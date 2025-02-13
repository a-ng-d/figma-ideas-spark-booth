import { UserSession } from 'src/types/user'
import {
  activitiesDbTableName,
  activitiesStorageName,
  templatesDbTableName,
} from '../../config'
import { ActivityConfiguration } from '../../types/configurations'
import { supabase } from './authentication'
import setImageUrlFromBlob from '../../utils/setImageUrlFromBlob'

const pullActivity = async (
  activity: ActivityConfiguration,
  userSession: UserSession
): Promise<ActivityConfiguration> => {
  const { data: pulledActivity, error: pulledActivityError } = await supabase
    .from(activitiesDbTableName)
    .select('*')
    .eq('activity_id', activity.meta.id)

  if (!pulledActivityError && pulledActivity.length === 1) {
    const activity: ActivityConfiguration = {
      name: pulledActivity[0].name,
      description: pulledActivity[0].description,
      instructions: pulledActivity[0].instructions,
      groupedBy: pulledActivity[0].grouped_by,
      timer: {
        minutes: pulledActivity[0].timer_minutes,
        seconds: pulledActivity[0].timer_seconds,
      },
      types: pulledActivity[0].types,
      meta: {
        id: pulledActivity[0].activity_id,
        dates: {
          createdAt: pulledActivity[0].created_at,
          updatedAt: pulledActivity[0].updated_at,
          publishedAt: pulledActivity[0].published_at,
        },
        publicationStatus: {
          isPublished: true,
          isShared: pulledActivity[0].is_shared,
        },
        creatorIdentity: {
          id: pulledActivity[0].creator_id,
          fullName: pulledActivity[0].creator_full_name,
          avatar: pulledActivity[0].creator_avatar,
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

    if (pulledActivity[0].thumbnail) {
      const { data: downloadedImg, error: downloadedImgError } =
        await supabase.storage
          .from(activitiesStorageName)
          .download(`${userSession.userId}/${activity.meta.id}.png`)

      if (!downloadedImgError && downloadedImg) {
        parent.postMessage(
          {
            pluginMessage: {
              type: 'UPDATE_THUMBNAIL',
              data: {
                activityId: pulledActivity[0].activity_id,
                imageUrl: await setImageUrlFromBlob(downloadedImg),
              },
            },
          },
          '*'
        )
        parent.postMessage(
          {
            pluginMessage: {
              type: 'GET_ACTIVITY_THUMBNAIL',
              activityId: pulledActivity[0].activity_id,
            },
          },
          '*'
        )
      }
    }

    const { data: pulledTemplate, error: pulledTemplateError } = await supabase
      .from(templatesDbTableName)
      .select('*')
      .eq('activity_id', activity.meta.id)

    if (pulledTemplate && !pulledTemplateError) {
      parent.postMessage(
        {
          pluginMessage: {
            type: 'UPDATE_TEMPLATE',
            data: {
              activityId: pulledActivity[0].activity_id,
              nodes: {
                document: pulledTemplate[0].document,
                components: pulledTemplate[0].components,
              },
            },
          },
        },
        '*'
      )
      parent.postMessage(
        {
          pluginMessage: {
            type: 'GET_ACTIVITY_TEMPLATE',
            activityId: pulledActivity[0].activity_id,
          },
        },
        '*'
      )
    }

    return activity
  } else throw pulledActivityError
}

export default pullActivity
