import {
  Bar,
  Button,
  ConsentConfiguration,
  Input,
  layouts,
  texts,
} from '@a_ng_d/figmug-ui'
import React from 'react'

import { Language, PlanStatus } from '../../types/app'
import {
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
  activeParticipants: Array<UserConfiguration>
  userSession: UserSession
  userConsent: Array<ConsentConfiguration>
  userIdentity: UserConfiguration
  planStatus: PlanStatus
  lang: Language
  onPushIdea: (idea: Partial<AppStates>) => void
  onChangeIdeas: (ideas: Partial<AppStates>) => void
  onEndSession: (
    activity: ActivityConfiguration,
    ideas: Array<IdeaConfiguration>
  ) => void
}

interface ParticipateStates {
  canBeSubmitted: boolean
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

  constructor(props: ParticipateProps) {
    super(props)
    this.ideasMessage = {
      type: 'UPDATE_IDEAS',
      data: this.props.ideas,
    }
    this.state = {
      canBeSubmitted: false,
      currentType: this.props.activity.types[0],
      currentText: '',
      selfIdeas: this.props.ideas
        .filter(
          (idea) =>
            idea.userIdentity.id === this.props.userIdentity.id &&
            idea.sessionId === this.props.session.id
        )
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
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
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          ),
      })
    }
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
            </div>
          }
          rightPartSlot={
            <div className={layouts['snackbar--tight']}>
              <Feature
                isActive={
                  features.find((feature) => feature.name === 'PARTICIPATE_END')
                    ?.isActive &&
                  this.props.session.facilitator.id ===
                    this.props.userIdentity.id
                }
              >
                <Button
                  type="secondary"
                  label="End session"
                  action={() =>
                    this.props.onEndSession(
                      this.props.activity,
                      this.props.ideas.filter(
                        (idea) => idea.sessionId === this.props.session.id
                      )
                    )
                  }
                />
              </Feature>
            </div>
          }
          border={['BOTTOM']}
        />
        <section className="controller">
          <div className="controls">
            <div className="controls__control controls__control--horizontal">
              <Feature
                isActive={
                  features.find(
                    (feature) => feature.name === 'PARTICIPATE_UPDATE'
                  )?.isActive
                }
              >
                <UpdateIdeas {...this.props} />
              </Feature>
              <Feature
                isActive={
                  features.find(
                    (feature) => feature.name === 'PARTICIPATE_INFO'
                  )?.isActive
                }
              >
                {this.props.session.facilitator.id ===
                this.props.userIdentity.id ? (
                  <FacilitatorInfo {...this.props} />
                ) : (
                  <ParticipantInfo {...this.props} />
                )}
              </Feature>
            </div>
          </div>
          <Feature
            isActive={
              features.find((feature) => feature.name === 'PARTICIPATE_CREATE')
                ?.isActive
            }
          >
            <CreateIdea {...this.props} />
          </Feature>
        </section>
      </>
    )
  }
}
