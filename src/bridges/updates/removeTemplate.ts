import { TemplateConfiguration } from 'src/types/configurations'

const removeTemplate = async (activityId: string) => {
  const existingTemplates = JSON.parse(
    figma.root.getPluginData('templates')
  ).filter(
    (existingTemplate: TemplateConfiguration) =>
      existingTemplate.activityId !== activityId
  )

  figma.root.setPluginData('templates', JSON.stringify(existingTemplates))
}

export default removeTemplate
