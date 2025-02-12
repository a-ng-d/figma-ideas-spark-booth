import { defaultActivity } from './defaultActivity'

const setMigration = () => {
  const activities = figma.root.getPluginData('activities'),
    sessions = figma.root.getPluginData('sessions'),
    ideas = figma.root.getPluginData('ideas'),
    activeParticipants = figma.root.getPluginData('activeParticipants'),
    thumbnails = figma.root.getPluginData('thumbnails'),
    templates = figma.root.getPluginData('templates')

  if (activities === '')
    figma.root.setPluginData('activities', JSON.stringify([defaultActivity]))

  if (sessions === '') figma.root.setPluginData('sessions', JSON.stringify([]))

  if (ideas === '') figma.root.setPluginData('ideas', JSON.stringify([]))

  if (activeParticipants === '')
    figma.root.setPluginData('activeParticipants', JSON.stringify([]))

  if (thumbnails === '')
    figma.root.setPluginData('thumbnails', JSON.stringify([]))

  if (templates === '')
    figma.root.setPluginData('templates', JSON.stringify([]))
}

export default setMigration
