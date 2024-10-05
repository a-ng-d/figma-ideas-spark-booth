import { Bar, ConsentConfiguration, Tabs } from '@a_ng_d/figmug-ui'
import React from 'react'

import { Language, PlanStatus } from '../../types/app'
import { ContextItem } from '../../types/app'
import {
  ActivityConfiguration,
  IdeaConfiguration,
  SessionConfiguration,
  UserConfiguration,
} from '../../types/configurations'
import { UserSession } from '../../types/user'
import { setContexts } from '../../utils/setContexts'
import { AppStates } from '../App'
import Activities from '../contexts/Activities'

interface BrowseActivitiesProps {
  activities: Array<ActivityConfiguration>
  sessions: Array<SessionConfiguration>
  ideas: Array<IdeaConfiguration>
  userSession: UserSession
  userConsent: Array<ConsentConfiguration>
  userIdentity: UserConfiguration
  planStatus: PlanStatus
  lang: Language
  onChangeActivities: React.Dispatch<Partial<AppStates>>
  onRunSession: React.Dispatch<Partial<AppStates>>
}

interface BrowseActivitiesStates {
  context: string | undefined
}

export default class BrowseActivities extends React.Component<
  BrowseActivitiesProps,
  BrowseActivitiesStates
> {
  contexts: Array<ContextItem>

  constructor(props: BrowseActivitiesProps) {
    super(props)
    this.contexts = setContexts(['ACTIVITY', 'EXPLORE'])
    this.state = {
      context: this.contexts[0] !== undefined ? this.contexts[0].id : '',
    }
  }

  // Handlers
  navHandler = (e: React.SyntheticEvent) =>
    this.setState({
      context: (e.target as HTMLElement).dataset.feature,
    })

  // Direct actions

  // Renders
  render() {
    let fragment

    switch (this.state.context) {
      case 'ACTIVITY': {
        fragment = <Activities {...this.props} />
        break
      }
      case 'EXPLORE': {
        fragment = <div></div>
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
