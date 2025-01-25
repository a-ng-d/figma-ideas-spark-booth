import { HexModel } from '@a_ng_d/figmug-ui'
import { max } from 'd3-array'
import { axisBottom, axisLeft } from 'd3-axis'
import { scaleBand, scaleLinear } from 'd3-scale'
import { create } from 'd3-selection'
import { colors, textStyles } from '../canvas/partials/tokens'

const setBarChart = (
  data: Array<{ type: string; count: number; color: HexModel }>,
  width = 800,
  height = 400,
  render: 'DOM' | 'STRING' = 'DOM'
) => {
  // Créer le conteneur SVG
  const svg = create('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('xmlns', 'http://www.w3.org/2000/svg')
    .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
    .attr('version', '1.1')
    .attr('viewbox', `0 0 ${width} ${height}`)

  const g = svg.append('g')

  const x = scaleBand()
    .domain(data.map((d) => d.type))
    .range([0, width])
    .padding(0.1)
  const y = scaleLinear()
    .domain([0, max(data, (d) => d.count) || 0])
    .nice()
    .range([height, 0])

  g.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${height})`)
    .call(axisBottom(x))
    .selectAll('text')
    .style('fill', `#${colors.darkColor}`)
    .style('font-size', `${textStyles.slideDataViz.fontSize}px`)
  g.append('g')
    .attr('class', 'y-axis')
    .call(axisLeft(y))
    .selectAll('text')
    .style('fill', `#${colors.darkColor}`)
    .style('font-size', `${textStyles.slideDataViz.fontSize}px`)

  g.selectAll('.x-axis path, .x-axis line').style(
    'stroke',
    `#${colors.darkColor}`
  )

  g.selectAll('.y-axis path, .y-axis line').style(
    'stroke',
    `#${colors.darkColor}`
  )

  g.selectAll('.bar')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (d) => x(d.type) ?? 0)
    .attr('y', (d) => y(d.count))
    .attr('width', x.bandwidth())
    .attr('height', (d) => height - y(d.count))
    .attr('fill', (d) => d.color)
    .attr('stroke', `#${colors.darkColor}`)
    .attr('stroke-width', 1)
    .attr('rx', 16)
    .attr('ry', 16)

  const svgNode = svg.node()

  if (svgNode && render === 'DOM') return svgNode

  if (svgNode) {
    const serializer = new XMLSerializer()
    const svgString = serializer.serializeToString(svgNode)

    return svgString
  }

  return ''
}

export default setBarChart
