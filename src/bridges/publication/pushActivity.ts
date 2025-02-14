import { FigmaRestJson } from 'src/types/data'
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
import { UserSession } from '../../types/user'
import setUint8Array from '../../utils/setUint8Array'
import { supabase } from './authentication'

const pushActivity = async ({
  activity,
  userSession,
  isShared = false,
  thumbnail,
  template,
}: {
  activity: ActivityConfiguration
  userSession: UserSession
  isShared?: boolean
  thumbnail?: ThumbnailConfiguration
  template?: FigmaRestJson
}): Promise<MetaConfiguration> => {
  const now = new Date().toISOString()

  const { data: checkedAssets, error: checkedAssetsError } = await supabase
    .from(activitiesDbTableName)
    .select('has_template, thumbnail')
    .match({ activity_id: activity.meta.id })

  if (!checkedAssetsError) {
    if (!checkedAssets[0].thumbnail && thumbnail === undefined) {
      const { error: removedImgError } = await supabase.storage
        .from(activitiesStorageName)
        .remove([`${userSession.userId}/${activity.meta?.id}.png`])

      if (removedImgError) throw removedImgError
    } else if (!checkedAssets[0].thumbnail && thumbnail !== undefined) {
      const { error: updatedImgError } = await supabase.storage
        .from(activitiesStorageName)
        .update(
          `${userSession.userId}/${activity.meta.id}.png`,
          setUint8Array(thumbnail.imageUrl).buffer,
          {
            contentType: 'image/png',
          }
        )

      if (updatedImgError) throw updatedImgError
    } else if (checkedAssets[0].thumbnail && thumbnail !== undefined) {
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

      if (uploadImgError) throw uploadImgError
    }
  } else throw checkedAssetsError

  const { error: updatedActivityError } = await supabase
    .from(activitiesDbTableName)
    .update([
      {
        name: activity.name,
        description: activity.description,
        instructions: activity.instructions,
        grouped_by: activity.groupedBy,
        timer_minutes: activity.timer.minutes,
        timer_seconds: activity.timer.seconds,
        types: activity.types,
        is_shared: isShared,
        has_template: template !== undefined,
        thumbnail:
          thumbnail !== undefined
            ? `${databaseUrl}/storage/v1/object/public/${activitiesStorageName}/${userSession.userId}/${activity.meta.id}.png`
            : null,
        creator_id: userSession.userId,
        creator_full_name: userSession.userFullName,
        creator_avatar: userSession.userAvatar,
        created_at: activity.meta.dates.createdAt,
        updated_at: activity.meta.dates.updatedAt,
        published_at: now,
      },
    ])
    .match({ activity_id: activity.meta.id })

  if (!updatedActivityError) {
    const activityPublicationDetails = {
      id: activity.meta.id,
      dates: {
        createdAt: activity.meta.dates.createdAt,
        updatedAt: activity.meta.dates.updatedAt,
        publishedAt: now,
      },
      publicationStatus: {
        isPublished: activity.meta.publicationStatus.isPublished,
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

    if (!checkedAssetsError) {
      if (checkedAssets[0].has_template && template === undefined) {
        const { error: deletedTemplateError } = await supabase
          .from(templatesDbTableName)
          .delete()
          .match({ activity_id: activity.meta.id })

        if (deletedTemplateError) throw deletedTemplateError
      } else if (checkedAssets[0].has_template && template !== undefined) {
        const { error: updatedTemplateError } = await supabase
          .from(templatesDbTableName)
          .update([
            {
              document: template.document,
              components: template.components,
              updated_at: now,
            },
          ])
          .match({ activity_id: activity.meta.id })

        if (updatedTemplateError) throw updatedTemplateError
      } else if (!checkedAssets[0].has_template && template !== undefined) {
        const { error: addedTemplateError } = await supabase
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

        if (addedTemplateError) throw addedTemplateError
      }
    } else throw checkedAssetsError

    return activityPublicationDetails
  } else throw updatedActivityError
}

export default pushActivity
