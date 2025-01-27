import { HexModel } from '@a_ng_d/figmug-ui'
import { TypeConfiguration } from 'src/types/configurations'
import { lang, locals } from '../../content/locals'
import Layout from '../partials/Layout'
import Slide from '../partials/Slide'
import { colors, textStyles } from '../partials/tokens'

export default class TypesSlide {
  private activityName: string
  private activityTypes: Array<TypeConfiguration>
  private indicator?: string
  solidPaint: (hex: HexModel) => Paint
  typesSlideNode: SlideNode

  constructor(options: {
    activityName: string
    activityTypes: Array<TypeConfiguration>
    indicator?: string
  }) {
    this.activityName = options.activityName
    this.activityTypes = options.activityTypes
    this.indicator = options.indicator
    this.solidPaint = figma.util.solidPaint
    this.typesSlideNode = this.makeTypesSlide()
  }

  makeTitle = () => {
    const titleNode = figma.createText()
    titleNode.name = '_title'
    titleNode.characters = `${locals[lang].consolisation.types}${this.indicator !== undefined ? `・${this.indicator}` : ''}`
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
    colorNode.resize(48, 48)
    colorNode.cornerRadius = 8
    colorNode.fills = [this.solidPaint(color)]
    colorNode.strokes = [this.solidPaint(colors.darkColor + '20')]
    colorNode.strokeAlign = 'INSIDE'

    // Text
    const textNode = figma.createFrame()
    typeNode.appendChild(textNode)
    textNode.name = '_text'
    textNode.layoutMode = 'VERTICAL'
    textNode.layoutSizingHorizontal = 'FILL'
    textNode.itemSpacing = 8
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
    typesNode.itemSpacing = 32
    typesNode.fills = []

    this.activityTypes.forEach((type) => {
      const typeNode = this.makeType(type.hex, type.name, type.description)
      typesNode.appendChild(typeNode)

      typeNode.layoutSizingHorizontal = 'FILL'
    })

    return typesNode
  }

  makeTypesSlide = () => {
    const slide = new Slide({
      name: `${this.activityName}・${locals[lang].consolisation.types}`,
      color: colors.lightColor,
    })
    const layout = new Layout({
      leftSlot: this.makeTitle(),
      rightSlot: this.makeTypes(),
    })

    slide.layoutNode.appendChild(layout.makeOneThird())

    layout.layoutNode.layoutSizingHorizontal = 'FILL'
    layout.layoutNode.layoutSizingVertical = 'FILL'

    if (layout.leftSlot !== undefined && layout.rightSlot !== undefined) {
      layout.leftSlot.layoutSizingHorizontal = 'FILL'
      layout.rightSlot.layoutSizingHorizontal = 'FILL'
      layout.rightSlot.layoutSizingVertical = 'FILL'
    }

    return slide.slideNode
  }
}
