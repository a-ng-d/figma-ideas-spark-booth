import {
  Button,
  ConsentConfiguration,
  DropdownOption,
  Input,
  Menu,
  Message,
  SectionTitle,
  SemanticMessage,
  SimpleItem,
  layouts,
} from '@a_ng_d/figmug-ui'
import { FeatureStatus } from '@a_ng_d/figmug-utils'
import { PureComponent } from 'preact/compat'
import React from 'react'
import features from '../../config'
import { locals } from '../../content/locals'
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
import { ActionsList } from '../../types/models'
import { UserSession } from '../../types/user'
import { AppStates } from '../App'
import ColorChip from '../components/ColorChip'
import Feature from '../components/Feature'

interface UpdateIdeasProps {
  activity: ActivityConfiguration
  session: SessionConfiguration
  ideas: Array<IdeaConfiguration>
  activeParticipants: Array<ActiveParticipant>
  canParticipate: boolean
  userSession: UserSession
  userConsent: Array<ConsentConfiguration>
  userIdentity: UserConfiguration
  planStatus: PlanStatus
  lang: Language
  onChangeIdeas: (ideas: Partial<AppStates>) => void
}

interface UpdateIdeasStates {
  selfIdeas: Array<IdeaConfiguration>
}

export default class UpdateIdeas extends PureComponent<
  UpdateIdeasProps,
  UpdateIdeasStates
> {
  ideasMessage: IdeasMessage
  textRef: React.RefObject<Input>

  static features = (planStatus: PlanStatus) => ({
    PARTICIPATE: new FeatureStatus({
      features: features,
      featureName: 'PARTICIPATE',
      planStatus: planStatus,
    }),
    PARTICIPATE_UPDATE_TYPE: new FeatureStatus({
      features: features,
      featureName: 'PARTICIPATE_UPDATE_TYPE',
      planStatus: planStatus,
    }),
    PARTICIPATE_UPDATE_IDEA: new FeatureStatus({
      features: features,
      featureName: 'PARTICIPATE_UPDATE_IDEA',
      planStatus: planStatus,
    }),
    PARTICIPATE_UPDATE_REMOVE: new FeatureStatus({
      features: features,
      featureName: 'PARTICIPATE_UPDATE_REMOVE',
      planStatus: planStatus,
    }),
  })

  constructor(props: UpdateIdeasProps) {
    super(props)
    this.ideasMessage = {
      type: 'UPDATE_IDEAS',
      data: this.props.ideas,
    }
    this.state = {
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

  // Lyfecycle
  componentDidUpdate(prevProps: Readonly<UpdateIdeasProps>): void {
    if (prevProps.ideas !== this.props.ideas)
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

  // Direct actions
  setMessage = () => {
    if (!this.props.canParticipate)
      return (
        <div
          style={{
            padding: '0 var(--size-xsmall)',
          }}
        >
          <SemanticMessage
            type="INFO"
            message={locals[this.props.lang].info.blockedParticipation.replace(
              '$1',
              UpdateIdeas.features(this.props.planStatus).PARTICIPATE.result
                .limit + 1
            )}
          />
        </div>
      )
    else
      return (
        <Message
          icon="draft"
          messages={[locals[this.props.lang].participate.noSelfIdea]}
        />
      )
  }

  // Handlers
  typesHandler = () => {
    return this.props.activity.types.map((type) => {
      return {
        label: type.name,
        value: type.id,
        feature: 'UPDATE_TYPE',
        type: 'OPTION',
        action: (e) => this.ideasHandler(e, type),
      } as DropdownOption
    })
  }

  ideasHandler = (e: Event, type: TypeConfiguration) => {
    let id: string | null
    const element: HTMLElement | null = (e.target as HTMLElement).closest(
        '.simple-item'
      ),
      currentElement = e.currentTarget as HTMLInputElement

    element !== null ? (id = element.getAttribute('data-id')) : (id = null)

    const updateIdea = () => {
      this.ideasMessage.data = this.props.ideas.map((item) => {
        if (item.id === id) item.text = currentElement.value
        return item
      })

      sendData()
    }

    const removeIdea = () => {
      this.ideasMessage.data = this.props.ideas.filter((item) => item.id !== id)

      sendData()
    }

    const updateIdeaType = () => {
      this.ideasMessage.data = this.props.ideas.map((item) => {
        if (item.id === id) item.type = type
        return item
      })

      sendData()
    }

    const sendData = () => {
      this.props.onChangeIdeas({
        ideas: this.ideasMessage.data,
        onGoingStep: 'ideas changed',
      })

      parent.postMessage({ pluginMessage: this.ideasMessage }, '*')
    }

    const actions: ActionsList = {
      UPDATE_IDEA: () => updateIdea(),
      REMOVE_IDEA: () => removeIdea(),
      UPDATE_TYPE: () => updateIdeaType(),
      DEFAULT: () => null,
    }

    return actions[currentElement.dataset.feature ?? 'DEFAULT']?.()
  }

  // Renders
  render() {
    return (
      <div className="control__block control__block--list">
        <SimpleItem
          leftPartSlot={
            <SectionTitle
              label={locals[this.props.lang].participate.ideas}
              indicator={this.state.selfIdeas.length.toString()}
            />
          }
          isListItem={false}
        />
        {this.state.selfIdeas.length === 0 ? (
          this.setMessage()
        ) : (
          <ul className="list list--fill">
            {this.state.selfIdeas.map((idea, index) => (
              <SimpleItem
                key={index}
                id={idea.id}
                leftPartSlot={
                  <div
                    className={`${layouts['snackbar--tight']} ${layouts['snackbar--fill']} ${layouts['snackbar--start']}`}
                  >
                    <Feature
                      isActive={UpdateIdeas.features(
                        this.props.planStatus
                      ).PARTICIPATE_UPDATE_TYPE.isActive()}
                    >
                      <div className="simple-item__param">
                        <Menu
                          id={`update-type-${index}`}
                          type="ICON"
                          customIcon={<ColorChip color={idea.type.hex} />}
                          options={this.typesHandler()}
                          selected={idea.type.id}
                          state={
                            UpdateIdeas.features(
                              this.props.planStatus
                            ).PARTICIPATE_UPDATE_TYPE.isBlocked()
                              ? 'DISABLED'
                              : 'DEFAULT'
                          }
                          isNew={UpdateIdeas.features(
                            this.props.planStatus
                          ).PARTICIPATE_UPDATE_TYPE.isNew()}
                        />
                      </div>
                    </Feature>
                    <Feature
                      isActive={UpdateIdeas.features(
                        this.props.planStatus
                      ).PARTICIPATE_UPDATE_IDEA.isActive()}
                    >
                      <div className="simple-item__param simple-item__param--fill">
                        <Input
                          id={`update-text-${index}`}
                          type="LONG_TEXT"
                          value={idea.text}
                          feature="UPDATE_IDEA"
                          isGrowing={true}
                          isFlex={true}
                          isBlocked={UpdateIdeas.features(
                            this.props.planStatus
                          ).PARTICIPATE_UPDATE_IDEA.isBlocked()}
                          isNew={UpdateIdeas.features(
                            this.props.planStatus
                          ).PARTICIPATE_UPDATE_IDEA.isNew()}
                          onBlur={(e) => this.ideasHandler(e, idea.type)}
                          onConfirm={(e) => this.ideasHandler(e, idea.type)}
                        />
                      </div>
                    </Feature>
                  </div>
                }
                rightPartSlot={
                  <Feature
                    isActive={UpdateIdeas.features(
                      this.props.planStatus
                    ).PARTICIPATE_UPDATE_REMOVE.isActive()}
                  >
                    <Button
                      type="icon"
                      icon="trash"
                      feature="REMOVE_IDEA"
                      isBlocked={UpdateIdeas.features(
                        this.props.planStatus
                      ).PARTICIPATE_UPDATE_REMOVE.isBlocked()}
                      isNew={UpdateIdeas.features(
                        this.props.planStatus
                      ).PARTICIPATE_UPDATE_REMOVE.isNew()}
                      action={(e: Event) => this.ideasHandler(e, idea.type)}
                    />
                  </Feature>
                }
              />
            ))}
          </ul>
        )}
      </div>
    )
  }
}
