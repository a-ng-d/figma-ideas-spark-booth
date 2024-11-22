import { ConsentConfiguration } from '@a_ng_d/figmug-ui'
import React from 'react'
import { Language, PlanStatus } from '../../types/app'
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
}

export default class Explore extends React.Component<ExploreProps> {
  // Renders
  render() {
    return (
      <section className="controller">
        <div className="controls">
          <ExternalActivities
            context="COMMUNITY"
            {...this.props}
          />
        </div>
      </section>
    )
  }
}
