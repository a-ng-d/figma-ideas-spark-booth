import { lang, locals } from '../../content/locals'
import {
  ActivityConfiguration,
  IdeaConfiguration,
  SessionConfiguration,
  UserConfiguration,
} from '../../types/configurations'
import addSessionToSlides from '../export/addSessionToSlides'
import addSessionToBoard from '../export/addSessionToBoard'
import updateParticipants from './updateParticipants'

const endSession = async (data: {
  activity: ActivityConfiguration
  sessions: Array<SessionConfiguration>
  session: SessionConfiguration
  ideas: { [key: string]: Array<IdeaConfiguration> }
  participants: Array<UserConfiguration>
  stringifiedChart: string
}) => {
  figma.root.setPluginData('sessions', JSON.stringify(data.sessions))
  figma.root.setPluginData('event', 'SESSION_ENDED')

  updateParticipants({ hasEnded: true })

  if (figma.editorType === 'figjam')
    addSessionToBoard({
      activity: data.activity,
      session: data.session,
      ideas: data.ideas,
    })
  else if (figma.editorType === 'slides')
    addSessionToSlides({
      activity: data.activity,
      session: data.session,
      ideas: data.ideas,
      participants: data.participants,
      stringifiedChart: data.stringifiedChart,
    })

  figma.timer?.stop()

  await figma.saveVersionHistoryAsync(
    `${data.activity.name} ${locals[lang].sessions.endSession}`
  )
}

export default endSession
