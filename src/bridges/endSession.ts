import Classification from '../canvas/Classification'
import {
  ActivityConfiguration,
  IdeaConfiguration,
  SessionConfiguration,
} from '../types/configurations'

const endSession = (data: {
  activity: ActivityConfiguration
  sessions: Array<SessionConfiguration>
  session: SessionConfiguration
  ideas: Array<IdeaConfiguration>
}) => {
  figma.root.setPluginData('sessions', JSON.stringify(data.sessions))

  figma.timer?.stop()

  if (data.activity.groupedBy === 'PARTICIPANT') {
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
  } else if (data.activity.groupedBy === 'TYPE') {
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
}

export default endSession
