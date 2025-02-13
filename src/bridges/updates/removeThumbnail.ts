import { ThumbnailConfiguration } from 'src/types/configurations'

const removeThumbnail = async (activityId: string) => {
  const existingThumbnails = JSON.parse(
    figma.root.getPluginData('thumbnails')
  ).filter(
    (existingThumbnail: ThumbnailConfiguration) =>
      existingThumbnail.activityId !== activityId
  )

  figma.root.setPluginData('thumbnails', JSON.stringify(existingThumbnails))
}

export default removeThumbnail
