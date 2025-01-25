import { HexModel } from '@a_ng_d/figmug-ui'
import Layout from '../partials/Layout'
import Slide from '../partials/Slide'
import { colors, gaps, textStyles } from '../partials/tokens'

export default class titleSlide {
  private activityName: string
  private activityDescription: string
  solidPaint: (hex: HexModel) => Paint
  titleSlideNode: SlideNode

  constructor(options: { activityName: string; activityDescription: string }) {
    this.activityName = options.activityName
    this.activityDescription = options.activityDescription
    this.solidPaint = figma.util.solidPaint
    this.titleSlideNode = this.makeTitleSlide()
  }

  makeTitle = () => {
    const blockNode = figma.createFrame()
    blockNode.name = '_block'
    blockNode.layoutMode = 'VERTICAL'
    blockNode.primaryAxisSizingMode = 'AUTO'
    blockNode.counterAxisSizingMode = 'AUTO'
    blockNode.itemSpacing = gaps.small
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

    return blockNode
  }

  makeTitleSlide = () => {
    const slide = new Slide({
      name: this.activityName,
      color: colors.lightColor,
    })
    const layout = new Layout({
      leftSlot: this.makeTitle(),
    })

    slide.layoutNode.appendChild(layout.makeThreeOne())

    layout.layoutNode.layoutSizingHorizontal = 'FILL'
    layout.layoutNode.layoutSizingVertical = 'FILL'

    if (layout.leftSlot !== undefined) {
      layout.leftSlot.layoutSizingHorizontal = 'FILL'
      layout.leftNode.primaryAxisAlignItems = 'CENTER'
    }

    return slide.slideNode
  }
}
