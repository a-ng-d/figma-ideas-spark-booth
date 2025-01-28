import { lang, locals } from '../../content/locals'
import {
  ActivityConfiguration,
  IdeaConfiguration,
  SessionConfiguration,
} from '../../types/configurations'
import { FileContent } from '../../types/data'
import {
  validateActivitiesStructure,
  validateIdeasStructure,
  validateSessionsStructure,
} from '../../utils/checkDataSchema'

const importActivities = async (importedFiles: Array<FileContent>) => {
  const messages: Array<string> = []

  const checkedFiles = await Promise.all(
    importedFiles.map(async (file) => {
      const data = JSON.parse(file.content as string)

      return validateActivitiesStructure([data.activity])
        .then(() => validateSessionsStructure(data.sessions))
        .then(() => validateIdeasStructure(data.ideas))
        .then(() => {
          return {
            ...file,
            content: data,
            isValid: true,
          }
        })
        .catch(() => {
          return {
            ...file,
            isValid: false,
          }
        })
    })
  )

  const validFiles = checkedFiles.filter((file) => file.isValid)
  const unValidFiles = checkedFiles.filter((file) => !file.isValid)

  if (validFiles.length > 0) {
    await figma.saveVersionHistoryAsync(
      locals[lang].activities.saveVersionAfterImporting
    )

    const existingActivities = JSON.parse(
      figma.root.getPluginData('activities')
    ) as Array<ActivityConfiguration>
    const existingSessions = JSON.parse(
      figma.root.getPluginData('sessions')
    ) as Array<SessionConfiguration>
    const existingIdeas = JSON.parse(
      figma.root.getPluginData('ideas')
    ) as Array<IdeaConfiguration>

    validFiles.forEach((file) => {
      const isActivityExisting = existingActivities.some(
        (activity: ActivityConfiguration) =>
          activity.meta.id === file.content.activity.meta.id
      )

      if (!isActivityExisting) {
        existingActivities.push(file.content.activity)
        existingSessions.push(...file.content.sessions)
        existingIdeas.push(...file.content.ideas)
        file.status = 'OK'
      } else file.status = 'EXISTING'
    })

    figma.root.setPluginData('activities', JSON.stringify(existingActivities))
    figma.root.setPluginData('sessions', JSON.stringify(existingSessions))
    figma.root.setPluginData('ideas', JSON.stringify(existingIdeas))
  }

  const importedFilesNames = validFiles
    .filter((file) => file.status === 'OK')
    .map((file) => `"${file.name}"`)
  const existingFilesNames = validFiles
    .filter((file) => file.status === 'EXISTING')
    .map((file) => `"${file.name}"`)
  const unValidFilesNames = unValidFiles.map((file) => `"${file.name}"`)

  if (importedFilesNames.length === 1)
    messages.push(
      locals[lang].success.importedActivities.single.replace(
        '$1',
        importedFilesNames.join(', ')
      )
    )
  else if (importedFilesNames.length > 1)
    messages.push(
      locals[lang].success.importedActivities.plural.replace(
        '$1',
        importedFilesNames.join(', ')
      )
    )

  if (existingFilesNames.length === 1)
    messages.push(
      locals[lang].info.importedActivities.single.replace(
        '$1',
        existingFilesNames.join(', ')
      )
    )
  else if (existingFilesNames.length > 1)
    messages.push(
      locals[lang].info.importedActivities.plural.replace(
        '$1',
        existingFilesNames.join(', ')
      )
    )

  if (unValidFiles.length === 1)
    messages.push(
      locals[lang].error.importedActivities.single.replace(
        '$1',
        unValidFilesNames.join(', ')
      )
    )
  else if (unValidFiles.length > 1)
    messages.push(
      locals[lang].error.importedActivities.plural.replace(
        '$1',
        unValidFilesNames.join(', ')
      )
    )

  return messages
}

export default importActivities
