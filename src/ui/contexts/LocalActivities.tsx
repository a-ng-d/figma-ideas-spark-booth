import {
  ActionsItem,
  Button,
  Chip,
  Dialog,
  Dropzone,
  layouts,
  SectionTitle,
  SemanticMessage,
  SimpleItem,
} from '@a_ng_d/figmug-ui'
import { FeatureStatus } from '@a_ng_d/figmug-utils'
import { createPortal, PureComponent } from 'preact/compat'
import React from 'react'
import features from '../../config'
import { locals } from '../../content/locals'
import { Language, PlanStatus, PriorityContext } from '../../types/app'
import { ActivityConfiguration } from '../../types/configurations'
import ColorChip from '../components/ColorChip'
import Feature from '../components/Feature'

interface LocalActivitiesProps {
  activities: Array<ActivityConfiguration>
  lang: Language
  planStatus: PlanStatus
  sessionCount: number
  onChangeActivities: React.MouseEventHandler<HTMLButtonElement>
  onOpenActivitySettings: (id: string) => void
  onRunSession: (id: string) => void
  onGetProPlan: (context: { priorityContainerContext: PriorityContext }) => void
}

interface LocalActivitiesStates {
  isImportDialogOpen: boolean
}

export default class LocalActivities extends PureComponent<
  LocalActivitiesProps,
  LocalActivitiesStates
> {
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
    ACTIVITIES_IMPORT: new FeatureStatus({
      features: features,
      featureName: 'ACTIVITIES_IMPORT',
      planStatus: planStatus,
    }),
  })

  constructor(props: LocalActivitiesProps) {
    super(props)
    this.state = {
      isImportDialogOpen: false,
    }
  }

  render() {
    return (
      <>
        <div className="control__block control__block--list">
          <SimpleItem
            leftPartSlot={
              <SectionTitle
                label={locals[this.props.lang].activities.title}
                indicator={this.props.activities.length}
              />
            }
            rightPartSlot={
              <>
                <Feature
                  isActive={LocalActivities.features(
                    this.props.planStatus
                  ).ACTIVITIES_IMPORT.isActive()}
                >
                  <Button
                    type="icon"
                    icon="import"
                    helper={locals[this.props.lang].activities.importActivities}
                    isBlocked={LocalActivities.features(
                      this.props.planStatus
                    ).ACTIVITIES_IMPORT.isReached(this.props.sessionCount)}
                    isNew={LocalActivities.features(
                      this.props.planStatus
                    ).ACTIVITIES_IMPORT.isNew()}
                    action={() =>
                      this.setState({
                        isImportDialogOpen: true,
                      })
                    }
                  />
                </Feature>
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
              </>
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
                  LocalActivities.features(this.props.planStatus)
                    .ACTIVITIES_LOCAL.result.limit
                )}
                actionsSlot={
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
          {this.props.activities.length === 0 && (
            <div className="callout--centered">
              <SemanticMessage
                type="NEUTRAL"
                message={locals[this.props.lang].activities.addFirst.message}
                orientation="VERTICAL"
                actionsSlot={
                  <Button
                    type="primary"
                    label={locals[this.props.lang].activities.addFirst.cta}
                    feature="ADD_ACTIVITY"
                    isBlocked={LocalActivities.features(
                      this.props.planStatus
                    ).ACTIVITIES_LOCAL.isReached(this.props.activities.length)}
                    isNew={LocalActivities.features(
                      this.props.planStatus
                    ).ACTIVITIES_ADD.isNew()}
                    action={this.props.onChangeActivities}
                  />
                }
              />
            </div>
          )}
          <ul className="rich-list">
            {this.props.activities
              .sort(
                (a, b) =>
                  new Date(b.meta.dates.addedAt ?? 0).getTime() -
                  new Date(a.meta.dates.addedAt ?? 0).getTime()
              )
              .map((activity: ActivityConfiguration, index) => (
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
                          ).ACTIVITIES_RUN.isReached(this.props.sessionCount)}
                          isNew={LocalActivities.features(
                            this.props.planStatus
                          ).ACTIVITIES_RUN.isNew()}
                          action={() =>
                            this.props.onRunSession(activity.meta.id)
                          }
                        />
                      </Feature>
                    </>
                  }
                  complementSlot={
                    <div className={`${layouts['snackbar--tight']}`}>
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
              ))}
          </ul>
        </div>
        <Feature
          isActive={
            LocalActivities.features(
              this.props.planStatus
            ).ACTIVITIES_IMPORT.isActive() && this.state.isImportDialogOpen
          }
        >
          {document.getElementById('modal') &&
            createPortal(
              <Dialog
                title={
                  locals[this.props.lang].activities.importSessionsDialog.title
                }
                onClose={() => this.setState({ isImportDialogOpen: false })}
              >
                <div
                  style={{
                    padding: 'var(--size-xxsmall)',
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <Dropzone
                    message={
                      locals[this.props.lang].activities.importSessionsDialog
                        .message
                    }
                    warningMessage={
                      locals[this.props.lang].activities.importSessionsDialog
                        .warning
                    }
                    errorMessage={
                      locals[this.props.lang].activities.importSessionsDialog
                        .error
                    }
                    cta={
                      locals[this.props.lang].activities.importSessionsDialog
                        .cta
                    }
                    acceptedMimeTypes={['application/json']}
                    isMultiple={true}
                    onImportFiles={(files) => {
                      this.setState({ isImportDialogOpen: false })

                      parent.postMessage(
                        {
                          pluginMessage: {
                            type: 'IMPORT_ACTIVITIES',
                            data: {
                              files: files,
                            },
                          },
                        },
                        '*'
                      )
                    }}
                  />
                </div>
              </Dialog>,
              document.getElementById('modal') ?? document.createElement('app')
            )}
        </Feature>
      </>
    )
  }
}
