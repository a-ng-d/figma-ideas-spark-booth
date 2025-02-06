import { HexModel } from '@a_ng_d/figmug-ui'
import { lang } from '../content/locals'
import {
  ActivityConfiguration,
  GroupedBy,
  IdeaConfiguration,
} from '../types/configurations'
import setFriendlyDate from '../utils/setFriendlyDate'
import StickyNote from './partials/StickyNote'
import { yellowColor } from '../config'

export default class BoardClassification {
  private activityName: string
  private groupedBy: GroupedBy
  private sessionStartDate: string | Date
  private ideas: { [key: string]: Array<IdeaConfiguration> }
  private stickyGap: number
  private sectionGap: number
  private sectionPadding: number
  solidPaint: (hex: HexModel) => Paint
  nodes: SceneNode

  static stickyX = 0
  static stickyY = 0
  static sectionX = 0
  static sectionY = 0

  constructor(options: {
    activity: ActivityConfiguration
    sessionStartDate: string | Date
    ideas: { [key: string]: Array<IdeaConfiguration> }
  }) {
    this.activityName = options.activity.name
    this.groupedBy = options.activity.groupedBy
    this.sessionStartDate = options.sessionStartDate
    this.ideas = options.ideas
    this.stickyGap = 32
    this.sectionGap = 200
    this.sectionPadding = 80
    this.solidPaint = figma.util.solidPaint
    this.nodes = this.makeClassification()
  }

  makeSection = (
    name: string,
    ideas: Array<IdeaConfiguration>,
    hex: HexModel
  ) => {
    const sectionNode = figma.createSection()
    sectionNode.name = name
    sectionNode.fills = [this.solidPaint(hex + '33')]

    const stickyNotes = ideas.map((idea) => {
      const stickyNote = new StickyNote({
        idea: idea.text,
        color: idea.type.hex,
        x: BoardClassification.stickyX,
        y: BoardClassification.stickyY,
      }).stickyNoteNode

      BoardClassification.stickyX = BoardClassification.stickyX + this.stickyGap
      BoardClassification.stickyY = BoardClassification.stickyY + this.stickyGap

      return stickyNote
    })
    const group = figma.group(stickyNotes.flat(), figma.currentPage)
    const groupSize = group.absoluteBoundingBox
    sectionNode.appendChild(group)

    sectionNode.resizeWithoutConstraints(
      (groupSize?.width ?? 0) + this.sectionPadding * 2,
      (groupSize?.height ?? 0) + this.sectionPadding * 2
    )
    sectionNode.x = BoardClassification.sectionX
    BoardClassification.sectionX =
      sectionNode.width + BoardClassification.sectionX + this.sectionGap
    group.x = this.sectionPadding
    group.y = this.sectionPadding
    figma.ungroup(group)

    return sectionNode
  }

  makeClassification = () => {
    const sectionNode = figma.createSection()
    sectionNode.name = `${this.activityName}・${setFriendlyDate(this.sessionStartDate, lang)}`

    const sections = Object.entries(this.ideas).map(([name, ideas]) => {
      return this.makeSection(
        name,
        ideas,
        this.groupedBy === 'PARTICIPANT' ? yellowColor : ideas[0].type.hex
      )
    })

    const classification = figma.group(sections.flat(), figma.currentPage)
    sectionNode.appendChild(classification)

    sectionNode.resizeWithoutConstraints(
      classification.width + this.sectionPadding * 2,
      classification.height + this.sectionPadding * 2
    )
    classification.x = this.sectionPadding
    classification.y = this.sectionPadding
    sectionNode.x = figma.viewport.center.x - sectionNode.width / 2
    sectionNode.y = figma.viewport.center.y - sectionNode.height / 2
    figma.viewport.scrollAndZoomIntoView([sectionNode])
    figma.ungroup(classification)

    return sectionNode
  }
}
