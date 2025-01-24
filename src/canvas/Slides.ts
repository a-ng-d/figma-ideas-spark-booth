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
import Member from './partials/Member'
import Members from './partials/Members'

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

  makeSessionSlide = () => {
    // Base
    const slideNode = figma.createSlide()
    slideNode.name = `${this.activityName}・${setFriendlyDate(this.sessionDate, lang)}`
    slideNode.fills = [this.solidPaint(colors.lightColor)]
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

    // Layout
    const layoutNode = figma.createFrame()
    slideNode.appendChild(layoutNode)
    layoutNode.name = '_layout'
    layoutNode.layoutMode = 'VERTICAL'
    layoutNode.primaryAxisSizingMode = 'FIXED'
    layoutNode.counterAxisSizingMode = 'FIXED'
    layoutNode.primaryAxisAlignItems = 'SPACE_BETWEEN'
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

    // Activity
    const activityNode = figma.createText()
    headerNode.appendChild(activityNode)
    activityNode.name = '_activity-name'
    activityNode.layoutSizingHorizontal = 'FILL'
    activityNode.layoutSizingVertical = 'HUG'
    activityNode.characters = `${this.activityName}・Session`
    activityNode.textAutoResize = 'WIDTH_AND_HEIGHT'
    activityNode.fontSize = textStyles.slideSubTitle.fontSize
    activityNode.fontName = {
      family: textStyles.slideSubTitle.fontFamily,
      style: textStyles.slideSubTitle.fontWeight,
    }
    activityNode.fills = [this.solidPaint(colors.darkColor)]

    // Session Date
    const sessionNode = figma.createText()
    headerNode.appendChild(sessionNode)
    sessionNode.name = '_session-date'
    sessionNode.layoutSizingHorizontal = 'FILL'
    sessionNode.layoutSizingVertical = 'HUG'
    sessionNode.characters = setFriendlyDate(this.sessionDate, lang)
    sessionNode.textAutoResize = 'WIDTH_AND_HEIGHT'
    sessionNode.fontSize = textStyles.slideTitle.fontSize
    sessionNode.fontName = {
      family: textStyles.slideTitle.fontFamily,
      style: textStyles.slideTitle.fontWeight,
    }
    sessionNode.fills = [this.solidPaint(colors.darkColor)]

    // Facilitator
    const facilitatorNode = figma.createFrame()
    headerNode.appendChild(facilitatorNode)
    facilitatorNode.name = '_facilitator'
    facilitatorNode.layoutMode = 'HORIZONTAL'
    facilitatorNode.layoutSizingHorizontal = 'FILL'
    facilitatorNode.layoutSizingVertical = 'HUG'
    facilitatorNode.counterAxisAlignItems = 'CENTER'
    facilitatorNode.itemSpacing = gaps.large
    facilitatorNode.fills = []

    // Facilitator Label
    const facilitatorLabelNode = figma.createText()
    facilitatorNode.appendChild(facilitatorLabelNode)
    facilitatorLabelNode.name = '_label'
    facilitatorLabelNode.characters = 'Facilitated by'
    facilitatorLabelNode.textAutoResize = 'WIDTH_AND_HEIGHT'
    facilitatorLabelNode.fontSize = textStyles.slideLabel.fontSize
    facilitatorLabelNode.fontName = {
      family: textStyles.slideLabel.fontFamily,
      style: textStyles.slideLabel.fontWeight,
    }
    facilitatorLabelNode.fills = [this.solidPaint(colors.darkColor)]

    // Facilitator Person
    const facilitatorPersonNode = new Member(
      this.sessionFacilitator.avatar,
      this.sessionFacilitator.fullName,
      'AUTO'
    ).memberNode
    facilitatorNode.appendChild(facilitatorPersonNode)

    // Participants
    const participantsNode = figma.createFrame()
    layoutNode.appendChild(participantsNode)
    participantsNode.name = '_participants'
    participantsNode.layoutMode = 'VERTICAL'
    participantsNode.layoutSizingHorizontal = 'FILL'
    participantsNode.itemSpacing = gaps.small
    participantsNode.fills = []

    // Participants Label
    const participantsLabelNode = figma.createText()
    participantsNode.appendChild(participantsLabelNode)
    participantsLabelNode.name = '_label'
    participantsLabelNode.characters = 'Participants'
    participantsLabelNode.layoutSizingHorizontal = 'FILL'
    participantsLabelNode.textAutoResize = 'WIDTH_AND_HEIGHT'
    participantsLabelNode.fontSize = textStyles.slideLabel.fontSize
    participantsLabelNode.fontName = {
      family: textStyles.slideLabel.fontFamily,
      style: textStyles.slideLabel.fontWeight,
    }
    participantsLabelNode.fills = [this.solidPaint(colors.darkColor)]

    // Participants List
    const participantsListNode = figma.createFrame()
    participantsNode.appendChild(participantsListNode)
    participantsListNode.name = '_list'
    participantsListNode.layoutMode = 'HORIZONTAL'
    participantsListNode.layoutSizingHorizontal = 'FILL'
    participantsListNode.layoutSizingVertical = 'HUG'
    participantsListNode.layoutWrap = 'WRAP'
    participantsListNode.itemSpacing = gaps.medium
    participantsListNode.counterAxisSpacing = null
    participantsListNode.maxHeight = 416
    participantsListNode.fills = []

    const participantToDuplicate = this.participants[0]
    const duplicationCount = 40
    const duplicatedParticipants = Array(duplicationCount).fill(
      participantToDuplicate
    )
    const allParticipants = [...this.participants, ...duplicatedParticipants]

    let remainingParticipants: Array<UserConfiguration> = []
    allParticipants.forEach((participant, index) => {
      if (index <= 13)
        participantsListNode.appendChild(
          new Member(participant.avatar, participant.fullName, 538).memberNode
        )
      else if (index === 14 && allParticipants.length <= 14)
        participantsListNode.appendChild(
          new Member(participant.avatar, participant.fullName, 538).memberNode
        )
      else if (index > 14)
        remainingParticipants = [...remainingParticipants, participant]
    })

    if (remainingParticipants.length > 0)
      participantsListNode.appendChild(
        new Members(remainingParticipants, 538).membersNode
      )

    return slideNode
  }

  makeClassification = () => {
    // Base
    const rowNode = figma.createSlideRow()
    rowNode.name = `${this.activityName}・${setFriendlyDate(this.sessionDate, lang)}`
    rowNode.appendChild(this.makeSessionSlide())

    const nodes = Object.entries(this.ideas).map(([name, ideas]) => {
      return this.makeSlide(name, ideas, ideas[0].type.hex)
    })

    return nodes
  }
}
