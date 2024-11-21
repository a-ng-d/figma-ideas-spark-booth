import { lang, locals } from '../content/locals'
import { Context } from '../types/app'
import features from './config'

export const setContexts = (contextList: Array<Context>) => {
  const contexts: Array<{
    label: string
    id: Context
    isUpdated: boolean
    isActive: boolean
  }> = [
    {
      label: locals[lang].contexts.activities,
      id: 'ACTIVITIES',
      isUpdated:
        features.find((feature) => feature.name === 'ACTIVITIES')?.isNew ??
        false,
      isActive:
        features.find((feature) => feature.name === 'ACTIVITIES')?.isActive ??
        false,
    },
    {
      label: locals[lang].contexts.activitiesLocal,
      id: 'ACTIVITIES_LOCAL',
      isUpdated:
        features.find((feature) => feature.name === 'ACTIVITIES_LOCAL')
          ?.isNew ?? false,
      isActive:
        features.find((feature) => feature.name === 'ACTIVITIES_LOCAL')
          ?.isActive ?? false,
    },
    {
      label: locals[lang].contexts.activitiesSelf,
      id: 'ACTIVITIES_SELF',
      isUpdated:
        features.find((feature) => feature.name === 'ACTIVITIES_SELF')?.isNew ??
        false,
      isActive:
        features.find((feature) => feature.name === 'ACTIVITIES_SELF')
          ?.isActive ?? false,
    },
    {
      label: locals[lang].contexts.explore,
      id: 'EXPLORE',
      isUpdated:
        features.find((feature) => feature.name === 'EXPLORE')?.isNew ?? false,
      isActive:
        features.find((feature) => feature.name === 'EXPLORE')?.isActive ??
        false,
    },
  ]

  return contexts.filter((context) => {
    return contextList.includes(context.id) && context.isActive
  })
}
