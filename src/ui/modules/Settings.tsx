import {
  Bar,
  Button,
  Dropdown,
  FormItem,
  Input,
  SectionTitle,
  SimpleItem,
  SortableList,
  layouts,
} from '@a_ng_d/figmug-ui'
import React from 'react'
import { uid } from 'uid'

import { locals } from '../../content/locals'
import { Language, PlanStatus } from '../../types/app'
import {
  ActivityConfiguration,
  ColorConfiguration,
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
import Feature from '../components/Feature'

interface SettingsProps {
  activity: ActivityConfiguration
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
  onCloseActivitySettings: () => void
}

export default class Settings extends React.Component<SettingsProps> {
  // Handlers
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
          />
          <SortableList
            data={this.props.activity.types as Array<TypeConfiguration>}
            primarySlot={this.props.activity.types.map((type) => (
              <>
                <Feature
                  isActive={
                    features.find(
                      (feature) => feature.name === 'SETTINGS_TYPES_RENAME'
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
                      (feature) =>
                        feature.name === 'SETTINGS_TYPES_UPDATE_COLOR'
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
                            label: 'Gray',
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
                            label: 'Red',
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
                            label: 'Orange',
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
                            label: 'Yellow',
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
                            label: 'Green',
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
                            label: 'Blue',
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
                            label: 'Violet',
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
                            label: 'Pink',
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
                            label: 'Light gray',
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
                            (feature) =>
                              feature.name === 'SETTINGS_TYPES_UPDATE_COLOR'
                          )?.isNew
                        }
                      />
                    </div>
                  </>
                </Feature>
              </>
            ))}
            onChangeSortableList={this.onChangeOrder}
            onRemoveItem={this.typeHandler}
          />
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
              <span className="type">{this.props.activity.name}</span>
            </div>
          }
          rightPartSlot={
            <div className={layouts['snackbar--tight']}>
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
                  action={() => null}
                />
              </Feature>
              <Feature
                isActive={
                  features.find(
                    (feature) => feature.name === 'ACTIVITIES_REMOVE'
                  )?.isActive
                }
              >
                <Button
                  type="icon"
                  icon="trash"
                  feature="REMOVE_ACTIVITY"
                  action={this.props.onChangeActivities}
                />
              </Feature>
            </div>
          }
          border={['BOTTOM']}
        ></Bar>
        <div className="control__block control__block--no-padding">
          <this.Global />
          <this.Timer />
          <this.Types />
        </div>
      </div>
    )
  }
}
