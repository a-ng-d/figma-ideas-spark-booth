import { HexModel } from '@a_ng_d/figmug-ui'
import { lang } from '../content/locals'
import {
  ActivityConfiguration,
  IdeaConfiguration,
  SessionConfiguration,
  UserConfiguration,
} from '../types/configurations'
import setFriendlyDate from '../utils/setFriendlyDate'

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
  static gaps = {
    xsmall: 8,
    small: 16,
    medium: 24,
    large: 32,
  }
  static documentTitle = {
    fontFamily: 'Martian Mono',
    fontSize: 96,
    fontWeight: 'ExtraBold',
    lineHeight: {
      unit: 'AUTO',
    },
  }
  static slideTitle = {
    fontFamily: 'Martian Mono',
    fontSize: 80,
    fontWeight: 'Bold',
    lineHeight: {
      unit: 'AUTO',
    },
  }
  static slideSubTitle = {
    fontFamily: 'Sora',
    fontSize: 32,
    fontWeight: 'SemiBold',
    lineHeight: {
      unit: 'AUTO',
    },
  }
  static slideAccentLabel = {
    fontFamily: 'Sora',
    fontSize: 40,
    fontWeight: 'SemiBold',
    lineHeight: {
      unit: 'AUTO',
    },
  }
  static slideLabel = {
    fontFamily: 'Sora',
    fontSize: 32,
    fontWeight: 'Regular',
    lineHeight: {
      unit: 'AUTO',
    },
  }
  static slideText = {
    fontFamily: 'Sora',
    fontSize: 32,
    fontWeight: 'Regular',
    lineHeight: {
      value: 150,
      unit: 'PERCENT',
    },
  }
  static lightColor = 'FFFEC3'
  static darkColor = '493200'

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

  makePerson = (avatarUrl: string, name: string, width: number | 'AUTO') => {
    // Base
    const personNode = figma.createFrame()
    personNode.name = '_person'
    personNode.layoutMode = 'HORIZONTAL'
    personNode.counterAxisSizingMode = 'AUTO'
    personNode.counterAxisAlignItems = 'CENTER'
    personNode.itemSpacing = Slides.gaps.small
    personNode.fills = []
    if (width !== 'AUTO') personNode.resize(width, 64)
    else personNode.primaryAxisSizingMode = 'AUTO'

    // Avatar
    figma
      .createImageAsync(avatarUrl)
      .then(async (image: Image) => {
        // Avatar
        const avatarNode = figma.createEllipse()
        personNode.appendChild(avatarNode)
        avatarNode.name = '_avatar'
        avatarNode.resize(64, 64)
        avatarNode.fills = [
          {
            type: 'SOLID',
            color: { r: 0.9, g: 0.9, b: 0.9 },
          },
          {
            type: 'IMAGE',
            imageHash: image.hash,
            scaleMode: 'FILL',
          },
        ]
      })
      .finally(() => {
        // Name
        const nameNode = figma.createText()
        personNode.appendChild(nameNode)
        nameNode.name = '_name'
        nameNode.characters = name
        nameNode.textAutoResize = 'WIDTH_AND_HEIGHT'
        nameNode.fontSize = Slides.slideAccentLabel.fontSize
        nameNode.fontName = {
          family: Slides.slideAccentLabel.fontFamily,
          style: Slides.slideAccentLabel.fontWeight,
        }
        if (width !== 'AUTO') {
          nameNode.layoutSizingHorizontal = 'FILL'
          nameNode.textTruncation = 'ENDING'
        } else nameNode.layoutSizingHorizontal = 'HUG'
        nameNode.fills = [this.solidPaint(Slides.darkColor)]
      })

    return personNode
  }

  makeSessionSlide = () => {
    // Base
    const slideNode = figma.createSlide()
    slideNode.name = `${this.activityName}・${setFriendlyDate(this.sessionDate, lang)}`
    slideNode.fills = [this.solidPaint(Slides.lightColor)]
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
    headerNode.itemSpacing = Slides.gaps.small
    headerNode.fills = []

    // Activity
    const activityNode = figma.createText()
    headerNode.appendChild(activityNode)
    activityNode.name = '_activity-name'
    activityNode.layoutSizingHorizontal = 'FILL'
    activityNode.layoutSizingVertical = 'HUG'
    activityNode.characters = `${this.activityName}・Session`
    activityNode.textAutoResize = 'WIDTH_AND_HEIGHT'
    activityNode.fontSize = Slides.slideSubTitle.fontSize
    activityNode.fontName = {
      family: Slides.slideSubTitle.fontFamily,
      style: Slides.slideSubTitle.fontWeight,
    }
    activityNode.fills = [this.solidPaint(Slides.darkColor)]

    // Session Date
    const sessionNode = figma.createText()
    headerNode.appendChild(sessionNode)
    sessionNode.name = '_session-date'
    sessionNode.layoutSizingHorizontal = 'FILL'
    sessionNode.layoutSizingVertical = 'HUG'
    sessionNode.characters = setFriendlyDate(this.sessionDate, lang)
    sessionNode.textAutoResize = 'WIDTH_AND_HEIGHT'
    sessionNode.fontSize = Slides.slideTitle.fontSize
    sessionNode.fontName = {
      family: Slides.slideTitle.fontFamily,
      style: Slides.slideTitle.fontWeight,
    }
    sessionNode.fills = [this.solidPaint(Slides.darkColor)]

    // Facilitator
    const facilitatorNode = figma.createFrame()
    headerNode.appendChild(facilitatorNode)
    facilitatorNode.name = '_facilitator'
    facilitatorNode.layoutMode = 'HORIZONTAL'
    facilitatorNode.layoutSizingHorizontal = 'FILL'
    facilitatorNode.layoutSizingVertical = 'HUG'
    facilitatorNode.counterAxisAlignItems = 'CENTER'
    facilitatorNode.itemSpacing = Slides.gaps.large
    facilitatorNode.fills = []

    // Facilitator Label
    const facilitatorLabelNode = figma.createText()
    facilitatorNode.appendChild(facilitatorLabelNode)
    facilitatorLabelNode.name = '_label'
    facilitatorLabelNode.characters = 'Facilitated by'
    facilitatorLabelNode.textAutoResize = 'WIDTH_AND_HEIGHT'
    facilitatorLabelNode.fontSize = Slides.slideLabel.fontSize
    facilitatorLabelNode.fontName = {
      family: Slides.slideLabel.fontFamily,
      style: Slides.slideLabel.fontWeight,
    }
    facilitatorLabelNode.fills = [this.solidPaint(Slides.darkColor)]

    // Facilitator Person
    const facilitatorPersonNode = this.makePerson(
      this.sessionFacilitator.avatar,
      this.sessionFacilitator.fullName,
      'AUTO'
    )
    facilitatorNode.appendChild(facilitatorPersonNode)

    // Participants
    const participantsNode = figma.createFrame()
    layoutNode.appendChild(participantsNode)
    participantsNode.name = '_participants'
    participantsNode.layoutMode = 'VERTICAL'
    participantsNode.layoutSizingHorizontal = 'FILL'
    participantsNode.itemSpacing = Slides.gaps.small
    participantsNode.fills = []

    // Participants Label
    const participantsLabelNode = figma.createText()
    participantsNode.appendChild(participantsLabelNode)
    participantsLabelNode.name = '_label'
    participantsLabelNode.characters = 'Participants'
    participantsLabelNode.layoutSizingHorizontal = 'FILL'
    participantsLabelNode.textAutoResize = 'WIDTH_AND_HEIGHT'
    participantsLabelNode.fontSize = Slides.slideLabel.fontSize
    participantsLabelNode.fontName = {
      family: Slides.slideLabel.fontFamily,
      style: Slides.slideLabel.fontWeight,
    }
    participantsLabelNode.fills = [this.solidPaint(Slides.darkColor)]

    // Participants List
    const participantsListNode = figma.createFrame()
    participantsNode.appendChild(participantsListNode)
    participantsListNode.name = '_list'
    participantsListNode.layoutMode = 'HORIZONTAL'
    participantsListNode.layoutSizingHorizontal = 'FILL'
    participantsListNode.layoutSizingVertical = 'HUG'
    participantsListNode.layoutWrap = 'WRAP'
    participantsListNode.itemSpacing = Slides.gaps.medium
    participantsListNode.counterAxisSpacing = null
    participantsListNode.maxHeight = 416
    participantsListNode.fills = []
    this.participants.forEach((participant) => {
      participantsListNode.appendChild(
        this.makePerson(participant.avatar, participant.fullName, 538)
      )
    })

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
