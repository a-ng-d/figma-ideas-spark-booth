import {
  ActionsItem,
  Button,
  Chip,
  FeatureStatus,
  layouts,
  SectionTitle,
  SemanticMessage,
  SimpleItem,
} from '@a_ng_d/figmug-ui'
import React from 'react'
import { locals } from '../../content/locals'
import { Language, PlanStatus, PriorityContext } from '../../types/app'
import { ActivityConfiguration } from '../../types/configurations'
import features from '../../utils/config'
import { AppStates } from '../App'
import ColorChip from '../components/ColorChip'
import Feature from '../components/Feature'

interface LocalActivitiesProps {
  activities: Array<ActivityConfiguration>
  lang: Language
  planStatus: PlanStatus
  onChangeActivities: React.Dispatch<Partial<AppStates>>
  onOpenActivitySettings: (id: string) => void
  onRunSession: (id: string) => void
  onGetProPlan: (context: { priorityContainerContext: PriorityContext }) => void
}

export default class LocalActivities extends React.Component<LocalActivitiesProps> {
  static features = (planStatus: PlanStatus) => ({
    ACTIVITIES_LOCAL: new FeatureStatus({
      features: features,
      featureName: 'ACTIVITIES_LOCAL',
      planStatus: planStatus,
    }),
    ACTIVITIES_ADD: new FeatureStatus({
      features: features,
      featureName: 'ACTIVITIES_ADD',
      planStatus: planStatus,
    }),
    ACTIVITIES_SETTINGS: new FeatureStatus({
      features: features,
      featureName: 'ACTIVITIES_SETTINGS',
      planStatus: planStatus,
    }),
    ACTIVITIES_RUN: new FeatureStatus({
      features: features,
      featureName: 'ACTIVITIES_RUN',
      planStatus: planStatus,
    }),
  })

  render() {
    return (
      <div className="control__block control__block--list">
        <SimpleItem
          leftPartSlot={
            <SectionTitle
              label={locals[this.props.lang].activities.title}
              indicator={this.props.activities.length}
            />
          }
          rightPartSlot={
            <Feature
              isActive={LocalActivities.features(
                this.props.planStatus
              ).ACTIVITIES_ADD.isActive()}
            >
              <Button
                type="icon"
                icon="plus"
                feature="ADD_ACTIVITY"
                isBlocked={LocalActivities.features(
                  this.props.planStatus
                ).ACTIVITIES_LOCAL.isReached(this.props.activities.length)}
                isNew={LocalActivities.features(
                  this.props.planStatus
                ).ACTIVITIES_ADD.isNew()}
                action={this.props.onChangeActivities}
              />
            </Feature>
          }
          isListItem={false}
        />
        <Feature
          isActive={LocalActivities.features(
            this.props.planStatus
          ).ACTIVITIES_LOCAL.isReached(this.props.activities.length)}
        >
          <div
            style={{
              padding: 'var(--size-xxxsmall) var(--size-xsmall) 0',
            }}
          >
            <SemanticMessage
              type="INFO"
              message={locals[
                this.props.lang
              ].info.maxNumberOfActivities.replace(
                '$1',
                LocalActivities.features(this.props.planStatus).ACTIVITIES_LOCAL
                  .result.limit
              )}
              action={
                <Button
                  type="secondary"
                  label={locals[this.props.lang].plan.tryPro}
                  action={() =>
                    this.props.onGetProPlan({
                      priorityContainerContext: 'TRY',
                    })
                  }
                />
              }
            />
          </div>
        </Feature>
        <ul className="rich-list">
          {this.props.activities.map(
            (activity: ActivityConfiguration, index) => (
              <ActionsItem
                key={index}
                id={activity.meta.id}
                name={activity.name}
                description={activity.description}
                indicator={
                  activity.meta.publicationStatus.isPublished
                    ? {
                        status: 'ACTIVE',
                        label:
                          locals[this.props.lang].publication.statusPublished,
                      }
                    : undefined
                }
                actionsSlot={
                  <>
                    <Feature
                      isActive={LocalActivities.features(
                        this.props.planStatus
                      ).ACTIVITIES_SETTINGS.isActive()}
                    >
                      <Button
                        type="icon"
                        icon="adjust"
                        feature="CONFIGURE_ACTIVITY"
                        isBlocked={LocalActivities.features(
                          this.props.planStatus
                        ).ACTIVITIES_SETTINGS.isBlocked()}
                        isNew={LocalActivities.features(
                          this.props.planStatus
                        ).ACTIVITIES_SETTINGS.isNew()}
                        action={() =>
                          this.props.onOpenActivitySettings(activity.meta.id)
                        }
                      />
                    </Feature>
                    <Feature
                      isActive={LocalActivities.features(
                        this.props.planStatus
                      ).ACTIVITIES_RUN.isActive()}
                    >
                      <Button
                        type="icon"
                        icon="play"
                        feature="RUN_ACTIVITY"
                        isBlocked={LocalActivities.features(
                          this.props.planStatus
                        ).ACTIVITIES_RUN.isBlocked()}
                        isNew={LocalActivities.features(
                          this.props.planStatus
                        ).ACTIVITIES_RUN.isNew()}
                        action={() => this.props.onRunSession(activity.meta.id)}
                      />
                    </Feature>
                  </>
                }
                complementSlot={
                  <div
                    className={`${layouts['snackbar']} ${layouts['snackbar--tight']}`}
                  >
                    {activity.types.map((type, index) => (
                      <ColorChip
                        key={index}
                        color={type.hex}
                        helper={type.name}
                      />
                    ))}
                    <Chip state="INACTIVE">
                      {String(activity.timer.minutes).padStart(2, '0') +
                        ':' +
                        String(activity.timer.seconds).padStart(2, '0')}
                    </Chip>
                  </div>
                }
                user={
                  activity.meta.publicationStatus.isPublished
                    ? {
                        avatar: activity.meta.creatorIdentity.avatar ?? '',
                        name: activity.meta.creatorIdentity.fullName ?? '',
                      }
                    : undefined
                }
              />
            )
          )}
        </ul>
      </div>
    )
  }
}
