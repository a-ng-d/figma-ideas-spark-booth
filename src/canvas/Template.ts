import { TemplateConfiguration } from '../types/configurations'

export default class Template {
  private template: TemplateConfiguration
  solidPaint: (Rgb: RGB) => Paint
  templateNode: Promise<SceneNode>

  constructor(options: { template: TemplateConfiguration }) {
    this.template = options.template
    this.solidPaint = figma.util.solidPaint
    this.templateNode = this.makeTemplate()
  }

  makeSection = (node: {
    name: string
    fills: Paint[]
    absoluteBoundingBox: { width: number; height: number; x: number; y: number }
  }) => {
    const sectionNode = figma.createSection()

    sectionNode.name = node.name
    sectionNode.fills = [this.solidPaint((node.fills[0] as SolidPaint).color)]
    sectionNode.resizeWithoutConstraints(
      node.absoluteBoundingBox.width,
      node.absoluteBoundingBox.height
    )

    return sectionNode
  }

  makeInstance = async (node: {
    componentId: string
    absoluteBoundingBox: { width: number; height: number; x: number; y: number }
  }) => {
    return figma
      .importComponentByKeyAsync(
        (this.template.nodes.components as Record<string, { key: string }>)[
          node.componentId
        ].key
      )
      .then((componentNode) => {
        const instanceNode = componentNode.createInstance()

        instanceNode.resizeWithoutConstraints(
          node.absoluteBoundingBox.width,
          node.absoluteBoundingBox.height
        )

        return instanceNode
      })
      .catch(() => {
        const placeholderNode = figma.createShapeWithText()

        placeholderNode.resize(
          node.absoluteBoundingBox.width,
          node.absoluteBoundingBox.height
        )

        return placeholderNode
      })
  }

  createNode = async (nodeData: any): Promise<SceneNode> => {
    let node: SceneNode

    switch (nodeData.type) {
      case 'SECTION':
        node = this.makeSection(nodeData)
        break
      case 'INSTANCE':
        node = await this.makeInstance(nodeData)
        break
      default:
        throw new Error(`Unsupported node type: ${nodeData.type}`)
    }

    if (
      nodeData.children &&
      Array.isArray(nodeData.children) &&
      node.type !== 'INSTANCE' &&
      node.type !== 'SHAPE_WITH_TEXT'
    )
      for (const childData of nodeData.children) {
        const childNode = await this.createNode(childData)
        node.appendChild(childNode)
        ;(childNode as LayoutMixin).x =
          childData.absoluteBoundingBox.x - nodeData.absoluteBoundingBox.x
        ;(childNode as LayoutMixin).y =
          childData.absoluteBoundingBox.y - nodeData.absoluteBoundingBox.y
      }

    return node
  }

  makeTemplate = async () => {
    const parent = this.template.nodes.document
    const templateNode = (await this.createNode(parent)) as
      | SectionNode
      | GroupNode

    templateNode.x = figma.viewport.center.x - templateNode.width / 2
    templateNode.y = figma.viewport.center.y - templateNode.height / 2
    figma.viewport.scrollAndZoomIntoView([templateNode])

    templateNode.setPluginData('activityId', this.template.activityId)

    templateNode.setRelaunchData({
      run: '',
    })

    return templateNode
  }
}
