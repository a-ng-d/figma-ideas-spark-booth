import { ActivityConfiguration } from '../types/configurations'
import InstructionsSlide from './slides/InstructionsSlide'
import titleSlide from './slides/TitleSlide'

export default class OverviewSlides {
  private activity: ActivityConfiguration
  rowNode: SlideRowNode

  constructor(options: { activity: ActivityConfiguration }) {
    this.activity = options.activity
    this.rowNode = this.makeClassification()
  }

  makeClassification = () => {
    const rowNode = figma.createSlideRow()
    rowNode.name = this.activity.name

    rowNode.appendChild(
      new titleSlide({
        activityName: this.activity.name,
        activityDescription: this.activity.description,
      }).titleSlideNode
    )
    rowNode.appendChild(
      new InstructionsSlide({
        activityName: this.activity.name,
        activityInstructions: this.activity.instructions,
      }).instructionsSlideNode
    )

    return rowNode
  }
}
