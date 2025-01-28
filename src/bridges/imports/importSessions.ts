import { lang, locals } from '../../content/locals'
import {
  IdeaConfiguration,
  SessionConfiguration,
} from '../../types/configurations'
import { FileContent } from '../../types/data'
import {
  validateIdeasStructure,
  validateSessionsStructure,
} from '../../utils/checkDataSchema'

const importSessions = async (
  importedFiles: Array<FileContent>,
  activityId: string
) => {
  const messages: Array<string> = []

  const checkedFiles = await Promise.all(
    importedFiles.map(async (file) => {
      const data = JSON.parse(file.content as string)

      return validateSessionsStructure([data.session])
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
    await figma.saveVersionHistoryAsync(locals[lang].sessions.importSessions)

    const existingSessions = JSON.parse(
      figma.root.getPluginData('sessions')
    ) as Array<SessionConfiguration>
    const existingIdeas = JSON.parse(
      figma.root.getPluginData('ideas')
    ) as Array<IdeaConfiguration>

    validFiles.forEach((file) => {
      const isSessionExisting = existingSessions.some(
        (session: SessionConfiguration) =>
          session.id === file.content.session.id
      )
      const isLinkedToActivity = file.content.session.activityId === activityId

      if (!isSessionExisting && isLinkedToActivity) {
        existingSessions.push(file.content.session)
        existingIdeas.push(...file.content.ideas)
        file.status = 'OK'
      }
      if (!isLinkedToActivity) file.status = 'NOT_LINKED'
      if (isSessionExisting) file.status = 'EXISTING'
    })

    figma.root.setPluginData('sessions', JSON.stringify(existingSessions))
    figma.root.setPluginData('ideas', JSON.stringify(existingIdeas))
  }

  const importedFilesNames = validFiles
    .filter((file) => file.status === 'OK')
    .map((file) => `"${file.name}"`)
  const existingFilesNames = validFiles
    .filter((file) => file.status === 'EXISTING')
    .map((file) => `"${file.name}"`)
  const notLikedToActivityFilesNames = validFiles
    .filter((file) => file.status === 'NOT_LINKED')
    .map((file) => `"${file.name}"`)
  const unValidFilesNames = unValidFiles.map((file) => `"${file.name}"`)

  if (importedFilesNames.length === 1)
    messages.push(
      locals[lang].success.importedSessions.single.replace(
        '$1',
        importedFilesNames.join(', ')
      )
    )
  else if (importedFilesNames.length > 1)
    messages.push(
      locals[lang].success.importedSessions.plural.replace(
        '$1',
        importedFilesNames.join(', ')
      )
    )

  if (existingFilesNames.length === 1)
    messages.push(
      locals[lang].info.importedSessions.single.replace(
        '$1',
        existingFilesNames.join(', ')
      )
    )
  else if (existingFilesNames.length > 1)
    messages.push(
      locals[lang].info.importedSessions.plural.replace(
        '$1',
        existingFilesNames.join(', ')
      )
    )

  if (notLikedToActivityFilesNames.length === 1)
    messages.push(
      locals[lang].warning.importedSessions.single.replace(
        '$1',
        notLikedToActivityFilesNames.join(', ')
      )
    )
  else if (notLikedToActivityFilesNames.length > 1)
    messages.push(
      locals[lang].warning.importedSessions.plural.replace(
        '$1',
        notLikedToActivityFilesNames.join(', ')
      )
    )

  if (unValidFiles.length === 1)
    messages.push(
      locals[lang].error.importedSessions.single.replace(
        '$1',
        unValidFilesNames.join(', ')
      )
    )
  else if (unValidFiles.length > 1)
    messages.push(
      locals[lang].error.importedSessions.plural.replace(
        '$1',
        unValidFilesNames.join(', ')
      )
    )

  return messages
}

export default importSessions
