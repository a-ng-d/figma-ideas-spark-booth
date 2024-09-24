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
  NoteConfiguration,
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
  onChangeNoteTypes: (noteTypes: Array<NoteConfiguration>) => void
  onCloseActivitySettings: () => void
}

export default class Settings extends React.Component<SettingsProps> {
  // Handlers
  noteTypeHandler = (e: any) => {
    let id: string | null
    const element: HTMLElement | null = (e.target as HTMLElement).closest(
        '.draggable-item'
      ),
      currentElement: HTMLInputElement = e.currentTarget

    element !== null ? (id = element.getAttribute('data-id')) : (id = null)

    const addNoteType = () => {
      const hasAlreadyNewNoteType = this.props.activity.noteTypes.filter(
        (noteType) => noteType.name.includes('New note type')
      )

      const noteTypes = this.props.activity.noteTypes.map((el) => el)
      noteTypes.push({
        name: `New note type ${hasAlreadyNewNoteType.length + 1}`,
        color: 'YELLOW',
        hex: yellowColor,
        id: uid(),
      })
      this.props.onChangeNoteTypes(noteTypes)
    }

    const renameNoteType = () => {
      const noteTypes = this.props.activity.noteTypes.map((noteType) => {
        if (noteType.id === id) noteType.name = e.target.value
        return noteType
      })
      this.props.onChangeNoteTypes(noteTypes)
    }

    const updateNoteTypeColor = () => {
      const noteTypes = this.props.activity.noteTypes.map((noteType) => {
        if (noteType.id === id) {
          noteType.color = currentElement.dataset.value as ColorConfiguration
          if (currentElement.dataset.value === 'YELLOW')
            noteType.hex = yellowColor
          else if (currentElement.dataset.value === 'BLUE')
            noteType.hex = blueColor
          else if (currentElement.dataset.value === 'GREEN')
            noteType.hex = greenColor
          else if (currentElement.dataset.value === 'VIOLET')
            noteType.hex = violetColor
          else if (currentElement.dataset.value === 'RED')
            noteType.hex = redColor
          else if (currentElement.dataset.value === 'ORANGE')
            noteType.hex = orangeColor
          else if (currentElement.dataset.value === 'PINK')
            noteType.hex = pinkColor
          else if (currentElement.dataset.value === 'LIGHT_GRAY')
            noteType.hex = lightGrayColor
          else if (currentElement.dataset.value === 'GRAY')
            noteType.hex = grayColor
        }
        return noteType
      })
      this.props.onChangeNoteTypes(noteTypes)
    }

    const removeNoteType = () => {
      const noteTypes = this.props.activity.noteTypes.filter((noteType) => {
        return noteType.id !== id
      })
      this.props.onChangeNoteTypes(noteTypes)
    }

    const actions: ActionsList = {
      ADD_NOTE_TYPE: () => addNoteType(),
      RENAME_NOTE_TYPE: () => renameNoteType(),
      UPDATE_NOTE_TYPE_COLOR: () => updateNoteTypeColor(),
      REMOVE_ITEM: () => removeNoteType(),
      NULL: () => null,
    }

    return actions[currentElement.dataset.feature ?? 'NULL']?.()
  }

  onChangeOrder = (noteTypes: Array<NoteConfiguration>) => {
    this.props.onChangeNoteTypes(noteTypes)
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
                  label:
                    locals[this.props.lang].settings.global.groupedBy.noteType,
                  value: 'NOTE_TYPE',
                  feature: 'UPDATE_GROUPED_BY',
                  position: 1,
                  type: 'OPTION',
                  isActive: features.find(
                    (feature) =>
                      feature.name === 'SETTINGS_GROUPED_BY_NOTE_TYPE'
                  )?.isActive,
                  isBlocked: isBlocked(
                    'SETTINGS_GROUPED_BY_NOTE_TYPE',
                    this.props.planStatus
                  ),
                  isNew: features.find(
                    (feature) =>
                      feature.name === 'SETTINGS_GROUPED_BY_NOTE_TYPE'
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

  NoteTypes = () => {
    return (
      <Feature
        isActive={
          features.find((feature) => feature.name === 'SETTINGS_NOTE_TYPES')
            ?.isActive
        }
      >
        <div className="group">
          <SimpleItem leftPartSlot={<SectionTitle label={'Description'} />} />
          <div className="section-controls">
            <div className="section-controls__left-part">
              <SectionTitle
                label={locals[this.props.lang].settings.noteTypes.title}
              />
            </div>
            <div className="section-controls__right-part">
              <Button
                type="icon"
                icon="plus"
                feature="ADD_NOTE_TYPE"
                action={this.noteTypeHandler}
              />
            </div>
          </div>
          <SortableList
            data={this.props.activity.noteTypes as Array<NoteConfiguration>}
            primarySlot={this.props.activity.noteTypes.map((noteType) => (
              <>
                <Feature
                  isActive={
                    features.find(
                      (feature) => feature.name === 'SETTINGS_NOTE_TYPES_RENAME'
                    )?.isActive
                  }
                >
                  <div className="draggable-item__param--compact">
                    <Input
                      type="TEXT"
                      value={noteType.name}
                      charactersLimit={24}
                      feature="RENAME_NOTE_TYPE"
                      onBlur={this.noteTypeHandler}
                      onConfirm={this.noteTypeHandler}
                    />
                  </div>
                </Feature>
                <Feature
                  isActive={
                    features.find(
                      (feature) =>
                        feature.name === 'SETTINGS_NOTE_TYPES_UPDATE_COLOR'
                    )?.isActive
                  }
                >
                  <>
                    <div className="draggable-item__param--square">
                      <div
                        className="color-chip"
                        style={{
                          backgroundColor: noteType.hex,
                        }}
                      />
                    </div>
                    <div className="draggable-item__param--compact">
                      <Dropdown
                        id="update-note-type-color"
                        options={[
                          {
                            label: 'Gray',
                            value: 'GRAY',
                            feature: 'UPDATE_NOTE_TYPE_COLOR',
                            position: 0,
                            type: 'OPTION',
                            isActive: true,
                            isBlocked: false,
                            isNew: false,
                            children: [],
                            action: this.noteTypeHandler,
                          },
                          {
                            label: 'Red',
                            value: 'RED',
                            feature: 'UPDATE_NOTE_TYPE_COLOR',
                            position: 1,
                            type: 'OPTION',
                            isActive: true,
                            isBlocked: false,
                            isNew: false,
                            children: [],
                            action: this.noteTypeHandler,
                          },
                          {
                            label: 'Orange',
                            value: 'ORANGE',
                            feature: 'UPDATE_NOTE_TYPE_COLOR',
                            position: 2,
                            type: 'OPTION',
                            isActive: true,
                            isBlocked: false,
                            isNew: false,
                            children: [],
                            action: this.noteTypeHandler,
                          },
                          {
                            label: 'Yellow',
                            value: 'YELLOW',
                            feature: 'UPDATE_NOTE_TYPE_COLOR',
                            position: 3,
                            type: 'OPTION',
                            isActive: true,
                            isBlocked: false,
                            isNew: false,
                            children: [],
                            action: this.noteTypeHandler,
                          },
                          {
                            label: 'Green',
                            value: 'GREEN',
                            feature: 'UPDATE_NOTE_TYPE_COLOR',
                            position: 4,
                            type: 'OPTION',
                            isActive: true,
                            isBlocked: false,
                            isNew: false,
                            children: [],
                            action: this.noteTypeHandler,
                          },
                          {
                            label: 'Blue',
                            value: 'BLUE',
                            feature: 'UPDATE_NOTE_TYPE_COLOR',
                            position: 5,
                            type: 'OPTION',
                            isActive: true,
                            isBlocked: false,
                            isNew: false,
                            children: [],
                            action: this.noteTypeHandler,
                          },
                          {
                            label: 'Violet',
                            value: 'VIOLET',
                            feature: 'UPDATE_NOTE_TYPE_COLOR',
                            position: 6,
                            type: 'OPTION',
                            isActive: true,
                            isBlocked: false,
                            isNew: false,
                            children: [],
                            action: this.noteTypeHandler,
                          },
                          {
                            label: 'Pink',
                            value: 'PINK',
                            feature: 'UPDATE_NOTE_TYPE_COLOR',
                            position: 7,
                            type: 'OPTION',
                            isActive: true,
                            isBlocked: false,
                            isNew: false,
                            children: [],
                            action: this.noteTypeHandler,
                          },
                          {
                            label: 'Light gray',
                            value: 'LIGHT_GRAY',
                            feature: 'UPDATE_NOTE_TYPE_COLOR',
                            position: 8,
                            type: 'OPTION',
                            isActive: true,
                            isBlocked: false,
                            isNew: false,
                            children: [],
                            action: this.noteTypeHandler,
                          },
                        ]}
                        selected={noteType.color}
                        alignment="FILL"
                        isNew={
                          features.find(
                            (feature) =>
                              feature.name ===
                              'SETTINGS_NOTE_TYPES_UPDATE_COLOR'
                          )?.isNew
                        }
                      />
                    </div>
                  </>
                </Feature>
              </>
            ))}
            onChangeSortableList={this.onChangeOrder}
            onRemoveItem={this.noteTypeHandler}
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
          <this.NoteTypes />
        </div>
      </div>
    )
  }
}