import {
  Bar,
  Button,
  ConsentConfiguration,
  FeatureStatus,
  Icon,
  Input,
  Message,
  SemanticMessage,
} from '@a_ng_d/figmug-ui'
import React, { PureComponent } from 'react'

import { signIn, supabase } from '../../bridges/publication/authentication'
import { locals } from '../../content/locals'
import {
  FetchStatus,
  Language,
  PlanStatus,
  PriorityContext,
} from '../../types/app'
import { UserConfiguration } from '../../types/configurations'
import { ExternalActivitiesData } from '../../types/data'
import { ActionsList } from '../../types/models'
import { UserSession } from '../../types/user'
import features, { activitiesDbTableName, pageSize } from '../../utils/config'
import { trackPublicationEvent } from '../../utils/eventsTracker'
import Feature from '../components/Feature'
import CommunityActivity from '../modules/CommunityActivity'
import SelfActivity from '../modules/SelfActivity'

interface ExternalActivitiesProps {
  context: 'SELF' | 'COMMUNITY'
  localActivitiesNumber: number
  userIdentity: UserConfiguration
  userSession: UserSession
  userConsent: Array<ConsentConfiguration>
  planStatus: PlanStatus
  lang: Language
  onGetProPlan: (context: { priorityContainerContext: PriorityContext }) => void
}

interface ExternalActivitiesStates {
  activitiesListStatus: FetchStatus
  currentPage: number
  activitiesList: Array<ExternalActivitiesData>
  activitiesSearchQuery: string
  isLoadMoreActionLoading: boolean
  isSignInActionLoading: boolean
  isDuplicateToLocalActionLoading: Array<boolean>
  isContextActionLoading: Array<boolean>
}

export default class ExternalActivities extends PureComponent<
  ExternalActivitiesProps,
  ExternalActivitiesStates
> {
  static features = (planStatus: PlanStatus) => ({
    ACTIVITIES_LOCAL: new FeatureStatus({
      features: features,
      featureName: 'ACTIVITIES_LOCAL',
      planStatus: planStatus,
    }),
    ACTIVITIES_SEARCH: new FeatureStatus({
      features: features,
      featureName: 'ACTIVITIES_SEARCH',
      planStatus: planStatus,
    }),
  })

  constructor(props: ExternalActivitiesProps) {
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
        if (
          this.props.userSession.connectionStatus !== 'CONNECTED' &&
          this.props.context === 'SELF'
        )
          this.setState({ activitiesListStatus: 'SIGN_IN_FIRST' })
        else {
          this.setState({ activitiesListStatus: 'LOADING' })
          this.callUICPAgent(1, '')
        }
      },
      LOADING: () => null,
      COMPLETE: () => null,
      LOADED: () => null,
    }

    return actions[this.state.activitiesListStatus]?.()
  }

  componentDidUpdate = (
    prevProps: Readonly<ExternalActivitiesProps>,
    prevState: Readonly<ExternalActivitiesStates>
  ): void => {
    if (
      prevProps.userSession.connectionStatus !==
        this.props.userSession.connectionStatus &&
      this.state.activitiesList.length === 0
    ) {
      this.callUICPAgent(1, '')
    }
    if (
      prevProps.userSession.connectionStatus !==
        this.props.userSession.connectionStatus &&
      this.props.context === 'SELF'
    )
      this.setState({ activitiesListStatus: 'SIGN_IN_FIRST' })
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
    batch: Array<ExternalActivitiesData>,
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
          'activity_id, name, description, timer_minutes, timer_seconds, types, is_shared, creator_full_name, creator_avatar'
        )
        .eq(
          this.props.context === 'SELF' ? 'creator_id' : 'is_shared',
          this.props.context === 'SELF' ? this.props.userSession.userId : true
        )
        .order('published_at', { ascending: false })
        .range(pageSize * (currentPage - 1), pageSize * currentPage - 1))
    } else {
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;({ data, error } = await supabase
        .from(activitiesDbTableName)
        .select(
          'activity_id, name, description, timer_minutes, timer_seconds, types, is_shared, creator_full_name, creator_avatar'
        )
        .eq(
          this.props.context === 'SELF' ? 'creator_id' : 'is_shared',
          this.props.context === 'SELF' ? this.props.userSession.userId : true
        )
        .order('published_at', { ascending: false })
        .range(pageSize * (currentPage - 1), pageSize * currentPage - 1)
        .ilike('name', `%${searchQuery}%`))
    }

    if (!error) {
      this.setState({
        activitiesList: this.state.activitiesList.concat(
          data as Array<ExternalActivitiesData>
        ),
        activitiesListStatus: this.updateStatus(
          data as Array<ExternalActivitiesData>,
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
                ? 'REUSE_ACTIVITY'
                : 'DUPLICATE_ACTIVITY',
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
          this.state.activitiesListStatus === 'LOADING' && 'rich-list--loading',
          this.state.activitiesListStatus === 'ERROR' ||
            this.state.activitiesListStatus === 'EMPTY' ||
            (this.state.activitiesListStatus === 'NO_RESULT' &&
              'rich-list--message'),
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
          <div className="callout--centered">
            <SemanticMessage
              type="WARNING"
              message={locals[this.props.lang].error.fetchActivity}
            />
          </div>
        )}
        {this.state.activitiesListStatus === 'EMPTY' && (
          <div className="callout--centered">
            <SemanticMessage
              type="NEUTRAL"
              message={locals[this.props.lang].warning.noSelfActivityOnRemote}
            />
          </div>
        )}
        {this.state.activitiesListStatus === 'NO_RESULT' && (
          <div className="callout--centered">
            <SemanticMessage
              type="NEUTRAL"
              message={locals[this.props.lang].info.noResult}
            />
          </div>
        )}
        {(this.state.activitiesListStatus === 'LOADED' ||
          this.state.activitiesListStatus === 'COMPLETE') &&
          this.state.activitiesList.map((activity, index: number) =>
            this.props.context === 'SELF' ? (
              <SelfActivity
                {...this.props}
                {...this.state}
                key={`activity-${index}`}
                index={index}
                activity={activity}
                onChangeActivitiesList={(e) =>
                  this.setState({ activitiesList: e })
                }
                onChangeActivitiesListStatus={(e) =>
                  this.setState({ activitiesListStatus: e })
                }
                onChangeCurrentPage={(e) => this.setState({ currentPage: e })}
                onChangeContextActionLoading={(e) =>
                  this.setState({ isContextActionLoading: e })
                }
                onChangeDuplicateToLocalActionLoading={(e) =>
                  this.setState({ isDuplicateToLocalActionLoading: e })
                }
                onSelectActivity={() =>
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
                              locals[this.props.lang].error.duplicateToLocal,
                          },
                        },
                        '*'
                      )
                    })
                }
              />
            ) : (
              <CommunityActivity
                {...this.props}
                {...this.state}
                key={`activity-${index}`}
                index={index}
                activity={activity}
                onChangeDuplicateToLocalActionLoading={(e) =>
                  this.setState({ isDuplicateToLocalActionLoading: e })
                }
                onSelectActivity={() =>
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
                              locals[this.props.lang].error.duplicateToLocal,
                          },
                        },
                        '*'
                      )
                    })
                }
              />
            )
          )}
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
        <div className="callout--centered">
          <SemanticMessage
            type="NEUTRAL"
            message={locals[this.props.lang].activities.signInFirst.message}
            orientation="VERTICAL"
            action={
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
            }
          />
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
                  <Feature
                    isActive={ExternalActivities.features(
                      this.props.planStatus
                    ).ACTIVITIES_SEARCH.isActive()}
                  >
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
                      isBlocked={ExternalActivities.features(
                        this.props.planStatus
                      ).ACTIVITIES_SEARCH.isBlocked()}
                      isNew={ExternalActivities.features(
                        this.props.planStatus
                      ).ACTIVITIES_SEARCH.isNew()}
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
                  </Feature>
                }
                border={['BOTTOM']}
              />
            )}
          <Feature
            isActive={
              ExternalActivities.features(
                this.props.planStatus
              ).ACTIVITIES_LOCAL.isReached(this.props.localActivitiesNumber) &&
              (this.state.activitiesListStatus === 'LOADED' ||
                this.state.activitiesListStatus === 'COMPLETE')
            }
          >
            <div
              style={{
                padding: 'var(--size-xsmall) var(--size-xsmall) 0',
              }}
            >
              <SemanticMessage
                type="INFO"
                message={locals[
                  this.props.lang
                ].info.maxNumberOfActivities.replace(
                  '$1',
                  ExternalActivities.features(this.props.planStatus)
                    .ACTIVITIES_LOCAL.result.limit
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
          {fragment}
        </div>
      </div>
    )
  }
}
