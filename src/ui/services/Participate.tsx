import {
  Bar,
  Button,
  ConsentConfiguration,
  Dropdown,
  DropdownOption,
  Input,
  Menu,
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
  NoteConfiguration,
  SessionConfiguration,
  UserConfiguration,
} from '../../types/configurations'
import { IdeasMessage } from '../../types/messages'
import { ActionsList } from '../../types/models'
import { UserSession } from '../../types/user'
import features from '../../utils/config'
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
  currentNoteType: NoteConfiguration
}

export default class Participate extends React.Component<
  ParticipateProps,
  ParticipateStates
> {
  ideasMessage: IdeasMessage

  constructor(props: ParticipateProps) {
    super(props)
    this.ideasMessage = {
      type: 'UPDATE_IDEAS',
      data: this.props.ideas,
    }
    this.state = {
      hasMoreOptions: false,
      currentNoteType: this.props.activity.noteTypes[0],
    }
  }

  componentDidMount = () => {
    onmessage = (e: MessageEvent) => {
      const actions: ActionsList = {}

      return actions[e.data.pluginMessage?.type ?? 'DEFAULT']?.()
    }
  }

  // Handlers
  noteTypeHandler = (type: 'CREATE' | 'UPDATE') => {
    return this.props.activity.noteTypes.map((noteType, index) => {
      return {
        label: noteType.name,
        value: noteType.color,
        feature: 'UPDATE_TYPE',
        position: index,
        type: 'OPTION',
        isActive: true,
        isBlocked: false,
        isNew: false,
        children: [],
        action: (e) => {
          type === 'CREATE'
            ? this.setState({ currentNoteType: noteType })
            : this.ideasHandler(e)
        },
      } as DropdownOption
    })
  }

  ideasHandler = (e: any) => {
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
        if (item.id === id) item.noteType = this.state.currentNoteType
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
  onPushIdea = (
    e: React.KeyboardEvent<Element> | React.MouseEvent<Element, MouseEvent>
  ) => {
    const idea: IdeaConfiguration = {
      id: uid(),
      text: (e.target as HTMLTextAreaElement).value,
      noteType: this.state.currentNoteType,
      userIdentity: {
        id: this.props.userIdentity.id,
        fullName: this.props.userIdentity.fullName,
        avatar: this.props.userIdentity.avatar,
      },
      sessionId: this.props.session.id,
      activityId: this.props.activity.meta.id,
    }

    ;(e.target as HTMLTextAreaElement).value = ''

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
              <div className="control__block control__block--no-padding">
                <ul className="list">
                  {this.props.ideas
                    .filter(
                      (idea) =>
                        idea.sessionId === this.props.session.id &&
                        idea.userIdentity.id === this.props.userIdentity.id
                    )
                    .map((idea, index) => (
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
                                  id={`idea-${index}`}
                                  type="ICON"
                                  customIcon={
                                    <div
                                      className="color-chip"
                                      style={{
                                        backgroundColor: idea.noteType.hex,
                                      }}
                                    />
                                  }
                                  options={this.noteTypeHandler('UPDATE')}
                                  selected={idea.noteType.color}
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
                                  id={`idea-${index}`}
                                  type="LONG_TEXT"
                                  value={idea.text}
                                  isGrowing={true}
                                  isFlex={true}
                                  feature="UPDATE_IDEA"
                                  onConfirm={this.ideasHandler}
                                />
                              </div>
                            </Feature>
                          </>
                        }
                        rightPartSlot={
                          <Button
                            type="icon"
                            icon="trash"
                            feature="REMOVE_IDEA"
                            action={this.ideasHandler}
                          />
                        }
                      />
                    ))}
                </ul>
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
                  (feature) => feature.name === 'PARTICIPATE_CREATE_IDEA'
                )?.isActive
              }
            >
              <div className="idea-edit__text">
                <Input
                  id="update-idea"
                  type="LONG_TEXT"
                  placeholder="Type your idea here"
                  isGrowing={true}
                  onConfirm={(e) => this.onPushIdea(e)}
                />
                <Button
                  type="icon"
                  icon="plus"
                  action={(e) => this.onPushIdea(e)}
                />
              </div>
            </Feature>
            <Feature
              isActive={
                features.find(
                  (feature) => feature.name === 'PARTICIPATE_CREATE_TYPE'
                )?.isActive
              }
            >
              <div className="idea-edit__type">
                <div
                  className="color-chip"
                  style={{
                    backgroundColor: this.state.currentNoteType.hex,
                  }}
                />
                <Dropdown
                  id="update-note-type-color"
                  options={this.noteTypeHandler('CREATE')}
                  selected={this.state.currentNoteType.color}
                  alignment="FILL"
                  isNew={
                    features.find(
                      (feature) => feature.name === 'PARTICIPATE_CREATE_TYPE'
                    )?.isNew
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
