import { SessionConfiguration } from '../../types/configurations'

const updateSingleSession = (session: SessionConfiguration) => {
  const existingSessions = JSON.parse(figma.root.getPluginData('sessions')).map(
    (existingSession: SessionConfiguration) => {
      if (existingSession.id === session.id) return session
      return existingSession
    }
  )
  figma.root.setPluginData('sessions', JSON.stringify(existingSessions))
}

export default updateSingleSession
