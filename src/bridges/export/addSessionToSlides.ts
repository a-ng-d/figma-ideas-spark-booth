import SessionSlides from '../../canvas/SessionSlides'
import {
  ActivityConfiguration,
  IdeaConfiguration,
  SessionConfiguration,
  UserConfiguration,
} from '../../types/configurations'

const addSessionToSlides = async (data: {
  activity: ActivityConfiguration
  session: SessionConfiguration
  ideas: { [key: string]: Array<IdeaConfiguration> }
  participants: Array<UserConfiguration>
  stringifiedChart: string
}) => {
  new SessionSlides({
    activity: data.activity,
    session: data.session,
    ideas: data.ideas,
    participants: data.participants,
    stringifiedChart: data.stringifiedChart,
  })

  return true
}

export default addSessionToSlides
