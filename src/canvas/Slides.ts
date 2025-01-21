import { HexModel } from '@a_ng_d/figmug-ui'
import { lang } from '../content/locals'
import {
  ActivityConfiguration,
  IdeaConfiguration,
} from '../types/configurations'
import setFriendlyDate from '../utils/setFriendlyDate'

export default class Slides {
  activityName: string
  sessionDate: string | Date
  ideas: { [key: string]: Array<IdeaConfiguration> }
  stickyGap: number
  sectionGap: number
  sectionPadding: number
  solidPaint: (hex: HexModel) => Paint
  nodes: Array<SlideNode>

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
    stickyNode.x = Slides.stickyX
    stickyNode.y = Slides.stickyY
    Slides.stickyX = Slides.stickyX + this.stickyGap
    Slides.stickyY = Slides.stickyY + this.stickyGap

    return stickyNode
  }

  makeSlide = (
    name: string,
    ideas: Array<IdeaConfiguration>,
    hex: HexModel
  ) => {
    // Base
    const slideNode = figma.createSlide()
    slideNode.name = `${this.activityName}・${name}・${setFriendlyDate(this.sessionDate, lang)}`
    slideNode.fills = [this.solidPaint(hex + '50')]

    // Sticky Notes
    const stickyNotes = ideas.map((idea) => this.makeStickyNote(idea, hex))
    stickyNotes.flat().forEach((note) => slideNode.appendChild(note))

    return slideNode
  }

  makeClassification = () => {
    const nodes = Object.entries(this.ideas).map(([name, ideas]) => {
      return this.makeSlide(name, ideas, ideas[0].type.hex)
    })

    return nodes
  }
}
