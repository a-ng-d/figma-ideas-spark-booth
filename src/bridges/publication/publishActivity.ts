import {
  ActivityConfiguration,
  MetaConfiguration,
} from '../../types/configurations'
import { UserSession } from '../../types/user'
import { activitiesDbTableName } from '../../utils/config'
import { supabase } from './authentication'

const publishActivity = async (
  activity: ActivityConfiguration,
  userSession: UserSession,
  isShared = false
): Promise<MetaConfiguration> => {
  const now = new Date().toISOString()

  const { error } = await supabase
    .from(activitiesDbTableName)
    .insert([
      {
        activity_id: activity.meta.id,
        name: activity.name,
        description: activity.description,
        instructions: activity.instructions,
        grouped_by: activity.groupedBy,
        timer_minutes: activity.timer.minutes,
        timer_seconds: activity.timer.seconds,
        types: activity.types,
        is_shared: isShared,
        creator_id: userSession.userId,
        creator_full_name: userSession.userFullName,
        creator_avatar: userSession.userAvatar,
        created_at: activity.meta.dates.createdAt,
        updated_at: activity.meta.dates.updatedAt,
        published_at: now,
      },
    ])
    .select()

  if (!error) {
    const activityPublicationDetails = {
      id: activity.meta.id,
      dates: {
        createdAt: activity.meta.dates.createdAt,
        updatedAt: activity.meta.dates.updatedAt,
        publishedAt: now,
      },
      publicationStatus: {
        isPublished: true,
        isShared: isShared,
      },
      creatorIdentity: {
        id: userSession.userId ?? '',
        fullName: userSession.userFullName,
        avatar: userSession.userAvatar,
      },
    }

    parent.postMessage(
      {
        pluginMessage: {
          type: 'UPDATE_ACTIVITY',
          data: {
            ...activity,
            meta: {
              activityPublicationDetails,
            },
          },
        },
      },
      '*'
    )

    return activityPublicationDetails
  } else throw error
}

export default publishActivity
