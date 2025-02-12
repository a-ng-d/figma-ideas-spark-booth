import Template from '../../canvas/Template'
import {
  ActivityConfiguration,
  TemplateConfiguration,
} from '../../types/configurations'

const addTemplateToBoard = async (data: {
  activity: ActivityConfiguration
}) => {
  const template = JSON.parse(figma.root.getPluginData('templates')).find(
    (template: TemplateConfiguration) =>
      template.activityId === data.activity.meta.id
  )

  new Template({
    template: template,
  })

  return true
}

export default addTemplateToBoard
