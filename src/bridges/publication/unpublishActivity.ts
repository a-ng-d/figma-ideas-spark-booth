import { UserSession } from 'src/types/user'
import { activitiesDbTableName, activitiesStorageName } from '../../config'
import {
  ActivityConfiguration,
  MetaConfiguration,
} from '../../types/configurations'
import { supabase } from './authentication'

const unpublishActivity = async (
  activity: Partial<ActivityConfiguration>,
  userSession: UserSession,
  isRemote = false
): Promise<Partial<MetaConfiguration>> => {
  const { error: deleteActivityError } = await supabase
    .from(activitiesDbTableName)
    .delete()
    .match({ activity_id: activity.meta?.id })

  if (!deleteActivityError) {
    const { error: deleteImgError } = await supabase.storage
      .from(activitiesStorageName)
      .remove([`${userSession.userId}/${activity.meta?.id}.png`])

    if (deleteImgError) throw deleteImgError
  }

  if (!deleteActivityError) {
    const activityPublicationDetails = {
      id: activity.meta?.id,
      dates: {
        publishedAt: '',
        createdAt: activity.meta?.dates.createdAt ?? '',
        updatedAt: activity.meta?.dates.updatedAt ?? '',
      },
      publicationStatus: {
        isPublished: false,
        isShared: false,
      },
      creatorIdentity: {
        id: '',
        fullName: '',
        avatar: '',
      },
    }

    if (!isRemote)
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
  } else throw deleteActivityError
}

export default unpublishActivity
