import {
  ActionsItem,
  Button,
  Chip,
  ConsentConfiguration,
  layouts,
} from '@a_ng_d/figmug-ui'
import { FeatureStatus } from '@a_ng_d/figmug-utils'
import { PureComponent } from 'preact/compat'
import React from 'react'
import { locals } from '../../content/locals'
import { FetchStatus, Language, PlanStatus } from '../../types/app'
import { UserConfiguration } from '../../types/configurations'
import { ExternalActivitiesData } from '../../types/data'
import features from '../../config'
import ColorChip from '../components/ColorChip'
import Feature from '../components/Feature'

interface CommunityActivityProps {
  activity: ExternalActivitiesData
  index: number
  activitiesList: Array<ExternalActivitiesData>
  currentPage: number
  activitiesListStatus: FetchStatus
  isContextActionLoading: Array<boolean>
  isDuplicateToLocalActionLoading: Array<boolean>
  localActivitiesNumber: number
  userConsent: Array<ConsentConfiguration>
  userIdentity: UserConfiguration
  planStatus: PlanStatus
  lang: Language
  onChangeDuplicateToLocalActionLoading: (loading: Array<boolean>) => void
  onSelectActivity: () => void
}

export default class CommunityActivity extends PureComponent<CommunityActivityProps> {
  static features = (planStatus: PlanStatus) => ({
    ACTIVITIES_LOCAL: new FeatureStatus({
      features: features,
      featureName: 'ACTIVITIES_LOCAL',
      planStatus: planStatus,
    }),
    ACTIVITIES_DUPLICATE: new FeatureStatus({
      features: features,
      featureName: 'ACTIVITIES_DUPLICATE',
      planStatus: planStatus,
    }),
  })

  render() {
    return (
      <ActionsItem
        id={this.props.activity.activity_id}
        name={this.props.activity.name}
        description={this.props.activity.description}
        actionsSlot={
          <Feature
            isActive={CommunityActivity.features(
              this.props.planStatus
            ).ACTIVITIES_DUPLICATE.isActive()}
          >
            <Button
              type="secondary"
              label={locals[this.props.lang].activities.duplicateToLocal}
              isLoading={
                this.props.isDuplicateToLocalActionLoading[this.props.index]
              }
              isBlocked={CommunityActivity.features(
                this.props.planStatus
              ).ACTIVITIES_LOCAL.isReached(this.props.localActivitiesNumber)}
              isNew={CommunityActivity.features(
                this.props.planStatus
              ).ACTIVITIES_DUPLICATE.isNew()}
              action={() => {
                this.props.onChangeDuplicateToLocalActionLoading(
                  this.props.isDuplicateToLocalActionLoading.map(
                    (loading, i) => (i === this.props.index ? true : loading)
                  )
                )
                this.props.onSelectActivity()
              }}
            />
          </Feature>
        }
        complementSlot={
          <div className={`${layouts['snackbar--tight']}`}>
            {this.props.activity.types.map((type, index) => (
              <ColorChip
                key={index}
                color={type.hex}
                helper={type.name}
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
