import {
  FormItem,
  Input,
  Section,
  SectionTitle,
  SimpleItem,
} from '@a_ng_d/figmug-ui'
import { FeatureStatus } from '@a_ng_d/figmug-utils'
import { PureComponent } from 'preact/compat'
import React from 'react'
import { locals } from '../../content/locals'
import { Language, PlanStatus } from '../../types/app'
import { ActivityConfiguration } from '../../types/configurations'
import features from '../../utils/config'
import Feature from '../components/Feature'

interface TimerSettingsProps {
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

export default class TimerSettings extends PureComponent<TimerSettingsProps> {
  static features = (planStatus: PlanStatus) => ({
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
  })

  // Templates
  Minutes = () => {
    return (
      <Feature
        isActive={TimerSettings.features(
          this.props.planStatus
        ).SETTINGS_TIMER_MINUTES.isActive()}
      >
        <FormItem
          label={locals[this.props.lang].settings.timer.minutes.label}
          id="update-timer-minutes"
          isBlocked={TimerSettings.features(
            this.props.planStatus
          ).SETTINGS_TIMER_MINUTES.isBlocked()}
          isNew={TimerSettings.features(
            this.props.planStatus
          ).SETTINGS_TIMER_MINUTES.isNew()}
        >
          <Input
            id="update-timer-minutes"
            type="NUMBER"
            value={this.props.activity.timer.minutes.toString()}
            min="0"
            max="60"
            isBlocked={TimerSettings.features(
              this.props.planStatus
            ).SETTINGS_TIMER_MINUTES.isBlocked()}
            feature="UPDATE_TIMER_MINUTES"
            onFocus={this.props.onChangeActivities}
            onBlur={this.props.onChangeActivities}
            onConfirm={this.props.onChangeActivities}
          />
        </FormItem>
      </Feature>
    )
  }

  Seconds = () => {
    return (
      <Feature
        isActive={TimerSettings.features(
          this.props.planStatus
        ).SETTINGS_TIMER_SECONDS.isActive()}
      >
        <FormItem
          label={locals[this.props.lang].settings.timer.seconds.label}
          id="update-timer-seconds"
          isBlocked={TimerSettings.features(
            this.props.planStatus
          ).SETTINGS_TIMER_SECONDS.isBlocked()}
          isNew={TimerSettings.features(
            this.props.planStatus
          ).SETTINGS_TIMER_SECONDS.isNew()}
        >
          <Input
            id="update-timer-seconds"
            type="NUMBER"
            value={this.props.activity.timer.seconds.toString()}
            min="0"
            max="59"
            isBlocked={TimerSettings.features(
              this.props.planStatus
            ).SETTINGS_TIMER_SECONDS.isBlocked()}
            feature="UPDATE_TIMER_SECONDS"
            onFocus={this.props.onChangeActivities}
            onBlur={this.props.onChangeActivities}
            onConfirm={this.props.onChangeActivities}
          />
        </FormItem>
      </Feature>
    )
  }

  render() {
    return (
      <Feature
        isActive={TimerSettings.features(
          this.props.planStatus
        ).SETTINGS_TIMER.isActive()}
      >
        <Section
          title={
            <SimpleItem
              leftPartSlot={
                <SectionTitle
                  label={locals[this.props.lang].settings.timer.title}
                />
              }
              isListItem={false}
            />
          }
          body={[
            {
              node: <this.Minutes />,
            },
            {
              node: <this.Seconds />,
            },
          ]}
          border={['BOTTOM']}
        />
      </Feature>
    )
  }
}
