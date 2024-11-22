import {
  ActionsItem,
  Button,
  Chip,
  ConsentConfiguration,
  layouts,
} from '@a_ng_d/figmug-ui'
import React from 'react'
import { locals } from '../../content/locals'
import { FetchStatus, Language, PlanStatus } from '../../types/app'
import { UserConfiguration } from '../../types/configurations'
import { ExternalActivitiesData } from '../../types/data'

interface CommunityActivityProps {
  activity: ExternalActivitiesData
  index: number
  activitiesList: Array<ExternalActivitiesData>
  currentPage: number
  activitiesListStatus: FetchStatus
  isContextActionLoading: Array<boolean>
  isDuplicateToLocalActionLoading: Array<boolean>
  userConsent: Array<ConsentConfiguration>
  userIdentity: UserConfiguration
  planStatus: PlanStatus
  lang: Language
  onChangeDuplicateToLocalActionLoading: (loading: Array<boolean>) => void
  onSelectActivity: () => void
}

export default class CommunityActivity extends React.Component<CommunityActivityProps> {
  render() {
    return (
      <ActionsItem
        id={this.props.activity.activity_id}
        name={this.props.activity.name}
        description={this.props.activity.description}
        actionsSlot={
          <Button
            type="secondary"
            label={locals[this.props.lang].actions.duplicateToLocal}
            isLoading={
              this.props.isDuplicateToLocalActionLoading[this.props.index]
            }
            action={() => {
              this.props.onChangeDuplicateToLocalActionLoading(
                this.props.isDuplicateToLocalActionLoading.map((loading, i) =>
                  i === this.props.index ? true : loading
                )
              )
              this.props.onSelectActivity()
            }}
          />
        }
        complementSlot={
          <div
            className={`${layouts['snackbar']} ${layouts['snackbar--tight']}`}
          >
            {this.props.activity.types.map((type, index) => (
              <div
                key={index}
                className="color-chip"
                style={{
                  backgroundColor: type.hex,
                }}
              />
            ))}
            <Chip state="INACTIVE">
              {String(this.props.activity.timer_minutes).padStart(2, '0') +
                ':' +
                String(this.props.activity.timer_seconds).padStart(2, '0')}
            </Chip>
          </div>
        }
        user={{
          avatar: this.props.activity.creator_avatar ?? '',
          name: this.props.activity.creator_full_name ?? '',
        }}
      />
    )
  }
}
