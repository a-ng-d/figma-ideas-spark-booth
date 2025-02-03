import BoardClassification from '../../canvas/BoardClassification'
import {
  ActivityConfiguration,
  IdeaConfiguration,
  SessionConfiguration,
} from '../../types/configurations'

const addSessionToBoard = async (data: {
  activity: ActivityConfiguration
  session: SessionConfiguration
  ideas: { [key: string]: Array<IdeaConfiguration> }
}) => {
  new BoardClassification({
    activity: data.activity,
    sessionStartDate: data.session.metrics.startDate,
    ideas: data.ideas,
  })

  return true
}

export default addSessionToBoard
