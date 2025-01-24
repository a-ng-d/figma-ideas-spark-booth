import { HexModel } from '@a_ng_d/figmug-ui'
import { gaps, textStyles } from './tokens'

export default class Header {
  upTitleLabel: string
  titleLabel: string
  downTitleNode?: FrameNode
  hex: HexModel
  solidPaint: (hex: HexModel) => Paint
  headerNode: FrameNode

  constructor(
    upTitle: string,
    title: string,
    hex: HexModel,
    downTitle?: FrameNode
  ) {
    this.upTitleLabel = upTitle
    this.titleLabel = title
    this.downTitleNode = downTitle
    this.hex = hex
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

    // Up Title
    const upTitleNode = figma.createText()
    headerNode.appendChild(upTitleNode)
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
    upTitleNode.fills = [this.solidPaint(this.hex)]

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
    titleNode.fills = [this.solidPaint(this.hex)]

    // Down Title
    if (this.downTitleNode !== undefined)
      headerNode.appendChild(this.downTitleNode)

    return headerNode
  }
}
