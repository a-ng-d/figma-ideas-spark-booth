import {
  Dropdown,
  FormItem,
  Input,
  Section,
  SectionTitle,
  SimpleItem,
} from '@a_ng_d/figmug-ui'
import React from 'react'
import { PureComponent } from 'preact/compat'
import { locals } from '../../content/locals'
import { Language, PlanStatus } from '../../types/app'
import { ActivityConfiguration } from '../../types/configurations'
import features from '../../utils/config'
import Feature from '../components/Feature'
import { FeatureStatus } from '@a_ng_d/figmug-utils'

interface GlobalSettingsProps {
  activity: ActivityConfiguration
  planStatus: PlanStatus
  lang: Language
  onChangeActivities: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | Element>
      | React.KeyboardEvent<
          HTMLInputElement | HTMLTextAreaElement | Element | HTMLLIElement
        >
      | React.TargetedEvent<HTMLButtonElement | HTMLLIElement>
  ) => void
}

export default class GlobalSettings extends PureComponent<GlobalSettingsProps> {
  static features = (planStatus: PlanStatus) => ({
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
  })

  // Templates
  Name = () => {
    return (
      <Feature
        isActive={GlobalSettings.features(
          this.props.planStatus
        ).SETTINGS_NAME.isActive()}
      >
        <FormItem
          label={locals[this.props.lang].settings.global.name.label}
          id="update-activity-name"
          isBlocked={GlobalSettings.features(
            this.props.planStatus
          ).SETTINGS_NAME.isBlocked()}
        >
          <Input
            id="update-activity-name"
            type="TEXT"
            value={this.props.activity.name}
            charactersLimit={64}
            feature="RENAME_ACTIVITY"
            isBlocked={GlobalSettings.features(
              this.props.planStatus
            ).SETTINGS_NAME.isBlocked()}
            isNew={GlobalSettings.features(
              this.props.planStatus
            ).SETTINGS_NAME.isNew()}
            onFocus={this.props.onChangeActivities}
            onBlur={this.props.onChangeActivities}
            onConfirm={this.props.onChangeActivities}
          />
        </FormItem>
      </Feature>
    )
  }

  Description = () => {
    return (
      <Feature
        isActive={GlobalSettings.features(
          this.props.planStatus
        ).SETTINGS_DESCRIPTION.isActive()}
      >
        <FormItem
          label={locals[this.props.lang].settings.global.description.label}
          id="update-activity-description"
          isBlocked={GlobalSettings.features(
            this.props.planStatus
          ).SETTINGS_DESCRIPTION.isBlocked()}
        >
          <Input
            id="update-activity-description"
            type="LONG_TEXT"
            placeholder={
              locals[this.props.lang].settings.global.description.placeholder
            }
            value={this.props.activity.description}
            feature="UPDATE_DESCRIPTION"
            isBlocked={GlobalSettings.features(
              this.props.planStatus
            ).SETTINGS_DESCRIPTION.isBlocked()}
            isNew={GlobalSettings.features(
              this.props.planStatus
            ).SETTINGS_DESCRIPTION.isNew()}
            isGrowing={true}
            onFocus={this.props.onChangeActivities}
            onBlur={this.props.onChangeActivities}
            onConfirm={this.props.onChangeActivities}
          />
        </FormItem>
      </Feature>
    )
  }

  Instructions = () => {
    return (
      <Feature
        isActive={GlobalSettings.features(
          this.props.planStatus
        ).SETTINGS_INSTRUCTIONS.isActive()}
      >
        <FormItem
          label={locals[this.props.lang].settings.global.instructions.label}
          id="update-activity-instructions"
          isBlocked={GlobalSettings.features(
            this.props.planStatus
          ).SETTINGS_INSTRUCTIONS.isBlocked()}
        >
          <Input
            id="update-activity-instructions"
            type="LONG_TEXT"
            placeholder={
              locals[this.props.lang].settings.global.instructions.placeholder
            }
            value={this.props.activity.instructions}
            feature="UPDATE_INSTRUCTIONS"
            isBlocked={GlobalSettings.features(
              this.props.planStatus
            ).SETTINGS_INSTRUCTIONS.isBlocked()}
            isNew={GlobalSettings.features(
              this.props.planStatus
            ).SETTINGS_INSTRUCTIONS.isNew()}
            isGrowing={true}
            onFocus={this.props.onChangeActivities}
            onBlur={this.props.onChangeActivities}
            onConfirm={this.props.onChangeActivities}
          />
        </FormItem>
      </Feature>
    )
  }

  GroupedBy = () => {
    return (
      <Feature
        isActive={GlobalSettings.features(
          this.props.planStatus
        ).SETTINGS_GROUPED_BY.isActive()}
      >
        <FormItem
          id="update-grouped-by"
          label={locals[this.props.lang].settings.global.groupedBy.label}
          isBlocked={GlobalSettings.features(
            this.props.planStatus
          ).SETTINGS_GROUPED_BY.isBlocked()}
        >
          <Dropdown
            id="update-grouped-by"
            options={[
              {
                label:
                  locals[this.props.lang].settings.global.groupedBy.participant,
                value: 'PARTICIPANT',
                feature: 'UPDATE_GROUPED_BY',
                type: 'OPTION',
                position: 0,
                isActive: GlobalSettings.features(
                  this.props.planStatus
                ).SETTINGS_GROUPED_BY_PARTICIPANT.isActive(),
                isBlocked: GlobalSettings.features(
                  this.props.planStatus
                ).SETTINGS_GROUPED_BY_PARTICIPANT.isBlocked(),
                isNew: GlobalSettings.features(
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
                isActive: GlobalSettings.features(
                  this.props.planStatus
                ).SETTINGS_GROUPED_BY_TYPE.isActive(),
                isBlocked: GlobalSettings.features(
                  this.props.planStatus
                ).SETTINGS_GROUPED_BY_TYPE.isBlocked(),
                isNew: GlobalSettings.features(
                  this.props.planStatus
                ).SETTINGS_GROUPED_BY_TYPE.isNew(),
                action: this.props.onChangeActivities,
              },
            ]}
            selected={this.props.activity.groupedBy}
            isBlocked={GlobalSettings.features(
              this.props.planStatus
            ).SETTINGS_GROUPED_BY.isBlocked()}
            isNew={GlobalSettings.features(
              this.props.planStatus
            ).SETTINGS_GROUPED_BY.isNew()}
          />
        </FormItem>
      </Feature>
    )
  }

  // Render
  render() {
    return (
      <Section
        title={
          <SimpleItem
            leftPartSlot={
              <SectionTitle
                label={locals[this.props.lang].settings.global.title}
              />
            }
            isListItem={false}
          />
        }
        body={[
          {
            node: <this.Name />,
          },
          {
            node: <this.Description />,
          },
          {
            node: <this.Instructions />,
          },
          {
            node: <this.GroupedBy />,
          },
        ]}
        border={['BOTTOM']}
      />
    )
  }
}