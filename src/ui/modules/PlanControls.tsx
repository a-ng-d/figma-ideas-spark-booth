import { Button, layouts, texts } from '@a_ng_d/figmug-ui'
import { doClassnames, FeatureStatus } from '@a_ng_d/figmug-utils'
import { PureComponent } from 'preact/compat'
import React from 'react'
import features, { trialFeedbackUrl } from '../../config'
import { locals } from '../../content/locals'
import { Language, PlanStatus, TrialStatus } from '../../types/app'
import Feature from '../components/Feature'

interface PlanControlsProps {
  planStatus: PlanStatus
  trialStatus: TrialStatus
  trialRemainingTime: number
  sessionCount: number
  lang: Language
  onGetProPlan: () => void
}

export default class PlanControls extends PureComponent<PlanControlsProps> {
  static features = (planStatus: PlanStatus) => ({
    ACTIVITIES_RUN: new FeatureStatus({
      features: features,
      featureName: 'ACTIVITIES_RUN',
      planStatus: planStatus,
    }),
    SHORTCUTS_FEEDBACK: new FeatureStatus({
      features: features,
      featureName: 'SHORTCUTS_FEEDBACK',
      planStatus: planStatus,
    }),
  })

  constructor(props: PlanControlsProps) {
    super(props)
    this.state = {
      isUserMenuLoading: false,
    }
  }

  // Templates
  SessionCount = () => (
    <div
      className={doClassnames([
        texts.type,
        texts['type--secondary'],
        texts['type--truncated'],
      ])}
    >
      {(PlanControls.features(this.props.planStatus).ACTIVITIES_RUN?.limit ??
        0) -
        this.props.sessionCount <=
        0 && <span>{locals[this.props.lang].plan.sessionCount.none}</span>}
      {(PlanControls.features(this.props.planStatus).ACTIVITIES_RUN?.limit ??
        0) -
        this.props.sessionCount ===
        1 && <span>{locals[this.props.lang].plan.sessionCount.single}</span>}
      {(PlanControls.features(this.props.planStatus).ACTIVITIES_RUN?.limit ??
        0) -
        this.props.sessionCount >
        1 && (
        <span>
          {locals[this.props.lang].plan.sessionCount.plural.replace(
            '$1',
            (PlanControls.features(this.props.planStatus).ACTIVITIES_RUN
              ?.limit ?? 0) - this.props.sessionCount
          )}
        </span>
      )}
    </div>
  )

  RemainingTime = () => (
    <div
      className={doClassnames([
        texts.type,
        texts['type--secondary'],
        texts['type--truncated'],
      ])}
    >
      {Math.ceil(this.props.trialRemainingTime) > 72 && (
        <span>
          {locals[this.props.lang].plan.trialTimeDays.plural.replace(
            '$1',
            Math.ceil(this.props.trialRemainingTime) > 72
              ? Math.ceil(this.props.trialRemainingTime / 24)
              : Math.ceil(this.props.trialRemainingTime)
          )}
        </span>
      )}
      {Math.ceil(this.props.trialRemainingTime) <= 72 &&
        Math.ceil(this.props.trialRemainingTime) > 1 && (
          <span>
            {locals[this.props.lang].plan.trialTimeHours.plural.replace(
              '$1',
              Math.ceil(this.props.trialRemainingTime)
            )}
          </span>
        )}
      {Math.ceil(this.props.trialRemainingTime) <= 1 && (
        <span>{locals[this.props.lang].plan.trialTimeHours.single}</span>
      )}
    </div>
  )

  FreePlan = () => (
    <>
      <Button
        type="alternative"
        size="small"
        icon="lock-off"
        label={locals[this.props.lang].plan.tryPro}
        action={this.props.onGetProPlan}
      />
      <span className={doClassnames([texts.type, texts['type--secondary']])}>
        {locals[this.props.lang].separator}
      </span>
      <this.SessionCount />
    </>
  )

  PendingTrial = () => <this.RemainingTime />

  ExpiredTrial = () => (
    <>
      <Button
        type="alternative"
        size="small"
        icon="lock-off"
        label={locals[this.props.lang].plan.getPro}
        action={this.props.onGetProPlan}
      />
      <span className={doClassnames([texts.type, texts['type--secondary']])}>
        {locals[this.props.lang].separator}
      </span>
      <this.SessionCount />
      <span className={doClassnames([texts.type, texts['type--secondary']])}>
        {locals[this.props.lang].separator}
      </span>
      <div
        className={doClassnames([
          texts.type,
          texts['type--secondary'],
          texts['type--truncated'],
        ])}
      >
        <span>{locals[this.props.lang].plan.trialEnded}</span>
      </div>
      <Feature
        isActive={PlanControls.features(
          this.props.planStatus
        ).SHORTCUTS_FEEDBACK.isActive()}
      >
        <span className={doClassnames([texts.type, texts['type--secondary']])}>
          {locals[this.props.lang].separator}
        </span>
        <Button
          type="tertiary"
          label={locals[this.props.lang].plan.trialFeedback}
          isBlocked={PlanControls.features(
            this.props.planStatus
          ).SHORTCUTS_FEEDBACK.isBlocked()}
          isNew={PlanControls.features(
            this.props.planStatus
          ).SHORTCUTS_FEEDBACK.isNew()}
          action={() =>
            parent.postMessage(
              {
                pluginMessage: {
                  type: 'OPEN_IN_BROWSER',
                  url: trialFeedbackUrl,
                },
              },
              '*'
            )
          }
        />
      </Feature>
    </>
  )

  // Render
  render() {
    return (
      <div className={doClassnames(['pro-zone', layouts['snackbar--tight']])}>
        {this.props.trialStatus === 'UNUSED' &&
          this.props.planStatus === 'UNPAID' && <this.FreePlan />}
        {this.props.trialStatus === 'PENDING' && <this.PendingTrial />}
        {this.props.trialStatus === 'EXPIRED' &&
          this.props.planStatus === 'UNPAID' && <this.ExpiredTrial />}
      </div>
    )
  }
}
