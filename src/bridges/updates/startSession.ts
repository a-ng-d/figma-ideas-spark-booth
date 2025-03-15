import { lang, locals } from '../../content/locals'
import {
  ActivityConfiguration,
  SessionConfiguration,
} from '../../types/configurations'
import updateParticipants from './../updates/updateParticipants'

const startSession = async (data: {
  sessions: Array<SessionConfiguration>
  activityId: string
}) => {
  const sessions = data.sessions,
    runningSession = sessions.find(
      (session) => session.isRunning && data.activityId === session.activityId
    ),
    activity = JSON.parse(figma.root.getPluginData('activities')).find(
      (activity: ActivityConfiguration) => activity.meta.id === data.activityId
    ),
    sessionCount = await figma.clientStorage.getAsync('session_count')

  updateParticipants({ hasStarted: true, joinedSessionId: runningSession?.id })

  figma.root.setPluginData('sessions', JSON.stringify(sessions))
  figma.root.setPluginData(
    'event',
    JSON.stringify({
      name: 'SESSION_STARTED',
      activityName: activity.name,
    })
  )
  figma.clientStorage.setAsync(
    'session_count',
    sessionCount !== undefined ? sessionCount + 1 : 1
  )

  figma.timer?.start(activity.timer.minutes * 60 + activity.timer.seconds)

  await figma.saveVersionHistoryAsync(
    locals[lang].sessions.newSession.replace('$1', activity.name)
  )

  figma.ui.postMessage({
    type: 'COUNT_SESSIONS',
    data: {
      sessionCount: sessionCount !== undefined ? sessionCount + 1 : 1,
    },
  })
}

export default startSession
