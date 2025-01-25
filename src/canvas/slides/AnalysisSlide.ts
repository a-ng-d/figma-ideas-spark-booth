import { lang, locals } from '../../content/locals'
import { IdeaConfiguration } from '../../types/configurations'
import setFriendlyDate from '../../utils/setFriendlyDate'
import Chart from '../partials/Chart'
import Header from '../partials/Header'
import Slide from '../partials/Slide'
import { colors } from '../partials/tokens'

export default class AnalysisSlide {
  private activityName: string
  private sessionStartDate: string | Date
  private duration: number
  private ideas: { [key: string]: Array<IdeaConfiguration> }
  private stringifiedChart: string
  analysisSlideNode: SlideNode

  constructor(options: {
    activityName: string
    sessionStartDate: string | Date
    sessionEndDate: string | Date
    ideas: { [key: string]: Array<IdeaConfiguration> }
    stringifiedChart: string
  }) {
    this.activityName = options.activityName
    this.sessionStartDate = options.sessionStartDate
    this.duration =
      new Date(options.sessionStartDate).getTime() -
      new Date(options.sessionEndDate).getTime()
    this.ideas = options.ideas
    this.stringifiedChart = options.stringifiedChart
    this.analysisSlideNode = this.makeAnalysisSlide()
  }

  makeAnalysisSlide = () => {
    const slide = new Slide({
      name: `${this.activityName}・${setFriendlyDate(this.sessionStartDate, lang)}・${locals[lang].consolisation.analysis}`,
      color: colors.lightColor,
    })
    const header = new Header({
      upTitle: `${this.activityName}・${setFriendlyDate(this.sessionStartDate, lang, 'LONG')}`,
      title: locals[lang].consolisation.analysis,
      color: colors.darkColor,
    })
    const chart = new Chart({
      stringifiedChart: this.stringifiedChart,
    })

    slide.layoutNode.appendChild(header.headerNode)
    slide.layoutNode.appendChild(chart.chartNode)

    header.headerNode.layoutSizingHorizontal = 'FILL'
    chart.chartNode.layoutSizingHorizontal = 'FILL'
    chart.chartNode.layoutSizingVertical = 'FILL'

    return slide.slideNode
  }
}
