import { lang, locals } from '../../content/locals'
import {
  ActivityConfiguration,
  SessionConfiguration,
} from '../../types/configurations'
import updateParticipants from './../updates/updateParticipants'

const startSession = async (data: Array<SessionConfiguration>) => {
  const sessions = data,
    runningSession = sessions.find((session) => session.isRunning),
    activity = JSON.parse(figma.root.getPluginData('activities')).find(
      (activity: ActivityConfiguration) =>
        activity.meta.id === runningSession?.activityId
    ),
    sessionCount = await figma.clientStorage.getAsync('session_count')

  updateParticipants({ hasStarted: true })

  figma.root.setPluginData('sessions', JSON.stringify(data))
  figma.root.setPluginData('event', 'SESSION_STARTED')
  figma.clientStorage.setAsync(
    'session_count',
    sessionCount !== undefined ? sessionCount + 1 : 1
  )

  figma.timer?.start(activity.timer.minutes * 60 + activity.timer.seconds)

  await figma.saveVersionHistoryAsync(
    `${locals[lang].sessions.newSession} of ${activity.name}`
  )

  figma.ui.postMessage({
    type: 'COUNT_SESSIONS',
    data: {
      sessionCount: sessionCount !== undefined ? sessionCount + 1 : 1,
    },
  })
}

export default startSession
