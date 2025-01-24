import { HexModel } from '@a_ng_d/figmug-ui'

export default class Slide {
  name: string
  hex: HexModel
  solidPaint: (hex: HexModel) => Paint
  slideNode: SlideNode
  layoutNode: FrameNode

  static slideWidth = 1920
  static slideHeight = 1080
  static slideGaps = {
    vertical: 128,
    horizontal: 128,
  }

  constructor(name: string, hex: HexModel) {
    this.name = name
    this.hex = hex
    this.solidPaint = figma.util.solidPaint
    this.slideNode = this.makeSlide()
    this.layoutNode = this.makeLayout()
  }

  makeSlide = () => {
    const slideNode = figma.createSlide()
    slideNode.name = this.name
    slideNode.fills = [this.solidPaint(this.hex)]
    slideNode.layoutGrids = [
      {
        pattern: 'ROWS',
        count: 1,
        gutterSize: Slide.slideGaps.vertical,
        offset: Slide.slideGaps.horizontal,
        alignment: 'STRETCH',
        visible: false,
        color: { r: 1, g: 0, b: 0, a: 0.1 },
      },
      {
        pattern: 'COLUMNS',
        count: 1,
        gutterSize: Slide.slideGaps.vertical,
        offset: Slide.slideGaps.horizontal,
        alignment: 'STRETCH',
        visible: false,
        color: { r: 1, g: 0, b: 0, a: 0.1 },
      },
    ]

    return slideNode
  }

  makeLayout = () => {
    const layoutNode = figma.createFrame()
    this.slideNode.appendChild(layoutNode)
    layoutNode.name = '_layout'
    layoutNode.layoutMode = 'VERTICAL'
    layoutNode.primaryAxisSizingMode = 'FIXED'
    layoutNode.counterAxisSizingMode = 'FIXED'
    layoutNode.primaryAxisAlignItems = 'SPACE_BETWEEN'
    layoutNode.verticalPadding = Slide.slideGaps.vertical
    layoutNode.horizontalPadding = Slide.slideGaps.horizontal
    layoutNode.resize(Slide.slideWidth, Slide.slideHeight)
    layoutNode.fills = []

    return layoutNode
  }
}
