import { HexModel } from '@a_ng_d/figmug-ui'
import { TypeConfiguration } from 'src/types/configurations'
import { lang, locals } from '../../content/locals'
import Layout from '../partials/Layout'
import { colors, gaps, sizes, textStyles } from '../partials/tokens'

export default class TypesSection {
  private activityTypes: Array<TypeConfiguration>
  private activityId: string
  private sectionWidth: number
  private sectionPadding: number
  solidPaint: (hex: HexModel) => Paint
  typesSectionNode: FrameNode

  constructor(options: {
    activityTypes: Array<TypeConfiguration>
    activityId: string
  }) {
    this.activityTypes = options.activityTypes
    this.activityId = options.activityId
    this.sectionWidth = 1920
    this.sectionPadding = 80
    this.solidPaint = figma.util.solidPaint
    this.typesSectionNode = this.makeTypesSection()
  }

  makeTitle = () => {
    const titleNode = figma.createText()
    titleNode.name = '_title'
    titleNode.characters = locals[lang].consolisation.types
    titleNode.textAutoResize = 'WIDTH_AND_HEIGHT'
    titleNode.fontSize = textStyles.slideAccentLabel.fontSize
    titleNode.fontName = {
      family: textStyles.slideAccentLabel.fontFamily,
      style: textStyles.slideAccentLabel.fontWeight,
    }
    titleNode.fills = [this.solidPaint(colors.darkColor)]

    return titleNode
  }

  makeType = (color: HexModel, name: string, description?: string) => {
    const typeNode = figma.createFrame()
    typeNode.name = '_type'
    typeNode.layoutMode = 'HORIZONTAL'
    typeNode.primaryAxisSizingMode = 'AUTO'
    typeNode.counterAxisSizingMode = 'AUTO'
    typeNode.itemSpacing = 16
    typeNode.fills = []

    // Color
    const colorNode = figma.createRectangle()
    typeNode.appendChild(colorNode)
    colorNode.name = '_color'
    colorNode.resize(sizes.medium, sizes.medium)
    colorNode.cornerRadius = gaps.small
    colorNode.fills = [this.solidPaint(color)]
    colorNode.strokes = [this.solidPaint(colors.darkColor + '20')]
    colorNode.strokeAlign = 'INSIDE'

    // Text
    const textNode = figma.createFrame()
    typeNode.appendChild(textNode)
    textNode.name = '_text'
    textNode.layoutMode = 'VERTICAL'
    textNode.layoutSizingHorizontal = 'FILL'
    textNode.itemSpacing = gaps.small
    textNode.fills = []

    // Name
    const nameNode = figma.createText()
    textNode.appendChild(nameNode)
    nameNode.name = '_name'
    nameNode.layoutSizingHorizontal = 'FILL'
    nameNode.characters = name
    nameNode.textAutoResize = 'WIDTH_AND_HEIGHT'
    nameNode.fontSize = textStyles.slideAccentLabel.fontSize
    nameNode.fontName = {
      family: textStyles.slideAccentLabel.fontFamily,
      style: textStyles.slideAccentLabel.fontWeight,
    }
    nameNode.fills = [this.solidPaint(colors.darkColor)]

    // Description
    if (description !== undefined) {
      const descriptionNode = figma.createText()
      textNode.appendChild(descriptionNode)
      descriptionNode.name = '_description'
      descriptionNode.layoutSizingHorizontal = 'FILL'
      descriptionNode.characters = description
      descriptionNode.textAutoResize = 'WIDTH_AND_HEIGHT'
      descriptionNode.fontSize = textStyles.slideText.fontSize
      descriptionNode.fontName = {
        family: textStyles.slideText.fontFamily,
        style: textStyles.slideText.fontWeight,
      }
      descriptionNode.lineHeight = {
        value: textStyles.slideText.lineHeight.value,
        unit: textStyles.slideText.lineHeight.unit as 'PERCENT' | 'PIXELS',
      }
      descriptionNode.fills = [this.solidPaint(colors.darkColor)]
    }

    return typeNode
  }

  makeTypes = () => {
    const typesNode = figma.createFrame()
    typesNode.name = '_types'
    typesNode.layoutMode = 'VERTICAL'
    typesNode.primaryAxisSizingMode = 'AUTO'
    typesNode.counterAxisSizingMode = 'AUTO'
    typesNode.itemSpacing = gaps.large
    typesNode.fills = []

    this.activityTypes.forEach((type) => {
      const typeNode = this.makeType(type.hex, type.name, type.description)
      typesNode.appendChild(typeNode)

      typeNode.layoutSizingHorizontal = 'FILL'
    })

    return typesNode
  }

  makeTypesSection = () => {
    const sectionNode = figma.createFrame()
    sectionNode.name = locals[lang].consolisation.types
    sectionNode.resize(this.sectionWidth, 1080)
    sectionNode.fills = [this.solidPaint(colors.lightColor)]
    sectionNode.layoutMode = 'VERTICAL'
    sectionNode.primaryAxisSizingMode = 'AUTO'
    sectionNode.counterAxisSizingMode = 'FIXED'
    sectionNode.verticalPadding = this.sectionPadding
    sectionNode.horizontalPadding = this.sectionPadding
    sectionNode.cornerRadius = gaps.medium

    const layout = new Layout({
      leftSlot: this.makeTitle(),
      rightSlot: this.makeTypes(),
    })

    sectionNode.appendChild(layout.makeOneThird())

    layout.layoutNode.layoutSizingHorizontal = 'FILL'
    layout.layoutNode.layoutSizingVertical = 'HUG'

    if (layout.leftSlot !== undefined && layout.rightSlot !== undefined) {
      layout.leftSlot.layoutSizingHorizontal = 'FILL'
      layout.rightSlot.layoutSizingHorizontal = 'FILL'
      layout.rightSlot.layoutSizingVertical = 'HUG'
    }

    return sectionNode
  }
}
