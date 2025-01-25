import { textStyles } from './tokens'

export default class Chart {
  private stringifiedChart: string
  chartNode: FrameNode

  constructor(options: { stringifiedChart: string }) {
    this.stringifiedChart = options.stringifiedChart
    this.chartNode = this.makeChart()
  }

  makeChart = () => {
    const chartNode = figma.createFrame()
    chartNode.name = '_chart'
    chartNode.layoutMode = 'VERTICAL'
    chartNode.primaryAxisSizingMode = 'AUTO'
    chartNode.counterAxisSizingMode = 'AUTO'
    chartNode.primaryAxisAlignItems = 'CENTER'
    chartNode.counterAxisAlignItems = 'CENTER'
    chartNode.fills = []

    const vectorNode = figma.createNodeFromSvg(this.stringifiedChart)
    vectorNode.name = '_chart-vectors'
    vectorNode.clipsContent = false
    vectorNode
      .findAllWithCriteria({
        types: ['TEXT'],
      })
      .forEach((textNode) => {
        textNode.fontName = {
          family: textStyles.slideDataViz.fontFamily,
          style: textStyles.slideDataViz.fontWeight,
        }
      })

    chartNode.appendChild(vectorNode)

    return chartNode
  }
}
