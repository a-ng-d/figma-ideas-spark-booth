import { lang, locals } from '../../content/locals'
import { ActivityConfiguration } from '../../types/configurations'
import { ExternalActivitiesData } from '../../types/data'

const duplicatePublishedActivity = async (data: ExternalActivitiesData) => {
  const newActivity: ActivityConfiguration = {
      name: data.name,
      description: data.description,
      instructions: data.instructions,
      groupedBy: data.grouped_by,
      timer: {
        minutes: data.timer_minutes,
        seconds: data.timer_seconds,
      },
      types: data.types,
      meta: {
        id: data.activity_id,
        dates: {
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          publishedAt: data.published_at,
        },
        creatorIdentity: {
          avatar: data.creator_avatar,
          fullName: data.creator_full_name,
          id: data.creator_id,
        },
        publicationStatus: {
          isShared: data.is_shared,
          isPublished: true,
        },
      },
    },
    existingActivities = JSON.parse(figma.root.getPluginData('activities'))

  const isThereAnyMatch = existingActivities.some(
    (activity: ActivityConfiguration) => {
      return activity.meta.id === newActivity.meta.id
    }
  )

  if (!isThereAnyMatch) {
    existingActivities.push(newActivity)
    figma.root.setPluginData('activities', JSON.stringify(existingActivities))
    figma.notify(locals[lang].success.duplicatedActivity)
  } else {
    figma.notify(locals[lang].warning.activityAlreadyExists)
  }
}

export default duplicatePublishedActivity
