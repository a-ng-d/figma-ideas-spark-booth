import Slides from '../../canvas/Slides'
import {
  ActivityConfiguration,
  IdeaConfiguration,
  SessionConfiguration,
  UserConfiguration,
} from '../../types/configurations'

const addToSlides = async (data: {
  activity: ActivityConfiguration
  session: SessionConfiguration
  ideas: { [key: string]: Array<IdeaConfiguration> }
  participants: Array<UserConfiguration>
  stringifiedChart: string
}) => {
  new Slides({
    activity: data.activity,
    session: data.session,
    ideas: data.ideas,
    participants: data.participants,
    stringifiedChart: data.stringifiedChart,
  })
}

export default addToSlides
