import { HexModel } from '@a_ng_d/figmug-ui'
import {
  ActivityConfiguration,
  IdeaConfiguration,
} from '../types/configurations'
import setFriendlyDate from '../utils/setFriendlyDate'

export default class Classification {
  activityName: string
  sessionDate: string | Date
  ideas: { [key: string]: Array<IdeaConfiguration> }
  stickyGap: number
  sectionGap: number
  sectionPadding: number
  solidPaint: (hex: HexModel) => Paint
  nodes: SceneNode

  static stickyX = 0
  static stickyY = 0
  static sectionX = 0
  static sectionY = 0

  constructor(
    activity: ActivityConfiguration,
    sessionDate: string | Date,
    ideas: { [key: string]: Array<IdeaConfiguration> }
  ) {
    this.activityName = activity.name
    this.sessionDate = sessionDate
    this.ideas = ideas
    this.stickyGap = 32
    this.sectionGap = 200
    this.sectionPadding = 80
    this.solidPaint = figma.util.solidPaint
    this.nodes = this.makeClassification()
  }

  makeStickyNote = (idea: IdeaConfiguration, hex: HexModel) => {
    // Base
    const stickyNode = figma.createSticky()
    stickyNode.text.characters = idea.text
    stickyNode.authorVisible = false
    stickyNode.isWideWidth = true
    stickyNode.fills = [this.solidPaint(hex)]

    // Sizing
    stickyNode.x = Classification.stickyX
    stickyNode.y = Classification.stickyY
    Classification.stickyX = Classification.stickyX + this.stickyGap
    Classification.stickyY = Classification.stickyY + this.stickyGap

    return stickyNode
  }

  makeSection = (
    name: string,
    ideas: Array<IdeaConfiguration>,
    hex: HexModel
  ) => {
    // Base
    const sectionNode = figma.createSection()
    sectionNode.name = name
    sectionNode.fills = [this.solidPaint(hex + '50')]

    // Sticky Notes
    const stickyNotes = ideas.map((idea) => this.makeStickyNote(idea, hex))
    const group = figma.group(stickyNotes.flat(), figma.currentPage)
    const groupSize = group.absoluteBoundingBox
    sectionNode.appendChild(group)

    // Sizing
    sectionNode.resizeWithoutConstraints(
      (groupSize?.width ?? 0) + this.sectionPadding * 2,
      (groupSize?.height ?? 0) + this.sectionPadding * 2
    )
    sectionNode.x = Classification.sectionX
    Classification.sectionX = sectionNode.width + Classification.sectionX + 200
    group.x = this.sectionPadding
    group.y = this.sectionPadding
    figma.ungroup(group)

    return sectionNode
  }

  makeClassification = () => {
    // Base
    const sectionNode = figma.createSection()
    sectionNode.name = `${this.activityName}・${setFriendlyDate(this.sessionDate, 'en-US')}`

    const sections = Object.entries(this.ideas).map(([name, ideas]) => {
      return this.makeSection(name, ideas, ideas[0].type.hex)
    })

    const classification = figma.group(sections.flat(), figma.currentPage)
    sectionNode.appendChild(classification)

    // Sizing
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
