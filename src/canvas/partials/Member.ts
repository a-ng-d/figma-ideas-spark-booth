import { HexModel } from '@a_ng_d/figmug-ui'
import { colors, gaps, textStyles } from './tokens'

export default class Member {
  private avatarUrl: string
  private name: string
  private width: number | 'AUTO'
  private solidPaint: (hex: HexModel) => Paint
  memberNode: FrameNode

  constructor(options: {
    avatarUrl: string
    name: string
    width: number | 'AUTO'
  }) {
    this.avatarUrl = options.avatarUrl
    this.name = options.name
    this.width = options.width
    this.solidPaint = figma.util.solidPaint
    this.memberNode = this.makeMember()
  }

  makeAvatar = async (avatarUrl: string) => {
    const avatarNode = figma.createEllipse()
    avatarNode.name = '_avatar'
    avatarNode.resize(64, 64)
    avatarNode.fills = [
      {
        type: 'SOLID',
        color: { r: 0.9, g: 0.9, b: 0.9 },
      },
    ]

    figma.createImageAsync(avatarUrl).then(async (image: Image) => {
      avatarNode.fills = [
        {
          type: 'IMAGE',
          imageHash: image.hash,
          scaleMode: 'FILL',
        },
      ]

      return avatarNode
    })

    return avatarNode
  }

  makeMember = () => {
    // Base
    const memberNode = figma.createFrame()
    memberNode.name = '_member'
    memberNode.layoutMode = 'HORIZONTAL'
    memberNode.counterAxisSizingMode = 'AUTO'
    memberNode.counterAxisAlignItems = 'CENTER'
    memberNode.itemSpacing = gaps.small
    memberNode.fills = []
    if (this.width !== 'AUTO') memberNode.resize(this.width, 100)
    else memberNode.primaryAxisSizingMode = 'AUTO'

    // Avatars
    const avatarsNode = figma.createFrame()
    memberNode.appendChild(avatarsNode)
    avatarsNode.name = '_avatars'
    avatarsNode.layoutMode = 'HORIZONTAL'
    avatarsNode.layoutSizingHorizontal = 'HUG'
    avatarsNode.layoutSizingVertical = 'HUG'
    avatarsNode.fills = []

    this.makeAvatar(this.avatarUrl)
      .then((avatarNode) => {
        avatarsNode.appendChild(avatarNode)
      })
      .finally(() => {
        // Name
        const nameNode = figma.createText()
        memberNode.appendChild(nameNode)
        nameNode.name = '_label'
        nameNode.characters = this.name
        nameNode.textAutoResize = 'WIDTH_AND_HEIGHT'
        nameNode.fontSize = textStyles.slideAccentLabel.fontSize
        nameNode.fontName = {
          family: textStyles.slideAccentLabel.fontFamily,
          style: textStyles.slideAccentLabel.fontWeight,
        }
        if (this.width !== 'AUTO') {
          nameNode.layoutSizingHorizontal = 'FILL'
          nameNode.textTruncation = 'ENDING'
        } else nameNode.layoutSizingHorizontal = 'HUG'
        nameNode.fills = [this.solidPaint(colors.darkColor)]
      })

    return memberNode
  }
}
