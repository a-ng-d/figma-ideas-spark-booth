import {
  ActivityConfiguration,
  IdeaConfiguration,
  SessionConfiguration,
  TemplateConfiguration,
  ThumbnailConfiguration,
} from '../../types/configurations'

const detachPublishedActivity = (
  activity: ActivityConfiguration,
  newId: string
) => {
  const existingSessions = JSON.parse(figma.root.getPluginData('sessions')).map(
    (existingSession: SessionConfiguration) => {
      if (existingSession.activityId === activity.meta.id) {
        existingSession.activityId = newId
        return existingSession
      }
      return existingSession
    }
  )
  figma.root.setPluginData('sessions', JSON.stringify(existingSessions))

  const existingIdeas = JSON.parse(figma.root.getPluginData('ideas')).map(
    (existingIdea: IdeaConfiguration) => {
      if (existingIdea.activityId === activity.meta.id) {
        existingIdea.activityId = newId
        return existingIdea
      }
      return existingIdea
    }
  )
  figma.root.setPluginData('ideas', JSON.stringify(existingIdeas))

  const existingThumbnails = JSON.parse(
    figma.root.getPluginData('thumbnails')
  ).map((existingThumbnail: ThumbnailConfiguration) => {
    if (existingThumbnail.activityId === activity.meta.id) {
      existingThumbnail.activityId = newId
      return existingThumbnail
    }
    return existingThumbnail
  })
  figma.root.setPluginData('thumbnails', JSON.stringify(existingThumbnails))

  const existingTemplates = JSON.parse(
    figma.root.getPluginData('templates')
  ).map((existingTemplate: TemplateConfiguration) => {
    if (existingTemplate.activityId === activity.meta.id) {
      existingTemplate.activityId = newId
      return existingTemplate
    }
    return existingTemplate
  })
  figma.root.setPluginData('templates', JSON.stringify(existingTemplates))

  const existingActivities = JSON.parse(
    figma.root.getPluginData('activities')
  ).map((existingActivity: ActivityConfiguration) => {
    if (existingActivity.meta.id === activity.meta.id) {
      activity.meta.id = newId
      return activity
    }
    return existingActivity
  })
  figma.root.setPluginData('activities', JSON.stringify(existingActivities))
}

export default detachPublishedActivity
