import { HexModel } from '@a_ng_d/figmug-ui'
import { lang, locals } from '../../content/locals'
import Layout from '../partials/Layout'
import { colors, gaps, textStyles } from '../partials/tokens'

export default class InstructionsSection {
  private activityName: string
  private activityInstructions: string
  private activityId: string
  private sectionWidth: number
  private sectionPadding: number
  solidPaint: (hex: HexModel) => Paint
  instructionsSectionNode: FrameNode

  constructor(options: {
    activityName: string
    activityInstructions: string
    activityId: string
  }) {
    this.activityName = options.activityName
    this.activityInstructions = options.activityInstructions
    this.activityId = options.activityId
    this.sectionWidth = 1920
    this.sectionPadding = 80
    this.solidPaint = figma.util.solidPaint
    this.instructionsSectionNode = this.makeInstructionsSection()
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

  makeInstructionsSection = () => {
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
      rightSlot: this.makeInstructions(),
    })

    sectionNode.appendChild(layout.makeOneThird())

    layout.layoutNode.layoutSizingHorizontal = 'FILL'
    layout.layoutNode.layoutSizingVertical = 'HUG'

    if (layout.leftSlot !== undefined && layout.rightSlot !== undefined) {
      layout.leftSlot.layoutSizingHorizontal = 'FILL'
      layout.rightSlot.layoutSizingHorizontal = 'FILL'
      layout.rightSlot.layoutSizingVertical = 'HUG'
    }

    sectionNode.setPluginData('activityId', this.activityId)
    sectionNode.setPluginData('type', 'OVERVIEW')

    return sectionNode
  }
}
