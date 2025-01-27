import OverviewSlides from '../../canvas/OverviewSlides'
import { ActivityConfiguration } from '../../types/configurations'

const addOverviewToSlides = async (data: {
  activity: ActivityConfiguration
}) => {
  new OverviewSlides({
    activity: data.activity,
  })

  return true
}

export default addOverviewToSlides
