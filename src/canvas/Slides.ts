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
import ChartSlide from './slides/ChartSlide'

export default class Slides {
  activityName: string
  sessionDate: string | Date
  sessionFacilitator: UserConfiguration
  ideas: { [key: string]: Array<IdeaConfiguration> }
  participants: Array<UserConfiguration>
  stringifiedChart: string
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
    this.sessionDate = options.session.metrics.startDate
    this.sessionFacilitator = options.session.facilitator
    this.ideas = options.ideas
    this.participants = options.participants
    this.stringifiedChart = options.stringifiedChart
    this.solidPaint = figma.util.solidPaint
    this.rowNode = this.makeClassification()
  }

  makeClassification = () => {
    const rowNode = figma.createSlideRow()
    rowNode.name = `${this.activityName}・${setFriendlyDate(this.sessionDate, lang)}`

    rowNode.appendChild(
      new SessionSlide({
        activityName: this.activityName,
        sessionDate: this.sessionDate,
        sessionFacilitator: this.sessionFacilitator,
        participants: this.participants,
      }).sessionSlideNode
    )
    rowNode.appendChild(
      new ChartSlide({
        activityName: this.activityName,
        sessionDate: this.sessionDate,
        ideas: this.ideas,
        stringifiedChart: this.stringifiedChart,
      }).chartSlideNode
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
            typeName: name,
            sessionDate: this.sessionDate,
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
