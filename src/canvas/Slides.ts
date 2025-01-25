import { HexModel } from '@a_ng_d/figmug-ui'
import { lang } from '../content/locals'
import {
  ActivityConfiguration,
  IdeaConfiguration,
  SessionConfiguration,
  UserConfiguration,
} from '../types/configurations'
import setFriendlyDate from '../utils/setFriendlyDate'
import SessionSlide from './slides/SessionSlide'
import IdeasSlide from './slides/IdeasSlide'

export default class Slides {
  activityName: string
  sessionDate: string | Date
  sessionFacilitator: UserConfiguration
  participants: Array<UserConfiguration>
  ideas: { [key: string]: Array<IdeaConfiguration> }
  solidPaint: (hex: HexModel) => Paint
  rowNode: SlideRowNode

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
    this.solidPaint = figma.util.solidPaint
    this.rowNode = this.makeClassification()
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
    Object.entries(this.ideas).forEach(([name, ideas]) => {
      const splitIdeas = ideas.reduce(
        (acc: Array<Array<IdeaConfiguration>>, idea, index) => {
          if (index % 6 === 0) acc.push([])
          acc[acc.length - 1].push(idea)
          return acc
        },
        []
      )
      splitIdeas.forEach((ideas, index) => {
        rowNode.appendChild(
          new IdeasSlide(
            this.activityName,
            name,
            this.sessionDate,
            ideas,
            splitIdeas.length > 1
              ? `${index + 1} / ${splitIdeas.length}`
              : undefined
          ).ideaSlideNode
        )
      })
    })

    return rowNode
  }
}
