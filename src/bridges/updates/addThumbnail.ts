import { ThumbnailConfiguration } from 'src/types/configurations'

const addThumbnail = async (activity: ThumbnailConfiguration) => {
  const existingThumbnails = JSON.parse(figma.root.getPluginData('thumbnails'))

  const isExisting = existingThumbnails.some(
    (existingThumbnail: ThumbnailConfiguration) =>
      existingThumbnail.activityId === activity.activityId
  )

  if (!isExisting) existingThumbnails.push(activity)
  else
    existingThumbnails.map((existingThumbnail: ThumbnailConfiguration) => {
      if (existingThumbnail.activityId === activity.activityId) return activity
      return existingThumbnail
    })

  figma.root.setPluginData('thumbnails', JSON.stringify(existingThumbnails))
}

export default addThumbnail
