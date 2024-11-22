import { Bar, ConsentConfiguration, Tabs } from '@a_ng_d/figmug-ui'
import React from 'react'
import { ContextItem, Language, PlanStatus } from '../../types/app'
import {
  ActivityConfiguration,
  UserConfiguration,
} from '../../types/configurations'
import { UserSession } from '../../types/user'
import { setContexts } from '../../utils/setContexts'
import { AppStates } from '../App'
import LocalActivities from '../contexts/LocalActivities'
import ExternalActivities from '../contexts/ExternalActivities'

interface ActivitiesListProps {
  activities: Array<ActivityConfiguration>
  userSession: UserSession
  userConsent: Array<ConsentConfiguration>
  userIdentity: UserConfiguration
  planStatus: PlanStatus
  lang: Language
  onChangeActivities: React.Dispatch<Partial<AppStates>>
  onOpenActivitySettings: (id: string) => void
  onRunSession: (id: string) => void
}

interface ActivitiesListStates {
  context: string | undefined
}

export default class ActivitiesList extends React.Component<
  ActivitiesListProps,
  ActivitiesListStates
> {
  contexts: Array<ContextItem>

  constructor(props: ActivitiesListProps) {
    super(props)
    this.contexts = setContexts(['ACTIVITIES_LOCAL', 'ACTIVITIES_SELF'])
    this.state = {
      context: this.contexts[0] !== undefined ? this.contexts[0].id : '',
    }
  }

  // Handlers
  navHandler = (e: React.SyntheticEvent) =>
    this.setState({
      context: (e.target as HTMLElement).dataset.feature,
    })

  // Render
  render() {
    let fragment

    switch (this.state.context) {
      case 'ACTIVITIES_LOCAL': {
        fragment = <LocalActivities {...this.props} />
        break
      }
      case 'ACTIVITIES_SELF': {
        fragment = (
          <ExternalActivities
            context="SELF"
            {...this.props}
          />
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
