import { lang, locals } from '../content/locals'
import {
  ActivityConfiguration,
  SessionConfiguration,
} from '../types/configurations'
import updateParticipants from './updates/updateParticipants'

const startSession = async (data: Array<SessionConfiguration>) => {
  const sessions = data,
    runningSession = sessions.find((session) => session.isRunning),
    activity = JSON.parse(figma.root.getPluginData('activities')).find(
      (activity: ActivityConfiguration) =>
        activity.meta.id === runningSession?.activityId
    )

  updateParticipants({ hasStarted: true })

  figma.root.setPluginData('sessions', JSON.stringify(data))
  figma.root.setPluginData('event', 'SESSION_STARTED')

  figma.timer?.start(activity.timer.minutes * 60 + activity.timer.seconds)

  await figma.saveVersionHistoryAsync(
    `${locals[lang].sessions.newSession} of ${activity.name}`
  )
}

export default startSession
