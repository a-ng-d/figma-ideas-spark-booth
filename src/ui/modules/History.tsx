import {
  Bar,
  Button,
  Dialog,
  Dropdown,
  DropdownOption,
  Menu,
  Message,
  SimpleItem,
  layouts,
  texts,
} from '@a_ng_d/figmug-ui'
import React from 'react'
import { locals } from '../../content/locals'
import { Language, PlanStatus } from '../../types/app'
import {
  ActivityConfiguration,
  IdeaConfiguration,
} from '../../types/configurations'
import features from '../../utils/config'
import isBlocked from '../../utils/isBlocked'
import setFriendlyDate from '../../utils/setFriendlyDate'
import Feature from '../components/Feature'
import { ActionsList } from '../../types/models'
import FileSaver from 'file-saver'

interface HistoryProps {
  activity: ActivityConfiguration
  sessionId: string
  sessionDate: string | Date
  ideas: Array<IdeaConfiguration>
  planStatus: PlanStatus
  lang: Language
  onDeleteSession: (sessionId: string) => void
  onCloseSessionHistory: () => void
}

interface HistoryStates {
  ideas: Array<IdeaConfiguration>
  sortedBy: 'MOST_RECENT' | 'OLDEST'
  filteredBy: string
  isDialogOpen: boolean
}

export default class History extends React.Component<HistoryProps, HistoryStates> {
  constructor(props: HistoryProps) {
    super(props)
    this.state = {
      ideas: props.ideas.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
      sortedBy: 'MOST_RECENT',
      filteredBy: 'NONE',
      isDialogOpen: false,
    }
  }

  componentDidMount = () => {
    onmessage = (e: MessageEvent) => {
      const exportCsv = (data: string) => {
        const blob = new Blob([data], {
          type: 'text/csv;charset=utf-8',
        })
        FileSaver.saveAs(
          blob,
          `${this.props.activity.name}_${this.props.sessionDate}.csv`
        )
      }

      const actions: ActionsList = {
        EXPORT_CSV: () => exportCsv(e.data.pluginMessage?.data),
        DEFAULT: () => null,
      }

      return actions[e.data.pluginMessage?.type ?? 'DEFAULT']?.()
    }
  }

  // Handlers
  typesHandler = (): Array<DropdownOption> => {
    const types = Object.entries(
      this.props.ideas.reduce(
        (acc: { [key: string]: IdeaConfiguration[] }, idea) => {
          const { type } = idea
          if (!acc[type.color]) {
            acc[type.color] = []
          }
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
                  if (this.state.sortedBy === 'MOST_RECENT') {
                    return this.onSortMostRecent(
                      this.props.ideas.filter(
                        (idea) => idea.type.id === entries[1][0].type.id
                      )
                    )
                  }
                  if (this.state.sortedBy === 'OLDEST') {
                    return this.onSortMostRecent(
                      this.props.ideas.filter(
                        (idea) => idea.type.id === entries[1][0].type.id
                      )
                    )
                  }
                  return []
                })() || [],
            }),
        } as DropdownOption
      })

    const participants = Object.entries(
      this.props.ideas.reduce(
        (acc: { [key: string]: IdeaConfiguration[] }, idea) => {
          const { userIdentity } = idea
          if (!acc[userIdentity.fullName]) {
            acc[userIdentity.fullName] = []
          }
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
          position: 0,
          type: 'OPTION',
          isActive: true,
          isBlocked: false,
          isNew: false,
          children: [],
          action: () =>
            this.setState({
              filteredBy: entries[1][0].userIdentity.id,
              ideas:
                (() => {
                  if (this.state.sortedBy === 'MOST_RECENT') {
                    return this.onSortMostRecent(
                      this.props.ideas.filter(
                        (idea) =>
                          idea.userIdentity.id === entries[1][0].userIdentity.id
                      )
                    )
                  }
                  if (this.state.sortedBy === 'OLDEST') {
                    return this.onSortMostRecent(
                      this.props.ideas.filter(
                        (idea) =>
                          idea.userIdentity.id === entries[1][0].userIdentity.id
                      )
                    )
                  }
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
                if (this.state.sortedBy === 'MOST_RECENT') {
                  return this.onSortMostRecent(this.props.ideas)
                }
                if (this.state.sortedBy === 'OLDEST') {
                  return this.onSortMostRecent(this.props.ideas)
                }
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
                {setFriendlyDate(this.props.sessionDate, 'en-US')}
              </span>
            </div>
          }
          rightPartSlot={
            <div className={layouts['snackbar--tight']}>
              <Feature
                isActive={
                  features.find((feature) => feature.name === 'HISTORY_SORT')
                    ?.isActive && this.props.ideas.length > 0
                }
              >
                <Dropdown
                  id="sort-ideas"
                  options={[
                    {
                      label: locals[this.props.lang].history.sort.recent,
                      value: 'MOST_RECENT',
                      feature: 'UPDATE_COLOR',
                      position: 0,
                      type: 'OPTION',
                      isActive: true,
                      isBlocked: false,
                      isNew: false,
                      children: [],
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
                      position: 0,
                      type: 'OPTION',
                      isActive: true,
                      isBlocked: false,
                      isNew: false,
                      children: [],
                      action: () => {
                        this.setState({
                          sortedBy: 'OLDEST',
                          ideas: this.onSortOldest(this.state.ideas) || [],
                        })
                      },
                    },
                  ]}
                  selected={this.state.sortedBy}
                  isDisabled={isBlocked('HISTORY_SORT', this.props.planStatus)}
                  alignment="RIGHT"
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
                      isActive: features.find(
                        (feature) => feature.name === 'HISTORY_EXPORT_CSV'
                      )?.isActive,
                      isBlocked: isBlocked(
                        'HISTORY_EXPORT_CSV',
                        this.props.planStatus
                      ),
                      isNew: features.find(
                        (feature) => feature.name === 'HISTORY_EXPORT_CSV'
                      )?.isNew,
                      action: () => {
                        parent.postMessage(
                          {
                            pluginMessage: {
                              type: 'EXPORT_CSV',
                              data: {
                                activity: this.props.activity,
                                sessionDate: this.props.sessionDate,
                                ideas: this.props.ideas,
                              },
                            },
                          },
                          '*'
                        )
                      },
                    },
                    {
                      label: locals[this.props.lang].history.deleteSession,
                      type: 'OPTION',
                      isActive: features.find(
                        (feature) => feature.name === 'HISTORY_DELETE'
                      )?.isActive,
                      isBlocked: isBlocked(
                        'HISTORY_DELETE',
                        this.props.planStatus
                      ),
                      isNew: features.find(
                        (feature) => feature.name === 'HISTORY_DELETE'
                      )?.isNew,
                      action: () => this.setState({ isDialogOpen: true }),
                    },
                  ]}
                  alignment="BOTTOM_RIGHT"
                />
              ) : (
                <Feature
                  isActive={
                    features.find(
                      (feature) => feature.name === 'HISTORY_DELETE'
                    )?.isActive
                  }
                >
                  <Button
                    type="icon"
                    icon="trash"
                    feature="DELETE_SESSION"
                    isBlocked={isBlocked(
                      'HISTORY_DELETE',
                      this.props.planStatus
                    )}
                    action={() => this.setState({ isDialogOpen: true })}
                  />
                </Feature>
              )}
              <Feature
                isActive={
                  features.find((feature) => feature.name === 'HISTORY_FILTER')
                    ?.isActive && this.props.ideas.length > 0
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
                  features.find(
                    (feature) => feature.name === 'HISTORY_ADD_TO_BOARD'
                  )?.isActive && this.props.ideas.length > 0
                }
              >
                <Button
                  type="secondary"
                  label={locals[this.props.lang].history.addToBoard}
                  isBlocked={isBlocked(
                    'HISTORY_ADD_TO_BOARD',
                    this.props.planStatus
                  )}
                  action={() => {
                    parent.postMessage(
                      {
                        pluginMessage: {
                          type: 'ADD_TO_BOARD',
                          data: {
                            activity: this.props.activity,
                            sessionDate: this.props.sessionDate,
                            ideas: this.props.ideas,
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
            features.find((feature) => feature.name === 'ACTIVITIES_DELETE')
              ?.isActive && this.state.isDialogOpen
          }
        >
          <Dialog
            title={locals[this.props.lang].settings.deleteSessionDialog.title}
            actions={{
              destructive: {
                label:
                  locals[this.props.lang].settings.deleteSessionDialog.delete,
                action: () => this.props.onDeleteSession(this.props.sessionId),
              },
              secondary: {
                label:
                  locals[this.props.lang].settings.deleteSessionDialog.cancel,
                action: () => this.setState({ isDialogOpen: false }),
              },
            }}
            onClose={() => this.setState({ isDialogOpen: false })}
          >
            <div className="dialog__text">
              <p className={`type ${texts.type}`}>
                {locals[
                  this.props.lang
                ].settings.deleteSessionDialog.message.replace(
                  '$1',
                  setFriendlyDate(this.props.sessionDate, 'en-US')
                )}
              </p>
            </div>
          </Dialog>
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
                        style={{ flex: '0 0 64px' }}
                      >
                        <div
                          className="color-chip"
                          style={{ backgroundColor: idea.type.hex }}
                        ></div>
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
            <div className="onboarding__callout--centered">
              <Message
                icon="info"
                messages={[locals[this.props.lang].history.noIdea]}
              />
            </div>
          )}
        </div>
      </div>
    )
  }
}
