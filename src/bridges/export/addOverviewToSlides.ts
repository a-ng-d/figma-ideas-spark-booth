import OverviewSlides from '../../canvas/OverviewSlides'
import { ActivityConfiguration } from '../../types/configurations'

const addOverviewToSlides = async (data: {
  activity: ActivityConfiguration
}) => {
  console.log(data.activity)
  new OverviewSlides({
    activity: data.activity,
  })
}

export default addOverviewToSlides
