import { HexModel } from '@a_ng_d/figmug-ui'
import { lang, locals } from '../content/locals'
import {
  ActivityConfiguration,
  TimerConfiguration,
  TypeConfiguration,
} from '../types/configurations'
import { colors } from './partials/tokens'
import InstructionsSection from './sections/InstructionsSection'
import TitleSection from './sections/TitleSection'
import TypesSection from './sections/TypesSection'

export default class ActivitySections {
  private activityName: string
  private activityDescription: string
  private activityInstructions: string
  private activityTimer: TimerConfiguration
  private activityTypes: Array<TypeConfiguration>
  private activityId: string
  private sectionWidth: number
  private sectionPadding: number
  solidPaint: (hex: HexModel) => Paint
  activitySectionNode: SectionNode

  constructor(activity: ActivityConfiguration) {
    this.activityName = activity.name
    this.activityDescription = activity.description
    this.activityInstructions = activity.instructions
    this.activityTimer = activity.timer
    this.activityTypes = activity.types
    this.activityId = activity.meta.id
    this.sectionWidth = 1920
    this.sectionPadding = 80
    this.solidPaint = figma.util.solidPaint
    this.activitySectionNode = this.makeActivitySections()
  }

  makeActivitySections = () => {
    const sectionNode = figma.createSection()
    sectionNode.name = `${this.activityName}${locals[lang].separator}${locals[lang].consolisation.overview}`
    sectionNode.resizeWithoutConstraints(
      this.sectionWidth + this.sectionPadding * 2,
      1080
    )
    sectionNode.fills = [this.solidPaint(colors.darkColor)]

    const title = new TitleSection({
      activityName: this.activityName,
      activityDescription: this.activityDescription,
      activityTimer: this.activityTimer,
      activityId: this.activityId,
    })
    const instructions = new InstructionsSection({
      activityName: this.activityName,
      activityInstructions: this.activityInstructions,
      activityId: this.activityId,
    })
    const types = new TypesSection({
      activityTypes: this.activityTypes,
      activityId: this.activityId,
    })

    sectionNode.appendChild(title.titleSectionNode)
    sectionNode.appendChild(instructions.instructionsSectionNode)
    sectionNode.appendChild(types.typesSectionNode)

    title.titleSectionNode.x = this.sectionPadding
    title.titleSectionNode.y = this.sectionPadding

    instructions.instructionsSectionNode.x = this.sectionPadding
    instructions.instructionsSectionNode.y =
      title.titleSectionNode.y +
      title.titleSectionNode.height +
      this.sectionPadding

    types.typesSectionNode.x = this.sectionPadding
    types.typesSectionNode.y =
      instructions.instructionsSectionNode.y +
      instructions.instructionsSectionNode.height +
      this.sectionPadding

    sectionNode.resizeWithoutConstraints(
      this.sectionWidth + this.sectionPadding * 2,
      types.typesSectionNode.y +
        types.typesSectionNode.height +
        this.sectionPadding
    )

    sectionNode.setPluginData('activityId', this.activityId)

    return sectionNode
  }
}
