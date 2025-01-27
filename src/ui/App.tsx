import {
  Button,
  Consent,
  ConsentConfiguration,
  layouts,
  SemanticMessage,
} from '@a_ng_d/figmug-ui'
import { FeatureStatus } from '@a_ng_d/figmug-utils'
import 'figma-plugin-ds/dist/figma-plugin-ds.css'
import React from 'react'
import { createPortal, PureComponent } from 'preact/compat'
import checkConnectionStatus from '../bridges/checks/checkConnectionStatus'
import { supabase } from '../bridges/publication/authentication'
import features, {
  announcementsWorkerUrl,
  feedbackUrl,
  trialTime,
  userConsentVersion,
  versionStatus,
} from '../config'
import { locals } from '../content/locals'
import {
  EditorType,
  HighlightDigest,
  Language,
  PlanStatus,
  PriorityContext,
  TrialStatus,
} from '../types/app'
import {
  ActiveParticipant,
  ActivityConfiguration,
  IdeaConfiguration,
  PublicationConfiguration,
  SessionConfiguration,
  UserConfiguration,
} from '../types/configurations'
import { ActionsList } from '../types/models'
import { UserSession } from '../types/user'
import {
  validateActivitiesStructure,
  validateIdeasStructure,
  validateSessionsStructure,
} from '../utils/checkDataSchema'
import {
  trackEditorEvent,
  trackEndSessionEvent,
  trackFatalErrorEvent,
  trackPurchaseEvent,
  trackRunningEvent,
  trackTrialEnablementEvent,
  trackUserConsentEvent,
} from '../utils/eventsTracker'
import { userConsent } from '../utils/userConsent'
import Feature from './components/Feature'
import PriorityContainer from './modules/PriorityContainer'
import Shortcuts from './modules/Shortcuts'
import BrowseActivities from './services/BrowseActivities'
import CorruptedData from './services/CorruptedData'
import Participate from './services/Participate'
import './stylesheets/app-components.css'
import './stylesheets/app.css'
import setParticipantsList from '../utils/setParticipantsList'
import setBarChart from '../utils/setBarChart'
import sortIdeas from '../utils/sortIdeas'
import { chartSizes } from '../canvas/partials/tokens'

export interface AppStates {
  activities: Array<ActivityConfiguration>
  sessions: Array<SessionConfiguration>
  ideas: Array<IdeaConfiguration>
  activeParticipants: Array<ActiveParticipant>
  editorType: EditorType
  planStatus: PlanStatus
  trialStatus: TrialStatus
  trialRemainingTime: number
  sessionCount: number
  publicationStatus: PublicationConfiguration
  userIdentity: UserConfiguration
  userSession: UserSession
  userConsent: Array<ConsentConfiguration>
  priorityContainerContext: PriorityContext
  lang: Language
  mustUserConsent: boolean
  highlight: HighlightDigest
  isLoaded: boolean
  isCorrupted: boolean
  isBetaMessageVisible: boolean
  onGoingStep: string
}

export default class App extends PureComponent<Record<string, never>, AppStates> {
  static features = (planStatus: PlanStatus) => ({
    BROWSE: new FeatureStatus({
      features: features,
      featureName: 'BROWSE',
      planStatus: planStatus,
    }),
    PARTICIPATE: new FeatureStatus({
      features: features,
      featureName: 'PARTICIPATE',
      planStatus: planStatus,
    }),
    SHORTCUTS: new FeatureStatus({
      features: features,
      featureName: 'SHORTCUTS',
      planStatus: planStatus,
    }),
    CONSENT: new FeatureStatus({
      features: features,
      featureName: 'CONSENT',
      planStatus: planStatus,
    }),
  })

  constructor(props: Record<string, never>) {
    super(props)
    this.state = {
      activities: [],
      sessions: [],
      ideas: [],
      activeParticipants: [],
      editorType: 'figjam',
      planStatus: 'UNPAID',
      trialStatus: 'UNUSED',
      trialRemainingTime: trialTime,
      sessionCount: 0,
      publicationStatus: {
        isPublished: false,
        isShared: false,
      },
      userIdentity: {
        id: '',
        fullName: '',
        avatar: '',
      },
      priorityContainerContext: 'EMPTY',
      lang: 'en-US',
      userSession: {
        connectionStatus: 'UNCONNECTED',
        userId: undefined,
        userFullName: '',
        userAvatar: '',
        accessToken: undefined,
        refreshToken: undefined,
      },
      userConsent: userConsent,
      mustUserConsent: true,
      highlight: {
        version: '',
        status: 'NO_HIGHLIGHT',
      },
      isLoaded: false,
      isCorrupted: false,
      isBetaMessageVisible: true,
      onGoingStep: '',
    }
  }

  componentDidMount = () => {
    setTimeout(
      () =>
        this.setState({
          isLoaded: true,
        }),
      1000
    )
    fetch(
      `${announcementsWorkerUrl}/?action=get_version&database_id=${process.env.REACT_APP_NOTION_ANNOUNCEMENTS_ID}`
    )
      .then((response) => response.json())
      .then((data) => {
        parent.postMessage(
          {
            pluginMessage: {
              type: 'CHECK_HIGHLIGHT_STATUS',
              version: data.version,
            },
          },
          '*'
        )
        this.setState({
          highlight: {
            version: data.version,
            status: 'NO_HIGHLIGHT',
          },
        })
      })
      .catch((error) => console.error(error))
    supabase.auth.onAuthStateChange((event, session) => {
      const actions: ActionsList = {
        SIGNED_IN: () => {
          this.setState({
            userSession: {
              connectionStatus: 'CONNECTED',
              userFullName: session?.user.user_metadata.full_name,
              userAvatar: session?.user.user_metadata.avatar_url,
              userId: session?.user.id,
              accessToken: session?.access_token,
              refreshToken: session?.refresh_token,
            },
          })
          parent.postMessage(
            {
              pluginMessage: {
                type: 'SEND_MESSAGE',
                message: locals[this.state.lang].user.welcomeMessage.replace(
                  '$[]',
                  session?.user.user_metadata.full_name
                ),
              },
            },
            '*'
          )
        },
        TOKEN_REFRESHED: () => {
          this.setState({
            userSession: {
              connectionStatus: 'CONNECTED',
              userFullName: session?.user.user_metadata.full_name,
              userAvatar: session?.user.user_metadata.avatar_url,
              userId: session?.user.id,
              accessToken: session?.access_token,
              refreshToken: session?.refresh_token,
            },
          })
          parent.postMessage(
            {
              pluginMessage: {
                type: 'SET_ITEMS',
                items: [
                  {
                    key: 'supabase_access_token',
                    value: session?.access_token,
                  },
                  {
                    key: 'supabase_refresh_token',
                    value: session?.refresh_token,
                  },
                ],
              },
            },
            '*'
          )
        },
      }
      // console.log(event, session)
      return actions[event]?.()
    })
    onmessage = (e: MessageEvent) => {
      try {
        const checkUserAuthentication = async () => {
          await checkConnectionStatus(
            e.data.pluginMessage.data.accessToken,
            e.data.pluginMessage.data.refreshToken
          )
        }

        const checkUserConsent = () =>
          this.setState({
            mustUserConsent: e.data.pluginMessage.mustUserConsent,
            userConsent: e.data.pluginMessage.userConsent,
          })

        const checkPlanStatus = () =>
          this.setState({
            planStatus: e.data.pluginMessage.data.planStatus,
            trialStatus: e.data.pluginMessage.data.trialStatus,
            trialRemainingTime: e.data.pluginMessage.data.trialRemainingTime,
          })

        const checkCounts = () =>
          this.setState({
            sessionCount: e.data.pluginMessage.data.sessionCount,
          })

        const checkEditorType = () => {
          this.setState({ editorType: e.data.pluginMessage.data })
          setTimeout(
            () =>
              trackEditorEvent(
                e.data.pluginMessage.id,
                this.state.userConsent.find(
                  (consent) => consent.id === 'mixpanel'
                )?.isConsented ?? false,
                {
                  editor: e.data.pluginMessage.data,
                }
              ),
            1000
          )
        }

        const handleHighlight = () => {
          this.setState({
            priorityContainerContext:
              e.data.pluginMessage.data !== 'DISPLAY_HIGHLIGHT_DIALOG'
                ? 'EMPTY'
                : 'HIGHLIGHT',
            highlight: {
              version: this.state.highlight.version,
              status: e.data.pluginMessage.data,
            },
          })
        }

        const getActivities = () => {
          validateActivitiesStructure(e.data.pluginMessage.data)
            .then(() =>
              this.setState({
                activities: e.data.pluginMessage.data,
              })
            )
            .catch(() => {
              this.setState({
                isCorrupted: true,
              })
              trackFatalErrorEvent(
                e.data.pluginMessage.data.id,
                this.state.userConsent.find(
                  (consent) => consent.id === 'mixpanel'
                )?.isConsented ?? false,
                {
                  data: 'ACTIVITIES',
                }
              )
            })
        }

        const getSessions = () => {
          validateSessionsStructure(e.data.pluginMessage.data)
            .then(() =>
              this.setState({
                sessions: e.data.pluginMessage.data,
              })
            )
            .catch(() => {
              this.setState({
                isCorrupted: true,
              })
              trackFatalErrorEvent(
                e.data.pluginMessage.data.id,
                this.state.userConsent.find(
                  (consent) => consent.id === 'mixpanel'
                )?.isConsented ?? false,
                {
                  data: 'SESSIONS',
                }
              )
            })
        }

        const getIdeas = () => {
          validateIdeasStructure(e.data.pluginMessage.data)
            .then(() =>
              this.setState({
                ideas: e.data.pluginMessage.data,
              })
            )
            .catch(() => {
              this.setState({
                isCorrupted: true,
              })
              trackFatalErrorEvent(
                e.data.pluginMessage.data.id,
                this.state.userConsent.find(
                  (consent) => consent.id === 'mixpanel'
                )?.isConsented ?? false,
                {
                  data: 'IDEAS',
                }
              )
            })
        }

        const getActiveParticipants = () =>
          this.setState({
            activeParticipants: e.data.pluginMessage.data,
          })

        const getUser = () => {
          this.setState({
            userIdentity: e.data.pluginMessage.data,
          })
          trackRunningEvent(
            e.data.pluginMessage.data.id,
            this.state.userConsent.find((consent) => consent.id === 'mixpanel')
              ?.isConsented ?? false
          )
        }

        const getProPlan = () => {
          this.setState({
            planStatus: e.data.pluginMessage.data,
            priorityContainerContext: 'WELCOME_TO_PRO',
          })
          trackPurchaseEvent(
            e.data.pluginMessage.id,
            this.state.userConsent.find((consent) => consent.id === 'mixpanel')
              ?.isConsented ?? false
          )
        }

        const enableTrial = () => {
          this.setState({
            planStatus: 'PAID',
            trialStatus: 'PENDING',
            priorityContainerContext: 'WELCOME_TO_TRIAL',
          })
          trackTrialEnablementEvent(
            e.data.pluginMessage.id,
            this.state.userConsent.find((consent) => consent.id === 'mixpanel')
              ?.isConsented ?? false,
            {
              date: e.data.pluginMessage.date,
              trialTime: e.data.pluginMessage.trialTime,
              trialVersion: e.data.pluginMessage.trialVersion,
            }
          )
        }

        const countSessions = () =>
          this.setState({
            sessionCount: e.data.pluginMessage.data.sessionCount,
          })

        const signOut = (data: UserSession) =>
          this.setState({
            userSession: data,
          })

        const actions: ActionsList = {
          CHECK_USER_AUTHENTICATION: () => checkUserAuthentication(),
          CHECK_USER_CONSENT: () => checkUserConsent(),
          CHECK_PLAN_STATUS: () => checkPlanStatus(),
          CHECK_COUNTS: () => checkCounts(),
          CHECK_EDITOR_TYPE: () => checkEditorType(),
          PUSH_HIGHLIGHT_STATUS: () => handleHighlight(),
          GET_ACTIVITIES: () => getActivities(),
          GET_SESSIONS: () => getSessions(),
          GET_IDEAS: () => getIdeas(),
          GET_ACTIVE_PARTICIPANTS: () => getActiveParticipants(),
          GET_USER: () => getUser(),
          GET_PRO_PLAN: () => getProPlan(),
          ENABLE_TRIAL: () => enableTrial(),
          COUNT_SESSIONS: () => countSessions(),
          SIGN_OUT: () => signOut(e.data.pluginMessage?.data),
          DEFAULT: () => null,
        }

        return actions[e.data.pluginMessage?.type ?? 'DEFAULT']?.()
      } catch (error) {
        console.error(error)
      }
    }
  }

  // Handlers
  userConsentHandler = (e: Array<ConsentConfiguration>) => {
    this.setState({
      userConsent: e,
      mustUserConsent: false,
    })
    parent.postMessage(
      {
        pluginMessage: {
          type: 'SET_ITEMS',
          items: [
            {
              key: 'mixpanel_user_consent',
              value: e.find((consent) => consent.id === 'mixpanel')
                ?.isConsented,
            },
            {
              key: 'user_consent_version',
              value: userConsentVersion,
            },
          ],
        },
      },
      '*'
    )
    parent.postMessage(
      {
        pluginMessage: {
          type: 'CHECK_USER_CONSENT',
        },
      },
      '*'
    )
    trackUserConsentEvent(e)
  }

  // Direct Actionss
  onEndSession = (
    activity: ActivityConfiguration,
    ideas: Array<IdeaConfiguration>
  ) => {
    const currentSession = this.state.sessions.find(
      (session) => session.isRunning
    )
    if (currentSession) {
      currentSession.isRunning = false
      currentSession.metrics.endDate = new Date().toISOString()
      currentSession.metrics.participants = Object.keys(
        ideas.reduce(
          (acc: { [key: string]: IdeaConfiguration[] }, idea) => {
            const { userIdentity } = idea
            if (!acc[userIdentity.fullName]) acc[userIdentity.fullName] = []

            acc[userIdentity.fullName].push(idea)
            return acc
          },
          {} as { [key: string]: IdeaConfiguration[] }
        )
      ).length
      currentSession.metrics.ideas = ideas.length
    }
    const sessions = this.state.sessions.map((session) => {
      if (session.id === currentSession?.id) return currentSession
      return session
    })

    const countByHasFinished = () => {
      return this.state.activeParticipants.reduce(
        (acc: { finished: number; unfinished: number }, participant) => {
          if (
            participant.hasFinished ||
            participant.userIdentity.id === this.state.userIdentity.id
          )
            acc.finished++
          else acc.unfinished++
          return acc
        },
        { finished: 0, unfinished: 0 }
      )
    }

    this.setState({
      sessions: sessions,
    })

    const sortedIdeas = sortIdeas(ideas, activity.groupedBy)
    const stringifiedChart = setBarChart(
      Object.keys(sortedIdeas).map((type) => ({
        type: type,
        count: sortedIdeas[type].length,
        color: sortedIdeas[type][0].type.hex,
      })),
      chartSizes.width,
      chartSizes.height,
      'STRING'
    )

    parent.postMessage(
      {
        pluginMessage: {
          type: 'END_SESSION',
          data: {
            activity: activity,
            sessions: sessions,
            session: currentSession,
            ideas: sortedIdeas,
            participants: setParticipantsList(ideas),
            stringifiedChart: stringifiedChart,
          },
        },
      },
      '*'
    )

    trackEndSessionEvent(
      this.state.userIdentity.id,
      this.state.userConsent.find((consent) => consent.id === 'mixpanel')
        ?.isConsented ?? false,
      {
        activityName: activity.name,
        activityDescription: activity.description,
        participantsNumber: currentSession?.metrics.participants ?? 0,
        finishedParticipantsNumber: countByHasFinished().finished,
        unfinishedParticipantsNumber: countByHasFinished().unfinished,
        sessionTimer: activity.timer.minutes * 60 + activity.timer.seconds,
        sessionDuration:
          currentSession?.metrics.endDate && currentSession?.metrics.startDate
            ? (new Date(currentSession.metrics.endDate).getTime() -
                new Date(currentSession.metrics.startDate).getTime()) /
              1000
            : 0,
        ideasNumber: currentSession?.metrics.ideas ?? 0,
      }
    )
  }

  // Templates
  Controls = () => {
    const runningSession = this.state.sessions?.find(
      (session) => session.isRunning
    )
    const runningSessionActivity = this.state.activities.find(
      (activity) => activity.meta.id === runningSession?.activityId
    )

    return (
      <>
        <Feature
          isActive={
            App.features(this.props.planStatus).BROWSE.isActive() &&
            this.state.sessions?.find((session) => session.isRunning) ===
              undefined
          }
        >
          <BrowseActivities
            {...this.state}
            onChangeActivities={(e) => this.setState({ ...e })}
            onRunSession={(e) => this.setState({ ...e })}
            onGetProPlan={(e) => this.setState({ ...e })}
          />
        </Feature>
        <Feature
          isActive={
            App.features(this.props.planStatus).PARTICIPATE.isActive() &&
            this.state.sessions?.find((session) => session.isRunning) !==
              undefined
          }
        >
          <Participate
            {...this.state}
            activity={runningSessionActivity ?? ({} as ActivityConfiguration)}
            session={runningSession ?? ({} as SessionConfiguration)}
            ideas={this.state.ideas}
            onPushIdea={(e) => {
              this.setState({ ideas: [...this.state.ideas, e] })
              parent.postMessage(
                {
                  pluginMessage: {
                    type: 'PUSH_IDEA',
                    data: [...this.state.ideas, e],
                  },
                },
                '*'
              )
            }}
            onChangeIdeas={(e) => this.setState({ ...e })}
            onEndSession={this.onEndSession}
            onGetProPlan={(e) => this.setState({ ...e })}
          />
        </Feature>
      </>
    )
  }

  Base = () => {
    return (
      <>
        <Feature isActive={this.state.priorityContainerContext !== 'EMPTY'}>
          {document.getElementById('modal') &&
            createPortal(
              <PriorityContainer
                {...this.state}
                context={this.state.priorityContainerContext}
                rawData={this.state}
                onChangePublication={(e) => this.setState({ ...e })}
                onClose={() =>
                  this.setState({
                    priorityContainerContext: 'EMPTY',
                    highlight: {
                      version: this.state.highlight.version,
                      status: 'NO_HIGHLIGHT',
                    },
                  })
                }
              />,
              document.getElementById('modal') ?? document.createElement('app')
            )}
        </Feature>
        <Feature
          isActive={
            this.state.mustUserConsent &&
            App.features(this.props.planStatus).CONSENT.isActive()
          }
        >
          <Consent
            welcomeMessage={locals[this.state.lang].user.cookies.welcome}
            vendorsMessage={locals[this.state.lang].user.cookies.vendors}
            privacyPolicy={{
              label: locals[this.state.lang].user.cookies.privacyPolicy,
              action: () =>
                parent.postMessage(
                  {
                    pluginMessage: {
                      type: 'OPEN_IN_BROWSER',
                      url: 'https://uicp.link/privacy',
                    },
                  },
                  '*'
                ),
            }}
            moreDetailsLabel={locals[this.state.lang].user.cookies.customize}
            lessDetailsLabel={locals[this.state.lang].user.cookies.back}
            consentActions={{
              consent: {
                label: locals[this.state.lang].user.cookies.consent,
                action: this.userConsentHandler,
              },
              deny: {
                label: locals[this.state.lang].user.cookies.deny,
                action: this.userConsentHandler,
              },
              save: {
                label: locals[this.state.lang].user.cookies.save,
                action: this.userConsentHandler,
              },
              close: {
                action: () => this.setState({ mustUserConsent: false }),
              },
            }}
            validVendor={{
              name: locals[this.state.lang].vendors.functional.name,
              id: 'functional',
              icon: '',
              description:
                locals[this.state.lang].vendors.functional.description,
              isConsented: true,
            }}
            vendorsList={this.state.userConsent}
          />
        </Feature>
        <Feature
          isActive={versionStatus === 'BETA' && this.state.isBetaMessageVisible}
        >
          <SemanticMessage
            type="INFO"
            message={locals[this.state.lang].beta.message}
            isAnchored={true}
            actionsSlot={
              <div className={`${layouts['snackbar--medium']}`}>
                <Button
                  type="secondary"
                  label={locals[this.state.lang].beta.cta}
                  action={() =>
                    parent.postMessage(
                      {
                        pluginMessage: {
                          type: 'OPEN_IN_BROWSER',
                          url: feedbackUrl,
                        },
                      },
                      '*'
                    )
                  }
                />
                <Button
                  type="icon"
                  icon="close"
                  action={() => this.setState({ isBetaMessageVisible: false })}
                />
              </div>
            }
          />
        </Feature>
        <Feature
          isActive={App.features(this.props.planStatus).SHORTCUTS.isActive()}
        >
          <Shortcuts
            {...this.state}
            onReOpenHighlight={() =>
              this.setState({ priorityContainerContext: 'HIGHLIGHT' })
            }
            onReOpenAbout={() =>
              this.setState({ priorityContainerContext: 'ABOUT' })
            }
            onReOpenReport={() =>
              this.setState({ priorityContainerContext: 'REPORT' })
            }
            onGetProPlan={() => {
              if (this.state.trialStatus === 'EXPIRED')
                parent.postMessage(
                  { pluginMessage: { type: 'GET_PRO_PLAN' } },
                  '*'
                )
              else this.setState({ priorityContainerContext: 'TRY' })
            }}
            onUpdateConsent={() => this.setState({ mustUserConsent: true })}
          />
        </Feature>
      </>
    )
  }

  // Render
  render() {
    if (this.state.isLoaded)
      return (
        <main className="ui">
          {this.state.isCorrupted ? (
            <CorruptedData {...this.state} />
          ) : (
            <this.Controls />
          )}
          <this.Base />
        </main>
      )
  }
}
