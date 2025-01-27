import {
  ActivityConfiguration,
  TypeConfiguration,
} from '../types/configurations'
import InstructionsSlide from './slides/InstructionsSlide'
import titleSlide from './slides/TitleSlide'
import TypesSlide from './slides/TypesSlide'

export default class OverviewSlides {
  private activity: ActivityConfiguration
  rowNode: SlideRowNode

  constructor(options: { activity: ActivityConfiguration }) {
    this.activity = options.activity
    this.rowNode = this.makeClassification()
  }

  splitDescriptions = (types: Array<TypeConfiguration>, maxLength: number) => {
    const slides = []
    let currentSlide = [] as Array<TypeConfiguration>
    let currentLength = 0

    types.forEach((type) => {
      if (currentLength + type.description.length > maxLength) {
        slides.push(currentSlide)
        currentSlide = []
        currentLength = 0
      }
      currentSlide.push(type)
      currentLength += type.description.length
    })

    if (currentSlide.length > 0) slides.push(currentSlide)

    return slides
  }

  makeClassification = () => {
    const rowNode = figma.createSlideRow()
    rowNode.name = this.activity.name

    rowNode.appendChild(
      new titleSlide({
        activityName: this.activity.name,
        activityDescription: this.activity.description,
        activityTimer: this.activity.timer,
      }).titleSlideNode
    )
    rowNode.appendChild(
      new InstructionsSlide({
        activityName: this.activity.name,
        activityInstructions: this.activity.instructions,
      }).instructionsSlideNode
    )

    const typeSlides = this.splitDescriptions(this.activity.types, 700)
    typeSlides.forEach((types, index) => {
      rowNode.appendChild(
        new TypesSlide({
          activityName: this.activity.name,
          activityTypes: types,
          indicator:
            typeSlides.length > 1
              ? `${index + 1} / ${typeSlides.length}`
              : undefined,
        }).typesSlideNode
      )
    })

    return rowNode
  }
}
