import { max } from 'd3-array'
import { axisBottom, axisLeft } from 'd3-axis'
import { scaleBand, scaleLinear } from 'd3-scale'
import { create } from 'd3-selection'

const setBarChart = (
  data: Array<{ type: string; count: number }>,
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

  // Définir les échelles
  const x = scaleBand()
    .domain(data.map((d) => d.type))
    .range([0, width])
    .padding(0.1)

  const y = scaleLinear()
    .domain([0, max(data, (d) => d.count) || 0])
    .nice()
    .range([height, 0])

  // Ajouter les axes
  g.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${height})`)
    .call(axisBottom(x))
  g.append('g').attr('class', 'y-axis').call(axisLeft(y))

  // Ajouter les barres
  g.selectAll('.bar')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (d) => x(d.type) ?? 0)
    .attr('y', (d) => y(d.count))
    .attr('width', x.bandwidth())
    .attr('height', (d) => height - y(d.count))
    .attr('fill', '#69b3a2')

  const svgNode = svg.node()

  if (svgNode && render === 'DOM') return svgNode

  if (svgNode) {
    const serializer = new XMLSerializer()
    const svgString = serializer.serializeToString(svgNode)

    return svgString
  }

  return null
}

export default setBarChart
