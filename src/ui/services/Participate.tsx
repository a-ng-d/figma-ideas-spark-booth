import {
  Bar,
  Button,
  ConsentConfiguration,
  DropdownOption,
  Input,
  Menu,
  Message,
  SectionTitle,
  SimpleItem,
  layouts,
} from '@a_ng_d/figmug-ui'
import React from 'react'
import { uid } from 'uid'

import { Language, PlanStatus } from '../../types/app'
import {
  ActivityConfiguration,
  IdeaConfiguration,
  SessionConfiguration,
  TypeConfiguration,
  UserConfiguration,
} from '../../types/configurations'
import { IdeasMessage } from '../../types/messages'
import { ActionsList } from '../../types/models'
import { UserSession } from '../../types/user'
import features from '../../utils/config'
import isBlocked from '../../utils/isBlocked'
import { AppStates } from '../App'
import Feature from '../components/Feature'

interface ParticipateProps {
  activity: ActivityConfiguration
  session: SessionConfiguration
  ideas: Array<IdeaConfiguration>
  userSession: UserSession
  userConsent: Array<ConsentConfiguration>
  userIdentity: UserConfiguration
  planStatus: PlanStatus
  lang: Language
  onPushIdea: (idea: Partial<AppStates>) => void
  onChangeIdeas: (ideas: Partial<AppStates>) => void
}

interface ParticipateStates {
  hasMoreOptions: boolean
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
      hasMoreOptions: false,
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

  componentDidMount = () => {
    onmessage = (e: MessageEvent) => {
      const actions: ActionsList = {}

      return actions[e.data.pluginMessage?.type ?? 'DEFAULT']?.()
    }
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

  // Handlers
  typesHandler = (action: 'CREATE' | 'UPDATE') => {
    return this.props.activity.types.map((type, index) => {
      return {
        label: type.name,
        value: type.color,
        feature: 'UPDATE_TYPE',
        position: index,
        type: 'OPTION',
        isActive: true,
        isBlocked: false,
        isNew: false,
        children: [],
        action: (e) => {
          action === 'CREATE'
            ? this.setState({ currentType: type })
            : this.ideasHandler(e, type)
        },
      } as DropdownOption
    })
  }

  ideasHandler = (e: any, type: TypeConfiguration = this.state.currentType) => {
    let id: string | null
    const element: HTMLElement | null = (e.target as HTMLElement).closest(
        '.simple-item'
      ),
      currentElement: HTMLInputElement = e.currentTarget

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
      NULL: () => null,
    }

    return actions[currentElement.dataset.feature ?? 'NULL']?.()
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
      date: new Date().toISOString(),
      sessionId: this.props.session.id,
      activityId: this.props.activity.meta.id,
    }

    if (this.state.canBeSubmitted) {
      this.textRef.current?.doClear()
      setTimeout(() => this.textRef.current?.textareaRef.current?.focus(), 100)
      this.setState({ canBeSubmitted: false })

      this.props.onPushIdea({
        ideas: [...this.props.ideas, idea],
      })

      parent.postMessage(
        {
          pluginMessage: {
            type: 'PUSH_IDEA',
            data: [...this.props.ideas, idea],
          },
        },
        '*'
      )
    }
  }

  // Renders
  render() {
    return (
      <>
        <Bar
          leftPartSlot={
            <div className={layouts['snackbar--tight']}>
              <span className="type">{this.props.activity.name}</span>
            </div>
          }
          rightPartSlot={
            <div className={layouts['snackbar--tight']}>
              <Button
                type="secondary"
                label="End session"
                action={() => null}
              />
              <Button
                type="icon"
                icon="adjust"
                action={() =>
                  this.setState({ hasMoreOptions: !this.state.hasMoreOptions })
                }
              />
            </div>
          }
          border={['BOTTOM']}
        />
        <section className="controller">
          <div className="controls">
            <div className="controls__control controls__control--horizontal">
              <div className="control__block control__block--list">
                <SimpleItem
                  leftPartSlot={
                    <SectionTitle
                      label={'Ideas'}
                      indicator={this.state.selfIdeas.length.toString()}
                    />
                  }
                />
                {this.state.selfIdeas.length === 0 ? (
                  <Message
                    icon="draft"
                    messages={['No ideas yet']}
                  />
                ) : (
                  <ul className="list list--fill">
                    {this.state.selfIdeas.map((idea, index) => (
                      <SimpleItem
                        key={index}
                        id={idea.id}
                        leftPartSlot={
                          <>
                            <Feature
                              isActive={
                                features.find(
                                  (feature) =>
                                    feature.name === 'PARTICIPATE_UPDATE_TYPE'
                                )?.isActive
                              }
                            >
                              <div className="simple-item__param">
                                <Menu
                                  id={`update-type-${index}`}
                                  type="ICON"
                                  customIcon={
                                    <div
                                      className="color-chip"
                                      style={{
                                        backgroundColor: idea.type.hex,
                                      }}
                                    />
                                  }
                                  options={this.typesHandler('UPDATE')}
                                  selected={idea.type.color}
                                  state={
                                    isBlocked(
                                      'PARTICIPATE_UPDATE_TYPE',
                                      this.props.planStatus
                                    )
                                      ? 'DISABLED'
                                      : 'DEFAULT'
                                  }
                                  isNew={
                                    features.find(
                                      (feature) =>
                                        feature.name ===
                                        'PARTICIPATE_UPDATE_TYPE'
                                    )?.isNew
                                  }
                                />
                              </div>
                            </Feature>
                            <Feature
                              isActive={
                                features.find(
                                  (feature) =>
                                    feature.name === 'PARTICIPATE_UPDATE_IDEA'
                                )?.isActive
                              }
                            >
                              <div className="simple-item__param simple-item__param--fill">
                                <Input
                                  id={`update-text-${index}`}
                                  type="LONG_TEXT"
                                  value={idea.text}
                                  feature="UPDATE_IDEA"
                                  isGrowing={true}
                                  isFlex={true}
                                  isBlocked={isBlocked(
                                    'PARTICIPATE_UPDATE_IDEA',
                                    this.props.planStatus
                                  )}
                                  isNew={
                                    features.find(
                                      (feature) =>
                                        feature.name ===
                                        'PARTICIPATE_UPDATE_IDEA'
                                    )?.isNew
                                  }
                                  onBlur={(e) =>
                                    !isBlocked(
                                      'PARTICIPATE_UPDATE_IDEA',
                                      this.props.planStatus
                                    ) && this.ideasHandler(e)
                                  }
                                  onConfirm={(e) =>
                                    !isBlocked(
                                      'PARTICIPATE_UPDATE_IDEA',
                                      this.props.planStatus
                                    ) && this.ideasHandler(e)
                                  }
                                />
                              </div>
                            </Feature>
                          </>
                        }
                        rightPartSlot={
                          <Feature
                            isActive={
                              features.find(
                                (feature) =>
                                  feature.name === 'PARTICIPATE_UPDATE_REMOVE'
                              )?.isActive
                            }
                          >
                            <Button
                              type="icon"
                              icon="trash"
                              feature="REMOVE_IDEA"
                              isBlocked={isBlocked(
                                'PARTICIPATE_UPDATE_REMOVE',
                                this.props.planStatus
                              )}
                              action={(e) =>
                                !isBlocked(
                                  'PARTICIPATE_UPDATE_REMOVE',
                                  this.props.planStatus
                                ) && this.ideasHandler(e)
                              }
                            />
                          </Feature>
                        }
                      />
                    ))}
                  </ul>
                )}
              </div>
              <div className="control__block control__block--no-padding">
                <div className="group">
                  <SimpleItem
                    leftPartSlot={
                      <SectionTitle
                        label={'Notes'}
                        indicator={'3'}
                      />
                    }
                  />
                  <div className="group__item"></div>
                </div>
                <div className="group">
                  <SimpleItem
                    leftPartSlot={
                      <SectionTitle
                        label={'Participants'}
                        indicator={'3'}
                      />
                    }
                  />
                  <div className="group__item"></div>
                </div>
                <div className="group">
                  <SimpleItem
                    leftPartSlot={<SectionTitle label={'Description'} />}
                  />
                  <div className="group__item">
                    <p className="type">{this.props.activity.description}</p>
                  </div>
                </div>
                <div className="group">
                  <SimpleItem
                    leftPartSlot={<SectionTitle label={'Instructions'} />}
                  />
                  <div className="group__item">
                    <p className="type">{this.props.activity.instructions}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
                  options={this.typesHandler('CREATE')}
                  selected={this.state.currentType.color}
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
                  onConfirm={(e) =>
                    !isBlocked(
                      'PARTICIPATE_CREATE_IDEA',
                      this.props.planStatus
                    ) && this.onPushIdea()
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
                  action={(e) =>
                    !isBlocked(
                      'PARTICIPATE_CREATE_IDEA',
                      this.props.planStatus
                    ) && this.onPushIdea()
                  }
                />
              </div>
            </Feature>
          </div>
        </section>
      </>
    )
  }
}
