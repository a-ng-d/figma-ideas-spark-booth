import { ThumbnailConfiguration } from '../../types/configurations'
import addThumbnail from './addThumbnail'

const updateSingleThumbnail = (thumbnail: ThumbnailConfiguration) => {
  const isExisting = JSON.parse(figma.root.getPluginData('thumbnails')).some(
    (existingThumbnail: ThumbnailConfiguration) =>
      existingThumbnail.activityId === thumbnail.activityId
  )

  if (!isExisting) return addThumbnail(thumbnail)
  else {
    const existingThumbnails = JSON.parse(
      figma.root.getPluginData('thumbnails')
    ).map((existingThumbnail: ThumbnailConfiguration) => {
      if (existingThumbnail.activityId === thumbnail.activityId)
        return thumbnail
      return existingThumbnail
    })

    figma.root.setPluginData('thumbnails', JSON.stringify(existingThumbnails))
  }
}

export default updateSingleThumbnail
