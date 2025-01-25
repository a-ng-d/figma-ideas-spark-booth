import { HexModel } from '@a_ng_d/figmug-ui'
import { gaps, textStyles } from './tokens'

export default class Header {
  private upTitleLabel: string
  private titleLabel: string
  private downTitleNode?: FrameNode
  private indicator?: string
  private color: HexModel
  solidPaint: (hex: HexModel) => Paint
  headerNode: FrameNode

  constructor(options: {
    upTitle: string
    title: string
    downTitle?: FrameNode
    indicator?: string
    color: HexModel
  }) {
    this.upTitleLabel = options.upTitle
    this.titleLabel = options.title
    this.downTitleNode = options.downTitle
    this.indicator = options.indicator
    this.color = options.color
    this.solidPaint = figma.util.solidPaint
    this.headerNode = this.makeHeader()
  }

  makeHeader = () => {
    // Header
    const headerNode = figma.createFrame()
    headerNode.name = '_header'
    headerNode.layoutMode = 'VERTICAL'
    headerNode.primaryAxisSizingMode = 'AUTO'
    headerNode.counterAxisSizingMode = 'AUTO'
    headerNode.itemSpacing = gaps.small
    headerNode.fills = []

    // Up
    const upNode = figma.createFrame()
    headerNode.appendChild(upNode)
    upNode.name = '_up'
    upNode.layoutMode = 'HORIZONTAL'
    upNode.layoutSizingHorizontal = 'FILL'
    upNode.layoutSizingVertical = 'HUG'
    upNode.fills = []

    // Up Title
    const upTitleNode = figma.createText()
    upNode.appendChild(upTitleNode)
    upTitleNode.name = '_up-title'
    upTitleNode.layoutSizingHorizontal = 'FILL'
    upTitleNode.layoutSizingVertical = 'HUG'
    upTitleNode.characters = this.upTitleLabel
    upTitleNode.textAutoResize = 'WIDTH_AND_HEIGHT'
    upTitleNode.fontSize = textStyles.slideSubTitle.fontSize
    upTitleNode.fontName = {
      family: textStyles.slideSubTitle.fontFamily,
      style: textStyles.slideSubTitle.fontWeight,
    }
    upTitleNode.fills = [this.solidPaint(this.color)]

    // Title
    const titleNode = figma.createText()
    headerNode.appendChild(titleNode)
    titleNode.name = '_title'
    titleNode.layoutSizingHorizontal = 'FILL'
    titleNode.layoutSizingVertical = 'HUG'
    titleNode.characters = this.titleLabel
    titleNode.textAutoResize = 'WIDTH_AND_HEIGHT'
    titleNode.fontSize = textStyles.slideTitle.fontSize
    titleNode.fontName = {
      family: textStyles.slideTitle.fontFamily,
      style: textStyles.slideTitle.fontWeight,
    }
    titleNode.fills = [this.solidPaint(this.color)]

    // Down Title
    if (this.downTitleNode !== undefined)
      headerNode.appendChild(this.downTitleNode)

    // Indicator
    if (this.indicator !== undefined) {
      const indicatorNode = figma.createText()
      upNode.appendChild(indicatorNode)
      indicatorNode.name = '_indicator'
      indicatorNode.layoutSizingHorizontal = 'HUG'
      indicatorNode.layoutSizingVertical = 'HUG'
      indicatorNode.characters = this.indicator
      indicatorNode.textAutoResize = 'WIDTH_AND_HEIGHT'
      indicatorNode.fontSize = textStyles.slideSubTitle.fontSize
      indicatorNode.fontName = {
        family: textStyles.slideSubTitle.fontFamily,
        style: textStyles.slideSubTitle.fontWeight,
      }
      indicatorNode.fills = [this.solidPaint(this.color)]
    }

    return headerNode
  }
}
