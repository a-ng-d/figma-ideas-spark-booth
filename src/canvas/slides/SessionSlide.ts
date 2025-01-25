import { HexModel } from '@a_ng_d/figmug-ui'
import { lang, locals } from '../../content/locals'
import { UserConfiguration } from '../../types/configurations'
import setFriendlyDate from '../../utils/setFriendlyDate'
import Header from '../partials/Header'
import Member from '../partials/Member'
import Members from '../partials/Members'
import Slide from '../partials/Slide'
import { colors, gaps, textStyles } from '../partials/tokens'

export default class SessionSlide {
  private activityName: string
  private sessionStartDate: string | Date
  private sessionFacilitator: UserConfiguration
  private participants: Array<UserConfiguration>
  solidPaint: (hex: HexModel) => Paint
  sessionSlideNode: SlideNode
  participantsSlot: FrameNode | null

  constructor(options: {
    activityName: string
    sessionStartDate: string | Date
    sessionFacilitator: UserConfiguration
    participants: Array<UserConfiguration>
  }) {
    this.activityName = options.activityName
    this.sessionStartDate = options.sessionStartDate
    this.sessionFacilitator = options.sessionFacilitator
    this.participants = options.participants
    this.solidPaint = figma.util.solidPaint
    this.sessionSlideNode = this.makeSessionSlide()
    this.participantsSlot = null
  }

  static participantWidth = 538

  makeFacilitator = () => {
    // Base
    const facilitatorNode = figma.createFrame()
    facilitatorNode.name = '_facilitator'
    facilitatorNode.layoutMode = 'HORIZONTAL'
    facilitatorNode.primaryAxisSizingMode = 'AUTO'
    facilitatorNode.counterAxisSizingMode = 'AUTO'
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

    // Facilitator Member
    const facilitatorMemberNode = new Member({
      avatarUrl: this.sessionFacilitator.avatar,
      name: this.sessionFacilitator.fullName,
      width: 'AUTO',
    }).memberNode
    facilitatorNode.appendChild(facilitatorMemberNode)

    return facilitatorNode
  }

  makeParticipants = () => {
    // Participants
    const participantsNode = figma.createFrame()
    participantsNode.name = '_participants'
    participantsNode.layoutMode = 'VERTICAL'
    participantsNode.primaryAxisSizingMode = 'AUTO'
    participantsNode.counterAxisSizingMode = 'AUTO'
    participantsNode.itemSpacing = gaps.small
    participantsNode.fills = []

    // Participants Label
    const participantsLabelNode = figma.createText()
    participantsNode.appendChild(participantsLabelNode)
    participantsLabelNode.name = '_label'
    participantsLabelNode.characters = locals[lang].consolisation.participants
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
    participantsListNode.name = '_participants-list'
    participantsListNode.layoutMode = 'HORIZONTAL'
    participantsListNode.layoutSizingHorizontal = 'FILL'
    participantsListNode.layoutSizingVertical = 'HUG'
    participantsListNode.layoutWrap = 'WRAP'
    participantsListNode.itemSpacing = gaps.medium
    participantsListNode.counterAxisSpacing = null
    participantsListNode.maxHeight = 416
    participantsListNode.fills = []

    this.participantsSlot = participantsListNode

    return participantsNode
  }

  makeSessionSlide = () => {
    const slide = new Slide({
      name: `${this.activityName}・${setFriendlyDate(this.sessionStartDate, lang)}`,
      color: colors.lightColor,
    })
    const header = new Header({
      upTitle: this.activityName,
      title: setFriendlyDate(this.sessionStartDate, lang, 'LONG'),
      downTitle: this.makeFacilitator(),
      color: colors.darkColor,
    })
    const participantsNode = this.makeParticipants()

    slide.layoutNode.appendChild(header.headerNode)
    slide.layoutNode.appendChild(participantsNode)

    header.headerNode.layoutSizingHorizontal = 'FILL'
    participantsNode.layoutSizingHorizontal = 'FILL'

    const participantToDuplicate = this.participants[0]
    const duplicationCount = 39
    const duplicatedParticipants = Array(duplicationCount).fill(
      participantToDuplicate
    )
    const allParticipants = [...this.participants, ...duplicatedParticipants]
    let remainingParticipants: Array<UserConfiguration> = []

    allParticipants.forEach((participant, index) => {
      if (index <= 13)
        this.participantsSlot?.appendChild(
          new Member({
            avatarUrl: participant.avatar,
            name: participant.fullName,
            width: SessionSlide.participantWidth,
          }).memberNode
        )
      if (index >= 14 && allParticipants.length <= 15)
        this.participantsSlot?.appendChild(
          new Member({
            avatarUrl: participant.avatar,
            name: participant.fullName,
            width: SessionSlide.participantWidth,
          }).memberNode
        )
      if (index >= 14 && allParticipants.length > 15)
        remainingParticipants = [...remainingParticipants, participant]
    })

    if (remainingParticipants.length > 0)
      this.participantsSlot?.appendChild(
        new Members({
          members: remainingParticipants,
          width: SessionSlide.participantWidth,
        }).membersNode
      )

    return slide.slideNode
  }
}
