import Classification from '../../canvas/Classification'
import {
  ActivityConfiguration,
  IdeaConfiguration,
  SessionConfiguration,
} from '../../types/configurations'

const addToBoard = async (data: {
  activity: ActivityConfiguration
  session: SessionConfiguration
  ideas: { [key: string]: Array<IdeaConfiguration> }
}) => {
  new Classification({
    activity: data.activity,
    sessionStartDate: data.session.metrics.startDate,
    ideas: data.ideas,
  })

  return true
}

export default addToBoard
