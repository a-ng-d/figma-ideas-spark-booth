import {
  ActionsItem,
  Bar,
  Button,
  ConsentConfiguration,
  Icon,
  Input,
  Menu,
  Message,
  texts,
} from '@a_ng_d/figmug-ui'
import React from 'react'

import { signIn, supabase } from '../../bridges/publication/authentication'
import shareActivity from '../../bridges/publication/shareActivity'
import unpublishActivity from '../../bridges/publication/unpublishActivity'
import { locals } from '../../content/locals'
import { FetchStatus, Language, PlanStatus } from '../../types/app'
import { UserConfiguration } from '../../types/configurations'
import { ExternalActivities } from '../../types/data'
import { ActionsList } from '../../types/models'
import { UserSession } from '../../types/user'
import { activitiesDbTableName, pageSize } from '../../utils/config'
import { trackPublicationEvent } from '../../utils/eventsTracker'

interface MyActivitiesProps {
  userIdentity: UserConfiguration
  userSession: UserSession
  userConsent: Array<ConsentConfiguration>
  planStatus: PlanStatus
  lang: Language
}

interface MyActivitiesStates {
  activitiesListStatus: FetchStatus
  currentPage: number
  activitiesList: Array<ExternalActivities>
  activitiesSearchQuery: string
  isLoadMoreActionLoading: boolean
  isSignInActionLoading: boolean
  isDuplicateToLocalActionLoading: Array<boolean>
  isContextActionLoading: Array<boolean>
}

export default class MyActivities extends React.Component<
  MyActivitiesProps,
  MyActivitiesStates
> {
  constructor(props: MyActivitiesProps) {
    super(props)
    this.state = {
      activitiesListStatus: 'UNLOADED',
      currentPage: 1,
      activitiesList: [],
      activitiesSearchQuery: '',
      isLoadMoreActionLoading: false,
      isSignInActionLoading: false,
      isDuplicateToLocalActionLoading: [],
      isContextActionLoading: [],
    }
  }

  // Lifecycle
  componentDidMount = async () => {
    const actions: ActionsList = {
      UNLOADED: () => {
        this.callUICPAgent(1, '')
        this.setState({ activitiesListStatus: 'LOADING' })
      },
      LOADING: () => null,
      COMPLETE: () => null,
      LOADED: () => null,
    }

    return actions[this.state.activitiesListStatus]?.()
  }

  componentDidUpdate = (
    prevProps: Readonly<MyActivitiesProps>,
    prevState: Readonly<MyActivitiesStates>
  ): void => {
    if (
      prevProps.userSession.connectionStatus !==
        this.props.userSession.connectionStatus &&
      this.state.activitiesList.length === 0
    ) {
      this.callUICPAgent(1, '')
    }
    if (prevState.activitiesList.length !== this.state.activitiesList.length)
      this.setState({
        isDuplicateToLocalActionLoading: Array(
          this.state.activitiesList.length
        ).fill(false),
        isContextActionLoading: Array(this.state.activitiesList.length).fill(
          false
        ),
      })
  }

  // Direct actions
  updateStatus = (
    batch: Array<ExternalActivities>,
    currentPage: number,
    searchQuery: string
  ) => {
    if (batch.length === 0 && currentPage === 1 && searchQuery === '')
      return 'EMPTY'
    if (batch.length === 0 && currentPage === 1 && searchQuery !== '')
      return 'NO_RESULT'
    else if (batch.length < pageSize) return 'COMPLETE'
    return 'LOADED'
  }

  callUICPAgent = async (currentPage: number, searchQuery: string) => {
    let data, error

    if (searchQuery === '') {
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;({ data, error } = await supabase
        .from(activitiesDbTableName)
        .select(
          'activity_id, name, description, timer_minutes, timer_seconds, types, is_shared'
        )
        .eq('creator_id', this.props.userSession.userId)
        .order('published_at', { ascending: false })
        .range(pageSize * (currentPage - 1), pageSize * currentPage - 1))
    } else {
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;({ data, error } = await supabase
        .from(activitiesDbTableName)
        .select(
          'activity_id, name, description, timer_minutes, timer_seconds, types, is_shared'
        )
        .eq('creator_id', this.props.userSession.userId)
        .order('published_at', { ascending: false })
        .range(pageSize * (currentPage - 1), pageSize * currentPage - 1)
        .ilike('name', `%${searchQuery}%`))
    }

    if (!error) {
      const batch = this.state.activitiesList.concat(
        data as Array<ExternalActivities>
      )
      this.setState({
        activitiesList: batch,
        activitiesListStatus: this.updateStatus(
          batch,
          currentPage,
          searchQuery
        ),
        isLoadMoreActionLoading: false,
      })
    } else
      this.setState({
        activitiesListStatus: 'ERROR',
      })
  }

  onSelectActivity = async (id: string) => {
    const { data, error } = await supabase
      .from(activitiesDbTableName)
      .select('*')
      .eq('activity_id', id)

    if (!error && data.length > 0) {
      try {
        parent.postMessage(
          {
            pluginMessage: {
              type: 'DUPLICATE_ACTIVITY',
              data: data[0],
            },
          },
          '*'
        )
        trackPublicationEvent(
          this.props.userIdentity.id,
          this.props.userConsent.find((consent) => consent.id === 'mixpanel')
            ?.isConsented ?? false,
          {
            feature:
              this.props.userSession.userId === data[0].creator_id
                ? 'REUSE_PALETTE'
                : 'ADD_PALETTE',
          }
        )

        return
      } catch {
        throw error
      }
    } else throw error
  }

  // Templates
  ExternalActivitiesList = () => {
    let fragment

    if (this.state.activitiesListStatus === 'LOADED') {
      fragment = (
        <Button
          type="secondary"
          label={locals[this.props.lang].activities.lazyLoad.loadMore}
          isLoading={this.state.isLoadMoreActionLoading}
          action={() => {
            this.setState({ currentPage: this.state.currentPage + 1 })
            this.callUICPAgent(
              this.state.currentPage + 1,
              this.state.activitiesSearchQuery
            )
            this.setState({
              isLoadMoreActionLoading: true,
            })
          }}
        />
      )
    } else if (this.state.activitiesListStatus === 'COMPLETE')
      fragment = (
        <Message
          icon="check"
          messages={[locals[this.props.lang].activities.lazyLoad.completeList]}
        />
      )

    return (
      <ul
        className={[
          'rich-list',
          this.state.activitiesListStatus === 'LOADING'
            ? 'rich-list--loading'
            : null,
          this.state.activitiesListStatus === 'ERROR' ||
          this.state.activitiesListStatus === 'EMPTY' ||
          this.state.activitiesListStatus === 'NO_RESULT'
            ? 'rich-list--message'
            : null,
        ]
          .filter((n) => n)
          .join(' ')}
      >
        {this.state.activitiesListStatus === 'LOADING' && (
          <Icon
            type="PICTO"
            iconName="spinner"
            customClassName="control__block__loader"
          />
        )}
        {this.state.activitiesListStatus === 'ERROR' && (
          <div className="onboarding__callout--centered">
            <Message
              icon="warning"
              messages={[locals[this.props.lang].error.fetchActivity]}
            />
          </div>
        )}
        {this.state.activitiesListStatus === 'EMPTY' && (
          <div className="onboarding__callout--centered">
            <Message
              icon="info"
              messages={[
                locals[this.props.lang].warning.noSelfActivityOnRemote,
              ]}
            />
          </div>
        )}
        {this.state.activitiesListStatus === 'NO_RESULT' && (
          <div className="onboarding__callout--centered">
            <Message
              icon="info"
              messages={[locals[this.props.lang].info.noResult]}
            />
          </div>
        )}
        {(this.state.activitiesListStatus === 'LOADED' ||
          this.state.activitiesListStatus === 'COMPLETE') &&
          this.state.activitiesList.map((activity, index: number) => (
            <ActionsItem
              id={activity.activity_id}
              key={`activity-${index}`}
              name={activity.name}
              description={activity.description}
              complementSlot={
                <div
                  style={{
                    display: 'flex',
                    gap: 'var(--size-xxsmall)',
                  }}
                >
                  {activity.types.map((type, index) => (
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
                activity.is_shared
                  ? {
                      status: 'ACTIVE',
                      label: locals[this.props.lang].publication.statusShared,
                    }
                  : undefined
              }
              actionsSlot={
                <>
                  <span
                    className={`${texts.type} ${texts['type--secondary']} type`}
                  >
                    {String(activity.timer_minutes).padStart(2, '0') +
                      ':' +
                      String(activity.timer_seconds).padStart(2, '0')}
                  </span>
                  <Menu
                    id="publication-options"
                    icon="ellipsis"
                    options={[
                      {
                        label: locals[this.props.lang].publication.unpublish,
                        type: 'OPTION',
                        action: async () => {
                          this.setState({
                            isContextActionLoading:
                              this.state.isContextActionLoading.map(
                                (loading, i) => (i === index ? true : loading)
                              ),
                          })
                          unpublishActivity(
                            {
                              meta: {
                                id: activity.activity_id,
                                dates: {
                                  createdAt: activity.created_at,
                                  updatedAt: activity.updated_at,
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
                                this.state.activitiesList.filter(
                                  (pal) =>
                                    pal.activity_id !== activity.activity_id
                                )

                              parent.postMessage(
                                {
                                  pluginMessage: {
                                    type: 'SEND_MESSAGE',
                                    message:
                                      locals[this.props.lang].success
                                        .nonPublication,
                                  },
                                },
                                '*'
                              )
                              this.setState({
                                activitiesList: currentActivitiesList,
                              })

                              if (currentActivitiesList.length === 0)
                                this.setState({ activitiesListStatus: 'EMPTY' })
                              if (currentActivitiesList.length < pageSize)
                                this.setState({ currentPage: 1 })

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
                              this.setState({
                                isContextActionLoading:
                                  this.state.isContextActionLoading.map(
                                    (loading, i) =>
                                      i === index ? false : loading
                                  ),
                              })
                            })
                            .catch(() => {
                              parent.postMessage(
                                {
                                  pluginMessage: {
                                    type: 'SEND_MESSAGE',
                                    message:
                                      locals[this.props.lang].error
                                        .nonPublication,
                                  },
                                },
                                '*'
                              )
                            })
                        },
                      },
                      {
                        label: activity.is_shared
                          ? locals[this.props.lang].publication.unshare
                          : locals[this.props.lang].publication.share,
                        type: 'OPTION',
                        action: async () => {
                          this.setState({
                            isContextActionLoading:
                              this.state.isContextActionLoading.map(
                                (loading, i) => (i === index ? true : loading)
                              ),
                          })
                          shareActivity(
                            activity.activity_id,
                            !activity.is_shared
                          )
                            .then(() => {
                              parent.postMessage(
                                {
                                  pluginMessage: {
                                    type: 'SEND_MESSAGE',
                                    message: !activity.is_shared
                                      ? locals[this.props.lang].success.share
                                      : locals[this.props.lang].success.unshare,
                                  },
                                },
                                '*'
                              )

                              const currentActivitiesList =
                                this.state.activitiesList.map((pal) =>
                                  pal.activity_id === activity.activity_id
                                    ? {
                                        ...pal,
                                        is_shared: !pal.is_shared,
                                      }
                                    : pal
                                )
                              this.setState({
                                activitiesList: currentActivitiesList,
                              })

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
                              this.setState({
                                isContextActionLoading:
                                  this.state.isContextActionLoading.map(
                                    (loading, i) =>
                                      i === index ? false : loading
                                  ),
                              })
                            })
                            .catch(() => {
                              parent.postMessage(
                                {
                                  pluginMessage: {
                                    type: 'SEND_MESSAGE',
                                    message: !activity.is_shared
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
                      this.state.isContextActionLoading[index]
                        ? 'LOADING'
                        : 'DEFAULT'
                    }
                    alignment="BOTTOM_RIGHT"
                  />
                  <Button
                    type="secondary"
                    label={locals[this.props.lang].actions.duplicateToLocal}
                    isLoading={
                      this.state.isDuplicateToLocalActionLoading[index]
                    }
                    action={() => {
                      this.setState({
                        isDuplicateToLocalActionLoading: this.state[
                          'isDuplicateToLocalActionLoading'
                        ].map((loading, i) => (i === index ? true : loading)),
                      })
                      this.onSelectActivity(activity.activity_id ?? '')
                        .finally(() => {
                          this.setState({
                            isDuplicateToLocalActionLoading:
                              this.state.isDuplicateToLocalActionLoading.map(
                                (loading, i) => (i === index ? false : loading)
                              ),
                          })
                        })
                        .catch(() => {
                          parent.postMessage(
                            {
                              pluginMessage: {
                                type: 'SEND_MESSAGE',
                                message:
                                  locals[this.props.lang].error
                                    .duplicateToLocal,
                              },
                            },
                            '*'
                          )
                        })
                    }}
                  />
                </>
              }
            />
          ))}
        <div className="list-control">{fragment}</div>
      </ul>
    )
  }

  // Render
  render() {
    let fragment

    if (this.state.activitiesListStatus !== 'SIGN_IN_FIRST') {
      fragment = <this.ExternalActivitiesList />
    } else {
      fragment = (
        <div className="onboarding__callout--centered">
          <Message
            icon="info"
            messages={[locals[this.props.lang].activities.signInFirst.message]}
          />
          <div className="onboarding__actions">
            <Button
              type="primary"
              label={locals[this.props.lang].activities.signInFirst.signIn}
              isLoading={this.state.isSignInActionLoading}
              action={async () => {
                this.setState({ isSignInActionLoading: true })
                signIn(this.props.userIdentity.id)
                  .finally(() => {
                    this.setState({ isSignInActionLoading: false })
                  })
                  .catch((error) => {
                    parent.postMessage(
                      {
                        pluginMessage: {
                          type: 'SEND_MESSAGE',
                          message:
                            error.message === 'Authentication timeout'
                              ? locals[this.props.lang].error.timeout
                              : locals[this.props.lang].error.authentication,
                        },
                      },
                      '*'
                    )
                  })
              }}
            />
          </div>
        </div>
      )
    }

    return (
      <div className="controls__control">
        <div className="control__block control__block--no-padding">
          {this.state.activitiesListStatus !== 'SIGN_IN_FIRST' &&
            this.state.activitiesListStatus !== 'EMPTY' && (
              <Bar
                soloPartSlot={
                  <Input
                    type="TEXT"
                    icon={{
                      type: 'PICTO',
                      value: 'search',
                    }}
                    placeholder={
                      locals[this.props.lang].activities.lazyLoad.search
                    }
                    value={this.state.activitiesSearchQuery}
                    isClearable
                    isFramed={false}
                    onChange={(e) => {
                      this.setState({
                        activitiesSearchQuery: (e.target as HTMLInputElement)
                          .value,
                        activitiesListStatus: 'LOADING',
                        currentPage: 1,
                        activitiesList: [],
                      })
                      this.callUICPAgent(
                        1,
                        (e.target as HTMLInputElement).value
                      )
                    }}
                    onCleared={(e) => {
                      this.setState({
                        activitiesSearchQuery: '',
                        activitiesListStatus: 'LOADING',
                        currentPage: 1,
                        activitiesList: [],
                      })
                      this.callUICPAgent(1, e)
                    }}
                  />
                }
                border={['BOTTOM']}
              />
            )}
          {fragment}
        </div>
      </div>
    )
  }
}
