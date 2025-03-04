import { lang, locals } from '../content/locals'
import {
  ActivityConfiguration,
  TemplateConfiguration,
} from '../types/configurations'

export default class Template {
  private template: TemplateConfiguration
  private activity: ActivityConfiguration
  solidPaint: (Rgb: RGB) => Paint
  templateNode: Promise<SectionNode>

  constructor(
    template: TemplateConfiguration,
    activity: ActivityConfiguration
  ) {
    this.template = template
    this.activity = activity
    this.solidPaint = figma.util.solidPaint
    this.templateNode = this.makeTemplate()
  }

  makePlaceholder = (node: {
    absoluteBoundingBox: { width: number; height: number }
  }) => {
    const placeholderNode = figma.createShapeWithText()

    placeholderNode.name = 'Placeholder'
    placeholderNode.shapeType = 'SQUARE'
    placeholderNode.resize(
      node.absoluteBoundingBox.width,
      node.absoluteBoundingBox.height
    )

    return placeholderNode
  }

  makeSection = (node: {
    name: string
    fills: Paint[]
    absoluteBoundingBox: { width: number; height: number; x: number; y: number }
    locked?: boolean
    visible?: boolean
  }) => {
    const sectionNode = figma.createSection()

    sectionNode.name = node.name
    sectionNode.fills = [this.solidPaint((node.fills[0] as SolidPaint).color)]
    sectionNode.resizeWithoutConstraints(
      node.absoluteBoundingBox.width,
      node.absoluteBoundingBox.height
    )
    node.locked !== undefined && (sectionNode.locked = node.locked)
    node.visible !== undefined && (sectionNode.visible = node.visible)

    return sectionNode
  }

  makeInstance = async (node: {
    componentId: string
    absoluteBoundingBox: { width: number; height: number; x: number; y: number }
    locked?: boolean
    visible?: boolean
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
        node.locked !== undefined && (instanceNode.locked = node.locked)
        node.visible !== undefined && (instanceNode.visible = node.visible)

        return instanceNode
      })
      .catch(() => this.makePlaceholder(node))
  }

  makeText = (node: {
    name: string
    characters: string
    fills: Paint[]
    absoluteBoundingBox: { width: number; height: number }
    style: {
      fontFamily: string
      fontStyle: string
      fontSize: number
      letterSpacing: number
      lineHeightPx: number
      textAlignHorizontal: 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED'
      textAlignVertical: 'TOP' | 'CENTER' | 'BOTTOM'
      textAutoResize: 'NONE' | 'WIDTH_AND_HEIGHT' | 'HEIGHT'
    }
    locked?: boolean
    visible?: boolean
  }) => {
    return figma
      .loadFontAsync({
        family: node.style.fontFamily,
        style: node.style.fontStyle,
      })
      .then(() => {
        const textNode = figma.createText()

        textNode.name = node.name
        textNode.characters = node.characters
        textNode.fills = [this.solidPaint((node.fills[0] as SolidPaint).color)]
        textNode.resize(
          node.absoluteBoundingBox.width,
          node.absoluteBoundingBox.height
        )
        textNode.fontName = {
          family: node.style.fontFamily,
          style: node.style.fontStyle,
        }
        textNode.fontSize = node.style.fontSize
        textNode.letterSpacing = {
          value: node.style.letterSpacing,
          unit: 'PIXELS',
        }
        textNode.lineHeight = {
          value: node.style.lineHeightPx,
          unit: 'PIXELS',
        }
        textNode.textAlignHorizontal = node.style.textAlignHorizontal
        textNode.textAlignVertical = node.style.textAlignVertical
        textNode.textAutoResize = node.style.textAutoResize
        node.locked !== undefined && (textNode.locked = node.locked)
        node.visible !== undefined && (textNode.visible = node.visible)

        return textNode
      })
      .catch(() => this.makePlaceholder(node))
  }

  makeShapeWithText = (node: {
    name: string
    fills: Paint[]
    absoluteBoundingBox: { width: number; height: number }
    shapeType:
      | 'SQUARE'
      | 'ELLIPSE'
      | 'ROUNDED_RECTANGLE'
      | 'DIAMOND'
      | 'TRIANGLE_UP'
      | 'TRIANGLE_DOWN'
      | 'PARALLELOGRAM_RIGHT'
      | 'PARALLELOGRAM_LEFT'
      | 'ENG_DATABASE'
      | 'ENG_QUEUE'
      | 'ENG_FILE'
      | 'ENG_FOLDER'
      | 'TRAPEZOID'
      | 'PREDEFINED_PROCESS'
      | 'SHIELD'
      | 'DOCUMENT_SINGLE'
      | 'DOCUMENT_MULTIPLE'
      | 'MANUAL_INPUT'
      | 'HEXAGON'
      | 'CHEVRON'
      | 'PENTAGON'
      | 'OCTAGON'
      | 'STAR'
      | 'PLUS'
      | 'ARROW_LEFT'
      | 'ARROW_RIGHT'
      | 'SUMMING_JUNCTION'
      | 'OR'
      | 'SPEECH_BUBBLE'
      | 'INTERNAL_STORAGE'
    locked?: boolean
    visible?: boolean
  }) => {
    const shapeWithTextNode = figma.createShapeWithText()

    shapeWithTextNode.name = node.name
    shapeWithTextNode.shapeType = node.shapeType
    shapeWithTextNode.fills = [
      this.solidPaint((node.fills[0] as SolidPaint).color),
    ]
    shapeWithTextNode.resize(
      node.absoluteBoundingBox.width,
      node.absoluteBoundingBox.height
    )
    node.locked !== undefined && (shapeWithTextNode.locked = node.locked)
    node.visible !== undefined && (shapeWithTextNode.visible = node.visible)

    return shapeWithTextNode
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createNode = async (nodeData: any): Promise<SceneNode | undefined> => {
    let node: SceneNode | undefined = undefined

    switch (nodeData.type) {
      case 'SECTION':
        node = this.makeSection(nodeData)
        break
      case 'INSTANCE':
        node = await this.makeInstance(nodeData)
        break
      case 'TEXT':
        node = await this.makeText(nodeData)
        break
      case 'SHAPE_WITH_TEXT':
        node = this.makeShapeWithText(nodeData)
        break
      case 'GROUP':
        break
      default:
        figma.notify(
          locals[lang].warning.unsupportedNodeType.replace('$1', nodeData.type)
        )
    }

    if (
      node !== undefined &&
      nodeData.children &&
      nodeData.children.length > 0 &&
      nodeData.type !== 'INSTANCE'
    )
      for (const childData of nodeData.children) {
        const childNode = await this.createNode(childData)

        if (childNode !== undefined && 'appendChild' in node) {
          // eslint-disable-next-line @typescript-eslint/no-extra-semi
          ;(node as SectionNode).appendChild(childNode)

          if (
            childNode.type === 'INSTANCE' ||
            childNode.type === 'TEXT' ||
            childNode.type === 'SHAPE_WITH_TEXT' ||
            childNode.type === 'SECTION' ||
            childNode.type === 'GROUP'
          ) {
            childNode.x =
              childData.absoluteBoundingBox.x - nodeData.absoluteBoundingBox.x

            childNode.y =
              childData.absoluteBoundingBox.y - nodeData.absoluteBoundingBox.y
          }
        }
      }
    else if (nodeData.type === 'GROUP') {
      const children = [] as Array<BaseNode>

      for (const childData of nodeData.children) {
        const childNode = await this.createNode(childData)

        if (childNode !== undefined) {
          if (
            childNode.type === 'INSTANCE' ||
            childNode.type === 'TEXT' ||
            childNode.type === 'SHAPE_WITH_TEXT' ||
            childNode.type === 'SECTION' ||
            childNode.type === 'GROUP'
          ) {
            childNode.x =
              childData.absoluteBoundingBox.x - nodeData.absoluteBoundingBox.x

            childNode.y =
              childData.absoluteBoundingBox.y - nodeData.absoluteBoundingBox.y
          }

          children.push(childNode)
        }
      }

      node = figma.group(children, figma.currentPage)
    }

    return node
  }

  makeTemplate = async () => {
    const parent = this.template.nodes.document
    const templateNode = (await this.createNode(parent)) as SectionNode

    templateNode.x = figma.viewport.center.x - templateNode.width / 2
    templateNode.y = figma.viewport.center.y - templateNode.height / 2
    figma.viewport.scrollAndZoomIntoView([templateNode])

    templateNode.setPluginData('activityId', this.template.activityId)
    templateNode.setPluginData('activity', JSON.stringify(this.activity))

    templateNode.setRelaunchData({
      run: '',
    })

    templateNode.setPluginData('type', 'TEMPLATE')

    return templateNode
  }
}
