import Classification from '../canvas/Classification'
import {
  ActivityConfiguration,
  IdeaConfiguration,
} from '../types/configurations'

const addToBoard = async (data: {
  activity: ActivityConfiguration
  sessionDate: Date | string
  ideas: Array<IdeaConfiguration>
}) => {
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
      data.sessionDate,
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

    new Classification(data.activity, data.sessionDate, sortedIdeasByType)
  }
}

export default addToBoard
