import { ConsentConfiguration } from '@a_ng_d/figmug-ui'
import { PureComponent } from 'preact/compat'
import React from 'react'
import { Language, PlanStatus, PriorityContext } from '../../types/app'
import {
  ActivityConfiguration,
  UserConfiguration,
} from '../../types/configurations'
import { UserSession } from '../../types/user'
import ExternalActivities from './ExternalActivities'

interface ExploreProps {
  activities: Array<ActivityConfiguration>
  userSession: UserSession
  userConsent: Array<ConsentConfiguration>
  userIdentity: UserConfiguration
  planStatus: PlanStatus
  lang: Language
  onGetProPlan: (context: { priorityContainerContext: PriorityContext }) => void
}

export default class Explore extends PureComponent<ExploreProps> {
  // Renders
  render() {
    return (
      <section className="controller">
        <div className="controls">
          <ExternalActivities
            {...this.props}
            context="COMMUNITY"
            localActivitiesNumber={this.props.activities.length}
          />
        </div>
      </section>
    )
  }
}
