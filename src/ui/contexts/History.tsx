import {
  Bar,
  Button,
  Dialog,
  Dropdown,
  DropdownOption,
  layouts,
  Menu,
  SemanticMessage,
  SimpleItem,
  texts,
} from '@a_ng_d/figmug-ui'
import { Case, FeatureStatus } from '@a_ng_d/figmug-utils'
import FileSaver from 'file-saver'
import React from 'react'
import { createPortal, PureComponent } from 'preact/compat'
import features from '../../config'
import { locals } from '../../content/locals'
import { EditorType, Language, PlanStatus } from '../../types/app'
import {
  ActivityConfiguration,
  IdeaConfiguration,
  SessionConfiguration,
} from '../../types/configurations'
import { ActionsList } from '../../types/models'
import setFriendlyDate from '../../utils/setFriendlyDate'
import ColorChip from '../components/ColorChip'
import Feature from '../components/Feature'
import sortIdeas from '../../utils/sortIdeas'
import setBarChart from '../../utils/setBarChart'
import setParticipantsList from '../../utils/setParticipantsList'
import { chartSizes } from '../../canvas/partials/tokens'

interface HistoryProps {
  activity: ActivityConfiguration
  sessionId: string
  session: SessionConfiguration
  ideas: Array<IdeaConfiguration>
  editorType: EditorType
  planStatus: PlanStatus
  lang: Language
  onDeleteSession: (sessionId: string) => void
  onCloseSessionHistory: () => void
}

interface HistoryStates {
  ideas: Array<IdeaConfiguration>
  sortedBy: 'MOST_RECENT' | 'OLDEST'
  filteredBy: string
  isDeleteDialogOpen: boolean
  isSecondaryLoading: boolean
  isActionLoading: boolean
}

export default class History extends PureComponent<
  HistoryProps,
  HistoryStates
> {
  static features = (planStatus: PlanStatus) => ({
    HISTORY_FILTER: new FeatureStatus({
      features: features,
      featureName: 'HISTORY_FILTER',
      planStatus: planStatus,
    }),
    HISTORY_SORT: new FeatureStatus({
      features: features,
      featureName: 'HISTORY_SORT',
      planStatus: planStatus,
    }),
    HISTORY_EXPORT_CSV: new FeatureStatus({
      features: features,
      featureName: 'HISTORY_EXPORT_CSV',
      planStatus: planStatus,
    }),
    HISTORY_EXPORT_SESSION: new FeatureStatus({
      features: features,
      featureName: 'HISTORY_EXPORT_SESSION',
      planStatus: planStatus,
    }),
    HISTORY_ADD_TO_BOARD: new FeatureStatus({
      features: features,
      featureName: 'HISTORY_ADD_TO_BOARD',
      planStatus: planStatus,
    }),
    HISTORY_DELETE: new FeatureStatus({
      features: features,
      featureName: 'HISTORY_DELETE',
      planStatus: planStatus,
    }),
  })

  constructor(props: HistoryProps) {
    super(props)
    this.state = {
      ideas: props.ideas.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
      sortedBy: 'MOST_RECENT',
      filteredBy: 'NONE',
      isDeleteDialogOpen: false,
      isSecondaryLoading: false,
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
      EXPORT_CSV: () => this.onExportCsv(e.data.pluginMessage?.data),
      STOP_LOADER: () =>
        this.setState({
          isSecondaryLoading: false,
        }),
      DEFAULT: () => null,
    }

    return actions[e.data.pluginMessage?.type ?? 'DEFAULT']?.()
  }

  typesHandler = (): Array<DropdownOption> => {
    const types = Object.entries(
      this.props.ideas.reduce(
        (acc: { [key: string]: IdeaConfiguration[] }, idea) => {
          const { type } = idea
          if (!acc[type.color]) acc[type.color] = []

          acc[type.color].push(idea)
          return acc
        },
        {} as { [key: string]: IdeaConfiguration[] }
      )
    )
      .sort((a, b) => a[1][0].type.name.localeCompare(b[1][0].type.name))
      .map((entries) => {
        return {
          label: entries[1][0].type.name,
          value: entries[1][0].type.id,
          feature: 'FILTER_BY_TYPE',
          type: 'OPTION',
          action: () =>
            this.setState({
              filteredBy: entries[1][0].type.id,
              ideas:
                (() => {
                  if (this.state.sortedBy === 'MOST_RECENT')
                    return this.onSortMostRecent(
                      this.props.ideas.filter(
                        (idea) => idea.type.id === entries[1][0].type.id
                      )
                    )

                  if (this.state.sortedBy === 'OLDEST')
                    return this.onSortMostRecent(
                      this.props.ideas.filter(
                        (idea) => idea.type.id === entries[1][0].type.id
                      )
                    )

                  return []
                })() || [],
            }),
        } as DropdownOption
      })

    const participants = Object.entries(
      this.props.ideas.reduce(
        (acc: { [key: string]: IdeaConfiguration[] }, idea) => {
          const { userIdentity } = idea
          if (!acc[userIdentity.fullName]) acc[userIdentity.fullName] = []

          acc[userIdentity.fullName].push(idea)
          return acc
        },
        {} as { [key: string]: IdeaConfiguration[] }
      )
    )
      .sort((a, b) =>
        a[1][0].userIdentity.fullName.localeCompare(
          b[1][0].userIdentity.fullName
        )
      )
      .map((entries) => {
        return {
          label: entries[1][0].userIdentity.fullName,
          value: entries[1][0].userIdentity.id,
          feature: 'FILTER_BY_PARTICIPANT',
          type: 'OPTION',
          action: () =>
            this.setState({
              filteredBy: entries[1][0].userIdentity.id,
              ideas:
                (() => {
                  if (this.state.sortedBy === 'MOST_RECENT')
                    return this.onSortMostRecent(
                      this.props.ideas.filter(
                        (idea) =>
                          idea.userIdentity.id === entries[1][0].userIdentity.id
                      )
                    )

                  if (this.state.sortedBy === 'OLDEST')
                    return this.onSortMostRecent(
                      this.props.ideas.filter(
                        (idea) =>
                          idea.userIdentity.id === entries[1][0].userIdentity.id
                      )
                    )

                  return []
                })() || [],
            }),
        } as DropdownOption
      })
    return [
      {
        label: locals[this.props.lang].history.filter.none,
        value: 'NONE',
        type: 'OPTION',
        action: () =>
          this.setState({
            filteredBy: 'NONE',
            ideas:
              (() => {
                if (this.state.sortedBy === 'MOST_RECENT')
                  return this.onSortMostRecent(this.props.ideas)

                if (this.state.sortedBy === 'OLDEST')
                  return this.onSortMostRecent(this.props.ideas)

                return []
              })() || [],
          }),
      },
      {
        type: 'SEPARATOR',
      },
      {
        label: locals[this.props.lang].history.filter.types,
        value: 'TYPES',
        type: 'OPTION',
        children: types,
        action: () => null,
      },
      {
        label: locals[this.props.lang].history.filter.participants,
        value: 'PARTICIPANTS',
        type: 'OPTION',
        children: participants,
        action: () => null,
      },
    ]
  }

  // Direct Actions
  onSortMostRecent = (ideas: Array<IdeaConfiguration>) =>
    ideas.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

  onSortOldest = (ideas: Array<IdeaConfiguration>) =>
    ideas.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )

  onExportCsv = (data: string) => {
    this.setState({
      isActionLoading: false,
    })

    const blob = new Blob([data], {
      type: 'text/csv;charset=utf-8',
    })
    FileSaver.saveAs(
      blob,
      `${new Case(this.props.activity.name).doSnakeCase()}_${this.props.session.metrics.startDate}.csv`
    )
  }

  onExportJson = () => {
    this.setState({
      isActionLoading: true,
    })

    const json = JSON.stringify({
      session: this.props.session,
      ideas: this.props.ideas,
    })

    const blob = new Blob([json], {
      type: 'application/json;charset=utf-8',
    })
    FileSaver.saveAs(
      blob,
      `${new Case(this.props.activity.name).doSnakeCase()}_${this.props.session.metrics.startDate}.json`
    )

    this.setState({
      isActionLoading: false,
    })
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
                action={this.props.onCloseSessionHistory}
              />
              <span className={`${texts['type']} type`}>
                {setFriendlyDate(
                  this.props.session.metrics.startDate,
                  this.props.lang,
                  'RELATIVE'
                )}
              </span>
            </div>
          }
          rightPartSlot={
            <div className={layouts['snackbar--tight']}>
              <Feature
                isActive={
                  History.features(
                    this.props.planStatus
                  ).HISTORY_SORT.isActive() && this.props.ideas.length > 0
                }
              >
                <Dropdown
                  id="sort-ideas"
                  options={[
                    {
                      label: locals[this.props.lang].history.sort.recent,
                      value: 'MOST_RECENT',
                      feature: 'UPDATE_COLOR',
                      type: 'OPTION',
                      action: () => {
                        this.setState({
                          sortedBy: 'MOST_RECENT',
                          ideas: this.onSortMostRecent(this.state.ideas) || [],
                        })
                      },
                    },
                    {
                      label: locals[this.props.lang].history.sort.old,
                      value: 'OLDEST',
                      feature: 'UPDATE_COLOR',
                      type: 'OPTION',
                      action: () => {
                        this.setState({
                          sortedBy: 'OLDEST',
                          ideas: this.onSortOldest(this.state.ideas) || [],
                        })
                      },
                    },
                  ]}
                  selected={this.state.sortedBy}
                  isDisabled={History.features(
                    this.props.planStatus
                  ).HISTORY_SORT.isBlocked()}
                  isBlocked={History.features(
                    this.props.planStatus
                  ).HISTORY_SORT.isBlocked()}
                  isNew={History.features(
                    this.props.planStatus
                  ).HISTORY_SORT.isNew()}
                  alignment="RIGHT"
                  pin="TOP"
                />
              </Feature>
              {this.props.ideas.length > 0 ? (
                <Menu
                  type="ICON"
                  icon="ellipses"
                  options={[
                    {
                      label: locals[this.props.lang].history.exportCsv,
                      type: 'OPTION',
                      isActive: History.features(
                        this.props.planStatus
                      ).HISTORY_EXPORT_CSV.isActive(),
                      isBlocked: History.features(
                        this.props.planStatus
                      ).HISTORY_EXPORT_CSV.isBlocked(),
                      isNew: History.features(
                        this.props.planStatus
                      ).HISTORY_EXPORT_CSV.isNew(),
                      action: () => {
                        this.setState({
                          isActionLoading: true,
                        })

                        parent.postMessage(
                          {
                            pluginMessage: {
                              type: 'EXPORT_CSV',
                              data: {
                                activity: this.props.activity,
                                sessionDate:
                                  this.props.session.metrics.startDate,
                                ideas: this.props.ideas,
                              },
                            },
                          },
                          '*'
                        )
                      },
                    },
                    {
                      label: locals[this.props.lang].history.exportSession,
                      type: 'OPTION',
                      isActive: History.features(
                        this.props.planStatus
                      ).HISTORY_EXPORT_SESSION.isActive(),
                      isBlocked: History.features(
                        this.props.planStatus
                      ).HISTORY_EXPORT_SESSION.isBlocked(),
                      isNew: History.features(
                        this.props.planStatus
                      ).HISTORY_EXPORT_SESSION.isNew(),
                      action: () => this.onExportJson(),
                    },
                    {
                      type: 'SEPARATOR',
                    },
                    {
                      label: locals[this.props.lang].history.deleteSession,
                      type: 'OPTION',
                      isActive: History.features(
                        this.props.planStatus
                      ).HISTORY_DELETE.isActive(),
                      isBlocked: History.features(
                        this.props.planStatus
                      ).HISTORY_DELETE.isBlocked(),
                      isNew: History.features(
                        this.props.planStatus
                      ).HISTORY_DELETE.isNew(),
                      action: () => this.setState({ isDeleteDialogOpen: true }),
                    },
                  ]}
                  alignment="BOTTOM_RIGHT"
                  state={this.state.isActionLoading ? 'LOADING' : 'DEFAULT'}
                />
              ) : (
                <Feature
                  isActive={History.features(
                    this.props.planStatus
                  ).HISTORY_DELETE.isActive()}
                >
                  <Button
                    type="icon"
                    icon="trash"
                    feature="DELETE_SESSION"
                    isBlocked={History.features(
                      this.props.planStatus
                    ).HISTORY_DELETE.isBlocked()}
                    isNew={History.features(
                      this.props.planStatus
                    ).HISTORY_DELETE.isNew()}
                    action={() => this.setState({ isDeleteDialogOpen: true })}
                  />
                </Feature>
              )}
              <Feature
                isActive={
                  History.features(
                    this.props.planStatus
                  ).HISTORY_FILTER.isActive() && this.props.ideas.length > 0
                }
              >
                <Menu
                  id="filter-ideas"
                  type="ICON"
                  icon="filter"
                  options={this.typesHandler()}
                  selected={this.state.filteredBy}
                  isNew={this.state.filteredBy !== 'NONE'}
                  alignment="BOTTOM_RIGHT"
                />
              </Feature>
              <Feature
                isActive={
                  History.features(
                    this.props.planStatus
                  ).HISTORY_ADD_TO_BOARD.isActive() &&
                  this.props.ideas.length > 0
                }
              >
                <Button
                  type="secondary"
                  label={
                    this.props.editorType === 'figjam'
                      ? locals[this.props.lang].history.addToBoard
                      : locals[this.props.lang].history.addToSlides
                  }
                  isLoading={this.state.isSecondaryLoading}
                  isBlocked={History.features(
                    this.props.planStatus
                  ).HISTORY_ADD_TO_BOARD.isBlocked()}
                  isNew={History.features(
                    this.props.planStatus
                  ).HISTORY_ADD_TO_BOARD.isNew()}
                  action={() => {
                    this.setState({
                      isSecondaryLoading: true,
                    })

                    const sortedIdeas = sortIdeas(
                      this.props.ideas,
                      this.props.activity.groupedBy
                    )
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
                          type:
                            this.props.editorType === 'figjam'
                              ? 'ADD_TO_BOARD'
                              : 'ADD_SESSION_TO_SLIDES',
                          data: {
                            activity: this.props.activity,
                            session: this.props.session,
                            ideas: sortedIdeas,
                            participants: setParticipantsList(this.props.ideas),
                            stringifiedChart: stringifiedChart,
                          },
                        },
                      },
                      '*'
                    )
                  }}
                />
              </Feature>
            </div>
          }
          border={['BOTTOM']}
        ></Bar>
        <Feature
          isActive={
            History.features(this.props.planStatus).HISTORY_DELETE.isActive() &&
            this.state.isDeleteDialogOpen
          }
        >
          {document.getElementById('modal') &&
            createPortal(
              <Dialog
                title={
                  locals[this.props.lang].history.deleteSessionDialog.title
                }
                actions={{
                  destructive: {
                    label:
                      locals[this.props.lang].history.deleteSessionDialog
                        .delete,
                    action: () =>
                      this.props.onDeleteSession(this.props.sessionId),
                  },
                  secondary: {
                    label:
                      locals[this.props.lang].history.deleteSessionDialog
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
                    ].history.deleteSessionDialog.message.replace(
                      '$1',
                      setFriendlyDate(
                        this.props.session.metrics.startDate,
                        this.props.lang,
                        'RELATIVE'
                      )
                    )}
                  </p>
                </div>
              </Dialog>,
              document.getElementById('modal') ?? document.createElement('app')
            )}
        </Feature>
        <div className="control__block">
          {this.state.ideas.length > 0 ? (
            <ul
              style={{
                padding: '0 var(--size-xxsmall)',
              }}
            >
              {this.state.ideas.map((idea, index) => (
                <SimpleItem
                  key={index}
                  leftPartSlot={
                    <div
                      className={`${layouts['snackbar--medium']} ${layouts['snackbar--start']}`}
                      style={{
                        flex: '1',
                      }}
                    >
                      <div
                        className={`${layouts['snackbar--tight']}`}
                        style={{ flex: '0 0 128px' }}
                      >
                        <ColorChip color={idea.type.hex} />
                        <span
                          className={`${texts['type']} ${texts['type--secondary']} ${texts['type--truncated']} type`}
                        >
                          {idea.type.name}
                        </span>
                      </div>
                      <div className={`${texts['type']} type`}>{idea.text}</div>
                    </div>
                  }
                  rightPartSlot={
                    <div className="user">
                      <span
                        className={`${texts['type']} ${texts['type--secondary']} type`}
                      >
                        {idea.userIdentity.fullName}
                      </span>
                      <div className="user__avatar">
                        <img
                          src={idea.userIdentity.avatar}
                          alt={idea.userIdentity.fullName}
                        />
                      </div>
                    </div>
                  }
                />
              ))}
            </ul>
          ) : (
            <div className="callout--centered">
              <SemanticMessage
                type="NEUTRAL"
                message={locals[this.props.lang].history.noIdea}
              />
            </div>
          )}
        </div>
      </div>
    )
  }
}
