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
  IdeaConfiguration,
  SessionConfiguration,
  UserConfiguration,
} from '../../types/configurations'
import { UserSession } from '../../types/user'
import features from '../../config'
import { setContexts } from '../../utils/setContexts'
import { AppStates } from '../App'
import Feature from '../components/Feature'
import Activities from '../contexts/Activities'
import Explore from '../contexts/Explore'

interface BrowseActivitiesProps {
  activities: Array<ActivityConfiguration>
  sessions: Array<SessionConfiguration>
  ideas: Array<IdeaConfiguration>
  userSession: UserSession
  userConsent: Array<ConsentConfiguration>
  userIdentity: UserConfiguration
  planStatus: PlanStatus
  sessionCount: number
  lang: Language
  onChangeActivities: React.Dispatch<Partial<AppStates>>
  onRunSession: React.Dispatch<Partial<AppStates>>
  onGetProPlan: (context: { priorityContainerContext: PriorityContext }) => void
}

interface BrowseActivitiesStates {
  context: Context | ''
}

export default class BrowseActivities extends PureComponent<
  BrowseActivitiesProps,
  BrowseActivitiesStates
> {
  contexts: Array<ContextItem>

  static features = (planStatus: PlanStatus) => ({
    ACTIVITIES: new FeatureStatus({
      features: features,
      featureName: 'ACTIVITIES',
      planStatus: planStatus,
    }),
    EXPLORE: new FeatureStatus({
      features: features,
      featureName: 'EXPLORE',
      planStatus: planStatus,
    }),
  })

  constructor(props: BrowseActivitiesProps) {
    super(props)
    this.contexts = setContexts(
      ['ACTIVITIES', 'EXPLORE'],
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

  // Renders
  render() {
    let fragment

    switch (this.state.context) {
      case 'ACTIVITIES': {
        fragment = (
          <Feature
            isActive={BrowseActivities.features(
              this.props.planStatus
            ).ACTIVITIES.isActive()}
          >
            <Activities {...this.props} />
          </Feature>
        )
        break
      }
      case 'EXPLORE': {
        fragment = (
          <Feature
            isActive={BrowseActivities.features(
              this.props.planStatus
            ).EXPLORE.isActive()}
          >
            <Explore {...this.props} />
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
        <section className="controller">
          <div className="controls">{fragment}</div>
        </section>
      </>
    )
  }
}
