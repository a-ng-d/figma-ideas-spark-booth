import {
  Bar,
  Button,
  Dialog,
  Dropdown,
  FormItem,
  Icon,
  Input,
  SectionTitle,
  SimpleItem,
  SortableList,
  layouts,
  texts,
} from '@a_ng_d/figmug-ui'
import React from 'react'
import { uid } from 'uid'
import { locals } from '../../content/locals'
import { Language, PlanStatus } from '../../types/app'
import {
  ActivityConfiguration,
  ColorConfiguration,
  IdeaConfiguration,
  SessionConfiguration,
  TypeConfiguration,
} from '../../types/configurations'
import { ActionsList } from '../../types/models'
import features, {
  blueColor,
  grayColor,
  greenColor,
  lightGrayColor,
  orangeColor,
  pinkColor,
  redColor,
  violetColor,
  yellowColor,
} from '../../utils/config'
import isBlocked from '../../utils/isBlocked'
import setFriendlyDate from '../../utils/setFriendlyDate'
import Feature from '../components/Feature'
import { UserSession } from '../../types/user'
import publishActivity from '../../bridges/publication/publishActivity'

interface SettingsProps {
  activity: ActivityConfiguration
  sessions: Array<SessionConfiguration>
  ideas: Array<IdeaConfiguration>
  userSession: UserSession
  planStatus: PlanStatus
  lang: Language
  onChangeActivities: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | Element>
      | React.KeyboardEvent<
          HTMLInputElement | HTMLTextAreaElement | Element | HTMLLIElement
        >
      | React.MouseEvent<HTMLLIElement | Element, MouseEvent>
  ) => void
  onChangeTypes: (types: Array<TypeConfiguration>) => void
  onRunSession: (id: string) => void
  onOpenSessionHistory: React.MouseEventHandler<Element> &
    React.KeyboardEventHandler<Element>
  onCloseActivitySettings: () => void
}

interface SettingsStates {
  isDialogOpen: boolean
  isPrimaryActionLoading: boolean
}

export default class Settings extends React.Component<
  SettingsProps,
  SettingsStates
> {
  constructor(props: SettingsProps) {
    super(props)
    this.state = {
      isDialogOpen: false,
      isPrimaryActionLoading: false,
    }
  }

  // Handlers
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  typeHandler = (e: any) => {
    let id: string | null
    const element: HTMLElement | null = (e.target as HTMLElement).closest(
        '.draggable-item'
      ),
      currentElement: HTMLInputElement = e.currentTarget

    element !== null ? (id = element.getAttribute('data-id')) : (id = null)

    const addType = () => {
      const hasAlreadyNewType = this.props.activity.types.filter((type) =>
        type.name.includes(locals[this.props.lang].settings.types.newType)
      )

      const types = this.props.activity.types.map((el) => el)
      types.push({
        name: `${locals[this.props.lang].settings.types.newType} ${hasAlreadyNewType.length + 1}`,
        color: 'YELLOW',
        hex: yellowColor,
        id: uid(),
        description: '',
      })
      this.props.onChangeTypes(types)
    }

    const renameType = () => {
      const types = this.props.activity.types.map((type) => {
        if (type.id === id) type.name = e.target.value
        return type
      })
      this.props.onChangeTypes(types)
    }

    const updateTypeColor = () => {
      const types = this.props.activity.types.map((type) => {
        if (type.id === id) {
          type.color = currentElement.dataset.value as ColorConfiguration
          if (currentElement.dataset.value === 'YELLOW') type.hex = yellowColor
          else if (currentElement.dataset.value === 'BLUE') type.hex = blueColor
          else if (currentElement.dataset.value === 'GREEN')
            type.hex = greenColor
          else if (currentElement.dataset.value === 'VIOLET')
            type.hex = violetColor
          else if (currentElement.dataset.value === 'RED') type.hex = redColor
          else if (currentElement.dataset.value === 'ORANGE')
            type.hex = orangeColor
          else if (currentElement.dataset.value === 'PINK') type.hex = pinkColor
          else if (currentElement.dataset.value === 'LIGHT_GRAY')
            type.hex = lightGrayColor
          else if (currentElement.dataset.value === 'GRAY') type.hex = grayColor
        }
        return type
      })
      this.props.onChangeTypes(types)
    }

    const updateTypeDescription = () => {
      const types = this.props.activity.types.map((type) => {
        if (type.id === id) type.description = currentElement.value
        return type
      })
      this.props.onChangeTypes(types)
    }

    const removeType = () => {
      const types = this.props.activity.types.filter((type) => {
        return type.id !== id
      })
      this.props.onChangeTypes(types)
    }

    const actions: ActionsList = {
      ADD_TYPE: () => addType(),
      RENAME_TYPE: () => renameType(),
      UPDATE_COLOR: () => updateTypeColor(),
      UPDATE_DESCRIPTION: () => updateTypeDescription(),
      REMOVE_ITEM: () => removeType(),
      NULL: () => null,
    }

    return actions[currentElement.dataset.feature ?? 'NULL']?.()
  }

  onChangeOrder = (types: Array<TypeConfiguration>) => {
    this.props.onChangeTypes(types)
  }

  // Templates
  Name = () => {
    return (
      <Feature
        isActive={
          features.find((feature) => feature.name === 'SETTINGS_NAME')?.isActive
        }
      >
        <div className="group__item">
          <FormItem
            label={locals[this.props.lang].settings.global.name.label}
            id="update-activity-name"
            isBlocked={isBlocked('SETTINGS_NAME', this.props.planStatus)}
          >
            <Input
              id="update-activity-name"
              type="TEXT"
              value={this.props.activity.name}
              charactersLimit={64}
              isBlocked={isBlocked('SETTINGS_NAME', this.props.planStatus)}
              feature="RENAME_ACTIVITY"
              onChange={
                isBlocked('SETTINGS_NAME', this.props.planStatus)
                  ? () => null
                  : this.props.onChangeActivities
              }
              onFocus={
                isBlocked('SETTINGS_NAME', this.props.planStatus)
                  ? () => null
                  : this.props.onChangeActivities
              }
              onBlur={
                isBlocked('SETTINGS_NAME', this.props.planStatus)
                  ? () => null
                  : this.props.onChangeActivities
              }
              onConfirm={
                isBlocked('SETTINGS_NAME', this.props.planStatus)
                  ? () => null
                  : this.props.onChangeActivities
              }
            />
          </FormItem>
        </div>
      </Feature>
    )
  }

  Description = () => {
    return (
      <Feature
        isActive={
          features.find((feature) => feature.name === 'SETTINGS_DESCRIPTION')
            ?.isActive
        }
      >
        <div className="group__item">
          <FormItem
            label={locals[this.props.lang].settings.global.description.label}
            id="update-activity-description"
            isBlocked={isBlocked('SETTINGS_DESCRIPTION', this.props.planStatus)}
          >
            <Input
              id="update-activity-description"
              type="LONG_TEXT"
              placeholder={"What's it for?"}
              value={this.props.activity.description}
              isBlocked={isBlocked(
                'SETTINGS_DESCRIPTION',
                this.props.planStatus
              )}
              feature="UPDATE_DESCRIPTION"
              isGrowing={true}
              onFocus={
                isBlocked('SETTINGS_DESCRIPTION', this.props.planStatus)
                  ? () => null
                  : this.props.onChangeActivities
              }
              onBlur={
                isBlocked('SETTINGS_DESCRIPTION', this.props.planStatus)
                  ? () => null
                  : this.props.onChangeActivities
              }
              onConfirm={
                isBlocked('SETTINGS_DESCRIPTION', this.props.planStatus)
                  ? () => null
                  : this.props.onChangeActivities
              }
            />
          </FormItem>
        </div>
      </Feature>
    )
  }

  Instructions = () => {
    return (
      <Feature
        isActive={
          features.find((feature) => feature.name === 'SETTINGS_INSTRUCTIONS')
            ?.isActive
        }
      >
        <div className="group__item">
          <FormItem
            label={locals[this.props.lang].settings.global.instructions.label}
            id="update-activity-instructions"
            isBlocked={isBlocked(
              'SETTINGS_INSTRUCTIONS',
              this.props.planStatus
            )}
          >
            <Input
              id="update-activity-instructions"
              type="LONG_TEXT"
              placeholder={"What's it for?"}
              value={this.props.activity.instructions}
              isBlocked={isBlocked(
                'SETTINGS_DESCRIPTION',
                this.props.planStatus
              )}
              feature="UPDATE_INSTRUCTIONS"
              isGrowing={true}
              onFocus={
                isBlocked('SETTINGS_INSTRUCTIONS', this.props.planStatus)
                  ? () => null
                  : this.props.onChangeActivities
              }
              onBlur={
                isBlocked('SETTINGS_INSTRUCTIONS', this.props.planStatus)
                  ? () => null
                  : this.props.onChangeActivities
              }
              onConfirm={
                isBlocked('SETTINGS_INSTRUCTIONS', this.props.planStatus)
                  ? () => null
                  : this.props.onChangeActivities
              }
            />
          </FormItem>
        </div>
      </Feature>
    )
  }

  GroupedBy = () => {
    return (
      <Feature
        isActive={
          features.find((feature) => feature.name === 'SETTINGS_GROUPED_BY')
            ?.isActive
        }
      >
        <div className="group__item">
          <FormItem
            id="update-grouped-by"
            label={locals[this.props.lang].settings.global.groupedBy.label}
          >
            <Dropdown
              id="update-grouped-by"
              options={[
                {
                  label:
                    locals[this.props.lang].settings.global.groupedBy
                      .participant,
                  value: 'PARTICIPANT',
                  feature: 'UPDATE_GROUPED_BY',
                  position: 0,
                  type: 'OPTION',
                  isActive: features.find(
                    (feature) =>
                      feature.name === 'SETTINGS_GROUPED_BY_PARTICIPANT'
                  )?.isActive,
                  isBlocked: isBlocked(
                    'SETTINGS_GROUPED_BY_PARTICIPANT',
                    this.props.planStatus
                  ),
                  isNew: features.find(
                    (feature) =>
                      feature.name === 'SETTINGS_GROUPED_BY_PARTICIPANT'
                  )?.isNew,
                  children: [],
                  action: this.props.onChangeActivities,
                },
                {
                  label: locals[this.props.lang].settings.global.groupedBy.type,
                  value: 'TYPE',
                  feature: 'UPDATE_GROUPED_BY',
                  position: 1,
                  type: 'OPTION',
                  isActive: features.find(
                    (feature) => feature.name === 'SETTINGS_GROUPED_BY_TYPE'
                  )?.isActive,
                  isBlocked: isBlocked(
                    'SETTINGS_GROUPED_BY_TYPE',
                    this.props.planStatus
                  ),
                  isNew: features.find(
                    (feature) => feature.name === 'SETTINGS_GROUPED_BY_TYPE'
                  )?.isNew,
                  children: [],
                  action: this.props.onChangeActivities,
                },
              ]}
              selected={this.props.activity.groupedBy}
              isNew={
                features.find(
                  (feature) => feature.name === 'SETTINGS_GROUPED_BY'
                )?.isNew
              }
            />
          </FormItem>
        </div>
      </Feature>
    )
  }

  Minutes = () => {
    return (
      <Feature
        isActive={
          features.find((feature) => feature.name === 'SETTINGS_TIMER_MINUTES')
            ?.isActive
        }
      >
        <div className="group__item">
          <FormItem
            label={locals[this.props.lang].settings.timer.minutes.label}
            id="update-timer-minutes"
            isBlocked={isBlocked(
              'SETTINGS_TIMER_MINUTES',
              this.props.planStatus
            )}
          >
            <Input
              id="update-timer-minutes"
              type="NUMBER"
              value={this.props.activity.timer.minutes.toString()}
              min="0"
              max="59"
              isBlocked={isBlocked(
                'SETTINGS_TIMER_MINUTES',
                this.props.planStatus
              )}
              feature="UPDATE_TIMER_MINUTES"
              onChange={
                isBlocked('SETTINGS_TIMER_MINUTES', this.props.planStatus)
                  ? () => null
                  : this.props.onChangeActivities
              }
              onFocus={
                isBlocked('SETTINGS_TIMER_MINUTES', this.props.planStatus)
                  ? () => null
                  : this.props.onChangeActivities
              }
              onBlur={
                isBlocked('SETTINGS_TIMER_MINUTES', this.props.planStatus)
                  ? () => null
                  : this.props.onChangeActivities
              }
              onConfirm={
                isBlocked('SETTINGS_TIMER_MINUTES', this.props.planStatus)
                  ? () => null
                  : this.props.onChangeActivities
              }
            />
          </FormItem>
        </div>
      </Feature>
    )
  }

  Seconds = () => {
    return (
      <Feature
        isActive={
          features.find((feature) => feature.name === 'SETTINGS_TIMER_SECONDS')
            ?.isActive
        }
      >
        <div className="group__item">
          <FormItem
            label={locals[this.props.lang].settings.timer.seconds.label}
            id="update-timer-seconds"
            isBlocked={isBlocked(
              'SETTINGS_TIMER_SECONDS',
              this.props.planStatus
            )}
          >
            <Input
              id="update-timer-seconds"
              type="NUMBER"
              value={this.props.activity.timer.seconds.toString()}
              min="0"
              max="59"
              isBlocked={isBlocked(
                'SETTINGS_TIMER_SECONDS',
                this.props.planStatus
              )}
              feature="UPDATE_TIMER_SECONDS"
              onChange={
                isBlocked('SETTINGS_TIMER_SECONDS', this.props.planStatus)
                  ? () => null
                  : this.props.onChangeActivities
              }
              onFocus={
                isBlocked('SETTINGS_TIMER_SECONDS', this.props.planStatus)
                  ? () => null
                  : this.props.onChangeActivities
              }
              onBlur={
                isBlocked('SETTINGS_TIMER_SECONDS', this.props.planStatus)
                  ? () => null
                  : this.props.onChangeActivities
              }
              onConfirm={
                isBlocked('SETTINGS_TIMER_SECONDS', this.props.planStatus)
                  ? () => null
                  : this.props.onChangeActivities
              }
            />
          </FormItem>
        </div>
      </Feature>
    )
  }

  Global = () => {
    return (
      <Feature
        isActive={
          features.find((feature) => feature.name === 'SETTINGS_GLOBAL')
            ?.isActive
        }
      >
        <div className="group">
          <SimpleItem
            leftPartSlot={
              <SectionTitle
                label={locals[this.props.lang].settings.global.title}
              />
            }
            isListItem={false}
          />
          <this.Name />
          <this.Description />
          <this.Instructions />
          <this.GroupedBy />
        </div>
      </Feature>
    )
  }

  Timer = () => {
    return (
      <Feature
        isActive={
          features.find((feature) => feature.name === 'SETTINGS_TIMER')
            ?.isActive
        }
      >
        <div className="group">
          <SimpleItem
            leftPartSlot={
              <SectionTitle
                label={locals[this.props.lang].settings.timer.title}
              />
            }
            isListItem={false}
          />
          <this.Minutes />
          <this.Seconds />
        </div>
      </Feature>
    )
  }

  Types = () => {
    return (
      <Feature
        isActive={
          features.find((feature) => feature.name === 'SETTINGS_TYPES')
            ?.isActive
        }
      >
        <div className="group">
          <SimpleItem
            leftPartSlot={
              <SectionTitle
                label={locals[this.props.lang].settings.types.title}
                indicator={this.props.activity.types.length}
              />
            }
            rightPartSlot={
              <Button
                type="icon"
                icon="plus"
                feature="ADD_TYPE"
                action={this.typeHandler}
              />
            }
            isListItem={false}
          />
          <SortableList
            data={this.props.activity.types as Array<TypeConfiguration>}
            canBeEmpty={false}
            primarySlot={this.props.activity.types.map((type) => (
              <>
                <Feature
                  isActive={
                    features.find(
                      (feature) => feature.name === 'SETTINGS_TYPES_NAME'
                    )?.isActive
                  }
                >
                  <div className="draggable-item__param--compact">
                    <Input
                      type="TEXT"
                      value={type.name}
                      charactersLimit={24}
                      feature="RENAME_TYPE"
                      onBlur={this.typeHandler}
                      onConfirm={this.typeHandler}
                    />
                  </div>
                </Feature>
                <Feature
                  isActive={
                    features.find(
                      (feature) => feature.name === 'SETTINGS_TYPES_COLOR'
                    )?.isActive
                  }
                >
                  <>
                    <div className="draggable-item__param--square">
                      <div
                        className="color-chip"
                        style={{
                          backgroundColor: type.hex,
                        }}
                      />
                    </div>
                    <div className="draggable-item__param--compact">
                      <Dropdown
                        id="update-type-color"
                        options={[
                          {
                            label:
                              locals[this.props.lang].settings.types.colors
                                .gray,
                            value: 'GRAY',
                            feature: 'UPDATE_COLOR',
                            position: 0,
                            type: 'OPTION',
                            isActive: true,
                            isBlocked: false,
                            isNew: false,
                            children: [],
                            action: this.typeHandler,
                          },
                          {
                            label:
                              locals[this.props.lang].settings.types.colors.red,
                            value: 'RED',
                            feature: 'UPDATE_COLOR',
                            position: 1,
                            type: 'OPTION',
                            isActive: true,
                            isBlocked: false,
                            isNew: false,
                            children: [],
                            action: this.typeHandler,
                          },
                          {
                            label:
                              locals[this.props.lang].settings.types.colors
                                .orange,
                            value: 'ORANGE',
                            feature: 'UPDATE_COLOR',
                            position: 2,
                            type: 'OPTION',
                            isActive: true,
                            isBlocked: false,
                            isNew: false,
                            children: [],
                            action: this.typeHandler,
                          },
                          {
                            label:
                              locals[this.props.lang].settings.types.colors
                                .yellow,
                            value: 'YELLOW',
                            feature: 'UPDATE_COLOR',
                            position: 3,
                            type: 'OPTION',
                            isActive: true,
                            isBlocked: false,
                            isNew: false,
                            children: [],
                            action: this.typeHandler,
                          },
                          {
                            label:
                              locals[this.props.lang].settings.types.colors
                                .green,
                            value: 'GREEN',
                            feature: 'UPDATE_COLOR',
                            position: 4,
                            type: 'OPTION',
                            isActive: true,
                            isBlocked: false,
                            isNew: false,
                            children: [],
                            action: this.typeHandler,
                          },
                          {
                            label:
                              locals[this.props.lang].settings.types.colors
                                .blue,
                            value: 'BLUE',
                            feature: 'UPDATE_COLOR',
                            position: 5,
                            type: 'OPTION',
                            isActive: true,
                            isBlocked: false,
                            isNew: false,
                            children: [],
                            action: this.typeHandler,
                          },
                          {
                            label:
                              locals[this.props.lang].settings.types.colors
                                .violet,
                            value: 'VIOLET',
                            feature: 'UPDATE_COLOR',
                            position: 6,
                            type: 'OPTION',
                            isActive: true,
                            isBlocked: false,
                            isNew: false,
                            children: [],
                            action: this.typeHandler,
                          },
                          {
                            label:
                              locals[this.props.lang].settings.types.colors
                                .pink,
                            value: 'PINK',
                            feature: 'UPDATE_COLOR',
                            position: 7,
                            type: 'OPTION',
                            isActive: true,
                            isBlocked: false,
                            isNew: false,
                            children: [],
                            action: this.typeHandler,
                          },
                          {
                            label:
                              locals[this.props.lang].settings.types.colors
                                .lightGray,
                            value: 'LIGHT_GRAY',
                            feature: 'UPDATE_COLOR',
                            position: 8,
                            type: 'OPTION',
                            isActive: true,
                            isBlocked: false,
                            isNew: false,
                            children: [],
                            action: this.typeHandler,
                          },
                        ]}
                        selected={type.color}
                        alignment="FILL"
                        isNew={
                          features.find(
                            (feature) => feature.name === 'SETTINGS_TYPES_COLOR'
                          )?.isNew
                        }
                      />
                    </div>
                  </>
                </Feature>
              </>
            ))}
            secondarySlot={this.props.activity.types.map((type, index) => (
              <Feature
                key={index}
                isActive={
                  features.find(
                    (feature) => feature.name === 'SETTINGS_TYPES_DESCRIPTION'
                  )?.isActive
                }
              >
                <div className="draggable-list__param">
                  <FormItem
                    id="type-description"
                    label={
                      locals[this.props.lang].settings.types.description.label
                    }
                  >
                    <Input
                      id="color-description"
                      type="LONG_TEXT"
                      value={type.description}
                      placeholder={
                        locals[this.props.lang].settings.types.description
                          .placeholder
                      }
                      feature="UPDATE_DESCRIPTION"
                      isGrowing={true}
                      onBlur={this.typeHandler}
                      onConfirm={this.typeHandler}
                    />
                  </FormItem>
                </div>
              </Feature>
            ))}
            onChangeSortableList={this.onChangeOrder}
            onRemoveItem={this.typeHandler}
          />
        </div>
      </Feature>
    )
  }

  History = () => {
    return (
      <Feature
        isActive={
          features.find((feature) => feature.name === 'HISTORY')?.isActive
        }
      >
        <div className="group">
          <SimpleItem
            leftPartSlot={
              <SectionTitle
                label={locals[this.props.lang].settings.history.title}
                indicator={this.props.sessions.length}
              />
            }
            isListItem={false}
          />
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
                        style={{ flex: '0 0 148px' }}
                      >
                        {setFriendlyDate(session.metrics.startDate, 'en-US')}
                      </span>
                      <span
                        className={`${texts['type']} ${texts['type--secondary']} type`}
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
        </div>
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
            </div>
          }
          rightPartSlot={
            <div className={layouts['snackbar--medium']}>
              <Feature
                isActive={
                  features.find(
                    (feature) => feature.name === 'ACTIVITIES_DELETE'
                  )?.isActive
                }
              >
                <Button
                  type="icon"
                  icon="trash"
                  feature="DELETE_ACTIVITY"
                  action={() => this.setState({ isDialogOpen: true })}
                />
              </Feature>
              <Feature
                isActive={
                  features.find(
                    (feature) => feature.name === 'ACTIVITIES_PUBLISH'
                  )?.isActive
                }
              >
                <Button
                  type="secondary"
                  label={locals[this.props.lang].publication.publish}
                  feature="PUBLISH_ACTIVITY"
                  isLoading={this.state.isPrimaryActionLoading}
                  action={async () => {
                    this.setState({ isPrimaryActionLoading: true })
                    await publishActivity(
                      this.props.activity,
                      this.props.userSession
                    )
                      .then(() => {
                        parent.postMessage(
                          {
                            pluginMessage: {
                              type: 'SEND_MESSAGE',
                              message:
                                locals[this.props.lang].success.publication,
                            },
                          },
                          '*'
                        )
                      })
                      .finally(() => {
                        this.setState({ isPrimaryActionLoading: false })
                      })
                      .catch(() => {
                        parent.postMessage(
                          {
                            pluginMessage: {
                              type: 'SEND_MESSAGE',
                              message:
                                locals[this.props.lang].error.publication,
                            },
                          },
                          '*'
                        )
                      })
                  }}
                />
              </Feature>
              <Feature
                isActive={
                  features.find((feature) => feature.name === 'SESSIONS_RUN')
                    ?.isActive
                }
              >
                <Button
                  type="primary"
                  label={locals[this.props.lang].sessions.newSession}
                  feature="SESSION_RUN"
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
            features.find((feature) => feature.name === 'ACTIVITIES_DELETE')
              ?.isActive && this.state.isDialogOpen
          }
        >
          <Dialog
            title={locals[this.props.lang].settings.deleteActivityDialog.title}
            actions={{
              destructive: {
                label:
                  locals[this.props.lang].settings.deleteActivityDialog.delete,
                feature: 'DELETE_ACTIVITY',
                action: this.props.onChangeActivities,
              },
              secondary: {
                label:
                  locals[this.props.lang].settings.deleteActivityDialog.cancel,
                action: () => this.setState({ isDialogOpen: false }),
              },
            }}
            onClose={() => this.setState({ isDialogOpen: false })}
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
          </Dialog>
        </Feature>
        <div className="control__block control__block--no-padding">
          <this.Global />
          <this.Timer />
          <this.Types />
          {this.props.sessions.length > 0 && <this.History />}
        </div>
      </div>
    )
  }
}
