import { ActiveParticipant } from '../../types/configurations'

const updateParticipants = async (options?: {
  hasStarted?: boolean
  hasEnded?: boolean
  hasFinished?: boolean
  isBlocked?: boolean
}): Promise<Array<ActiveParticipant>> => {
  let activeParticipants: Array<ActiveParticipant> = JSON.parse(
    figma.root.getPluginData('activeParticipants')
  )
  const isUserIncluded = activeParticipants.find(
    (participant) => participant.userIdentity.id === figma.currentUser?.id
  )

  if (isUserIncluded === undefined) {
    activeParticipants = [
      ...activeParticipants,
      {
        userIdentity: {
          id: figma.currentUser?.id,
          fullName: figma.currentUser?.name,
          avatar: figma.currentUser?.photoUrl,
        },
        hasStarted: false,
        hasEnded: false,
        hasFinished: false,
        isBlocked: false,
        joinedAt: new Date().toISOString(),
      } as ActiveParticipant,
    ]
  } else {
    activeParticipants = activeParticipants.map((participant) => {
      if (participant.userIdentity.id === figma.currentUser?.id) {
        return {
          ...participant,
          hasStarted: options?.hasStarted ?? participant.hasStarted,
          hasEnded: options?.hasEnded ?? participant.hasEnded,
          hasFinished: options?.hasFinished ?? participant.hasFinished,
          isBlocked: options?.isBlocked ?? participant.isBlocked,
        }
      }
      return participant
    })
  }

  figma.root.setPluginData(
    'activeParticipants',
    JSON.stringify(activeParticipants)
  )

  return activeParticipants
}

export default updateParticipants
