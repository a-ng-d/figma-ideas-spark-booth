import { ActivityConfiguration } from '../../types/configurations'
import { activitiesDbTableName } from '../../config'
import { supabase } from './authentication'

const pullActivity = async (
  activity: ActivityConfiguration
): Promise<ActivityConfiguration> => {
  const { data, error } = await supabase
    .from(activitiesDbTableName)
    .select('*')
    .eq('activity_id', activity.meta.id)

  if (!error && data.length === 1) {
    const activity: ActivityConfiguration = {
      name: data[0].name,
      description: data[0].description,
      instructions: data[0].instructions,
      groupedBy: data[0].grouped_by,
      timer: {
        minutes: data[0].timer_minutes,
        seconds: data[0].timer_seconds,
      },
      types: data[0].types,
      meta: {
        id: data[0].activity_id,
        dates: {
          createdAt: data[0].created_at,
          updatedAt: data[0].updated_at,
          publishedAt: data[0].published_at,
        },
        publicationStatus: {
          isPublished: true,
          isShared: data[0].is_shared,
        },
        creatorIdentity: {
          id: data[0].creator_id,
          fullName: data[0].creator_full_name,
          avatar: data[0].creator_avatar,
        },
      },
    }

    parent.postMessage(
      {
        pluginMessage: {
          type: 'UPDATE_ACTIVITY',
          data: activity,
        },
      },
      '*'
    )

    return activity
  } else throw error
}

export default pullActivity
