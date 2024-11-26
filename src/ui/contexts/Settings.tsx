import {
  Bar,
  Button,
  Chip,
  ConsentConfiguration,
  Dialog,
  Dropdown,
  FeatureStatus,
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
import { signIn } from '../../bridges/publication/authentication'
import p from '../../content/images/publication.webp'
import { locals } from '../../content/locals'
import { Language, PlanStatus } from '../../types/app'
import {
  ActivityConfiguration,
  ColorConfiguration,
  IdeaConfiguration,
  SessionConfiguration,
  TypeConfiguration,
  UserConfiguration,
} from '../../types/configurations'
import { ActionsList } from '../../types/models'
import { UserSession } from '../../types/user'
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
import { trackSignInEvent } from '../../utils/eventsTracker'
import setFriendlyDate from '../../utils/setFriendlyDate'
import ColorChip from '../components/ColorChip'
import Feature from '../components/Feature'
import Publication from '../modules/Publication'

interface SettingsProps {
  activity: ActivityConfiguration
  sessions: Array<SessionConfiguration>
  ideas: Array<IdeaConfiguration>
  userSession: UserSession
  userIdentity: UserConfiguration
  userConsent: Array<ConsentConfiguration>
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
  isDeleteDialogOpen: boolean
  isPublicationDialogOpen: boolean
  isPrimaryActionLoading: boolean
  isSecondaryActionLoading: boolean
}

export default class Settings extends React.Component<
  SettingsProps,
  SettingsStates
> {
  static features = (planStatus: PlanStatus) => ({
    ACTIVITIES_DELETE: new FeatureStatus({
      features: features,
      featureName: 'ACTIVITIES_DELETE',
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
    SETTINGS: new FeatureStatus({
      features: features,
      featureName: 'SETTINGS',
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
    SETTINGS_NAME: new FeatureStatus({
      features: features,
      featureName: 'SETTINGS_NAME',
      planStatus: planStatus,
    }),
    SETTINGS_DESCRIPTION: new FeatureStatus({
      features: features,
      featureName: 'SETTINGS_DESCRIPTION',
      planStatus: planStatus,
    }),
    SETTINGS_INSTRUCTIONS: new FeatureStatus({
      features: features,
      featureName: 'SETTINGS_INSTRUCTIONS',
      planStatus: planStatus,
    }),
    SETTINGS_GROUPED_BY: new FeatureStatus({
      features: features,
      featureName: 'SETTINGS_GROUPED_BY',
      planStatus: planStatus,
    }),
    SETTINGS_GROUPED_BY_PARTICIPANT: new FeatureStatus({
      features: features,
      featureName: 'SETTINGS_GROUPED_BY_PARTICIPANT',
      planStatus: planStatus,
    }),
    SETTINGS_GROUPED_BY_TYPE: new FeatureStatus({
      features: features,
      featureName: 'SETTINGS_GROUPED_BY_TYPE',
      planStatus: planStatus,
    }),
    SETTINGS_TIMER: new FeatureStatus({
      features: features,
      featureName: 'SETTINGS_TIMER',
      planStatus: planStatus,
    }),
    SETTINGS_TIMER_MINUTES: new FeatureStatus({
      features: features,
      featureName: 'SETTINGS_TIMER_MINUTES',
      planStatus: planStatus,
    }),
    SETTINGS_TIMER_SECONDS: new FeatureStatus({
      features: features,
      featureName: 'SETTINGS_TIMER_SECONDS',
      planStatus: planStatus,
    }),
    SETTINGS_TYPES: new FeatureStatus({
      features: features,
      featureName: 'SETTINGS_TYPES',
      planStatus: planStatus,
    }),
    SETTINGS_TYPES_ADD: new FeatureStatus({
      features: features,
      featureName: 'SETTINGS_TYPES_ADD',
      planStatus: planStatus,
    }),
    SETTINGS_TYPES_REMOVE: new FeatureStatus({
      features: features,
      featureName: 'SETTINGS_TYPES_REMOVE',
      planStatus: planStatus,
    }),
    SETTINGS_TYPES_NAME: new FeatureStatus({
      features: features,
      featureName: 'SETTINGS_TYPES_NAME',
      planStatus: planStatus,
    }),
    SETTINGS_TYPES_COLOR: new FeatureStatus({
      features: features,
      featureName: 'SETTINGS_TYPES_COLOR',
      planStatus: planStatus,
    }),
    SETTINGS_TYPES_DESCRIPTION: new FeatureStatus({
      features: features,
      featureName: 'SETTINGS_TYPES_DESCRIPTION',
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
        isActive={Settings.features(
          this.props.planStatus
        ).SETTINGS_NAME.isActive()}
      >
        <div className="group__item">
          <FormItem
            label={locals[this.props.lang].settings.global.name.label}
            id="update-activity-name"
            isBlocked={Settings.features(
              this.props.planStatus
            ).SETTINGS_NAME.isBlocked()}
            isNew={Settings.features(
              this.props.planStatus
            ).SETTINGS_NAME.isNew()}
          >
            <Input
              id="update-activity-name"
              type="TEXT"
              value={this.props.activity.name}
              charactersLimit={64}
              feature="RENAME_ACTIVITY"
              isBlocked={Settings.features(
                this.props.planStatus
              ).SETTINGS_NAME.isBlocked()}
              onChange={this.props.onChangeActivities}
              onFocus={this.props.onChangeActivities}
              onBlur={this.props.onChangeActivities}
              onConfirm={this.props.onChangeActivities}
            />
          </FormItem>
        </div>
      </Feature>
    )
  }

  Description = () => {
    return (
      <Feature
        isActive={Settings.features(
          this.props.planStatus
        ).SETTINGS_DESCRIPTION.isActive()}
      >
        <div className="group__item">
          <FormItem
            label={locals[this.props.lang].settings.global.description.label}
            id="update-activity-description"
            isBlocked={Settings.features(
              this.props.planStatus
            ).SETTINGS_DESCRIPTION.isBlocked()}
            isNew={Settings.features(
              this.props.planStatus
            ).SETTINGS_DESCRIPTION.isNew()}
          >
            <Input
              id="update-activity-description"
              type="LONG_TEXT"
              placeholder={"What's it for?"}
              value={this.props.activity.description}
              feature="UPDATE_DESCRIPTION"
              isBlocked={Settings.features(
                this.props.planStatus
              ).SETTINGS_DESCRIPTION.isBlocked()}
              isGrowing={true}
              onFocus={this.props.onChangeActivities}
              onBlur={this.props.onChangeActivities}
              onConfirm={this.props.onChangeActivities}
            />
          </FormItem>
        </div>
      </Feature>
    )
  }

  Instructions = () => {
    return (
      <Feature
        isActive={Settings.features(
          this.props.planStatus
        ).SETTINGS_INSTRUCTIONS.isActive()}
      >
        <div className="group__item">
          <FormItem
            label={locals[this.props.lang].settings.global.instructions.label}
            id="update-activity-instructions"
            isBlocked={Settings.features(
              this.props.planStatus
            ).SETTINGS_INSTRUCTIONS.isBlocked()}
            isNew={Settings.features(
              this.props.planStatus
            ).SETTINGS_INSTRUCTIONS.isNew()}
          >
            <Input
              id="update-activity-instructions"
              type="LONG_TEXT"
              placeholder={"What's it for?"}
              value={this.props.activity.instructions}
              feature="UPDATE_INSTRUCTIONS"
              isBlocked={Settings.features(
                this.props.planStatus
              ).SETTINGS_INSTRUCTIONS.isBlocked()}
              isGrowing={true}
              onFocus={this.props.onChangeActivities}
              onBlur={this.props.onChangeActivities}
              onConfirm={this.props.onChangeActivities}
            />
          </FormItem>
        </div>
      </Feature>
    )
  }

  GroupedBy = () => {
    return (
      <Feature
        isActive={Settings.features(
          this.props.planStatus
        ).SETTINGS_GROUPED_BY.isActive()}
      >
        <div className="group__item">
          <FormItem
            id="update-grouped-by"
            label={locals[this.props.lang].settings.global.groupedBy.label}
            isBlocked={Settings.features(
              this.props.planStatus
            ).SETTINGS_GROUPED_BY.isBlocked()}
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
                  type: 'OPTION',
                  position: 0,
                  isActive: Settings.features(
                    this.props.planStatus
                  ).SETTINGS_GROUPED_BY_PARTICIPANT.isActive(),
                  isBlocked: Settings.features(
                    this.props.planStatus
                  ).SETTINGS_GROUPED_BY_PARTICIPANT.isBlocked(),
                  isNew: Settings.features(
                    this.props.planStatus
                  ).SETTINGS_GROUPED_BY_PARTICIPANT.isNew(),
                  action: this.props.onChangeActivities,
                },
                {
                  label: locals[this.props.lang].settings.global.groupedBy.type,
                  value: 'TYPE',
                  feature: 'UPDATE_GROUPED_BY',
                  position: 1,
                  type: 'OPTION',
                  isActive: Settings.features(
                    this.props.planStatus
                  ).SETTINGS_GROUPED_BY_TYPE.isActive(),
                  isBlocked: Settings.features(
                    this.props.planStatus
                  ).SETTINGS_GROUPED_BY_TYPE.isBlocked(),
                  isNew: Settings.features(
                    this.props.planStatus
                  ).SETTINGS_GROUPED_BY_TYPE.isNew(),
                  action: this.props.onChangeActivities,
                },
              ]}
              selected={this.props.activity.groupedBy}
              isNew={Settings.features(
                this.props.planStatus
              ).SETTINGS_GROUPED_BY.isNew()}
            />
          </FormItem>
        </div>
      </Feature>
    )
  }

  Minutes = () => {
    return (
      <Feature
        isActive={Settings.features(
          this.props.planStatus
        ).SETTINGS_TIMER_MINUTES.isActive()}
      >
        <div className="group__item">
          <FormItem
            label={locals[this.props.lang].settings.timer.minutes.label}
            id="update-timer-minutes"
            isBlocked={Settings.features(
              this.props.planStatus
            ).SETTINGS_TIMER_MINUTES.isBlocked()}
            isNew={Settings.features(
              this.props.planStatus
            ).SETTINGS_TIMER_MINUTES.isNew()}
          >
            <Input
              id="update-timer-minutes"
              type="NUMBER"
              value={this.props.activity.timer.minutes.toString()}
              min="0"
              max="59"
              isBlocked={Settings.features(
                this.props.planStatus
              ).SETTINGS_TIMER_MINUTES.isBlocked()}
              feature="UPDATE_TIMER_MINUTES"
              onChange={this.props.onChangeActivities}
              onFocus={this.props.onChangeActivities}
              onBlur={this.props.onChangeActivities}
              onConfirm={this.props.onChangeActivities}
            />
          </FormItem>
        </div>
      </Feature>
    )
  }

  Seconds = () => {
    return (
      <Feature
        isActive={Settings.features(
          this.props.planStatus
        ).SETTINGS_TIMER_SECONDS.isActive()}
      >
        <div className="group__item">
          <FormItem
            label={locals[this.props.lang].settings.timer.seconds.label}
            id="update-timer-seconds"
            isBlocked={Settings.features(
              this.props.planStatus
            ).SETTINGS_TIMER_SECONDS.isBlocked()}
            isNew={Settings.features(
              this.props.planStatus
            ).SETTINGS_TIMER_SECONDS.isNew()}
          >
            <Input
              id="update-timer-seconds"
              type="NUMBER"
              value={this.props.activity.timer.seconds.toString()}
              min="0"
              max="59"
              isBlocked={Settings.features(
                this.props.planStatus
              ).SETTINGS_TIMER_SECONDS.isBlocked()}
              feature="UPDATE_TIMER_SECONDS"
              onChange={this.props.onChangeActivities}
              onFocus={this.props.onChangeActivities}
              onBlur={this.props.onChangeActivities}
              onConfirm={this.props.onChangeActivities}
            />
          </FormItem>
        </div>
      </Feature>
    )
  }

  Global = () => {
    return (
      <Feature
        isActive={Settings.features(
          this.props.planStatus
        ).SETTINGS_GLOBAL.isActive()}
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
        isActive={Settings.features(
          this.props.planStatus
        ).SETTINGS_TIMER.isActive()}
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
        isActive={Settings.features(
          this.props.planStatus
        ).SETTINGS_TYPES.isActive()}
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
              <Feature
                isActive={Settings.features(
                  this.props.planStatus
                ).SETTINGS_TYPES_ADD.isActive()}
              >
                <Button
                  type="icon"
                  icon="plus"
                  feature="ADD_TYPE"
                  isBlocked={Settings.features(
                    this.props.planStatus
                  ).SETTINGS_TYPES_ADD.isBlocked()}
                  isNew={Settings.features(
                    this.props.planStatus
                  ).SETTINGS_TYPES_ADD.isNew()}
                  action={this.typeHandler}
                />
              </Feature>
            }
            isListItem={false}
          />
          <SortableList
            data={this.props.activity.types as Array<TypeConfiguration>}
            canBeEmpty={false}
            primarySlot={this.props.activity.types.map((type) => (
              <>
                <Feature
                  isActive={Settings.features(
                    this.props.planStatus
                  ).SETTINGS_TYPES_NAME.isActive()}
                >
                  <div className="draggable-item__param--compact">
                    <Input
                      type="TEXT"
                      value={type.name}
                      charactersLimit={24}
                      feature="RENAME_TYPE"
                      isBlocked={Settings.features(
                        this.props.planStatus
                      ).SETTINGS_TYPES_NAME.isBlocked()}
                      isNew={Settings.features(
                        this.props.planStatus
                      ).SETTINGS_TYPES_NAME.isNew()}
                      onBlur={this.typeHandler}
                      onConfirm={this.typeHandler}
                    />
                  </div>
                </Feature>
                <Feature
                  isActive={Settings.features(
                    this.props.planStatus
                  ).SETTINGS_TYPES_COLOR.isActive()}
                >
                  <>
                    <div className="draggable-item__param--square">
                      <ColorChip color={type.hex} />
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
                            action: this.typeHandler,
                          },
                          {
                            label:
                              locals[this.props.lang].settings.types.colors.red,
                            value: 'RED',
                            feature: 'UPDATE_COLOR',
                            position: 1,
                            type: 'OPTION',
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
                            action: this.typeHandler,
                          },
                        ]}
                        selected={type.color}
                        alignment="FILL"
                        isNew={Settings.features(
                          this.props.planStatus
                        ).SETTINGS_TYPES_COLOR.isNew()}
                      />
                    </div>
                  </>
                </Feature>
              </>
            ))}
            secondarySlot={this.props.activity.types.map((type, index) => (
              <Feature
                key={index}
                isActive={Settings.features(
                  this.props.planStatus
                ).SETTINGS_TYPES_DESCRIPTION.isActive()}
              >
                <div className="draggable-list__param">
                  <FormItem
                    id="type-description"
                    label={
                      locals[this.props.lang].settings.types.description.label
                    }
                    isBlocked={Settings.features(
                      this.props.planStatus
                    ).SETTINGS_TYPES_DESCRIPTION.isBlocked()}
                    isNew={Settings.features(
                      this.props.planStatus
                    ).SETTINGS_TYPES_DESCRIPTION.isNew()}
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
                      isBlocked={Settings.features(
                        this.props.planStatus
                      ).SETTINGS_TYPES_DESCRIPTION.isBlocked()}
                      isNew={Settings.features(
                        this.props.planStatus
                      ).SETTINGS_TYPES_DESCRIPTION.isNew()}
                      onChange={this.typeHandler}
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
        isActive={Settings.features(this.props.planStatus).HISTORY.isActive()}
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
                        style={{ flex: '0 0 200px' }}
                      >
                        {setFriendlyDate(
                          session.metrics.startDate,
                          this.props.lang
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
              {this.props.activity.meta.publicationStatus.isShared && (
                <Chip state="ACTIVE">
                  {locals[this.props.lang].publication.statusPublished}
                </Chip>
              )}
            </div>
          }
          rightPartSlot={
            <div className={layouts['snackbar--medium']}>
              <Feature
                isActive={Settings.features(
                  this.props.planStatus
                ).ACTIVITIES_DELETE.isActive()}
              >
                <Button
                  type="icon"
                  icon="trash"
                  isBlocked={Settings.features(
                    this.props.planStatus
                  ).ACTIVITIES_DELETE.isBlocked()}
                  isNew={Settings.features(
                    this.props.planStatus
                  ).ACTIVITIES_DELETE.isNew()}
                  action={() => this.setState({ isDeleteDialogOpen: true })}
                />
              </Feature>
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
                        ? locals[this.props.lang].settings.global.publish
                        : locals[this.props.lang].settings.global.synchronize
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
                    label={locals[this.props.lang].settings.global.publish}
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
                  ).ACTIVITIES_RUN.isBlocked()}
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
          </Dialog>
        </Feature>
        <Feature
          isActive={
            Settings.features(this.props.planStatus).PUBLICATION.isActive() &&
            this.state.isPublicationDialogOpen
          }
        >
          {this.props.userSession.connectionStatus === 'UNCONNECTED' ? (
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
              onClose={() => this.setState({ isPublicationDialogOpen: false })}
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
            </Dialog>
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
          <this.Global />
          <this.Timer />
          <this.Types />
          {this.props.sessions.length > 0 && <this.History />}
        </div>
      </div>
    )
  }
}
