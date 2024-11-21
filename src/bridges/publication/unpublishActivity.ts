import {
  ActivityConfiguration,
  MetaConfiguration,
} from '../../types/configurations'
import { activitiesDbTableName } from '../../utils/config'
import { supabase } from './authentication'

const unpublishActivity = async (
  activity: ActivityConfiguration,
  isRemote = false
): Promise<MetaConfiguration> => {
  const { error } = await supabase
    .from(activitiesDbTableName)
    .delete()
    .match({ activity_id: activity.meta.id })

  if (!error) {
    const activityPublicationDetails = {
      id: activity.meta.id,
      dates: {
        publishedAt: '',
        createdAt: activity.meta.dates?.createdAt ?? '',
        updatedAt: activity.meta.dates?.updatedAt ?? '',
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

    if (!isRemote) {
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
    }

    return activityPublicationDetails
  } else throw error
}

export default unpublishActivity
