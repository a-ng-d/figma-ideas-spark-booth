import {
  Bar,
  Button,
  Dropdown,
  DropdownOption,
  SimpleItem,
  layouts,
  texts,
} from '@a_ng_d/figmug-ui'
import React from 'react'

import { locals } from '../../content/locals'
import { Language, PlanStatus } from '../../types/app'
import { IdeaConfiguration } from '../../types/configurations'
import features from '../../utils/config'
import isBlocked from '../../utils/isBlocked'
import setFriendlyDate from '../../utils/setFriendlyDate'
import Feature from '../components/Feature'

interface HistoryProps {
  sessionDate: string | Date
  ideas: Array<IdeaConfiguration>
  planStatus: PlanStatus
  lang: Language
  onRemoveSession: React.MouseEventHandler<Element> &
    React.KeyboardEventHandler<Element>
  onCloseSessionHistory: () => void
}

interface HistoryStates {
  ideas: Array<IdeaConfiguration>
  sortedBy: 'MOST_RECENT' | 'OLDEST'
  filteredBy: string
}

export default class History extends React.Component<
  HistoryProps,
  HistoryStates
> {
  constructor(props: HistoryProps) {
    super(props)
    this.state = {
      ideas: props.ideas.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
      sortedBy: 'MOST_RECENT',
      filteredBy: 'ALL',
    }
  }

  // Handlers
  typesHandler = () => {
    const all: DropdownOption = {
      label: 'All',
      value: 'ALL',
      feature: 'FILTER_BY_TYPE',
      position: 0,
      type: 'OPTION',
      isActive: true,
      isBlocked: false,
      isNew: false,
      children: [],
      action: () =>
        this.setState({
          filteredBy: 'ALL',
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
    }
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
          position: 0,
          type: 'OPTION',
          isActive: true,
          isBlocked: false,
          isNew: false,
          children: [],
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
    return [all, ...types]
  }

  onSortMostRecent = (ideas: Array<IdeaConfiguration>) =>
    ideas.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )

  onSortOldest = (ideas: Array<IdeaConfiguration>) =>
    ideas.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
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
                  features.find((feature) => feature.name === 'HISTORY_FILTER')
                    ?.isActive
                }
              >
                <Dropdown
                  id="sort-ideas"
                  options={this.typesHandler()}
                  selected={this.state.filteredBy}
                  alignment="RIGHT"
                />
              </Feature>
              <Feature
                isActive={
                  features.find((feature) => feature.name === 'HISTORY_SORT')
                    ?.isActive
                }
              >
                <Dropdown
                  id="sort-ideas"
                  options={[
                    {
                      label: 'Most recent',
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
                      label: 'Oldest',
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
                  alignment="RIGHT"
                />
              </Feature>
              <Feature
                isActive={
                  features.find((feature) => feature.name === 'HISTORY_REMOVE')
                    ?.isActive
                }
              >
                <Button
                  type="icon"
                  icon="trash"
                  feature="REMOVE_SESSION"
                  action={this.props.onRemoveSession}
                />
              </Feature>
            </div>
          }
          border={['BOTTOM']}
        ></Bar>
        <div className="control__block control__block--no-padding">
          <ul>
            {this.state.ideas.map((idea, index) => (
              <SimpleItem
                key={index}
                leftPartSlot={
                  <div className={layouts['snackbar--tight']}>
                    <span className="type">{idea.text}</span>
                  </div>
                }
                rightPartSlot={
                  <div className={layouts['snackbar--tight']}>
                    <span className="type">{idea.userIdentity.fullName}</span>
                  </div>
                }
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }
}
