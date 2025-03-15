import { ActiveParticipant } from '../../types/configurations'

const updateParticipants = async (
  params = {}
): Promise<Array<ActiveParticipant>> => {
  const { hasStarted, hasEnded, hasFinished, isBlocked, joinedSessionId } =
    params as {
      hasStarted?: boolean
      hasEnded?: boolean
      hasFinished?: boolean
      isBlocked?: boolean
      joinedSessionId?: string
    }
  let activeParticipants: Array<ActiveParticipant> = JSON.parse(
    figma.root.getPluginData('activeParticipants')
  )
  const isUserIncluded = activeParticipants.find(
    (participant) => participant.userIdentity.id === figma.currentUser?.id
  )

  if (isUserIncluded === undefined)
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
        joinedSessionId: '',
        joinedAt: new Date().toISOString(),
      } as ActiveParticipant,
    ]
  else
    activeParticipants = activeParticipants.map((participant) => {
      if (participant.userIdentity.id === figma.currentUser?.id)
        return {
          ...participant,
          hasStarted: hasStarted ?? participant.hasStarted,
          hasEnded: hasEnded ?? participant.hasEnded,
          hasFinished: hasFinished ?? participant.hasFinished,
          isBlocked: isBlocked ?? participant.isBlocked,
          joinedSessionId: joinedSessionId ?? participant.joinedSessionId,
        }

      return participant
    })

  figma.root.setPluginData(
    'activeParticipants',
    JSON.stringify(activeParticipants)
  )

  return activeParticipants
}

export default updateParticipants
