import {
  Bar,
  Button,
  Chip,
  ConsentConfiguration,
  Dialog,
  Icon,
  layouts,
  Menu,
  Section,
  SectionTitle,
  SimpleItem,
  texts,
} from '@a_ng_d/figmug-ui'
import { FeatureStatus } from '@a_ng_d/figmug-utils'
import React from 'react'
import { createPortal, PureComponent } from 'preact/compat'
import { signIn } from '../../bridges/publication/authentication'
import features from '../../config'
import p from '../../content/images/publication.webp'
import { locals } from '../../content/locals'
import {
  EditorType,
  Language,
  PlanStatus,
  PriorityContext,
} from '../../types/app'
import {
  ActivityConfiguration,
  IdeaConfiguration,
  SessionConfiguration,
  TypeConfiguration,
  UserConfiguration,
} from '../../types/configurations'
import { UserSession } from '../../types/user'
import { trackSignInEvent } from '../../utils/eventsTracker'
import setFriendlyDate from '../../utils/setFriendlyDate'
import Feature from '../components/Feature'
import GlobalSettings from '../modules/GlobalSettings'
import Publication from '../modules/Publication'
import TimerSettings from '../modules/TimerSettings'
import TypesSettings from '../modules/TypesSettings'
import sortIdeas from '../../utils/sortIdeas'
import setBarChart from '../../utils/setBarChart'
import { chartSizes } from '../../canvas/partials/tokens'
import setParticipantsList from '../../utils/setParticipantsList'
import { ActionsList } from 'src/types/models'

interface SettingsProps {
  activity: ActivityConfiguration
  sessions: Array<SessionConfiguration>
  ideas: Array<IdeaConfiguration>
  userSession: UserSession
  userIdentity: UserConfiguration
  userConsent: Array<ConsentConfiguration>
  editorType: EditorType
  planStatus: PlanStatus
  sessionCount: number
  lang: Language
  onChangeActivities: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | Element>
      | React.KeyboardEvent<
          HTMLInputElement | HTMLTextAreaElement | Element | HTMLLIElement
        >
      | React.TargetedEvent<HTMLButtonElement | HTMLLIElement>
  ) => void
  onChangeTypes: (types: Array<TypeConfiguration>) => void
  onRunSession: (id: string) => void
  onOpenSessionHistory: React.MouseEventHandler<Element> &
    React.KeyboardEventHandler<Element>
  onCloseActivitySettings: () => void
  onGetProPlan: (context: { priorityContainerContext: PriorityContext }) => void
}

interface SettingsStates {
  isDeleteDialogOpen: boolean
  isPublicationDialogOpen: boolean
  isPrimaryActionLoading: boolean
  isSecondaryActionLoading: boolean
  isActionLoading: boolean
}

export default class Settings extends PureComponent<
  SettingsProps,
  SettingsStates
> {
  static features = (planStatus: PlanStatus) => ({
    ACTIVITIES_DELETE: new FeatureStatus({
      features: features,
      featureName: 'ACTIVITIES_DELETE',
      planStatus: planStatus,
    }),
    ACTIVITIES_OVERVIEW: new FeatureStatus({
      features: features,
      featureName: 'ACTIVITIES_OVERVIEW',
      planStatus: planStatus,
    }),
    ACTIVITIES_REPORT: new FeatureStatus({
      features: features,
      featureName: 'ACTIVITIES_REPORT',
      planStatus: planStatus,
    }),
    ACTIVITIES_EXPORT_JSON: new FeatureStatus({
      features: features,
      featureName: 'ACTIVITIES_EXPORT_JSON',
      planStatus: planStatus,
    }),
    ACTIVITIES_PUBLISH: new FeatureStatus({
      features: features,
      featureName: 'ACTIVITIES_PUBLISH',
      planStatus: planStatus,
    }),
    ACTIVITIES_RUN: new FeatureStatus({
      features: features,
      featureName: 'ACTIVITIES_RUN',
      planStatus: planStatus,
    }),
    PUBLICATION: new FeatureStatus({
      features: features,
      featureName: 'PUBLICATION',
      planStatus: planStatus,
    }),
    SETTINGS_GLOBAL: new FeatureStatus({
      features: features,
      featureName: 'SETTINGS_GLOBAL',
      planStatus: planStatus,
    }),
    SETTINGS_TYPES: new FeatureStatus({
      features: features,
      featureName: 'SETTINGS_TYPES',
      planStatus: planStatus,
    }),
    SETTINGS_TIMER: new FeatureStatus({
      features: features,
      featureName: 'SETTINGS_TIMER',
      planStatus: planStatus,
    }),
    HISTORY: new FeatureStatus({
      features: features,
      featureName: 'HISTORY',
      planStatus: planStatus,
    }),
  })

  constructor(props: SettingsProps) {
    super(props)
    this.state = {
      isDeleteDialogOpen: false,
      isPublicationDialogOpen: false,
      isPrimaryActionLoading: false,
      isSecondaryActionLoading: false,
      isActionLoading: false,
    }
  }

  // Lifecycle
  componentDidMount = () => {
    window.addEventListener('message', this.handleMessage)
  }

  componentWillUnmount = () => {
    window.removeEventListener('message', this.handleMessage)
  }

  // Handlers
  handleMessage = (e: MessageEvent) => {
    const actions: ActionsList = {
      STOP_LOADER: () =>
        this.setState({
          isActionLoading: false,
        }),
      DEFAULT: () => null,
    }

    return actions[e.data.pluginMessage?.type ?? 'DEFAULT']?.()
  }

  // Direct actions
  onAddReport = () => {
    const sortedSessionsData = this.props.sessions
      .map((session) => {
        const ideas = this.props.ideas.filter(
          (idea) => idea.sessionId === session.id
        )
        const sortedIdeas = sortIdeas(ideas, this.props.activity.groupedBy)
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
        if (ideas.length === 0) return null
        return {
          session: session,
          ideas: sortedIdeas,
          participants: setParticipantsList(ideas),
          stringifiedChart: stringifiedChart,
        }
      })
      .filter((session) => session !== null)
      .sort(
        (a, b) =>
          new Date(a.session.metrics.startDate).getTime() -
          new Date(b.session.metrics.startDate).getTime()
      )

    parent.postMessage(
      {
        pluginMessage: {
          type: 'ADD_REPORT_TO_SLIDES',
          data: {
            activity: this.props.activity,
            sessions: sortedSessionsData,
          },
        },
      },
      '*'
    )

    this.setState({
      isActionLoading: true,
    })
  }

  // Templates
  History = () => {
    return (
      <Feature
        isActive={Settings.features(this.props.planStatus).HISTORY.isActive()}
      >
        <Section
          title={
            <SimpleItem
              leftPartSlot={
                <SectionTitle
                  label={locals[this.props.lang].settings.history.title}
                  indicator={this.props.sessions.length}
                />
              }
              isListItem={false}
            />
          }
          body={[
            {
              node: (
                <ul>
                  {this.props.sessions
                    .sort(
                      (a, b) =>
                        new Date(b.metrics.startDate).getTime() -
                        new Date(a.metrics.startDate).getTime()
                    )
                    .map((session, index) => (
                      <SimpleItem
                        key={index}
                        id={session.id}
                        leftPartSlot={
                          <div
                            style={{
                              paddingLeft: 'var(--size-xxsmall)',
                            }}
                            className={`${layouts['snackbar--large']}`}
                          >
                            <span
                              className={`${texts['type']} ${texts['type--truncated']} type`}
                              style={{ flex: '0 0 200px' }}
                            >
                              {setFriendlyDate(
                                session.metrics.startDate,
                                this.props.lang,
                                'RELATIVE'
                              )}
                            </span>
                            <span
                              className={`${texts['type']} ${texts['type--secondary']} type`}
                              style={{ flex: '0 0 auto' }}
                            >
                              {`${session.metrics.participants} ${session.metrics.participants > 1 ? locals[this.props.lang].settings.history.participants.plural : locals[this.props.lang].settings.history.participants.single}・${session.metrics.ideas} ${session.metrics.ideas > 1 ? locals[this.props.lang].settings.history.ideas.plural : locals[this.props.lang].settings.history.ideas.single}`}
                            </span>
                          </div>
                        }
                        rightPartSlot={
                          <Icon
                            type="PICTO"
                            iconName="forward"
                          />
                        }
                        alignment="CENTER"
                        isInteractive={true}
                        action={this.props.onOpenSessionHistory}
                      />
                    ))}
                </ul>
              ),
              spacingModifier: 'NONE',
            },
          ]}
          border={undefined}
        />
      </Feature>
    )
  }

  render() {
    return (
      <div className="controls__control">
        <Bar
          leftPartSlot={
            <div className={layouts['snackbar--tight']}>
              <Button
                type="icon"
                icon="back"
                feature="BACK"
                action={this.props.onCloseActivitySettings}
              />
              <span className={`${texts['type']} type`}>
                {this.props.activity.name}
              </span>
              {this.props.activity.meta.publicationStatus.isShared && (
                <Chip state="ACTIVE">
                  {locals[this.props.lang].publication.statusPublished}
                </Chip>
              )}
            </div>
          }
          rightPartSlot={
            <div className={layouts['snackbar--medium']}>
              <Menu
                type="ICON"
                icon="ellipses"
                options={[
                  {
                    label: locals[this.props.lang].settings.actions.overview,
                    type: 'OPTION',
                    isActive: Settings.features(
                      this.props.planStatus
                    ).ACTIVITIES_OVERVIEW.isActive(),
                    isBlocked: Settings.features(
                      this.props.planStatus
                    ).ACTIVITIES_OVERVIEW.isBlocked(),
                    isNew: Settings.features(
                      this.props.planStatus
                    ).ACTIVITIES_OVERVIEW.isNew(),
                    action: () => {
                      this.setState({
                        isActionLoading: true,
                      })

                      parent.postMessage(
                        {
                          pluginMessage: {
                            type: 'ADD_OVERVIEW_TO_SLIDES',
                            data: {
                              activity: this.props.activity,
                            },
                          },
                        },
                        '*'
                      )
                    },
                  },
                  {
                    label: locals[this.props.lang].settings.actions.report,
                    type: 'OPTION',
                    isActive:
                      Settings.features(
                        this.props.planStatus
                      ).ACTIVITIES_REPORT.isActive() &&
                      this.props.editorType === 'slides',
                    isBlocked: Settings.features(
                      this.props.planStatus
                    ).ACTIVITIES_REPORT.isBlocked(),
                    isNew: Settings.features(
                      this.props.planStatus
                    ).ACTIVITIES_REPORT.isNew(),
                    action: () => this.onAddReport(),
                  },
                  {
                    label: locals[this.props.lang].settings.actions.exportJson,
                    type: 'OPTION',
                    isActive: Settings.features(
                      this.props.planStatus
                    ).ACTIVITIES_EXPORT_JSON.isActive(),
                    isBlocked: Settings.features(
                      this.props.planStatus
                    ).ACTIVITIES_EXPORT_JSON.isBlocked(),
                    isNew: Settings.features(
                      this.props.planStatus
                    ).ACTIVITIES_EXPORT_JSON.isNew(),
                    action: () => null,
                  },
                  {
                    type: 'SEPARATOR',
                  },
                  {
                    label: locals[this.props.lang].settings.actions.delete,
                    type: 'OPTION',
                    isActive: Settings.features(
                      this.props.planStatus
                    ).ACTIVITIES_DELETE.isActive(),
                    isBlocked: Settings.features(
                      this.props.planStatus
                    ).ACTIVITIES_DELETE.isBlocked(),
                    isNew: Settings.features(
                      this.props.planStatus
                    ).ACTIVITIES_DELETE.isNew(),
                    action: () => this.setState({ isDeleteDialogOpen: true }),
                  },
                ]}
                alignment="BOTTOM_RIGHT"
                state={this.state.isActionLoading ? 'LOADING' : 'DEFAULT'}
              />
              <Feature
                isActive={Settings.features(
                  this.props.planStatus
                ).ACTIVITIES_PUBLISH.isActive()}
              >
                {this.props.activity.meta.publicationStatus.isPublished ? (
                  <Button
                    type="secondary"
                    label={
                      this.props.userSession.userId ===
                      this.props.activity.meta.creatorIdentity.id
                        ? locals[this.props.lang].settings.actions.publish
                        : locals[this.props.lang].settings.actions.synchronize
                    }
                    isBlocked={Settings.features(
                      this.props.planStatus
                    ).ACTIVITIES_PUBLISH.isBlocked()}
                    isNew={Settings.features(
                      this.props.planStatus
                    ).ACTIVITIES_PUBLISH.isNew()}
                    action={() =>
                      this.setState({ isPublicationDialogOpen: true })
                    }
                  />
                ) : (
                  <Button
                    type="secondary"
                    label={locals[this.props.lang].settings.actions.publish}
                    isBlocked={Settings.features(
                      this.props.planStatus
                    ).ACTIVITIES_PUBLISH.isBlocked()}
                    isNew={Settings.features(
                      this.props.planStatus
                    ).ACTIVITIES_PUBLISH.isNew()}
                    action={() =>
                      this.setState({ isPublicationDialogOpen: true })
                    }
                  />
                )}
              </Feature>
              <Feature
                isActive={Settings.features(
                  this.props.planStatus
                ).ACTIVITIES_RUN.isActive()}
              >
                <Button
                  type="primary"
                  label={locals[this.props.lang].sessions.newSession}
                  feature="SESSION_RUN"
                  isBlocked={Settings.features(
                    this.props.planStatus
                  ).ACTIVITIES_RUN.isReached(this.props.sessionCount)}
                  isNew={Settings.features(
                    this.props.planStatus
                  ).ACTIVITIES_RUN.isNew()}
                  action={() =>
                    this.props.onRunSession(this.props.activity.meta.id)
                  }
                />
              </Feature>
            </div>
          }
          border={['BOTTOM']}
        ></Bar>
        <Feature
          isActive={
            Settings.features(
              this.props.planStatus
            ).ACTIVITIES_DELETE.isActive() && this.state.isDeleteDialogOpen
          }
        >
          {document.getElementById('modal') &&
            createPortal(
              <Dialog
                title={
                  locals[this.props.lang].settings.deleteActivityDialog.title
                }
                actions={{
                  destructive: {
                    label:
                      locals[this.props.lang].settings.deleteActivityDialog
                        .delete,
                    feature: 'DELETE_ACTIVITY',
                    action: this.props.onChangeActivities,
                  },
                  secondary: {
                    label:
                      locals[this.props.lang].settings.deleteActivityDialog
                        .cancel,
                    action: () => this.setState({ isDeleteDialogOpen: false }),
                  },
                }}
                onClose={() => this.setState({ isDeleteDialogOpen: false })}
              >
                <div className="dialog__text">
                  <p className={`type ${texts.type}`}>
                    {locals[
                      this.props.lang
                    ].settings.deleteActivityDialog.message.replace(
                      '$1',
                      this.props.activity.name
                    )}
                  </p>
                </div>
              </Dialog>,
              document.getElementById('modal') ?? document.createElement('app')
            )}
        </Feature>
        <Feature
          isActive={
            Settings.features(this.props.planStatus).PUBLICATION.isActive() &&
            this.state.isPublicationDialogOpen
          }
        >
          {this.props.userSession.connectionStatus === 'UNCONNECTED' &&
          document.getElementById('modal') ? (
            createPortal(
              <Dialog
                title={locals[this.props.lang].publication.titleSignIn}
                actions={{
                  primary: {
                    label: locals[this.props.lang].publication.signIn,
                    state: this.state.isPrimaryActionLoading
                      ? 'LOADING'
                      : 'DEFAULT',
                    action: async () => {
                      this.setState({ isPrimaryActionLoading: true })
                      signIn(this.props.userIdentity.id)
                        .then(() => {
                          trackSignInEvent(
                            this.props.userIdentity.id,
                            this.props.userConsent.find(
                              (consent) => consent.id === 'mixpanel'
                            )?.isConsented ?? false
                          )
                        })
                        .finally(() => {
                          this.setState({ isPrimaryActionLoading: false })
                        })
                        .catch((error) => {
                          parent.postMessage(
                            {
                              pluginMessage: {
                                type: 'SEND_MESSAGE',
                                message:
                                  error.message === 'Authentication timeout'
                                    ? locals[this.props.lang].error.timeout
                                    : locals[this.props.lang].error
                                        .authentication,
                              },
                            },
                            '*'
                          )
                        })
                    },
                  },
                }}
                onClose={() =>
                  this.setState({ isPublicationDialogOpen: false })
                }
              >
                <div className="dialog__cover">
                  <img
                    src={p}
                    style={{
                      width: '100%',
                    }}
                  />
                </div>
                <div className="dialog__text">
                  <p className={`type ${texts.type}`}>
                    {locals[this.props.lang].publication.message}
                  </p>
                </div>
              </Dialog>,
              document.getElementById('modal') ?? document.createElement('app')
            )
          ) : (
            <Publication
              {...this.props}
              isPrimaryActionLoading={this.state.isPrimaryActionLoading}
              isSecondaryActionLoading={this.state.isSecondaryActionLoading}
              onLoadPrimaryAction={(e) =>
                this.setState({ isPrimaryActionLoading: e })
              }
              onLoadSecondaryAction={(e) =>
                this.setState({ isSecondaryActionLoading: e })
              }
              onClosePublication={() =>
                this.setState({ isPublicationDialogOpen: false })
              }
            />
          )}
        </Feature>
        <div className="control__block control__block--no-padding">
          <Feature
            isActive={Settings.features(
              this.props.planStatus
            ).SETTINGS_GLOBAL.isActive()}
          >
            <GlobalSettings {...this.props} />
          </Feature>
          <Feature
            isActive={Settings.features(
              this.props.planStatus
            ).SETTINGS_TIMER.isActive()}
          >
            <TimerSettings {...this.props} />
          </Feature>
          <Feature
            isActive={Settings.features(
              this.props.planStatus
            ).SETTINGS_TYPES.isActive()}
          >
            <TypesSettings {...this.props} />
          </Feature>
          {this.props.sessions.length > 0 && <this.History />}
        </div>
      </div>
    )
  }
}
