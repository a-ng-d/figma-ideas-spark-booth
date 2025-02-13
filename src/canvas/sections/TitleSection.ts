import { HexModel } from '@a_ng_d/figmug-ui'
import { TimerConfiguration } from 'src/types/configurations'
import { lang, locals } from '../../content/locals'
import Layout from '../partials/Layout'
import Timer from '../partials/Timer'
import { colors, gaps, textStyles } from '../partials/tokens'

export default class TitleSection {
  private activityName: string
  private activityDescription: string
  private activityTimer: TimerConfiguration
  private activityId: string
  private sectionWidth: number
  private sectionPadding: number
  solidPaint: (hex: HexModel) => Paint
  titleSectionNode: FrameNode

  constructor(options: {
    activityName: string
    activityDescription: string
    activityTimer: TimerConfiguration
    activityId: string
  }) {
    this.activityName = options.activityName
    this.activityDescription = options.activityDescription
    this.activityTimer = options.activityTimer
    this.activityId = options.activityId
    this.sectionWidth = 1920
    this.sectionPadding = 80
    this.solidPaint = figma.util.solidPaint
    this.titleSectionNode = this.makeTitleSection()
  }

  makeTitle = () => {
    const blockNode = figma.createFrame()
    blockNode.name = '_block'
    blockNode.layoutMode = 'VERTICAL'
    blockNode.primaryAxisSizingMode = 'AUTO'
    blockNode.counterAxisSizingMode = 'AUTO'
    blockNode.itemSpacing = gaps.regular
    blockNode.fills = []

    // Title
    const titleNode = figma.createText()
    blockNode.appendChild(titleNode)
    titleNode.name = '_title'
    titleNode.layoutSizingHorizontal = 'FILL'
    titleNode.characters = this.activityName
    titleNode.textAutoResize = 'WIDTH_AND_HEIGHT'
    titleNode.fontSize = textStyles.documentTitle.fontSize
    titleNode.fontName = {
      family: textStyles.documentTitle.fontFamily,
      style: textStyles.documentTitle.fontWeight,
    }
    titleNode.fills = [this.solidPaint(colors.darkColor)]

    // Description
    if (this.activityDescription !== '') {
      const descriptionNode = figma.createText()
      blockNode.appendChild(descriptionNode)
      descriptionNode.name = '_description'
      descriptionNode.layoutSizingHorizontal = 'FILL'
      descriptionNode.characters = this.activityDescription
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

    // Timer
    const timerNode = new Timer({
      duration:
        (this.activityTimer.minutes * 60 + this.activityTimer.seconds) * 1000,
    })
    blockNode.appendChild(timerNode.timerNode)

    return blockNode
  }

  makeTitleSection = () => {
    const sectionNode = figma.createFrame()
    sectionNode.name = locals[lang].consolisation.types
    sectionNode.resize(this.sectionWidth, 1080)
    sectionNode.fills = [this.solidPaint(colors.lightColor)]
    sectionNode.layoutMode = 'VERTICAL'
    sectionNode.primaryAxisSizingMode = 'FIXED'
    sectionNode.counterAxisSizingMode = 'FIXED'
    sectionNode.verticalPadding = this.sectionPadding
    sectionNode.horizontalPadding = this.sectionPadding
    sectionNode.cornerRadius = gaps.medium

    const layout = new Layout({
      leftSlot: this.makeTitle(),
    })

    sectionNode.appendChild(layout.makeThreeOne())

    layout.layoutNode.layoutSizingHorizontal = 'FILL'
    layout.layoutNode.layoutSizingVertical = 'FILL'

    if (layout.leftSlot !== undefined) {
      layout.leftSlot.layoutSizingHorizontal = 'FILL'
      layout.leftNode.primaryAxisAlignItems = 'CENTER'
    }

    return sectionNode
  }
}
