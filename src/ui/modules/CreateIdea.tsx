import {
  Button,
  ConsentConfiguration,
  DropdownOption,
  Input,
  Menu,
} from '@a_ng_d/figmug-ui'
import React from 'react'
import { uid } from 'uid'
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
import isBlocked from '../../utils/isBlocked'
import Feature from '../components/Feature'

interface CreateIdeasProps {
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
}

interface CreateIdeasStates {
  canBeSubmitted: boolean
  currentType: TypeConfiguration
  currentText: string
}

export default class CreateIdeas extends React.Component<
  CreateIdeasProps,
  CreateIdeasStates
> {
  ideasMessage: IdeasMessage
  textRef: React.RefObject<Input>

  constructor(props: CreateIdeasProps) {
    super(props)
    this.ideasMessage = {
      type: 'UPDATE_IDEAS',
      data: this.props.ideas,
    }
    this.state = {
      canBeSubmitted: false,
      currentType: this.props.activity.types[0],
      currentText: '',
    }
    this.textRef = React.createRef()
  }

  // Handlers
  typesHandler = () => {
    return this.props.activity.types.map((type, index) => {
      return {
        label: type.name,
        value: type.id,
        feature: 'UPDATE_TYPE',
        position: index,
        type: 'OPTION',
        isActive: true,
        isBlocked: false,
        isNew: false,
        children: [],
        action: () => this.setState({ currentType: type }),
      } as DropdownOption
    })
  }

  // Direct actions
  onPushIdea = () => {
    const idea: IdeaConfiguration = {
      id: uid(),
      text: this.state.currentText,
      type: this.state.currentType,
      userIdentity: {
        id: this.props.userIdentity.id,
        fullName: this.props.userIdentity.fullName,
        avatar: this.props.userIdentity.avatar,
      },
      createdAt: new Date().toISOString(),
      sessionId: this.props.session.id,
      activityId: this.props.activity.meta.id,
    }

    if (this.state.canBeSubmitted) {
      this.textRef.current?.doClear()
      setTimeout(() => this.textRef.current?.textareaRef.current?.focus(), 100)
      this.setState({ canBeSubmitted: false })

      this.props.onPushIdea(idea)
    }
  }

  // Renders
  render() {
    return (
      <div className="idea-edit">
        <Feature
          isActive={
            features.find(
              (feature) => feature.name === 'PARTICIPATE_CREATE_TYPE'
            )?.isActive
          }
        >
          <div className="idea-edit__type">
            <Menu
              id={'update-type'}
              type="ICON"
              customIcon={
                <div
                  className="color-chip"
                  style={{
                    backgroundColor: this.state.currentType.hex,
                  }}
                />
              }
              options={this.typesHandler()}
              selected={this.state.currentType.id}
              state={
                isBlocked('PARTICIPATE_CREATE_TYPE', this.props.planStatus)
                  ? 'DISABLED'
                  : 'DEFAULT'
              }
              alignment="TOP_LEFT"
              isNew={
                features.find(
                  (feature) => feature.name === 'PARTICIPATE_CREATE_TYPE'
                )?.isNew
              }
            />
          </div>
        </Feature>
        <Feature
          isActive={
            features.find(
              (feature) => feature.name === 'PARTICIPATE_CREATE_IDEA'
            )?.isActive
          }
        >
          <div className="idea-edit__text">
            <Input
              ref={this.textRef}
              id="update-idea"
              type="LONG_TEXT"
              placeholder="Type your idea here"
              isGrowing={true}
              isBlocked={isBlocked(
                'PARTICIPATE_CREATE_IDEA',
                this.props.planStatus
              )}
              isNew={
                features.find(
                  (feature) => feature.name === 'PARTICIPATE_CREATE_IDEA'
                )?.isNew
              }
              onChange={(e) =>
                e.target.value.length > 0
                  ? this.setState({
                      canBeSubmitted: true,
                      currentText: e.target.value,
                    })
                  : this.setState({
                      canBeSubmitted: false,
                      currentText: e.target.value,
                    })
              }
              onConfirm={() =>
                !isBlocked('PARTICIPATE_CREATE_IDEA', this.props.planStatus) &&
                this.onPushIdea()
              }
            />
            <Button
              type="icon"
              icon="plus"
              isBlocked={isBlocked(
                'PARTICIPATE_CREATE_IDEA',
                this.props.planStatus
              )}
              isDisabled={!this.state.canBeSubmitted}
              action={() =>
                !isBlocked('PARTICIPATE_CREATE_IDEA', this.props.planStatus) &&
                this.onPushIdea()
              }
            />
          </div>
        </Feature>
      </div>
    )
  }
}
