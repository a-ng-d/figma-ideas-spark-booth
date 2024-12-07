import { FeatureStatus } from '@a_ng_d/figmug-ui'
import { lang, locals } from '../content/locals'
import { Context, PlanStatus } from '../types/app'
import features from '../config'

export const setContexts = (
  contextList: Array<Context>,
  planStatus: PlanStatus
) => {
  const featuresList = {
    ACTIVITIES: new FeatureStatus({
      features: features,
      featureName: 'ACTIVITIES',
      planStatus: planStatus,
    }),
    ACTIVITIES_LOCAL: new FeatureStatus({
      features: features,
      featureName: 'ACTIVITIES_LOCAL',
      planStatus: planStatus,
    }),
    ACTIVITIES_SELF: new FeatureStatus({
      features: features,
      featureName: 'ACTIVITIES_SELF',
      planStatus: planStatus,
    }),
    EXPLORE: new FeatureStatus({
      features: features,
      featureName: 'EXPLORE',
      planStatus: planStatus,
    }),
  }

  const contexts: Array<{
    label: string
    id: Context
    isUpdated: boolean
    isActive: boolean
  }> = [
    {
      label: locals[lang].contexts.activities,
      id: 'ACTIVITIES',
      isUpdated: featuresList.ACTIVITIES.isNew(),
      isActive: featuresList.ACTIVITIES.isActive(),
    },
    {
      label: locals[lang].contexts.activitiesLocal,
      id: 'ACTIVITIES_LOCAL',
      isUpdated: featuresList.ACTIVITIES_LOCAL.isNew(),
      isActive: featuresList.ACTIVITIES_LOCAL.isActive(),
    },
    {
      label: locals[lang].contexts.activitiesSelf,
      id: 'ACTIVITIES_SELF',
      isUpdated: featuresList.ACTIVITIES_SELF.isNew(),
      isActive: featuresList.ACTIVITIES_SELF.isActive(),
    },
    {
      label: locals[lang].contexts.explore,
      id: 'EXPLORE',
      isUpdated: featuresList.EXPLORE.isNew(),
      isActive: featuresList.EXPLORE.isActive(),
    },
  ]

  return contexts.filter((context) => {
    return contextList.includes(context.id) && context.isActive
  })
}
