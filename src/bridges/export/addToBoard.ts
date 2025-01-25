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
  new Classification(data.activity, data.session.metrics.startDate, data.ideas)
}

export default addToBoard
