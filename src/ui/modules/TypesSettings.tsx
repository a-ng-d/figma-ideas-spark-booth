import {
  Button,
  ConsentConfiguration,
  Dropdown,
  FormItem,
  Input,
  Section,
  SectionTitle,
  SemanticMessage,
  SimpleItem,
  SortableList,
} from '@a_ng_d/figmug-ui'
import { FeatureStatus } from '@a_ng_d/figmug-utils'
import { PureComponent } from 'preact/compat'
import React from 'react'
import { uid } from 'uid'
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
} from '../../config'
import { locals } from '../../content/locals'
import { Language, PlanStatus, PriorityContext } from '../../types/app'
import {
  ActivityConfiguration,
  ColorConfiguration,
  TypeConfiguration,
  UserConfiguration,
} from '../../types/configurations'
import { TypeEvent } from '../../types/events'
import { ActionsList } from '../../types/models'
import { trackTypeEvent } from '../../utils/eventsTracker'
import ColorChip from '../components/ColorChip'
import Feature from '../components/Feature'

interface TypesSettingsProps {
  activity: ActivityConfiguration
  userIdentity: UserConfiguration
  userConsent: Array<ConsentConfiguration>
  planStatus: PlanStatus
  lang: Language
  onChangeTypes: (types: Array<TypeConfiguration>) => void
  onGetProPlan: (context: { priorityContainerContext: PriorityContext }) => void
}

export default class TypesSettings extends PureComponent<TypesSettingsProps> {
  static features = (planStatus: PlanStatus) => ({
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
  })

  // Handlers
  typeHandler = (e: Event) => {
    let id: string | null
    const element: HTMLElement | null = (e.target as HTMLElement).closest(
        '.draggable-item'
      ),
      currentElement = e.currentTarget as HTMLInputElement

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

      trackTypeEvent(
        this.props.userIdentity.id,
        this.props.userConsent.find((consent) => consent.id === 'mixpanel')
          ?.isConsented ?? false,
        {
          feature: currentElement.dataset.feature,
        } as TypeEvent
      )
    }

    const renameType = () => {
      const types = this.props.activity.types.map((type) => {
        if (type.id === id) type.name = (e.target as HTMLInputElement).value
        return type
      })

      this.props.onChangeTypes(types)

      trackTypeEvent(
        this.props.userIdentity.id,
        this.props.userConsent.find((consent) => consent.id === 'mixpanel')
          ?.isConsented ?? false,
        {
          feature: currentElement.dataset.feature,
        } as TypeEvent
      )
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

      trackTypeEvent(
        this.props.userIdentity.id,
        this.props.userConsent.find((consent) => consent.id === 'mixpanel')
          ?.isConsented ?? false,
        {
          feature: currentElement.dataset.feature,
        } as TypeEvent
      )
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

      trackTypeEvent(
        this.props.userIdentity.id,
        this.props.userConsent.find((consent) => consent.id === 'mixpanel')
          ?.isConsented ?? false,
        {
          feature: currentElement.dataset.feature,
        } as TypeEvent
      )
    }

    const actions: ActionsList = {
      ADD_TYPE: () => addType(),
      RENAME_TYPE: () => renameType(),
      UPDATE_COLOR: () => updateTypeColor(),
      UPDATE_DESCRIPTION: () => updateTypeDescription(),
      REMOVE_ITEM: () => removeType(),
      DEFAULT: () => null,
    }

    return actions[currentElement.dataset.feature ?? 'DEFAULT']?.()
  }

  onChangeOrder = (types: Array<TypeConfiguration>) => {
    this.props.onChangeTypes(types)

    trackTypeEvent(
      this.props.userIdentity.id,
      this.props.userConsent.find((consent) => consent.id === 'mixpanel')
        ?.isConsented ?? false,
      {
        feature: 'REORDER_TYPES',
      } as TypeEvent
    )
  }

  render() {
    return (
      <Section
        title={
          <SimpleItem
            leftPartSlot={
              <SectionTitle
                label={locals[this.props.lang].settings.types.title}
                indicator={this.props.activity.types.length}
              />
            }
            rightPartSlot={
              <Feature
                isActive={TypesSettings.features(
                  this.props.planStatus
                ).SETTINGS_TYPES_ADD.isActive()}
              >
                <Button
                  type="icon"
                  icon="plus"
                  feature="ADD_TYPE"
                  isBlocked={TypesSettings.features(
                    this.props.planStatus
                  ).SETTINGS_TYPES.isReached(this.props.activity.types.length)}
                  isNew={TypesSettings.features(
                    this.props.planStatus
                  ).SETTINGS_TYPES_ADD.isNew()}
                  action={this.typeHandler}
                />
              </Feature>
            }
            isListItem={false}
          />
        }
        body={[
          {
            node: (
              <Feature
                isActive={TypesSettings.features(
                  this.props.planStatus
                ).SETTINGS_TYPES.isReached(this.props.activity.types.length)}
              >
                <SemanticMessage
                  type="INFO"
                  message={locals[
                    this.props.lang
                  ].info.maxNumberOfTypes.replace(
                    '$1',
                    TypesSettings.features(this.props.planStatus).SETTINGS_TYPES
                      .result.limit
                  )}
                  actionsSlot={
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
              </Feature>
            ),
          },
          {
            node: (
              <SortableList
                data={this.props.activity.types as Array<TypeConfiguration>}
                canBeEmpty={false}
                primarySlot={this.props.activity.types.map((type) => (
                  <>
                    <Feature
                      isActive={TypesSettings.features(
                        this.props.planStatus
                      ).SETTINGS_TYPES_NAME.isActive()}
                    >
                      <div className="draggable-item__param--compact">
                        <Input
                          type="TEXT"
                          value={type.name}
                          charactersLimit={24}
                          feature="RENAME_TYPE"
                          isBlocked={TypesSettings.features(
                            this.props.planStatus
                          ).SETTINGS_TYPES_NAME.isBlocked()}
                          isNew={TypesSettings.features(
                            this.props.planStatus
                          ).SETTINGS_TYPES_NAME.isNew()}
                          onBlur={this.typeHandler}
                          onConfirm={this.typeHandler}
                        />
                      </div>
                    </Feature>
                    <Feature
                      isActive={TypesSettings.features(
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
                                type: 'OPTION',
                                action: this.typeHandler,
                              },
                              {
                                label:
                                  locals[this.props.lang].settings.types.colors
                                    .red,
                                value: 'RED',
                                feature: 'UPDATE_COLOR',
                                type: 'OPTION',
                                action: this.typeHandler,
                              },
                              {
                                label:
                                  locals[this.props.lang].settings.types.colors
                                    .orange,
                                value: 'ORANGE',
                                feature: 'UPDATE_COLOR',
                                type: 'OPTION',
                                action: this.typeHandler,
                              },
                              {
                                label:
                                  locals[this.props.lang].settings.types.colors
                                    .yellow,
                                value: 'YELLOW',
                                feature: 'UPDATE_COLOR',
                                type: 'OPTION',
                                action: this.typeHandler,
                              },
                              {
                                label:
                                  locals[this.props.lang].settings.types.colors
                                    .green,
                                value: 'GREEN',
                                feature: 'UPDATE_COLOR',
                                type: 'OPTION',
                                action: this.typeHandler,
                              },
                              {
                                label:
                                  locals[this.props.lang].settings.types.colors
                                    .blue,
                                value: 'BLUE',
                                feature: 'UPDATE_COLOR',
                                type: 'OPTION',
                                action: this.typeHandler,
                              },
                              {
                                label:
                                  locals[this.props.lang].settings.types.colors
                                    .violet,
                                value: 'VIOLET',
                                feature: 'UPDATE_COLOR',
                                type: 'OPTION',
                                action: this.typeHandler,
                              },
                              {
                                label:
                                  locals[this.props.lang].settings.types.colors
                                    .pink,
                                value: 'PINK',
                                feature: 'UPDATE_COLOR',
                                type: 'OPTION',
                                action: this.typeHandler,
                              },
                              {
                                label:
                                  locals[this.props.lang].settings.types.colors
                                    .lightGray,
                                value: 'LIGHT_GRAY',
                                feature: 'UPDATE_COLOR',
                                type: 'OPTION',
                                action: this.typeHandler,
                              },
                            ]}
                            selected={type.color}
                            alignment="FILL"
                            isBlocked={TypesSettings.features(
                              this.props.planStatus
                            ).SETTINGS_TYPES_COLOR.isBlocked()}
                            isNew={TypesSettings.features(
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
                    isActive={TypesSettings.features(
                      this.props.planStatus
                    ).SETTINGS_TYPES_DESCRIPTION.isActive()}
                  >
                    <div className="draggable-item__param">
                      <FormItem
                        id="type-description"
                        label={
                          locals[this.props.lang].settings.types.description
                            .label
                        }
                        isBlocked={TypesSettings.features(
                          this.props.planStatus
                        ).SETTINGS_TYPES_DESCRIPTION.isBlocked()}
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
                          isBlocked={TypesSettings.features(
                            this.props.planStatus
                          ).SETTINGS_TYPES_DESCRIPTION.isBlocked()}
                          isNew={TypesSettings.features(
                            this.props.planStatus
                          ).SETTINGS_TYPES_DESCRIPTION.isNew()}
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
            ),
            spacingModifier: 'NONE',
          },
        ]}
        border={['BOTTOM']}
      />
    )
  }
}
