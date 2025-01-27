import {
  Button,
  ConsentConfiguration,
  DropdownOption,
  Input,
  Menu,
} from '@a_ng_d/figmug-ui'
import { FeatureStatus } from '@a_ng_d/figmug-utils'
import { PureComponent } from 'preact/compat'
import React from 'react'
import { uid } from 'uid'
import features from '../../config'
import { Language, PlanStatus } from '../../types/app'
import {
  ActiveParticipant,
  ActivityConfiguration,
  IdeaConfiguration,
  SessionConfiguration,
  TypeConfiguration,
  UserConfiguration,
} from '../../types/configurations'
import { IdeasMessage } from '../../types/messages'
import { UserSession } from '../../types/user'
import ColorChip from '../components/ColorChip'
import Feature from '../components/Feature'

interface CreateIdeasProps {
  activity: ActivityConfiguration
  session: SessionConfiguration
  ideas: Array<IdeaConfiguration>
  activeParticipants: Array<ActiveParticipant>
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

export default class CreateIdeas extends PureComponent<CreateIdeasProps, CreateIdeasStates> {
  ideasMessage: IdeasMessage
  textRef: React.RefObject<Input>

  static features = (planStatus: PlanStatus) => ({
    PARTICIPATE_CREATE_TYPE: new FeatureStatus({
      features: features,
      featureName: 'PARTICIPATE_CREATE_TYPE',
      planStatus: planStatus,
    }),
    PARTICIPATE_CREATE_IDEA: new FeatureStatus({
      features: features,
      featureName: 'PARTICIPATE_CREATE_IDEA',
      planStatus: planStatus,
    }),
  })

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
    return this.props.activity.types.map((type) => {
      return {
        label: type.name,
        value: type.id,
        feature: 'UPDATE_TYPE',
        type: 'OPTION',
        action: () => this.setState({ currentType: type }),
      } as DropdownOption
    })
  }

  // Direct Actions
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

  // Render
  render() {
    return (
      <div className="idea-edit">
        <Feature
          isActive={CreateIdeas.features(
            this.props.planStatus
          ).PARTICIPATE_CREATE_TYPE.isActive()}
        >
          <div className="idea-edit__type">
            <Menu
              id={'update-type'}
              type="ICON"
              customIcon={<ColorChip color={this.state.currentType.hex} />}
              options={this.typesHandler()}
              selected={this.state.currentType.id}
              state={
                CreateIdeas.features(
                  this.props.planStatus
                ).PARTICIPATE_CREATE_TYPE.isBlocked()
                  ? 'DISABLED'
                  : 'DEFAULT'
              }
              alignment="TOP_LEFT"
              isNew={CreateIdeas.features(
                this.props.planStatus
              ).PARTICIPATE_CREATE_TYPE.isNew()}
            />
          </div>
        </Feature>
        <Feature
          isActive={CreateIdeas.features(
            this.props.planStatus
          ).PARTICIPATE_CREATE_IDEA.isActive()}
        >
          <div className="idea-edit__text">
            <Input
              ref={this.textRef}
              id="update-idea"
              type="LONG_TEXT"
              placeholder="Type your idea here"
              isGrowing={true}
              isBlocked={CreateIdeas.features(
                this.props.planStatus
              ).PARTICIPATE_CREATE_IDEA.isBlocked()}
              isNew={CreateIdeas.features(
                this.props.planStatus
              ).PARTICIPATE_CREATE_IDEA.isNew()}
              onChange={(e) => {
                const target = e.target as HTMLInputElement
                target.value.length > 0
                  ? this.setState({
                      canBeSubmitted: true,
                      currentText: target.value,
                    })
                  : this.setState({
                      canBeSubmitted: false,
                      currentText: target.value,
                    })
              }}
              onValid={this.onPushIdea}
            />
            <Button
              type="icon"
              icon="plus"
              isDisabled={!this.state.canBeSubmitted}
              isBlocked={CreateIdeas.features(
                this.props.planStatus
              ).PARTICIPATE_CREATE_IDEA.isBlocked()}
              isNew={CreateIdeas.features(
                this.props.planStatus
              ).PARTICIPATE_CREATE_IDEA.isNew()}
              action={this.onPushIdea}
            />
          </div>
        </Feature>
      </div>
    )
  }
}
