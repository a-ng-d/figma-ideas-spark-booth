import { IdeaConfiguration, UserConfiguration } from 'src/types/configurations'

const setParticipantsList = (ideas: Array<IdeaConfiguration>) => {
  const participantsMap = ideas.reduce(
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

  return participantsList
}

export default setParticipantsList
