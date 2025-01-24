import { HexModel } from '@a_ng_d/figmug-ui'
import { lang } from '../content/locals'
import {
  ActivityConfiguration,
  IdeaConfiguration,
  SessionConfiguration,
  UserConfiguration,
} from '../types/configurations'
import setFriendlyDate from '../utils/setFriendlyDate'
import { colors, gaps, textStyles } from './partials/tokens'
import StickyNote from './partials/StickyNote'
import SessionSlide from './slides/SessionSlide'

export default class Slides {
  activityName: string
  sessionDate: string | Date
  sessionFacilitator: UserConfiguration
  participants: Array<UserConfiguration>
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
  static slideWidth = 1920
  static slideHeight = 1080
  static slideGaps = {
    vertical: 128,
    horizontal: 128,
  }

  constructor(
    activity: ActivityConfiguration,
    session: SessionConfiguration,
    ideas: { [key: string]: Array<IdeaConfiguration> },
    participants: Array<UserConfiguration>
  ) {
    this.activityName = activity.name
    ;(this.sessionDate = session.metrics.startDate),
      (this.sessionFacilitator = session.facilitator)
    this.participants = participants
    this.ideas = ideas
    this.stickyGap = 32
    this.sectionGap = 200
    this.sectionPadding = 80
    this.solidPaint = figma.util.solidPaint
    this.nodes = this.makeClassification()
  }

  makeSlide = (
    name: string,
    ideas: Array<IdeaConfiguration>,
    hex: HexModel
  ) => {
    // Base
    const slideNode = figma.createSlide()
    slideNode.name = `${this.activityName}・${setFriendlyDate(this.sessionDate, lang)}・${name}`
    slideNode.layoutGrids = [
      {
        pattern: 'ROWS',
        count: 1,
        gutterSize: Slides.slideGaps.vertical,
        offset: Slides.slideGaps.horizontal,
        alignment: 'STRETCH',
        visible: false,
        color: { r: 1, g: 0, b: 0, a: 0.1 },
      },
      {
        pattern: 'COLUMNS',
        count: 1,
        gutterSize: Slides.slideGaps.vertical,
        offset: Slides.slideGaps.horizontal,
        alignment: 'STRETCH',
        visible: false,
        color: { r: 1, g: 0, b: 0, a: 0.1 },
      },
    ]
    slideNode.fills = [this.solidPaint(hex + '20')]

    // Layout
    const layoutNode = figma.createFrame()
    slideNode.appendChild(layoutNode)
    layoutNode.name = '_layout'
    layoutNode.layoutMode = 'VERTICAL'
    layoutNode.primaryAxisSizingMode = 'FIXED'
    layoutNode.counterAxisSizingMode = 'FIXED'
    layoutNode.itemSpacing = 72
    layoutNode.verticalPadding = Slides.slideGaps.vertical
    layoutNode.horizontalPadding = Slides.slideGaps.horizontal
    layoutNode.resize(Slides.slideWidth, Slides.slideHeight)
    layoutNode.fills = []

    // Header
    const headerNode = figma.createFrame()
    layoutNode.appendChild(headerNode)
    headerNode.name = '_header'
    headerNode.layoutMode = 'VERTICAL'
    headerNode.layoutSizingHorizontal = 'FILL'
    headerNode.layoutSizingVertical = 'HUG'
    headerNode.itemSpacing = gaps.small
    headerNode.fills = []

    // Session Date
    const sessionNode = figma.createText()
    headerNode.appendChild(sessionNode)
    sessionNode.name = '_session-date'
    sessionNode.layoutSizingHorizontal = 'FILL'
    sessionNode.layoutSizingVertical = 'HUG'
    sessionNode.characters = setFriendlyDate(this.sessionDate, lang, 'LONG')
    sessionNode.textAutoResize = 'WIDTH_AND_HEIGHT'
    sessionNode.fontSize = textStyles.slideSubTitle.fontSize
    sessionNode.fontName = {
      family: textStyles.slideSubTitle.fontFamily,
      style: textStyles.slideSubTitle.fontWeight,
    }
    sessionNode.fills = [this.solidPaint(colors.lightColor)]

    // Tyme
    const typeNode = figma.createText()
    headerNode.appendChild(typeNode)
    typeNode.name = '_type-name'
    typeNode.layoutSizingHorizontal = 'FILL'
    typeNode.layoutSizingVertical = 'HUG'
    typeNode.characters = name
    typeNode.textAutoResize = 'WIDTH_AND_HEIGHT'
    typeNode.fontSize = textStyles.slideTitle.fontSize
    typeNode.fontName = {
      family: textStyles.slideTitle.fontFamily,
      style: textStyles.slideTitle.fontWeight,
    }
    typeNode.fills = [this.solidPaint(colors.lightColor)]

    // Ideas
    const ideasNode = figma.createFrame()
    layoutNode.appendChild(ideasNode)
    ideasNode.name = '_ideas-list'
    ideasNode.layoutMode = 'HORIZONTAL'
    ideasNode.layoutSizingHorizontal = 'FILL'
    ideasNode.layoutSizingVertical = 'FILL'
    ideasNode.layoutWrap = 'WRAP'
    ideasNode.itemSpacing = gaps.large
    ideasNode.counterAxisSpacing = null
    ideasNode.fills = []

    const stickyNotes = ideas.map((idea) => new StickyNote(idea.text, hex))
    stickyNotes
      .flat()
      .forEach((note) => ideasNode.appendChild(note.stickyNoteNode))

    return slideNode
  }

  makeClassification = () => {
    // Base
    const rowNode = figma.createSlideRow()
    rowNode.name = `${this.activityName}・${setFriendlyDate(this.sessionDate, lang)}`
    rowNode.appendChild(
      new SessionSlide(
        this.activityName,
        this.sessionDate,
        this.sessionFacilitator,
        this.participants
      ).sessionSlideNode
    )

    const nodes = Object.entries(this.ideas).map(([name, ideas]) => {
      return this.makeSlide(name, ideas, ideas[0].type.hex)
    })

    return nodes
  }
}
