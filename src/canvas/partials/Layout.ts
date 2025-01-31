import { gaps } from './tokens'

export default class Layout<T extends SceneNode, U extends SceneNode> {
  leftSlot?: T
  rightSlot?: U
  layoutNode: FrameNode
  leftNode: FrameNode
  rightNode: FrameNode

  constructor(options: { leftSlot?: T; rightSlot?: U }) {
    this.leftSlot = options.leftSlot
    this.rightSlot = options.rightSlot
    this.layoutNode = figma.createFrame()
    this.leftNode = figma.createFrame()
    this.rightNode = figma.createFrame()
  }

  makeOneThird = () => {
    this.layoutNode.name = '_layout-one-third'
    this.layoutNode.layoutMode = 'HORIZONTAL'
    this.layoutNode.primaryAxisSizingMode = 'AUTO'
    this.layoutNode.counterAxisSizingMode = 'AUTO'
    this.layoutNode.itemSpacing = gaps.large
    this.layoutNode.clipsContent = false
    this.layoutNode.fills = []

    // Left Part
    this.layoutNode.appendChild(this.leftNode)
    this.leftNode.name = '_left'
    this.leftNode.layoutMode = 'VERTICAL'
    this.leftNode.layoutSizingHorizontal = 'FILL'
    this.leftNode.layoutSizingVertical = 'FILL'
    this.leftNode.maxWidth = 400
    this.leftNode.clipsContent = false
    this.leftNode.fills = []
    if (this.leftSlot !== undefined) this.leftNode.appendChild(this.leftSlot)

    // Right Part
    this.layoutNode.appendChild(this.rightNode)
    this.rightNode.name = '_right'
    this.rightNode.layoutMode = 'VERTICAL'
    this.rightNode.layoutSizingHorizontal = 'FILL'
    this.rightNode.layoutSizingVertical = 'FILL'
    this.rightNode.clipsContent = false
    this.rightNode.fills = []
    if (this.rightSlot !== undefined) this.rightNode.appendChild(this.rightSlot)

    return this.layoutNode
  }

  makeThreeOne = () => {
    this.layoutNode.name = '_layout-three-one'
    this.layoutNode.layoutMode = 'HORIZONTAL'
    this.layoutNode.primaryAxisSizingMode = 'AUTO'
    this.layoutNode.counterAxisSizingMode = 'AUTO'
    this.layoutNode.itemSpacing = gaps.large
    this.layoutNode.clipsContent = false
    this.layoutNode.fills = []

    // Left Part
    this.layoutNode.appendChild(this.leftNode)
    this.leftNode.name = '_left'
    this.leftNode.layoutMode = 'VERTICAL'
    this.leftNode.layoutSizingHorizontal = 'FILL'
    this.leftNode.layoutSizingVertical = 'FILL'
    this.leftNode.clipsContent = false
    this.leftNode.fills = []
    if (this.leftSlot !== undefined) this.leftNode.appendChild(this.leftSlot)

    // Right Part
    this.layoutNode.appendChild(this.rightNode)
    this.rightNode.name = '_right'
    this.rightNode.layoutMode = 'VERTICAL'
    this.rightNode.layoutSizingHorizontal = 'FILL'
    this.rightNode.layoutSizingVertical = 'FILL'
    this.rightNode.maxWidth = 400
    this.rightNode.clipsContent = false
    this.rightNode.fills = []
    if (this.rightSlot !== undefined) this.rightNode.appendChild(this.rightSlot)

    return this.layoutNode
  }
}
