import { lang } from '../../content/locals'
import { IdeaConfiguration } from '../../types/configurations'
import setFriendlyDate from '../../utils/setFriendlyDate'
import BarChart from '../partials/Chart'
import Header from '../partials/Header'
import Slide from '../partials/Slide'
import { colors } from '../partials/tokens'

export default class ChartSlide {
  private activityName: string
  private sessionDate: string | Date
  private ideas: { [key: string]: Array<IdeaConfiguration> }
  private stringifiedChart: string
  chartSlideNode: SlideNode

  constructor(options: {
    activityName: string
    sessionDate: string | Date
    ideas: { [key: string]: Array<IdeaConfiguration> }
    stringifiedChart: string
  }) {
    this.activityName = options.activityName
    this.sessionDate = options.sessionDate
    this.ideas = options.ideas
    this.stringifiedChart = options.stringifiedChart
    this.chartSlideNode = this.makeChartSlide()
  }

  prepareData = () => {
    const data = Object.keys(this.ideas).map((type: string) => ({
      type: type,
      count: this.ideas[type].length,
    }))

    return data
  }

  makeChartSlide = () => {
    const slide = new Slide({
      name: `${this.activityName}・${setFriendlyDate(this.sessionDate, lang)}・${'Chart'}`,
      color: colors.lightColor,
    })
    const header = new Header({
      upTitle: `${this.activityName}・${setFriendlyDate(this.sessionDate, lang, 'LONG')}`,
      title: 'Chart',
      color: colors.darkColor,
    })
    const chart = new BarChart({
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
