import { HexModel } from '@a_ng_d/figmug-ui'
import { lang } from '../content/locals'
import {
  ActivityConfiguration,
  GroupedBy,
  IdeaConfiguration,
  SessionConfiguration,
  UserConfiguration,
} from '../types/configurations'
import setFriendlyDate from '../utils/setFriendlyDate'
import AnalysisSlide from './slides/AnalysisSlide'
import IdeasSlide from './slides/IdeasSlide'
import SessionSlide from './slides/SessionSlide'

export default class SessionSlides {
  private activityName: string
  private activityId: string
  private groupedBy: GroupedBy
  private sessionStartDate: string | Date
  private sessionEndDate: string | Date
  private sessionFacilitator: UserConfiguration
  private sessionId: string
  private ideas: { [key: string]: Array<IdeaConfiguration> }
  private participants: Array<UserConfiguration>
  private stringifiedChart: string
  solidPaint: (hex: HexModel) => Paint
  rowNode: SlideRowNode

  constructor(options: {
    activity: ActivityConfiguration
    session: SessionConfiguration
    ideas: { [key: string]: Array<IdeaConfiguration> }
    participants: Array<UserConfiguration>
    stringifiedChart: string
  }) {
    this.activityName = options.activity.name
    this.activityId = options.activity.meta.id
    this.groupedBy = options.activity.groupedBy
    this.sessionStartDate = options.session.metrics.startDate
    this.sessionEndDate = options.session.metrics.endDate
    this.sessionFacilitator = options.session.facilitator
    this.sessionId = options.session.id
    this.ideas = options.ideas
    this.participants = options.participants
    this.stringifiedChart = options.stringifiedChart
    this.solidPaint = figma.util.solidPaint
    this.rowNode = this.makeClassification()
  }

  makeClassification = () => {
    const rowNode = figma.createSlideRow()
    rowNode.name = `${this.activityName}・${setFriendlyDate(this.sessionStartDate, lang)}`

    rowNode.appendChild(
      new SessionSlide({
        activityName: this.activityName,
        sessionStartDate: this.sessionStartDate,
        sessionFacilitator: this.sessionFacilitator,
        participants: this.participants,
      }).sessionSlideNode
    )
    rowNode.appendChild(
      new AnalysisSlide({
        activityName: this.activityName,
        sessionStartDate: this.sessionStartDate,
        sessionEndDate: this.sessionEndDate,
        stringifiedChart: this.stringifiedChart,
      }).analysisSlideNode
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
          new IdeasSlide({
            activityName: this.activityName,
            activityId: this.activityId,
            groupedBy: this.groupedBy,
            typeName: name,
            sessionStartDate: this.sessionStartDate,
            sessionId: this.sessionId,
            ideas: ideas,
            indicator:
              splitIdeas.length > 1
                ? `${index + 1} / ${splitIdeas.length}`
                : undefined,
          }).ideaSlideNode
        )
      })
    })

    return rowNode
  }
}
