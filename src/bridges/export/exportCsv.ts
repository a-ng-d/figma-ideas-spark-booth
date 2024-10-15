import {
  ActivityConfiguration,
  IdeaConfiguration,
} from '../../types/configurations'

const exportCsv = (data: {
  activity: ActivityConfiguration
  sessionData: Date | string
  ideas: Array<IdeaConfiguration>
}) => {
  const csv: Array<string> = ['Type,Text,Author,Date']
  data.ideas.forEach((idea) => {
    csv.push(
      `${idea.type.name},${idea.text},${idea.userIdentity.fullName},${idea.createdAt}`
    )
  })

  figma.ui.postMessage({
    type: 'EXPORT_CSV',
    data: csv.join('\n'),
  })
}

export default exportCsv
