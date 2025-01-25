import { gaps } from './tokens'

export default class Layout<T extends SceneNode> {
  leftSlot?: T
  rightSlot?: T
  layoutNode: FrameNode
  leftNode: FrameNode
  rightNode: FrameNode

  constructor(options: { leftSlot?: T; rightSlot?: T }) {
    this.leftSlot = options.leftSlot
    this.rightSlot = options.rightSlot
    this.layoutNode = figma.createFrame()
    this.leftNode = figma.createFrame()
    this.rightNode = figma.createFrame()
  }

  makeOneThird = () => {
    this.layoutNode.name = '_layout'
    this.layoutNode.layoutMode = 'HORIZONTAL'
    this.layoutNode.primaryAxisSizingMode = 'AUTO'
    this.layoutNode.counterAxisSizingMode = 'AUTO'
    this.layoutNode.itemSpacing = gaps.large
    this.layoutNode.fills = []

    // Left Part
    const leftNode = figma.createFrame()
    this.layoutNode.insertChild(0, leftNode)
    leftNode.name = '_left'
    leftNode.layoutMode = 'VERTICAL'
    leftNode.layoutSizingHorizontal = 'FILL'
    leftNode.layoutSizingVertical = 'FILL'
    leftNode.maxWidth = 400
    leftNode.fills = []
    if (this.leftSlot !== undefined) {
      this.leftNode = leftNode
      leftNode.appendChild(this.leftSlot)
    }

    // Right Part
    const rightNode = figma.createFrame()
    this.layoutNode.insertChild(1, rightNode)
    rightNode.name = '_right'
    rightNode.layoutMode = 'VERTICAL'
    rightNode.layoutSizingHorizontal = 'FILL'
    rightNode.layoutSizingVertical = 'FILL'
    rightNode.fills = []
    if (this.rightSlot !== undefined) {
      this.rightNode = rightNode
      rightNode.appendChild(this.rightSlot)
    }

    return this.layoutNode
  }

  makeThreeOne = () => {
    this.layoutNode.name = '_layout-three-one'
    this.layoutNode.layoutMode = 'HORIZONTAL'
    this.layoutNode.primaryAxisSizingMode = 'AUTO'
    this.layoutNode.counterAxisSizingMode = 'AUTO'
    this.layoutNode.itemSpacing = gaps.large
    this.layoutNode.fills = []

    // Left Part
    const leftNode = figma.createFrame()
    this.layoutNode.insertChild(0, leftNode)
    leftNode.name = '_left'
    leftNode.layoutMode = 'VERTICAL'
    leftNode.layoutSizingHorizontal = 'FILL'
    leftNode.layoutSizingVertical = 'FILL'
    leftNode.fills = []
    if (this.leftSlot !== undefined) {
      this.leftNode = leftNode
      leftNode.appendChild(this.leftSlot)
    }

    // Right Part
    const rightNode = figma.createFrame()
    this.layoutNode.insertChild(1, rightNode)
    rightNode.name = '_right'
    rightNode.layoutMode = 'VERTICAL'
    rightNode.layoutSizingHorizontal = 'FILL'
    rightNode.layoutSizingVertical = 'FILL'
    rightNode.maxWidth = 400
    rightNode.fills = []
    if (this.rightSlot !== undefined) {
      this.rightNode = rightNode
      rightNode.appendChild(this.rightSlot)
    }

    return this.layoutNode
  }
}
