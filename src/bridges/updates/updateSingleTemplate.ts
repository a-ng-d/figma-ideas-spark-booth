import { TemplateConfiguration } from '../../types/configurations'
import addTemplate from './addTemplate'

const updateSingleTemplate = (template: TemplateConfiguration) => {
  const isExisting = JSON.parse(figma.root.getPluginData('templates')).some(
    (existingTemplate: TemplateConfiguration) =>
      existingTemplate.activityId === template.activityId
  )

  if (!isExisting) return addTemplate(template)
  else {
    const existingTemplates = JSON.parse(
      figma.root.getPluginData('templates')
    ).map((existingTemplate: TemplateConfiguration) => {
      if (existingTemplate.activityId === template.activityId) return template
      return existingTemplate
    })

    figma.root.setPluginData('templates', JSON.stringify(existingTemplates))
  }
}

export default updateSingleTemplate
