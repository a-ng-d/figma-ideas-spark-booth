import { lang, locals } from '../../content/locals'
import {
  ActivityConfiguration,
  IdeaConfiguration,
  SessionConfiguration,
  UserConfiguration,
} from '../../types/configurations'
import addSessionToBoard from '../export/addSessionToBoard'
import addSessionToSlides from '../export/addSessionToSlides'
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
  figma.root.setPluginData(
    'event',
    JSON.stringify({
      name: 'SESSION_ENDED',
      activityName: data.activity.name,
    })
  )

  updateParticipants({ hasEnded: true, joinedSessionId: '' })

  if (figma.editorType === 'figjam' && Object.entries(data.ideas).length > 0)
    addSessionToBoard({
      activity: data.activity,
      session: data.session,
      ideas: data.ideas,
    })
  else if (
    figma.editorType === 'slides' &&
    Object.entries(data.ideas).length > 0
  )
    addSessionToSlides({
      activity: data.activity,
      session: data.session,
      ideas: data.ideas,
      participants: data.participants,
      stringifiedChart: data.stringifiedChart,
    })

  figma.timer?.stop()

  await figma.saveVersionHistoryAsync(
    locals[lang].sessions.endSession.replace('$1', data.activity.name)
  )
}

export default endSession
