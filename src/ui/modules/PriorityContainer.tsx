import {
  ConsentConfiguration,
  Dialog,
  FormItem,
  Input,
  texts,
} from '@a_ng_d/figmug-ui'
import { FeatureStatus } from '@a_ng_d/figmug-utils'
import * as Sentry from '@sentry/browser'
import { PureComponent } from 'preact/compat'
import React from 'react'
import cp from '../../content/images/choose_plan.webp'
import pp from '../../content/images/pro_plan.webp'
import t from '../../content/images/trial.webp'
import { locals } from '../../content/locals'
import {
  HighlightDigest,
  Language,
  PlanStatus,
  PriorityContext,
  TrialStatus,
} from '../../types/app'
import { UserConfiguration } from '../../types/configurations'
import { UserSession } from '../../types/user'
import features from '../../utils/config'
import type { AppStates } from '../App'
import Feature from '../components/Feature'
import About from './About'
import Highlight from './Highlight'

interface PriorityContainerProps {
  context: PriorityContext
  planStatus: PlanStatus
  trialStatus: TrialStatus
  userConsent: Array<ConsentConfiguration>
  userIdentity: UserConfiguration
  userSession: UserSession
  highlight: HighlightDigest
  lang: Language
  onChangePublication: React.Dispatch<Partial<AppStates>>
  onClose: React.Dispatch<Partial<AppStates>>
}

interface PriorityContainerStates {
  isPrimaryActionLoading: boolean
  isSecondaryActionLoading: boolean
  userFullName: string
  userEmail: string
  userMessage: string
}

export default class PriorityContainer extends PureComponent<
  PriorityContainerProps,
  PriorityContainerStates
> {
  counter: number

  static features = (planStatus: PlanStatus) => ({
    GET_PRO_PLAN: new FeatureStatus({
      features: features,
      featureName: 'GET_PRO_PLAN',
      planStatus: planStatus,
    }),
    SHORTCUTS_FEEDBACK: new FeatureStatus({
      features: features,
      featureName: 'SHORTCUTS_FEEDBACK',
      planStatus: planStatus,
    }),
    SHORTCUTS_HIGHLIGHT: new FeatureStatus({
      features: features,
      featureName: 'SHORTCUTS_HIGHLIGHT',
      planStatus: planStatus,
    }),
    SHORTCUTS_ABOUT: new FeatureStatus({
      features: features,
      featureName: 'SHORTCUTS_ABOUT',
      planStatus: planStatus,
    }),
    SHORTCUTS_REPORTING: new FeatureStatus({
      features: features,
      featureName: 'SHORTCUTS_REPORTING',
      planStatus: planStatus,
    }),
  })

  constructor(props: PriorityContainerProps) {
    super(props)
    this.counter = 0
    this.state = {
      isPrimaryActionLoading: false,
      isSecondaryActionLoading: false,
      userFullName: '',
      userEmail: '',
      userMessage: '',
    }
  }

  // Handlers
  reportHandler = () => {
    this.setState({ isPrimaryActionLoading: true })
    Sentry.sendFeedback(
      {
        name: this.state.userFullName,
        email: this.state.userEmail,
        message: this.state.userMessage,
      },
      {
        includeReplay: true,
      }
    )
      .then(() => {
        this.setState({
          userFullName: '',
          userEmail: '',
          userMessage: '',
        })
        parent.postMessage(
          {
            pluginMessage: {
              type: 'SEND_MESSAGE',
              message: locals[this.props.lang].success.report,
            },
          },
          '*'
        )
      })
      .finally(() => this.setState({ isPrimaryActionLoading: false }))
      .catch(() => {
        parent.postMessage(
          {
            pluginMessage: {
              type: 'SEND_MESSAGE',
              message: locals[this.props.lang].error.generic,
            },
          },
          '*'
        )
      })
  }

  // Templates
  TryPro = () => {
    return (
      <Feature
        isActive={PriorityContainer.features(
          this.props.planStatus
        ).GET_PRO_PLAN.isActive()}
      >
        <Dialog
          title={locals[this.props.lang].proPlan.trial.title}
          actions={{
            primary: {
              label: locals[this.props.lang].proPlan.trial.cta,
              action: () =>
                parent.postMessage(
                  { pluginMessage: { type: 'ENABLE_TRIAL' } },
                  '*'
                ),
            },
            secondary: {
              label: locals[this.props.lang].proPlan.trial.option,
              action: () =>
                parent.postMessage(
                  { pluginMessage: { type: 'GET_PRO_PLAN' } },
                  '*'
                ),
            },
          }}
          onClose={() =>
            this.props.onClose({
              priorityContainerContext: 'EMPTY',
            })
          }
        >
          <div className="dialog__cover">
            <img
              src={cp}
              style={{
                width: '100%',
              }}
            />
          </div>
          <div className="dialog__text">
            <p className={`type ${texts.type}`}>
              {locals[this.props.lang].proPlan.trial.message}
            </p>
          </div>
        </Dialog>
      </Feature>
    )
  }

  WelcomeToTrial = () => {
    return (
      <Feature
        isActive={PriorityContainer.features(
          this.props.planStatus
        ).GET_PRO_PLAN.isActive()}
      >
        <Dialog
          title={locals[this.props.lang].proPlan.welcome.title}
          actions={{
            primary: {
              label: locals[this.props.lang].proPlan.welcome.cta,
              action: () =>
                this.props.onClose({
                  priorityContainerContext: 'EMPTY',
                }),
            },
          }}
          onClose={() =>
            this.props.onClose({
              priorityContainerContext: 'EMPTY',
            })
          }
        >
          <div className="dialog__cover">
            <img
              src={t}
              style={{
                width: '100%',
              }}
            />
          </div>
          <div className="dialog__text">
            <p className={`type ${texts.type}`}>
              {locals[this.props.lang].proPlan.welcome.trial}
            </p>
          </div>
        </Dialog>
      </Feature>
    )
  }

  WelcomeToPro = () => {
    return (
      <Feature
        isActive={PriorityContainer.features(
          this.props.planStatus
        ).GET_PRO_PLAN.isActive()}
      >
        <Dialog
          title={locals[this.props.lang].proPlan.welcome.title}
          actions={{
            primary: {
              label: locals[this.props.lang].proPlan.welcome.cta,
              action: () =>
                this.props.onClose({
                  priorityContainerContext: 'EMPTY',
                }),
            },
          }}
          onClose={() =>
            this.props.onClose({
              priorityContainerContext: 'EMPTY',
            })
          }
        >
          <div className="dialog__cover">
            <img
              src={pp}
              style={{
                width: '100%',
              }}
            />
          </div>
          <div className="dialog__text">
            <p className={`type ${texts.type}`}>
              {locals[this.props.lang].proPlan.welcome.message}
            </p>
          </div>
        </Dialog>
      </Feature>
    )
  }

  Highlight = () => {
    return (
      <Feature
        isActive={PriorityContainer.features(
          this.props.planStatus
        ).SHORTCUTS_HIGHLIGHT.isActive()}
      >
        <Highlight
          {...this.props}
          onCloseHighlight={() =>
            this.props.onClose({
              priorityContainerContext: 'EMPTY',
              highlight: {
                version: this.props.highlight.version,
                status: 'NO_HIGHLIGHT',
              },
            })
          }
        />
      </Feature>
    )
  }

  About = () => {
    return (
      <Feature
        isActive={PriorityContainer.features(
          this.props.planStatus
        ).SHORTCUTS_ABOUT.isActive()}
      >
        <Dialog
          title={locals[this.props.lang].about.title}
          actions={{}}
          onClose={() =>
            this.props.onClose({
              priorityContainerContext: 'EMPTY',
            })
          }
        >
          <About
            planStatus={this.props.planStatus}
            trialStatus={this.props.trialStatus}
            lang={this.props.lang}
          />
        </Dialog>
      </Feature>
    )
  }

  Report = () => {
    return (
      <Feature
        isActive={PriorityContainer.features(
          this.props.planStatus
        ).SHORTCUTS_REPORTING.isActive()}
      >
        <Dialog
          title={locals[this.props.lang].report.title}
          actions={{
            primary: {
              label: locals[this.props.lang].report.cta,
              state: (() => {
                if (this.state.userMessage === '') {
                  return 'DISABLED'
                }
                if (this.state.isPrimaryActionLoading) return 'LOADING'
                return 'DEFAULT'
              })(),
              action: this.reportHandler,
            },
          }}
          onClose={() =>
            this.props.onClose({
              priorityContainerContext: 'EMPTY',
            })
          }
        >
          <div className="dialog__form">
            <div className="dialog__form__item">
              <FormItem
                label={locals[this.props.lang].report.fullName.label}
                id="type-fullname"
                shouldFill
              >
                <Input
                  type="TEXT"
                  value={this.state.userFullName}
                  isAutoFocus={true}
                  placeholder={
                    locals[this.props.lang].report.fullName.placeholder
                  }
                  onChange={(e) =>
                    this.setState({
                      userFullName: (e.target as HTMLInputElement).value,
                    })
                  }
                />
              </FormItem>
            </div>
            <div className="dialog__form__item">
              <FormItem
                label={locals[this.props.lang].report.email.label}
                id="type-email"
                shouldFill
              >
                <Input
                  type="TEXT"
                  value={this.state.userEmail}
                  placeholder={locals[this.props.lang].report.email.placeholder}
                  onChange={(e) =>
                    this.setState({
                      userEmail: (e.target as HTMLInputElement).value,
                    })
                  }
                />
              </FormItem>
            </div>
            <div className="dialog__form__item">
              <FormItem
                label={locals[this.props.lang].report.message.label}
                id="type-message"
                shouldFill
              >
                <Input
                  type="LONG_TEXT"
                  placeholder={
                    locals[this.props.lang].report.message.placeholder
                  }
                  value={this.state.userMessage}
                  isGrowing
                  onChange={(e) =>
                    this.setState({
                      userMessage: (e.target as HTMLInputElement).value,
                    })
                  }
                />
              </FormItem>
            </div>
          </div>
        </Dialog>
      </Feature>
    )
  }

  // Render
  render() {
    return (
      <>
        <Feature isActive={this.props.context === 'TRY'}>
          <this.TryPro />
        </Feature>
        <Feature isActive={this.props.context === 'WELCOME_TO_TRIAL'}>
          <this.WelcomeToTrial />
        </Feature>
        <Feature isActive={this.props.context === 'WELCOME_TO_PRO'}>
          <this.WelcomeToPro />
        </Feature>
        <Feature isActive={this.props.context === 'HIGHLIGHT'}>
          <this.Highlight />
        </Feature>
        <Feature isActive={this.props.context === 'ABOUT'}>
          <this.About />
        </Feature>
        <Feature isActive={this.props.context === 'REPORT'}>
          <this.Report />
        </Feature>
      </>
    )
  }
}
