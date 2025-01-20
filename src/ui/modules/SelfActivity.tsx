import {
  ActionsItem,
  Button,
  Chip,
  ConsentConfiguration,
  layouts,
  Menu,
} from '@a_ng_d/figmug-ui'
import { FeatureStatus } from '@a_ng_d/figmug-utils'
import { PureComponent } from 'preact/compat'
import React from 'react'
import shareActivity from '../../bridges/publication/shareActivity'
import unpublishActivity from '../../bridges/publication/unpublishActivity'
import features, { pageSize } from '../../config'
import { locals } from '../../content/locals'
import { FetchStatus, Language, PlanStatus } from '../../types/app'
import { UserConfiguration } from '../../types/configurations'
import { ExternalActivitiesData } from '../../types/data'
import { trackPublicationEvent } from '../../utils/eventsTracker'
import ColorChip from '../components/ColorChip'
import Feature from '../components/Feature'

interface SelfActivityProps {
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
  onChangeActivitiesList: (
    activitiesList: Array<ExternalActivitiesData>
  ) => void
  onChangeCurrentPage: (currentPage: number) => void
  onChangeActivitiesListStatus: (status: FetchStatus) => void
  onChangeContextActionLoading: (loading: Array<boolean>) => void
  onChangeDuplicateToLocalActionLoading: (loading: Array<boolean>) => void
  onSelectActivity: () => void
}

export default class SelfActivity extends PureComponent<SelfActivityProps> {
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
    ACTIVITIES_UNPUBLISH: new FeatureStatus({
      features: features,
      featureName: 'ACTIVITIES_UNPUBLISH',
      planStatus: planStatus,
    }),
    ACTIVITIES_SHARE: new FeatureStatus({
      features: features,
      featureName: 'ACTIVITIES_SHARE',
      planStatus: planStatus,
    }),
  })

  render() {
    return (
      <ActionsItem
        id={this.props.activity.activity_id}
        name={this.props.activity.name}
        description={this.props.activity.description}
        indicator={
          this.props.activity.is_shared
            ? {
                status: 'ACTIVE',
                label: locals[this.props.lang].publication.statusShared,
              }
            : undefined
        }
        actionsSlot={
          <>
            <Menu
              id="publication-options"
              icon="ellipses"
              options={[
                {
                  label: locals[this.props.lang].publication.unpublish,
                  type: 'OPTION',
                  isActive: SelfActivity.features(
                    this.props.planStatus
                  ).ACTIVITIES_UNPUBLISH.isActive(),
                  isBlocked: SelfActivity.features(
                    this.props.planStatus
                  ).ACTIVITIES_UNPUBLISH.isBlocked(),
                  isNew: SelfActivity.features(
                    this.props.planStatus
                  ).ACTIVITIES_UNPUBLISH.isNew(),
                  action: async () => {
                    this.props.onChangeContextActionLoading(
                      this.props.isContextActionLoading.map((loading, i) =>
                        i === this.props.index ? true : loading
                      )
                    )
                    unpublishActivity(
                      {
                        meta: {
                          id: this.props.activity.activity_id,
                          dates: {
                            createdAt: this.props.activity.created_at,
                            updatedAt: this.props.activity.updated_at,
                            publishedAt: '',
                          },
                          creatorIdentity: {
                            id: '',
                            fullName: '',
                            avatar: '',
                          },
                          publicationStatus: {
                            isPublished: false,
                            isShared: false,
                          },
                        },
                      },
                      true
                    )
                      .then(() => {
                        const currentActivitiesList =
                          this.props.activitiesList.filter(
                            (pal) =>
                              pal.activity_id !==
                              this.props.activity.activity_id
                          )

                        parent.postMessage(
                          {
                            pluginMessage: {
                              type: 'SEND_MESSAGE',
                              message:
                                locals[this.props.lang].success.nonPublication,
                            },
                          },
                          '*'
                        )
                        this.props.onChangeActivitiesList(currentActivitiesList)

                        if (currentActivitiesList.length === 0)
                          this.props.onChangeActivitiesListStatus('EMPTY')
                        if (currentActivitiesList.length < pageSize)
                          this.props.onChangeCurrentPage(1)

                        trackPublicationEvent(
                          this.props.userIdentity.id,
                          this.props.userConsent.find(
                            (consent) => consent.id === 'mixpanel'
                          )?.isConsented ?? false,
                          {
                            feature: 'UNPUBLISH_ACTIVITY',
                          }
                        )
                      })
                      .finally(() => {
                        this.props.onChangeContextActionLoading(
                          this.props.isContextActionLoading.map((loading, i) =>
                            i === this.props.index ? false : loading
                          )
                        )
                      })
                      .catch(() => {
                        parent.postMessage(
                          {
                            pluginMessage: {
                              type: 'SEND_MESSAGE',
                              message:
                                locals[this.props.lang].error.nonPublication,
                            },
                          },
                          '*'
                        )
                      })
                  },
                },
                {
                  label: this.props.activity.is_shared
                    ? locals[this.props.lang].publication.unshare
                    : locals[this.props.lang].publication.share,
                  type: 'OPTION',
                  isActive: SelfActivity.features(
                    this.props.planStatus
                  ).ACTIVITIES_SHARE.isActive(),
                  isBlocked: SelfActivity.features(
                    this.props.planStatus
                  ).ACTIVITIES_SHARE.isBlocked(),
                  isNew: SelfActivity.features(
                    this.props.planStatus
                  ).ACTIVITIES_SHARE.isNew(),
                  action: async () => {
                    this.props.onChangeContextActionLoading(
                      this.props.isContextActionLoading.map((loading, i) =>
                        i === this.props.index ? true : loading
                      )
                    )
                    shareActivity(
                      this.props.activity.activity_id,
                      !this.props.activity.is_shared
                    )
                      .then(() => {
                        parent.postMessage(
                          {
                            pluginMessage: {
                              type: 'SEND_MESSAGE',
                              message: !this.props.activity.is_shared
                                ? locals[this.props.lang].success.share
                                : locals[this.props.lang].success.unshare,
                            },
                          },
                          '*'
                        )

                        const currentActivitiesList =
                          this.props.activitiesList.map((pal) =>
                            pal.activity_id === this.props.activity.activity_id
                              ? {
                                  ...pal,
                                  is_shared: !pal.is_shared,
                                }
                              : pal
                          )
                        this.props.onChangeActivitiesList(currentActivitiesList)

                        trackPublicationEvent(
                          this.props.userIdentity.id,
                          this.props.userConsent.find(
                            (consent) => consent.id === 'mixpanel'
                          )?.isConsented ?? false,
                          {
                            feature: 'SHARE_ACTIVITY',
                          }
                        )
                      })
                      .finally(() => {
                        this.props.onChangeContextActionLoading(
                          this.props.isContextActionLoading.map((loading, i) =>
                            i === this.props.index ? false : loading
                          )
                        )
                      })
                      .catch(() => {
                        parent.postMessage(
                          {
                            pluginMessage: {
                              type: 'SEND_MESSAGE',
                              message: !this.props.activity.is_shared
                                ? locals[this.props.lang].error.share
                                : locals[this.props.lang].error.unshare,
                            },
                          },
                          '*'
                        )
                      })
                  },
                },
              ]}
              state={
                this.props.isContextActionLoading[this.props.index]
                  ? 'LOADING'
                  : 'DEFAULT'
              }
              alignment="BOTTOM_RIGHT"
            />
            <Feature
              isActive={SelfActivity.features(
                this.props.planStatus
              ).ACTIVITIES_DUPLICATE.isActive()}
            >
              <Button
                type="secondary"
                label={locals[this.props.lang].activities.duplicateToLocal}
                isLoading={
                  this.props.isDuplicateToLocalActionLoading[this.props.index]
                }
                isBlocked={SelfActivity.features(
                  this.props.planStatus
                ).ACTIVITIES_LOCAL.isReached(this.props.localActivitiesNumber)}
                isNew={SelfActivity.features(
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
          </>
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
      />
    )
  }
}
