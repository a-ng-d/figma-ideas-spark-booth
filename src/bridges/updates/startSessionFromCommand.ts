import { PlanStatus } from 'src/types/app'
import {
  ActivityConfiguration,
  SessionConfiguration,
} from 'src/types/configurations'
import { uid } from 'uid'
import startSession from './startSession'

const startSessionFromCommand = async (template: SectionNode) => {
  const activity = JSON.parse(
    template.getPluginData('activity')
  ) as ActivityConfiguration
  const existingActivities = JSON.parse(figma.root.getPluginData('activities'))
  const existingSessions = JSON.parse(figma.root.getPluginData('sessions'))
  const existingThumbnails = JSON.parse(figma.root.getPluginData('thumbnails'))
  const existingTemplates = JSON.parse(figma.root.getPluginData('templates'))

  const isActivityExisting: boolean = JSON.parse(
    figma.root.getPluginData('activities')
  ).some(
    (existingActivity: ActivityConfiguration) =>
      existingActivity.meta.id === activity.meta.id
  )

  if (!isActivityExisting) {
    figma.root.setPluginData(
      'activities',
      JSON.stringify([...existingActivities, activity])
    )
    figma.root.setPluginData(
      'thumbnails',
      JSON.stringify([
        ...existingThumbnails,
        {
          activityId: activity.meta.id,
          thumbnail: await template.exportAsync({
            format: 'JSON_REST_V1',
          }),
        },
      ])
    )
    figma.root.setPluginData(
      'templates',
      JSON.stringify([
        ...existingTemplates,
        {
          activityId: activity.meta.id,
          nodes: template.children.map((node) => node.id),
        },
      ])
    )
  }

  const newSession = {
    id: uid(),
    facilitator: {
      id: figma.currentUser?.id,
      fullName: figma.currentUser?.name,
      avatar: figma.currentUser?.photoUrl,
      planStatus: 'UNPAID' as PlanStatus,
    },
    metrics: {
      startDate: new Date().toISOString(),
      endDate: '',
      participants: 0,
      ideas: 0,
    },
    isRunning: true,
    activityId: activity.meta.id,
  } as SessionConfiguration

  startSession([...existingSessions, newSession])
}

export default startSessionFromCommand
