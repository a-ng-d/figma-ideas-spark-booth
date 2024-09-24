import { SessionConfiguration } from '../types/configurations'

const endSession = (data: Array<SessionConfiguration>) => {
  figma.root.setPluginData('sessions', JSON.stringify(data))

  figma.timer?.stop()
}

export default endSession
