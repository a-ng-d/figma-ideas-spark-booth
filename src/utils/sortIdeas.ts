import { GroupedBy, IdeaConfiguration } from '../types/configurations'

const sortIdeas = (ideas: Array<IdeaConfiguration>, sorting: GroupedBy) => {
  if (sorting === 'PARTICIPANT')
    return ideas.reduce(
      (acc: { [key: string]: IdeaConfiguration[] }, idea) => {
        const { userIdentity } = idea
        if (!acc[userIdentity.fullName]) acc[userIdentity.fullName] = []

        acc[userIdentity.fullName].push(idea)
        return acc
      },
      {} as { [key: string]: IdeaConfiguration[] }
    )
  return ideas.reduce(
    (acc: { [key: string]: IdeaConfiguration[] }, idea) => {
      const { type } = idea
      if (!acc[type.name]) acc[type.name] = []

      acc[type.name].push(idea)
      return acc
    },
    {} as { [key: string]: IdeaConfiguration[] }
  )
}

export default sortIdeas
