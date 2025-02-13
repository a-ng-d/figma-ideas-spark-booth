import { uid } from 'uid'
import { lang, locals } from '../../content/locals'
import { ActivityConfiguration } from '../../types/configurations'

const detachActivity = async (
  activity: ActivityConfiguration
): Promise<string> => {
  const newId = uid()
  const activityPublicationDetails = {
    id: activity.meta.id,
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
        type: 'DETACH_ACTIVITY',
        newId: newId,
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

  return newId
}

export default detachActivity
