import {
  ActivityConfiguration,
  SessionConfiguration,
} from '../types/configurations'

const startSession = (data: Array<SessionConfiguration>) => {
  const sessions = data,
    runningSession = sessions.find((session) => session.isRunning),
    activity = JSON.parse(figma.root.getPluginData('activities')).find(
      (activity: ActivityConfiguration) =>
        activity.meta.id === runningSession?.activityId
    )

  figma.root.setPluginData('sessions', JSON.stringify(data))

  figma.timer?.start(activity.timer.minutes * 60 + activity.timer.seconds)
}

export default startSession
