import {
  ActionsItem,
  Button,
  ConsentConfiguration,
  Menu,
  texts,
} from '@a_ng_d/figmug-ui'
import React from 'react'
import shareActivity from '../../bridges/publication/shareActivity'
import unpublishActivity from '../../bridges/publication/unpublishActivity'
import { locals } from '../../content/locals'
import { FetchStatus, Language, PlanStatus } from '../../types/app'
import { UserConfiguration } from '../../types/configurations'
import { ExternalActivitiesData } from '../../types/data'
import { pageSize } from '../../utils/config'
import { trackPublicationEvent } from '../../utils/eventsTracker'

interface SelfActivityProps {
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
  onChangeActivitiesList: (
    activitiesList: Array<ExternalActivitiesData>
  ) => void
  onChangeCurrentPage: (currentPage: number) => void
  onChangeActivitiesListStatus: (status: FetchStatus) => void
  onChangeContextActionLoading: (loading: Array<boolean>) => void
  onChangeDuplicateToLocalActionLoading: (loading: Array<boolean>) => void
  onSelectActivity: () => void
}

export default class SelfActivity extends React.Component<SelfActivityProps> {
  render() {
    return (
      <ActionsItem
        id={this.props.activity.activity_id}
        name={this.props.activity.name}
        description={this.props.activity.description}
        complementSlot={
          <div
            style={{
              display: 'flex',
              gap: 'var(--size-xxsmall)',
            }}
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
          </div>
        }
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
            <span className={`${texts.type} ${texts['type--secondary']} type`}>
              {String(this.props.activity.timer_minutes).padStart(2, '0') +
                ':' +
                String(this.props.activity.timer_seconds).padStart(2, '0')}
            </span>
            <Menu
              id="publication-options"
              icon="ellipsis"
              options={[
                {
                  label: locals[this.props.lang].publication.unpublish,
                  type: 'OPTION',
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
                            feature: 'UNPUBLISH_PALETTE',
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
                            feature: 'SHARE_PALETTE',
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
            <Button
              type="secondary"
              label={locals[this.props.lang].actions.duplicateToLocal}
              isLoading={
                this.props.isDuplicateToLocalActionLoading[this.props.index]
              }
              action={() => {
                this.props.onChangeDuplicateToLocalActionLoading(
                  this.props.isDuplicateToLocalActionLoading.map(
                    (loading, i) => (i === this.props.index ? true : loading)
                  )
                )
                this.props.onSelectActivity()
              }}
            />
          </>
        }
      />
    )
  }
}
