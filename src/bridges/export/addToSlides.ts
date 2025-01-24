import Slides from '../../canvas/Slides'
import {
  ActivityConfiguration,
  IdeaConfiguration,
  SessionConfiguration,
  UserConfiguration,
} from '../../types/configurations'

const addToSlides = async (data: {
  activity: ActivityConfiguration
  session: SessionConfiguration
  ideas: Array<IdeaConfiguration>
}) => {
  const participantsMap = data.ideas.reduce(
    (acc: Map<string, UserConfiguration>, idea) => {
      const { userIdentity } = idea
      acc.set(userIdentity.id, userIdentity)
      return acc
    },
    new Map<string, UserConfiguration>()
  )

  const participantsSet = new Set<UserConfiguration>(participantsMap.values())

  const participantsList = Array.from(participantsSet)
    //.filter((user) => user.id !== data.session.facilitator.id)
    .map((user) => ({
      id: user.id,
      fullName: user.fullName,
      avatar: user.avatar,
    })) as Array<UserConfiguration>

  if (data.activity.groupedBy === 'PARTICIPANT' && data.ideas.length > 0) {
    const sortedIdeasByParticipant = data.ideas.reduce(
      (acc: { [key: string]: IdeaConfiguration[] }, idea) => {
        const { userIdentity } = idea
        if (!acc[userIdentity.fullName]) acc[userIdentity.fullName] = []

        acc[userIdentity.fullName].push(idea)
        return acc
      },
      {} as { [key: string]: IdeaConfiguration[] }
    )

    new Slides(
      data.activity,
      data.session,
      sortedIdeasByParticipant,
      participantsList
    )
  } else if (data.activity.groupedBy === 'TYPE' && data.ideas.length > 0) {
    const sortedIdeasByType = data.ideas.reduce(
      (acc: { [key: string]: IdeaConfiguration[] }, idea) => {
        const { type } = idea
        if (!acc[type.name]) acc[type.name] = []

        acc[type.name].push(idea)
        return acc
      },
      {} as { [key: string]: IdeaConfiguration[] }
    )

    new Slides(data.activity, data.session, sortedIdeasByType, participantsList)
  }
}

export default addToSlides
