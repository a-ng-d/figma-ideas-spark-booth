import { UserConfiguration } from '../../types/configurations'

const updateParticipants = async (): Promise<Array<UserConfiguration>> => {
  let activeParticipants: Array<UserConfiguration> = JSON.parse(
    figma.root.getPluginData('activeParticipants')
  )

  activeParticipants = [
    ...activeParticipants,
    {
      id: figma.currentUser?.id,
      fullName: figma.currentUser?.name,
      avatar: figma.currentUser?.photoUrl,
    } as UserConfiguration,
  ]

  figma.root.setPluginData(
    'activeParticipants',
    JSON.stringify(activeParticipants)
  )

  return activeParticipants
}

export default updateParticipants
