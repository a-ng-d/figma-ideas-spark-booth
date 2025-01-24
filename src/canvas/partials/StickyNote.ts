import { HexModel } from '@a_ng_d/figmug-ui'

export default class StickyNote {
  idea: string
  hex: HexModel
  x?: number
  y?: number
  solidPaint: (hex: HexModel) => Paint
  stickyNoteNode: StickyNode

  constructor(idea: string, hex: HexModel, x?: number, y?: number) {
    this.idea = idea
    this.hex = hex
    this.x = x
    this.y = y
    this.solidPaint = figma.util.solidPaint
    this.stickyNoteNode = this.makeStickyNote()
  }

  makeStickyNote = () => {
    const stickyNode = figma.createSticky()
    stickyNode.text.characters = this.idea
    stickyNode.authorVisible = false
    stickyNode.isWideWidth = true
    stickyNode.fills = [this.solidPaint(this.hex)]

    if (this.x !== undefined) stickyNode.x = this.x
    if (this.y !== undefined) stickyNode.y = this.y

    return stickyNode
  }
}
