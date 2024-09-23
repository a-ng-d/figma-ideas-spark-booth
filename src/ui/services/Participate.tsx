import {
  Bar,
  Button,
  ConsentConfiguration,
  DraggableItem,
  Dropdown,
  DropdownOption,
  Input,
  SectionTitle,
  Tabs,
  layouts,
  texts,
} from '@a_ng_d/figmug-ui'
import React from 'react'
import { uid } from 'uid'

import { Language, PlanStatus } from '../../types/app'
import { ContextItem } from '../../types/app'
import {
  ActivityConfiguration,
  IdeaConfiguration,
  NoteConfiguration,
  SessionConfiguration,
  UserConfiguration,
} from '../../types/configurations'
import { ActionsList } from '../../types/models'
import { UserSession } from '../../types/user'
import features from '../../utils/config'
import { setContexts } from '../../utils/setContexts'
import { AppStates } from '../App'
import Activities from '../contexts/Activities'

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
}

interface ParticipateStates {
  hasMoreOptions: boolean
  currentTime: number
  currentNoteType: NoteConfiguration
}

export default class Participate extends React.Component<
  ParticipateProps,
  ParticipateStates
> {
  contexts: Array<ContextItem>
  timer: number

  constructor(props: ParticipateProps) {
    super(props)
    this.contexts = setContexts(['ACTIVITY', 'EXPLORE'])
    this.state = {
      hasMoreOptions: false,
      currentTime: 0,
      currentNoteType: this.props.activity.noteTypes[0],
    }
    this.timer = 0
  }

  componentDidMount = () => {
    onmessage = (e: MessageEvent) => {
      const startTimer = () => {
        this.setState({ currentTime: e.data.pluginMessage.data })
        this.timer = setInterval(
          () => this.setState({ currentTime: this.state.currentTime - 1 }),
          1000
        )
      }

      const actions: ActionsList = {
        START_TIMER: () => startTimer(),
      }

      return actions[e.data.pluginMessage?.type ?? 'DEFAULT']?.()
    }
  }

  // Handlers
  noteTypeHandler = () => {
    return this.props.activity.noteTypes.map((noteType, index) => {
      return {
        label: noteType.name,
        value: noteType.color,
        feature: 'UPDATE_NOTE_TYPE_COLOR',
        position: index,
        type: 'OPTION',
        isActive: true,
        isBlocked: false,
        isNew: false,
        children: [],
        action: () => this.setState({ currentNoteType: noteType }),
      } as DropdownOption
    })
  }

  // Direct actions
  onPushIdea = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
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
                {this.props.ideas
                  .filter(
                    (idea) =>
                      idea.sessionId === this.props.session.id &&
                      idea.userIdentity.id === this.props.userIdentity.id
                  )
                  .map((idea, index) => (
                    <div
                      key={index}
                      data-id={idea.id}
                    >
                      <Dropdown
                        id={`idea-${index}`}
                        options={this.noteTypeHandler()}
                        selected={idea.noteType.color}
                        alignment="FILL"
                        isNew={
                          features.find(
                            (feature) =>
                              feature.name === 'PARTICIPATE_UPDATE_NOTE_TYPE'
                          )?.isNew
                        }
                      />
                      <Input
                        id={`idea-${index}`}
                        type="LONG_TEXT"
                        value={idea.text}
                        isGrowing={true}
                        onConfirm={(e) => this.onPushIdea(e)}
                      />
                      <Button
                        type="icon"
                        icon="trash"
                        action={() => null}
                      />
                    </div>
                  ))}
              </div>
              <div className="control__block control__block--no-padding">
                <div className="group">
                  <div className="section-controls">
                    <div className="section-controls__left-part">
                      <SectionTitle
                        label={'Notes'}
                        indicator={'3'}
                      />
                    </div>
                    <div className="section-controls__right-part"></div>
                  </div>
                  <div className="group__item"></div>
                </div>
                <div className="group">
                  <div className="section-controls">
                    <div className="section-controls__left-part">
                      <SectionTitle
                        label={'Participants'}
                        indicator={'3'}
                      />
                    </div>
                    <div className="section-controls__right-part"></div>
                  </div>
                  <div className="group__item"></div>
                </div>
                <div className="group">
                  <div className="section-controls">
                    <div className="section-controls__left-part">
                      <SectionTitle label={'Description'} />
                    </div>
                    <div className="section-controls__right-part"></div>
                  </div>
                  <div className="group__item">
                    <p className="type">{this.props.activity.description}</p>
                  </div>
                </div>
                <div className="group">
                  <div className="section-controls">
                    <div className="section-controls__left-part">
                      <SectionTitle label={'Instructions'} />
                    </div>
                    <div className="section-controls__right-part"></div>
                  </div>
                  <div className="group__item">
                    <p className="type">{this.props.activity.instructions}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="idea-edit">
            <div className="idea-edit__text">
              <Input
                id="update-idea"
                type="LONG_TEXT"
                placeholder="Type your note here"
                isGrowing={true}
                onConfirm={(e) => this.onPushIdea(e)}
              />
            </div>
            <div className="idea-edit__note-type">
              <div className={layouts['snackbar--tight']}>
                <div
                  style={{
                    width: 'var(--size-xsmall)',
                    height: 'var(--size-xsmall)',
                    borderRadius: '2px',
                    outline: '1px solid rgba(0, 0, 0, 0.1)',
                    outlineOffset: '-1px',
                    backgroundColor: this.state.currentNoteType.hex,
                  }}
                />
                <Dropdown
                  id="update-note-type-color"
                  options={this.noteTypeHandler()}
                  selected={this.state.currentNoteType.color}
                  alignment="FILL"
                  isNew={
                    features.find(
                      (feature) =>
                        feature.name === 'PARTICIPATE_UPDATE_NOTE_TYPE'
                    )?.isNew
                  }
                />
              </div>
            </div>
          </div>
        </section>
      </>
    )
  }
}
