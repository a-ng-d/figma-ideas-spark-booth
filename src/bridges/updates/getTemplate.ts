import { TemplateConfiguration } from 'src/types/configurations'

const getTemplate = (activityId: string) => {
  const template = JSON.parse(figma.root.getPluginData('templates')).find(
    (template: TemplateConfiguration) => template.activityId === activityId
  )

  figma.ui.postMessage({
    type: 'GET_ACTIVITY_TEMPLATE',
    nodes: template !== undefined ? template.nodes : undefined,
    templateStatus: template !== undefined ? 'SAVED' : 'NOT_SAVED',
  })
}

export default getTemplate
