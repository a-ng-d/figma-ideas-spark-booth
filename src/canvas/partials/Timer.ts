import { colors, gaps, textStyles } from './tokens'

export default class Timer {
  private duration: number
  timerNode: FrameNode

  constructor(options: { duration: number }) {
    this.duration = options.duration
    this.timerNode = this.makeTimer()
  }

  formatTime = () => {
    console.log(this.duration)
    const minutes = Math.floor((this.duration % 3600000) / 60000)
    const seconds = Math.floor((this.duration % 60000) / 1000)

    return `${minutes}:${seconds}`
  }

  makeTimer = () => {
    const timerNode = figma.createFrame()
    timerNode.name = '_timer'
    timerNode.layoutMode = 'HORIZONTAL'
    timerNode.primaryAxisSizingMode = 'AUTO'
    timerNode.counterAxisSizingMode = 'AUTO'
    timerNode.itemSpacing = gaps.xsmall
    timerNode.verticalPadding = gaps.medium
    timerNode.horizontalPadding = gaps.medium
    timerNode.cornerRadius = 16
    timerNode.fills = [figma.util.solidPaint(colors.onLightColor)]

    const timerLabelNode = figma.createText()
    timerNode.appendChild(timerLabelNode)
    timerLabelNode.name = '_label'
    timerLabelNode.characters = this.formatTime()
    timerLabelNode.textAutoResize = 'WIDTH_AND_HEIGHT'
    timerLabelNode.fontSize = textStyles.slideTimer.fontSize
    timerLabelNode.fontName = {
      family: textStyles.slideTimer.fontFamily,
      style: textStyles.slideTimer.fontWeight,
    }
    timerLabelNode.fills = [figma.util.solidPaint(colors.darkColor)]

    return timerNode
  }
}
