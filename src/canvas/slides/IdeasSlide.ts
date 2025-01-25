import { HexModel } from '@a_ng_d/figmug-ui'
import { lang } from '../../content/locals'
import { IdeaConfiguration } from '../../types/configurations'
import setFriendlyDate from '../../utils/setFriendlyDate'
import Header from '../partials/Header'
import Slide from '../partials/Slide'
import StickyNote from '../partials/StickyNote'
import { colors, gaps } from '../partials/tokens'

export default class IdeasSlide {
  activityName: string
  typeName: string
  sessionDate: string | Date
  ideas: Array<IdeaConfiguration>
  indicator?: string
  solidPaint: (hex: HexModel) => Paint
  ideaSlideNode: SlideNode

  constructor(
    activityName: string,
    typeName: string,
    sessionDate: string | Date,
    ideas: Array<IdeaConfiguration>,
    indicator?: string
  ) {
    this.activityName = activityName
    this.typeName = typeName
    this.sessionDate = sessionDate
    this.ideas = ideas
    this.indicator = indicator
    this.solidPaint = figma.util.solidPaint
    this.ideaSlideNode = this.makeIdeaSlide()
  }

  makeIdeas = () => {
    const ideasNode = figma.createFrame()
    ideasNode.name = '_ideas-list'
    ideasNode.layoutMode = 'HORIZONTAL'
    ideasNode.primaryAxisSizingMode = 'AUTO'
    ideasNode.counterAxisSizingMode = 'AUTO'
    ideasNode.layoutWrap = 'WRAP'
    ideasNode.primaryAxisAlignItems = 'MIN'
    ideasNode.counterAxisAlignItems = 'MAX'
    ideasNode.itemSpacing = gaps.large
    ideasNode.counterAxisSpacing = null
    ideasNode.fills = []

    return ideasNode
  }

  makeIdeaSlide = () => {
    const slide = new Slide({
      name: `${this.activityName}・${setFriendlyDate(this.sessionDate, lang)}・${this.typeName}`,
      color: this.ideas[0].type.hex + '20',
    })
    const header = new Header({
      upTitle: setFriendlyDate(this.sessionDate, lang, 'LONG'),
      title: this.typeName,
      color: colors.lightColor,
      indicator: this.indicator !== undefined ? this.indicator : undefined,
    })
    const ideasNode = this.makeIdeas()

    slide.layoutNode.appendChild(header.headerNode)
    slide.layoutNode.appendChild(ideasNode)

    header.headerNode.layoutSizingHorizontal = 'FILL'
    ideasNode.layoutSizingHorizontal = 'FILL'
    ideasNode.layoutSizingVertical = 'HUG'

    const stickyNotes = this.ideas.map(
      (idea) => new StickyNote({ idea: idea.text, color: idea.type.hex })
    )
    stickyNotes
      .flat()
      .forEach((note) => ideasNode.appendChild(note.stickyNoteNode))

    return slide.slideNode
  }
}
