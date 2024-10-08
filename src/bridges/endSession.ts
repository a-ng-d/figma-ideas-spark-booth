import Classification from '../canvas/Classification'
import {
  ActivityConfiguration,
  IdeaConfiguration,
  SessionConfiguration,
} from '../types/configurations'
import updateParticipants from './updates/updateParticipants'

const endSession = (data: {
  activity: ActivityConfiguration
  sessions: Array<SessionConfiguration>
  session: SessionConfiguration
  ideas: Array<IdeaConfiguration>
}) => {
  figma.root.setPluginData('sessions', JSON.stringify(data.sessions))
  figma.root.setPluginData('event', 'SESSION_ENDED')

  updateParticipants({ hasEnded: true })

  if (data.activity.groupedBy === 'PARTICIPANT' && data.ideas.length > 0) {
    const sortedIdeasByParticipant = data.ideas.reduce(
      (acc: { [key: string]: IdeaConfiguration[] }, idea) => {
        const { userIdentity } = idea
        if (!acc[userIdentity.fullName]) {
          acc[userIdentity.fullName] = []
        }
        acc[userIdentity.fullName].push(idea)
        return acc
      },
      {} as { [key: string]: IdeaConfiguration[] }
    )

    new Classification(
      data.activity,
      data.session.metrics.startDate,
      sortedIdeasByParticipant
    )
  } else if (data.activity.groupedBy === 'TYPE' && data.ideas.length > 0) {
    const sortedIdeasByType = data.ideas.reduce(
      (acc: { [key: string]: IdeaConfiguration[] }, idea) => {
        const { type } = idea
        if (!acc[type.name]) {
          acc[type.name] = []
        }
        acc[type.name].push(idea)
        return acc
      },
      {} as { [key: string]: IdeaConfiguration[] }
    )

    new Classification(
      data.activity,
      data.session.metrics.startDate,
      sortedIdeasByType
    )
  }

  figma.timer?.stop()
}

export default endSession
