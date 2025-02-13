import {
  activitiesDbTableName,
  activitiesStorageName,
  databaseUrl,
  templatesDbTableName,
} from '../../config'
import {
  ActivityConfiguration,
  MetaConfiguration,
  ThumbnailConfiguration,
} from '../../types/configurations'
import { FigmaRestJson } from '../../types/data'
import { UserSession } from '../../types/user'
import setUint8Array from '../../utils/setUint8Array'
import { supabase } from './authentication'

const publishActivity = async (
  activity: ActivityConfiguration,
  userSession: UserSession,
  isShared = false,
  thumbnail?: ThumbnailConfiguration,
  template?: FigmaRestJson
): Promise<MetaConfiguration> => {
  let imageUrl = null
  const now = new Date().toISOString()

  if (thumbnail !== undefined) {
    const { error: uploadImgError } = await supabase.storage
      .from(activitiesStorageName)
      .upload(
        `${userSession.userId}/${activity.meta.id}.png`,
        setUint8Array(thumbnail.imageUrl).buffer,
        {
          contentType: 'image/png',
          upsert: true,
        }
      )
    if (!uploadImgError)
      imageUrl = `${databaseUrl}/storage/v1/object/public/${activitiesStorageName}/${userSession.userId}/${activity.meta.id}.png`
  }

  const { error: addActivityError } = await supabase
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
        thumbnail: imageUrl,
        creator_id: userSession.userId,
        creator_full_name: userSession.userFullName,
        creator_avatar: userSession.userAvatar,
        created_at: activity.meta.dates.createdAt,
        updated_at: activity.meta.dates.updatedAt,
        published_at: now,
      },
    ])
    .select()

  if (template !== undefined) {
    const { error: addTemplateError } = await supabase
      .from(templatesDbTableName)
      .insert([
        {
          activity_id: activity.meta.id,
          document: template.document,
          components: template.components,
          creator_id: userSession.userId,
          creator_full_name: userSession.userFullName,
          creator_avatar: userSession.userAvatar,
        },
      ])
      .select()

    if (addTemplateError) throw addTemplateError
  }

  if (!addActivityError) {
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
              ...activityPublicationDetails,
            },
          },
        },
      },
      '*'
    )

    return activityPublicationDetails
  } else throw addActivityError
}

export default publishActivity
