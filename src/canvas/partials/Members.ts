import { HexModel } from '@a_ng_d/figmug-ui'
import { UserConfiguration } from 'src/types/configurations'
import { colors, gaps, textStyles } from './tokens'

export default class Members {
  private members: Array<UserConfiguration>
  private width: number | 'AUTO'
  private solidPaint: (hex: HexModel) => Paint
  membersNode: FrameNode

  constructor(options: {
    members: Array<UserConfiguration>
    width: number | 'AUTO'
  }) {
    this.members = options.members
    this.width = options.width
    this.solidPaint = figma.util.solidPaint
    this.membersNode = this.makeMembers()
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

  makeMembers = () => {
    let remains = 0

    // Base
    const membersNode = figma.createFrame()
    membersNode.name = '_members'
    membersNode.layoutMode = 'HORIZONTAL'
    membersNode.counterAxisSizingMode = 'AUTO'
    membersNode.counterAxisAlignItems = 'CENTER'
    membersNode.itemSpacing = gaps.small
    membersNode.fills = []
    if (this.width !== 'AUTO') membersNode.resize(this.width, 100)
    else membersNode.primaryAxisSizingMode = 'AUTO'

    // Avatars
    const avatarsNode = figma.createFrame()
    membersNode.appendChild(avatarsNode)
    avatarsNode.name = '_avatars'
    avatarsNode.layoutMode = 'HORIZONTAL'
    avatarsNode.layoutSizingHorizontal = 'HUG'
    avatarsNode.layoutSizingVertical = 'HUG'
    avatarsNode.itemSpacing = -32
    avatarsNode.itemReverseZIndex = true
    avatarsNode.fills = []

    this.members.forEach((member, index) => {
      if (index < 12)
        this.makeAvatar(member.avatar).then((avatarNode) => {
          avatarsNode.appendChild(avatarNode)
        })
      else remains++
    })

    if (remains > 0) {
      const nameNode = figma.createText()
      membersNode.appendChild(nameNode)
      nameNode.name = '_label'
      nameNode.characters = `+${remains}`
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
    }

    return membersNode
  }
}
