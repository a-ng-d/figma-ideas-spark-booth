import {
  Bar,
  Button,
  Chip,
  ConsentConfiguration,
  Dialog,
  FeatureStatus,
  Input,
  Menu,
  layouts,
  texts,
} from '@a_ng_d/figmug-ui'
import React from 'react'
import { locals } from '../../content/locals'
import { Language, PlanStatus } from '../../types/app'
import {
  ActiveParticipants,
  ActivityConfiguration,
  IdeaConfiguration,
  SessionConfiguration,
  TypeConfiguration,
  UserConfiguration,
} from '../../types/configurations'
import { IdeasMessage } from '../../types/messages'
import { UserSession } from '../../types/user'
import features from '../../utils/config'
import { AppStates } from '../App'
import Feature from '../components/Feature'
import CreateIdea from '../modules/CreateIdea'
import FacilitatorInfo from '../modules/FacilitatorInfo'
import ParticipantInfo from '../modules/ParticipantInfo'
import UpdateIdeas from '../modules/UpdateIdeas'

interface ParticipateProps {
  activity: ActivityConfiguration
  session: SessionConfiguration
  ideas: Array<IdeaConfiguration>
  activeParticipants: Array<ActiveParticipants>
  userSession: UserSession
  userConsent: Array<ConsentConfiguration>
  userIdentity: UserConfiguration
  planStatus: PlanStatus
  lang: Language
  onPushIdea: (idea: IdeaConfiguration) => void
  onChangeIdeas: (ideas: Partial<AppStates>) => void
  onEndSession: (
    activity: ActivityConfiguration,
    ideas: Array<IdeaConfiguration>
  ) => void
}

interface ParticipateStates {
  canBeSubmitted: boolean
  isDialogOpen: boolean
  isFlaggedAsDone: boolean
  currentType: TypeConfiguration
  currentText: string
  selfIdeas: Array<IdeaConfiguration>
}

export default class Participate extends React.Component<
  ParticipateProps,
  ParticipateStates
> {
  ideasMessage: IdeasMessage
  textRef: React.RefObject<Input>

  static features = (planStatus: PlanStatus) => ({
    PARTICIPATE_END: new FeatureStatus({
      features: features,
      featureName: 'PARTICIPATE_END',
      planStatus: planStatus,
    }),
    PARTICIPATE_UPDATE: new FeatureStatus({
      features: features,
      featureName: 'PARTICIPATE_UPDATE',
      planStatus: planStatus,
    }),
    PARTICIPATE_INFO: new FeatureStatus({
      features: features,
      featureName: 'PARTICIPATE_INFO',
      planStatus: planStatus,
    }),
    PARTICIPATE_CREATE: new FeatureStatus({
      features: features,
      featureName: 'PARTICIPATE_CREATE',
      planStatus: planStatus,
    }),
    PARTICIPATE_FINISH: new FeatureStatus({
      features: features,
      featureName: 'PARTICIPATE_FINISH',
      planStatus: planStatus,
    }),
  })

  constructor(props: ParticipateProps) {
    super(props)
    this.ideasMessage = {
      type: 'UPDATE_IDEAS',
      data: this.props.ideas,
    }
    this.state = {
      canBeSubmitted: false,
      isDialogOpen: false,
      isFlaggedAsDone: false,
      currentType: this.props.activity.types[0],
      currentText: '',
      selfIdeas: this.props.ideas
        .filter(
          (idea) =>
            idea.userIdentity.id === this.props.userIdentity.id &&
            idea.sessionId === this.props.session.id
        )
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
    }
    this.textRef = React.createRef()
  }

  componentDidUpdate(prevProps: Readonly<ParticipateProps>): void {
    if (prevProps.ideas !== this.props.ideas) {
      this.setState({
        selfIdeas: this.props.ideas
          .filter(
            (idea) =>
              idea.userIdentity.id === this.props.userIdentity.id &&
              idea.sessionId === this.props.session.id
          )
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ),
      })
    }
  }

  // Handlers
  finishHandler = (): void => {
    if (!this.state.isFlaggedAsDone) {
      parent.postMessage(
        {
          pluginMessage: {
            type: 'FLAG_AS_DONE',
          },
        },
        '*'
      )
    } else {
      parent.postMessage(
        {
          pluginMessage: {
            type: 'UNFLAG_AS_DONE',
          },
        },
        '*'
      )
    }

    this.setState({ isFlaggedAsDone: !this.state.isFlaggedAsDone })
  }

  // Renders
  render() {
    return (
      <>
        <Bar
          leftPartSlot={
            <div className={layouts['snackbar--tight']}>
              <span className={`type ${texts['type']}`}>
                {this.props.activity.name}
              </span>
              {this.state.isFlaggedAsDone ? (
                <Chip>{locals[this.props.lang].participate.finished}</Chip>
              ) : (
                <Chip>{locals[this.props.lang].participate.onGoing}</Chip>
              )}
            </div>
          }
          rightPartSlot={
            <div className={layouts['snackbar--medium']}>
              <Feature
                isActive={
                  Participate.features(
                    this.props.planStatus
                  ).PARTICIPATE_END.isActive() &&
                  this.props.session.facilitator.id ===
                    this.props.userIdentity.id
                }
              >
                <Button
                  type="primary"
                  label={locals[this.props.lang].participate.endSession}
                  isBlocked={Participate.features(
                    this.props.planStatus
                  ).PARTICIPATE_END.isBlocked()}
                  isNew={Participate.features(
                    this.props.planStatus
                  ).PARTICIPATE_END.isNew()}
                  action={() => this.setState({ isDialogOpen: true })}
                />
              </Feature>
              <Feature
                isActive={
                  Participate.features(
                    this.props.planStatus
                  ).PARTICIPATE_END.isActive() &&
                  this.props.session.facilitator.id !==
                    this.props.userIdentity.id
                }
              >
                <Menu
                  id="open-session-tools"
                  type="ICON"
                  icon="ellipses"
                  options={[
                    {
                      label: this.state.isFlaggedAsDone
                        ? locals[this.props.lang].participate.unflagAsDone
                        : locals[this.props.lang].participate.flagAsDone,
                      type: 'OPTION',
                      isActive: Participate.features(
                        this.props.planStatus
                      ).PARTICIPATE_FINISH.isActive(),
                      isBlocked: Participate.features(
                        this.props.planStatus
                      ).PARTICIPATE_FINISH.isBlocked(),
                      isNew: Participate.features(
                        this.props.planStatus
                      ).PARTICIPATE_FINISH.isNew(),
                      action: this.finishHandler,
                    },
                    {
                      type: 'SEPARATOR',
                    },
                    {
                      label: locals[this.props.lang].participate.endSession,
                      type: 'OPTION',
                      isActive: Participate.features(
                        this.props.planStatus
                      ).PARTICIPATE_END.isActive(),
                      isBlocked: Participate.features(
                        this.props.planStatus
                      ).PARTICIPATE_END.isBlocked(),
                      isNew: Participate.features(
                        this.props.planStatus
                      ).PARTICIPATE_END.isNew(),
                      action: () => this.setState({ isDialogOpen: true }),
                    },
                  ]}
                  alignment="BOTTOM_RIGHT"
                />
              </Feature>
            </div>
          }
          border={['BOTTOM']}
        />
        <Feature
          isActive={
            Participate.features(
              this.props.planStatus
            ).PARTICIPATE_END.isActive() && this.state.isDialogOpen
          }
        >
          <Dialog
            title={
              this.props.session.facilitator.id !== this.props.userIdentity.id
                ? locals[this.props.lang].participate.endSessionDialog
                    .participantTitle
                : locals[this.props.lang].participate.endSessionDialog
                    .facilitatorTitle
            }
            actions={{
              destructive: {
                label: locals[this.props.lang].participate.endSession,
                action: () =>
                  this.props.onEndSession(
                    this.props.activity,
                    this.props.ideas.filter(
                      (idea) => idea.sessionId === this.props.session.id
                    )
                  ),
              },
              secondary: {
                label:
                  locals[this.props.lang].participate.endSessionDialog.cancel,
                action: () => this.setState({ isDialogOpen: false }),
              },
            }}
            onClose={() => this.setState({ isDialogOpen: false })}
          >
            <div className="dialog__text">
              <p className={`type ${texts.type}`}>
                {locals[this.props.lang].participate.endSessionDialog.message}
              </p>
            </div>
          </Dialog>
        </Feature>
        <section className="controller">
          <div className="controls">
            <div className="controls__control controls__control--horizontal">
              <Feature
                isActive={Participate.features(
                  this.props.planStatus
                ).PARTICIPATE_UPDATE.isActive()}
              >
                <UpdateIdeas {...this.props} />
              </Feature>
              <Feature
                isActive={Participate.features(
                  this.props.planStatus
                ).PARTICIPATE_INFO.isActive()}
              >
                {this.props.session.facilitator.id ===
                this.props.userIdentity.id ? (
                  <FacilitatorInfo
                    {...this.props}
                    ideas={this.props.ideas.filter(
                      (idea) => idea.sessionId === this.props.session.id
                    )}
                  />
                ) : (
                  <ParticipantInfo {...this.props} />
                )}
              </Feature>
            </div>
          </div>
          <Feature
            isActive={Participate.features(
              this.props.planStatus
            ).PARTICIPATE_CREATE.isActive()}
          >
            <CreateIdea {...this.props} />
          </Feature>
        </section>
      </>
    )
  }
}
