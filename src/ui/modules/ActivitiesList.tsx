import { Bar, ConsentConfiguration, Tabs } from '@a_ng_d/figmug-ui'
import { FeatureStatus } from '@a_ng_d/figmug-utils'
import { PureComponent } from 'preact/compat'
import React from 'react'
import {
  Context,
  ContextItem,
  Language,
  PlanStatus,
  PriorityContext,
} from '../../types/app'
import {
  ActivityConfiguration,
  UserConfiguration,
} from '../../types/configurations'
import { UserSession } from '../../types/user'
import features from '../../config'
import { setContexts } from '../../utils/setContexts'
import Feature from '../components/Feature'
import ExternalActivities from '../contexts/ExternalActivities'
import LocalActivities from '../contexts/LocalActivities'

interface ActivitiesListProps {
  activities: Array<ActivityConfiguration>
  userSession: UserSession
  userConsent: Array<ConsentConfiguration>
  userIdentity: UserConfiguration
  planStatus: PlanStatus
  sessionCount: number
  lang: Language
  onChangeActivities: React.MouseEventHandler<HTMLButtonElement>
  onOpenActivitySettings: (id: string) => void
  onRunSession: (id: string) => void
  onGetProPlan: (context: { priorityContainerContext: PriorityContext }) => void
}

interface ActivitiesListStates {
  context: Context | ''
}

export default class ActivitiesList extends PureComponent<
  ActivitiesListProps,
  ActivitiesListStates
> {
  contexts: Array<ContextItem>

  static features = (planStatus: PlanStatus) => ({
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
  })

  constructor(props: ActivitiesListProps) {
    super(props)
    this.contexts = setContexts(
      ['ACTIVITIES_LOCAL', 'ACTIVITIES_SELF'],
      this.props.planStatus
    )
    this.state = {
      context: this.contexts[0] !== undefined ? this.contexts[0].id : '',
    }
  }

  // Handlers
  navHandler = (e: Event) =>
    this.setState({
      context: (e.target as HTMLElement).dataset.feature as Context,
    })

  // Render
  render() {
    let fragment

    switch (this.state.context) {
      case 'ACTIVITIES_LOCAL': {
        fragment = (
          <Feature
            isActive={ActivitiesList.features(
              this.props.planStatus
            ).ACTIVITIES_LOCAL.isActive()}
          >
            <LocalActivities {...this.props} />
          </Feature>
        )
        break
      }
      case 'ACTIVITIES_SELF': {
        fragment = (
          <Feature
            isActive={ActivitiesList.features(
              this.props.planStatus
            ).ACTIVITIES_SELF.isActive()}
          >
            <ExternalActivities
              context="SELF"
              localActivitiesNumber={this.props.activities.length}
              {...this.props}
            />
          </Feature>
        )
        break
      }
    }

    return (
      <>
        <Bar
          leftPartSlot={
            <Tabs
              tabs={this.contexts}
              active={this.state.context ?? ''}
              action={this.navHandler}
            />
          }
          border={['BOTTOM']}
          isOnlyText={true}
        />
        {fragment}
      </>
    )
  }
}
