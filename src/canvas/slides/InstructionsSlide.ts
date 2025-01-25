import { HexModel } from '@a_ng_d/figmug-ui'
import { lang, locals } from '../../content/locals'
import Layout from '../partials/Layout'
import Slide from '../partials/Slide'
import { colors, textStyles } from '../partials/tokens'

export default class InstructionsSlide {
  private activityName: string
  private activityInstructions: string
  solidPaint: (hex: HexModel) => Paint
  instructionsSlideNode: SlideNode

  constructor(options: { activityName: string; activityInstructions: string }) {
    this.activityName = options.activityName
    this.activityInstructions = options.activityInstructions
    this.solidPaint = figma.util.solidPaint
    this.instructionsSlideNode = this.makeInstructionsSlide()
  }

  makeTitle = () => {
    const titleNode = figma.createText()
    titleNode.name = '_title'
    titleNode.characters = locals[lang].consolisation.instructions
    titleNode.textAutoResize = 'WIDTH_AND_HEIGHT'
    titleNode.fontSize = textStyles.slideAccentLabel.fontSize
    titleNode.fontName = {
      family: textStyles.slideAccentLabel.fontFamily,
      style: textStyles.slideAccentLabel.fontWeight,
    }
    titleNode.fills = [this.solidPaint(colors.darkColor)]

    return titleNode
  }

  makeInstructions = () => {
    const instructionsNode = figma.createText()
    instructionsNode.name = '_instructions'
    instructionsNode.characters = this.activityInstructions
    instructionsNode.textAutoResize = 'WIDTH_AND_HEIGHT'
    instructionsNode.fontSize = textStyles.slideText.fontSize
    instructionsNode.fontName = {
      family: textStyles.slideText.fontFamily,
      style: textStyles.slideText.fontWeight,
    }
    instructionsNode.lineHeight = {
      value: textStyles.slideText.lineHeight.value,
      unit: textStyles.slideText.lineHeight.unit as 'PERCENT' | 'PIXELS',
    }
    instructionsNode.fills = [this.solidPaint(colors.darkColor)]

    return instructionsNode
  }

  makeInstructionsSlide = () => {
    const slide = new Slide({
      name: `${this.activityName}・${locals[lang].consolisation.instructions}`,
      color: colors.lightColor,
    })
    const layout = new Layout({
      leftSlot: this.makeTitle(),
      rightSlot: this.makeInstructions(),
    })

    slide.layoutNode.appendChild(layout.makeOneThird())

    layout.layoutNode.layoutSizingHorizontal = 'FILL'
    layout.layoutNode.layoutSizingVertical = 'FILL'

    if (layout.leftSlot !== undefined && layout.rightNode !== undefined) {
      layout.leftSlot.layoutSizingHorizontal = 'FILL'
      layout.rightNode.layoutSizingHorizontal = 'FILL'
    }

    return slide.slideNode
  }
}
