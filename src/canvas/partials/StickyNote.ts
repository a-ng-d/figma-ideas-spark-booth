import { HexModel } from '@a_ng_d/figmug-ui'

export default class StickyNote {
  private idea: string
  private color: HexModel
  private author: string
  private ideaId: string
  private sessionId: string
  private activityId: string
  private x?: number
  private y?: number
  solidPaint: (hex: HexModel) => Paint
  stickyNoteNode: StickyNode

  constructor(options: {
    idea: string
    ideaId: string
    sessionId: string
    activityId: string
    author: string
    color: HexModel
    x?: number
    y?: number
  }) {
    this.idea = options.idea
    this.color = options.color
    this.author = options.author
    this.ideaId = options.ideaId
    this.sessionId = options.sessionId
    this.activityId = options.activityId
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

    stickyNode.setPluginData('ideaId', this.ideaId)
    stickyNode.setPluginData('sessionId', this.sessionId)
    stickyNode.setPluginData('activityId', this.activityId)
    stickyNode.setPluginData('author', this.author)

    if (this.x !== undefined) stickyNode.x = this.x
    if (this.y !== undefined) stickyNode.y = this.y

    return stickyNode
  }
}
