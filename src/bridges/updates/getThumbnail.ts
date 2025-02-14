import { ThumbnailConfiguration } from 'src/types/configurations'

const getThumnail = (activityId: string) => {
  const thumbnail = JSON.parse(figma.root.getPluginData('thumbnails')).find(
    (thumbnail: ThumbnailConfiguration) => thumbnail.activityId === activityId
  )

  figma.ui.postMessage({
    type: 'GET_ACTIVITY_THUMBNAIL',
    imageUrl: thumbnail !== undefined ? thumbnail.imageUrl : undefined,
    templateStatus: thumbnail !== undefined ? 'SAVED' : 'NOT_SAVED',
  })
}

export default getThumnail
