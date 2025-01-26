import { lang, locals } from '../../content/locals'
import setFriendlyDate from '../../utils/setFriendlyDate'
import Chart from '../partials/Chart'
import Header from '../partials/Header'
import Layout from '../partials/Layout'
import Slide from '../partials/Slide'
import Timer from '../partials/Timer'
import { chartSizes, colors, gaps, textStyles } from '../partials/tokens'

export default class AnalysisSlide {
  private activityName: string
  private sessionStartDate: string | Date
  private duration: number
  private stringifiedChart: string
  analysisSlideNode: SlideNode

  constructor(options: {
    activityName: string
    sessionStartDate: string | Date
    sessionEndDate: string | Date
    stringifiedChart: string
  }) {
    this.activityName = options.activityName
    this.sessionStartDate = options.sessionStartDate
    this.duration =
      new Date(options.sessionEndDate).getTime() -
      new Date(options.sessionStartDate).getTime()
    this.stringifiedChart = options.stringifiedChart
    this.analysisSlideNode = this.makeAnalysisSlide()
  }

  makeChart = () => {
    const chart = new Chart({
      stringifiedChart: this.stringifiedChart,
    })

    return chart.chartNode
  }

  makeDuration = () => {
    const durationNode = figma.createFrame()
    durationNode.name = '_duration'
    durationNode.layoutMode = 'VERTICAL'
    durationNode.primaryAxisSizingMode = 'AUTO'
    durationNode.counterAxisSizingMode = 'AUTO'
    durationNode.itemSpacing = gaps.small
    durationNode.fills = []

    const durationLabelNode = figma.createText()
    durationNode.appendChild(durationLabelNode)
    durationLabelNode.name = '_label'
    durationLabelNode.characters = locals[lang].consolisation.duration
    durationLabelNode.textAutoResize = 'WIDTH_AND_HEIGHT'
    durationLabelNode.fontSize = textStyles.slideLabel.fontSize
    durationLabelNode.fontName = {
      family: textStyles.slideLabel.fontFamily,
      style: textStyles.slideLabel.fontWeight,
    }
    durationLabelNode.fills = [figma.util.solidPaint(colors.darkColor)]

    durationNode.appendChild(new Timer({ duration: this.duration }).timerNode)

    return durationNode
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
    const layout = new Layout({
      leftSlot: this.makeDuration(),
      rightSlot: this.makeChart(),
    })

    slide.layoutNode.appendChild(header.headerNode)
    slide.layoutNode.appendChild(layout.makeOneThird())

    header.headerNode.layoutSizingHorizontal = 'FILL'
    layout.layoutNode.layoutSizingHorizontal = 'FILL'
    layout.layoutNode.layoutSizingVertical = 'FILL'
    layout.layoutNode.maxHeight = chartSizes.height

    if (layout.leftSlot !== undefined && layout.rightSlot !== undefined) {
      layout.leftSlot.layoutSizingHorizontal = 'FILL'
      layout.rightSlot.layoutSizingHorizontal = 'FILL'
      layout.rightSlot.layoutSizingVertical = 'FILL'
    }

    return slide.slideNode
  }
}
