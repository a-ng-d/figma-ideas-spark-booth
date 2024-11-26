import { uid } from 'uid'
import { lang, locals } from '../../content/locals'
import {
  ActivityConfiguration,
  MetaConfiguration,
} from '../../types/configurations'

const detachActivity = async (
  activity: ActivityConfiguration
): Promise<MetaConfiguration> => {
  const activityPublicationDetails = {
    id: uid(),
    dates: {
      publishedAt: '',
      createdAt: activity.meta.dates.createdAt,
      updatedAt: activity.meta.dates.updatedAt,
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

  parent.postMessage(
    {
      pluginMessage: {
        type: 'SEND_MESSAGE',
        message: locals[lang].success.detachment,
      },
    },
    '*'
  )
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
}

export default detachActivity
