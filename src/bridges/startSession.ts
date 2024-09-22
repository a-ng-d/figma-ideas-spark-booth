import {
  ActivityConfiguration,
  SessionConfiguration,
} from '../types/configurations'

const startSession = (data: Array<SessionConfiguration>) => {
  const sessions = data,
    onGoingSession = sessions.find((session) => session.isOngoing),
    activity = JSON.parse(figma.root.getPluginData('activities')).find(
      (activity: ActivityConfiguration) =>
        activity.meta.id === onGoingSession?.activityId
    )

  figma.root.setPluginData('sessions', JSON.stringify(data))

  figma.timer?.start(activity.timer.minutes * 60 + activity.timer.seconds)
}

export default startSession
