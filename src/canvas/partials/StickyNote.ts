import { HexModel } from '@a_ng_d/figmug-ui'

export default class StickyNote {
  idea: string
  color: HexModel
  x?: number
  y?: number
  solidPaint: (hex: HexModel) => Paint
  stickyNoteNode: StickyNode

  constructor(options: {
    idea: string
    color: HexModel
    x?: number
    y?: number
  }) {
    this.idea = options.idea
    this.color = options.color
    this.x = options.x
    this.y = options.y
    this.solidPaint = figma.util.solidPaint
    this.stickyNoteNode = this.makeStickyNote()
  }

  makeStickyNote = () => {
    const stickyNode = figma.createSticky()
    stickyNode.text.characters = this.idea
    stickyNode.authorVisible = false
    stickyNode.isWideWidth = true
    stickyNode.fills = [this.solidPaint(this.color)]

    if (this.x !== undefined) stickyNode.x = this.x
    if (this.y !== undefined) stickyNode.y = this.y

    return stickyNode
  }
}
