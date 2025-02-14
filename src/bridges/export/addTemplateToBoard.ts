import ActivitySections from '../../canvas/ActivitySections'
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

  const templateNode = await new Template(template, data.activity).templateNode
  const activitySectionNode = new ActivitySections(data.activity)
    .activitySectionNode

  activitySectionNode.x = templateNode.x - activitySectionNode.width - 100
  activitySectionNode.y = templateNode.y

  return true
}

export default addTemplateToBoard
