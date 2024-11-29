import { defaultActivity } from './defaultActivity'

const setMigration = () => {
  const activities = figma.root.getPluginData('activities'),
    sessions = figma.root.getPluginData('sessions'),
    ideas = figma.root.getPluginData('ideas'),
    activeParticipants = figma.root.getPluginData('activeParticipants')

  if (activities === '')
    figma.root.setPluginData('activities', JSON.stringify([defaultActivity]))

  if (sessions === '') figma.root.setPluginData('sessions', JSON.stringify([]))

  if (ideas === '') figma.root.setPluginData('ideas', JSON.stringify([]))

  if (activeParticipants === '')
    figma.root.setPluginData('activeParticipants', JSON.stringify([]))
}

export default setMigration
