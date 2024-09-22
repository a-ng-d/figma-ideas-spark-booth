import { defaultActivity } from './defaultActivity'

const setMigration = () => {
  const board = figma.root

  const activities = board.getPluginData('activities'),
    sessions = board.getPluginData('sessions')

  if (activities === '')
    figma.root.setPluginData('activities', JSON.stringify([defaultActivity]))

  if (sessions === '') figma.root.setPluginData('sessions', JSON.stringify([]))
}

export default setMigration
