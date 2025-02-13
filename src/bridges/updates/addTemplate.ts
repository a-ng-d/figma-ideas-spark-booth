import { TemplateConfiguration } from 'src/types/configurations'

const addTemplate = async (activity: TemplateConfiguration) => {
  const existingTemplates = JSON.parse(figma.root.getPluginData('templates'))

  const isExisting = existingTemplates.some(
    (existingTemplate: TemplateConfiguration) =>
      existingTemplate.activityId === activity.activityId
  )

  if (!isExisting) existingTemplates.push(activity)
  else
    existingTemplates.map((existingTemplate: TemplateConfiguration) => {
      if (existingTemplate.activityId === activity.activityId) return activity
      return existingTemplate
    })

  figma.root.setPluginData('templates', JSON.stringify(existingTemplates))
}

export default addTemplate
