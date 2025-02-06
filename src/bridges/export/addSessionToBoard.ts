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
    session: data.session,
    ideas: data.ideas,
  })

  return true
}

export default addSessionToBoard
