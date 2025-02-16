import { UserSession } from 'src/types/user'
import { activitiesDbTableName, activitiesStorageName } from '../../config'
import {
  ActivityConfiguration,
  MetaConfiguration,
} from '../../types/configurations'
import { supabase } from './authentication'

const unpublishActivity = async ({
  activity,
  userSession,
  isRemote = false,
}: {
  activity: Partial<ActivityConfiguration>
  userSession: UserSession
  isRemote?: boolean
}): Promise<Partial<MetaConfiguration>> => {
  const { error: deletedActivityError } = await supabase
    .from(activitiesDbTableName)
    .delete()
    .match({ activity_id: activity.meta?.id })

  if (!deletedActivityError) {
    const { error: deletedImgError } = await supabase.storage
      .from(activitiesStorageName)
      .remove([`${userSession.userId}/${activity.meta?.id}.png`])

    if (deletedImgError) throw deletedImgError
  }

  if (!deletedActivityError) {
    const activityPublicationDetails = {
      id: activity.meta?.id,
      dates: {
        createdAt: activity.meta?.dates.createdAt ?? '',
        updatedAt: activity.meta?.dates.updatedAt ?? '',
        addedAt: activity.meta?.dates.addedAt ?? '',
        publishedAt: '',
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
  } else throw deletedActivityError
}

export default unpublishActivity
