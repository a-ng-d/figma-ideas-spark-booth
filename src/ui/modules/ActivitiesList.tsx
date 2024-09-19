import {
  ActionsItem,
  Button,
  ConsentConfiguration,
  SectionTitle,
  texts,
} from '@a_ng_d/figmug-ui'
import React from 'react'

import { locals } from '../../content/locals'
import { Language, PlanStatus } from '../../types/app'
import {
  ActivityConfiguration,
  UserConfiguration,
} from '../../types/configurations'
import { UserSession } from '../../types/user'
import { AppStates } from '../App'

interface ActivitiesListProps {
  activities: Array<ActivityConfiguration>
  userSession: UserSession
  userConsent: Array<ConsentConfiguration>
  userIdentity: UserConfiguration
  planStatus: PlanStatus
  lang: Language
  onChangeActivities: React.Dispatch<Partial<AppStates>>
  onOpenActivitySettings: (id: string) => void
}

export default class ActivitiesList extends React.Component<ActivitiesListProps> {
  // Render
  render() {
    return (
      <div className="control__block control__block--list">
        <div className="section-controls">
          <div className="section-controls__left-part">
            <SectionTitle
              label={locals[this.props.lang].activities.title}
              indicator={this.props.activities.length}
            />
          </div>
          <div className="section-controls__right-part">
            <Button
              type="icon"
              icon="plus"
              feature="ADD_ACTIVITY"
              action={this.props.onChangeActivities}
            />
          </div>
        </div>
        <ul className="rich-list">
          {this.props.activities.map(
            (activity: ActivityConfiguration, index) => (
              <ActionsItem
                key={index}
                id={activity.id}
                name={activity.name}
                description={activity.description}
                complement={
                  <div
                    style={{
                      display: 'flex',
                      gap: 'var(--size-xxsmall)',
                    }}
                  >
                    {activity.noteTypes.map((noteType, index) => (
                      <div
                        key={index}
                        style={{
                          width: 'var(--size-xsmall)',
                          height: 'var(--size-xsmall)',
                          borderRadius: '2px',
                          outline: '1px solid rgba(0, 0, 0, 0.1)',
                          outlineOffset: '-1px',
                          backgroundColor: noteType.hex,
                        }}
                      />
                    ))}
                  </div>
                }
                actions={
                  <>
                    <span
                      className={`${texts.type} ${texts['type--secondary']} type`}
                    >
                      {String(activity.timer.minutes).padStart(2, '0') +
                        ':' +
                        String(activity.timer.seconds).padStart(2, '0')}
                    </span>
                    <Button
                      type="icon"
                      icon="adjust"
                      feature="CONFIGURE_ACTIVITY"
                      action={() =>
                        this.props.onOpenActivitySettings(activity.id)
                      }
                    />
                  </>
                }
                action={(e) => null}
              />
            )
          )}
        </ul>
      </div>
    )
  }
}
