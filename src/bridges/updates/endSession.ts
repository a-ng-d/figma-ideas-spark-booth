import { lang, locals } from '../../content/locals'
import {
  ActivityConfiguration,
  IdeaConfiguration,
  SessionConfiguration,
} from '../../types/configurations'
import addToBoard from '../export/addToBoard'
import addToSlides from '../export/addToSlides'
import updateParticipants from './updateParticipants'

const endSession = async (data: {
  activity: ActivityConfiguration
  sessions: Array<SessionConfiguration>
  session: SessionConfiguration
  ideas: Array<IdeaConfiguration>
}) => {
  figma.root.setPluginData('sessions', JSON.stringify(data.sessions))
  figma.root.setPluginData('event', 'SESSION_ENDED')

  updateParticipants({ hasEnded: true })

  if (figma.editorType === 'figjam')
    addToBoard({
      activity: data.activity,
      sessionDate: data.session.metrics.startDate,
      ideas: data.ideas,
    })
  else if (figma.editorType === 'slides')
    addToSlides({
      activity: data.activity,
      sessionDate: data.session.metrics.startDate,
      ideas: data.ideas,
    })

  figma.timer?.stop()

  await figma.saveVersionHistoryAsync(
    `${data.activity.name} ${locals[lang].sessions.endSession}`
  )
}

export default endSession
