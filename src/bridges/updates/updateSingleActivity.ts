import { ActivityConfiguration } from '../../types/configurations'

const updateSingleActivity = (activity: ActivityConfiguration) => {
  const existingActivities = JSON.parse(
    figma.root.getPluginData('activities')
  ).map((existingActivity: ActivityConfiguration) => {
    if (existingActivity.meta.id === activity.meta.id) return activity
    return existingActivity
  })
  figma.root.setPluginData('activities', JSON.stringify(existingActivities))
}

export default updateSingleActivity
