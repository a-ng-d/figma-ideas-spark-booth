import {
  Button,
  Chip,
  ConsentConfiguration,
  Message,
  Section,
  SectionTitle,
  SemanticMessage,
  SimpleItem,
  layouts,
  texts,
} from '@a_ng_d/figmug-ui'
import { FeatureStatus } from '@a_ng_d/figmug-utils'
import { PureComponent } from 'preact/compat'
import React from 'react'
import features from '../../config'
import { locals } from '../../content/locals'
import { Language, PlanStatus, PriorityContext } from '../../types/app'
import {
  ActiveParticipant,
  ActivityConfiguration,
  IdeaConfiguration,
  UserConfiguration,
} from '../../types/configurations'
import { UserSession } from '../../types/user'
import ColorChip from '../components/ColorChip'
import Feature from '../components/Feature'

interface FacilitatorInfoProps {
  activity: ActivityConfiguration
  ideas: Array<IdeaConfiguration>
  activeParticipants: Array<ActiveParticipant>
  userSession: UserSession
  userConsent: Array<ConsentConfiguration>
  userIdentity: UserConfiguration
  planStatus: PlanStatus
  lang: Language
  onGetProPlan: (context: { priorityContainerContext: PriorityContext }) => void
}

interface FacilitatorInfoStates {
  isParticipantsMessageVisible: boolean
}

export default class FacilitatorInfo extends PureComponent<
  FacilitatorInfoProps,
  FacilitatorInfoStates
> {
  static features = (planStatus: PlanStatus) => ({
    PARTICIPATE: new FeatureStatus({
      features: features,
      featureName: 'PARTICIPATE',
      planStatus: planStatus,
    }),
    PARTICIPATE_INFO_IDEAS: new FeatureStatus({
      features: features,
      featureName: 'PARTICIPATE_INFO_IDEAS',
      planStatus: planStatus,
    }),
    PARTICIPATE_INFO_PARTICIPANTS: new FeatureStatus({
      features: features,
      featureName: 'PARTICIPATE_INFO_PARTICIPANTS',
      planStatus: planStatus,
    }),
    PARTICIPATE_INFO_DESCRIPTION: new FeatureStatus({
      features: features,
      featureName: 'PARTICIPATE_INFO_DESCRIPTION',
      planStatus: planStatus,
    }),
    PARTICIPATE_INFO_INSTRUCTIONS: new FeatureStatus({
      features: features,
      featureName: 'PARTICIPATE_INFO_INSTRUCTIONS',
      planStatus: planStatus,
    }),
    PARTICIPATE_INFO_TYPES: new FeatureStatus({
      features: features,
      featureName: 'PARTICIPATE_INFO_TYPES',
      planStatus: planStatus,
    }),
  })

  constructor(props: FacilitatorInfoProps) {
    super(props)
    this.state = {
      isParticipantsMessageVisible: true,
    }
  }

  render() {
    const sortedIdeas = this.props.ideas.reduce(
      (acc: { [key: string]: IdeaConfiguration[] }, idea) => {
        const { type } = idea
        if (!acc[type.name]) acc[type.name] = []

        acc[type.name].push(idea)
        return acc
      },
      {} as { [key: string]: IdeaConfiguration[] }
    )

    return (
      <div
        className="control__block control__block--no-padding"
        style={{
          flex: '0 1 296px',
        }}
      >
        <Feature
          isActive={FacilitatorInfo.features(
            this.props.planStatus
          ).PARTICIPATE_INFO_IDEAS.isActive()}
        >
          <Section
            title={
              <SimpleItem
                leftPartSlot={
                  <SectionTitle
                    label={
                      locals[this.props.lang].participate.info.sessionIdeas
                    }
                    indicator={this.props.ideas.length.toString()}
                  />
                }
                isListItem={false}
              />
            }
            body={[
              {
                node: (() =>
                  this.props.ideas.length === 0 ? (
                    <Message
                      icon="draft"
                      messages={[
                        locals[this.props.lang].participate.noParticipantIdea,
                      ]}
                    />
                  ) : (
                    <ul>
                      {Object.values(sortedIdeas).map((ideas, index) => (
                        <SimpleItem
                          key={index}
                          leftPartSlot={
                            <div className={layouts['snackbar--medium']}>
                              <ColorChip color={ideas[0].type.hex} />
                              <span
                                className={`type ${texts['type']}`}
                              >{`${ideas.length} ${ideas[0].type.name}`}</span>
                            </div>
                          }
                        />
                      ))}
                    </ul>
                  ))(),
                spacingModifier:
                  this.props.ideas.length === 0 ? 'NONE' : 'TIGHT',
              },
            ]}
            border={['BOTTOM']}
          />
        </Feature>
        <Feature
          isActive={FacilitatorInfo.features(
            this.props.planStatus
          ).PARTICIPATE_INFO_PARTICIPANTS.isActive()}
        >
          <Section
            title={
              <SimpleItem
                leftPartSlot={
                  <SectionTitle
                    label={
                      locals[this.props.lang].participate.info.participants
                    }
                    indicator={this.props.activeParticipants.length.toString()}
                  />
                }
                isListItem={false}
              />
            }
            body={[
              {
                node: (() =>
                  this.state.isParticipantsMessageVisible && (
                    <SemanticMessage
                      type="INFO"
                      message={locals[this.props.lang].info.inviteParticipants}
                      actionsSlot={
                        <Button
                          type="icon"
                          icon="close"
                          action={() =>
                            this.setState({
                              isParticipantsMessageVisible: false,
                            })
                          }
                        />
                      }
                    />
                  ))(),
              },
              {
                node: (() =>
                  this.props.activeParticipants.some(
                    (participant) => participant.isBlocked
                  ) && (
                    <SemanticMessage
                      type="WARNING"
                      message={locals[
                        this.props.lang
                      ].warning.blockedParticipations.replace(
                        '$1',
                        FacilitatorInfo.features(this.props.planStatus)
                          .PARTICIPATE.result.limit + 1
                      )}
                      actionsSlot={
                        <Button
                          type="secondary"
                          label={locals[this.props.lang].plan.tryPro}
                          action={() =>
                            this.props.onGetProPlan({
                              priorityContainerContext: 'TRY',
                            })
                          }
                        />
                      }
                    />
                  ))(),
              },
              {
                node: (
                  <ul className="list list--fill">
                    {this.props.activeParticipants
                      .sort(
                        (a, b) =>
                          new Date(a.joinedAt).getTime() -
                          new Date(b.joinedAt).getTime()
                      )
                      .map((participant, index) => (
                        <SimpleItem
                          key={index}
                          leftPartSlot={
                            <div className="user">
                              <div className="user__avatar">
                                <img
                                  src={participant.userIdentity.avatar}
                                  alt={participant.userIdentity.fullName}
                                />
                              </div>
                              <span className={`type ${texts['type']}`}>
                                {participant.userIdentity.fullName}
                              </span>
                              {participant.userIdentity.id ===
                                this.props.userIdentity.id && (
                                <span
                                  className={`type ${texts['type']}  ${texts['type--secondary']}`}
                                >
                                  {locals[this.props.lang].user.you}
                                </span>
                              )}
                              {participant.hasFinished && (
                                <Chip>
                                  {locals[this.props.lang].participate.finished}
                                </Chip>
                              )}
                              {participant.isBlocked && (
                                <Chip>
                                  {locals[this.props.lang].participate.blocked}
                                </Chip>
                              )}
                            </div>
                          }
                        />
                      ))}
                  </ul>
                ),
                spacingModifier: 'TIGHT',
              },
            ]}
            border={['BOTTOM']}
          />
        </Feature>
        <Feature
          isActive={
            FacilitatorInfo.features(
              this.props.planStatus
            ).PARTICIPATE_INFO_DESCRIPTION.isActive() &&
            this.props.activity.description !== ''
          }
        >
          <Section
            title={
              <SimpleItem
                leftPartSlot={
                  <SectionTitle
                    label={locals[this.props.lang].participate.info.description}
                  />
                }
                isListItem={false}
              />
            }
            body={[
              {
                node: (
                  <div
                    style={{ paddingBottom: 'var(--size-xxsmall)' }}
                    className={`type ${texts['type']}`}
                    dangerouslySetInnerHTML={{
                      __html: this.props.activity.description.replace(
                        /\n/g,
                        '<br />'
                      ),
                    }}
                  />
                ),
                spacingModifier: 'LARGE',
              },
            ]}
            border={['BOTTOM']}
          />
        </Feature>
        <Feature
          isActive={
            FacilitatorInfo.features(
              this.props.planStatus
            ).PARTICIPATE_INFO_INSTRUCTIONS.isActive() &&
            this.props.activity.instructions !== ''
          }
        >
          <Section
            title={
              <SimpleItem
                leftPartSlot={
                  <SectionTitle
                    label={
                      locals[this.props.lang].participate.info.instructions
                    }
                  />
                }
                isListItem={false}
              />
            }
            body={[
              {
                node: (
                  <div
                    style={{ paddingBottom: 'var(--size-xxsmall)' }}
                    className={`type ${texts['type']}`}
                    dangerouslySetInnerHTML={{
                      __html: this.props.activity.instructions.replace(
                        /\n/g,
                        '<br />'
                      ),
                    }}
                  />
                ),
                spacingModifier: 'LARGE',
              },
            ]}
            border={['BOTTOM']}
          />
        </Feature>
        <Feature
          isActive={FacilitatorInfo.features(
            this.props.planStatus
          ).PARTICIPATE_INFO_TYPES.isActive()}
        >
          <Section
            title={
              <SimpleItem
                leftPartSlot={
                  <SectionTitle
                    label={locals[this.props.lang].participate.info.types}
                    indicator={this.props.activity.types.length.toString()}
                  />
                }
                isListItem={false}
              />
            }
            body={[
              {
                node: (
                  <ul>
                    {this.props.activity.types.map((type, index) => (
                      <SimpleItem
                        key={index}
                        leftPartSlot={
                          <div
                            className={`${layouts['snackbar--medium']} ${layouts['snackbar--start']} ${layouts['snackbar--fill']}`}
                          >
                            <div className="simple-item__param">
                              <ColorChip color={type.hex} />
                            </div>
                            <div
                              className={`simple-item__param simple-item__param--fill ${layouts['stackbar--tight']}`}
                            >
                              <span
                                className={`type type--bold ${texts['type']}`}
                              >
                                {type.name}
                              </span>
                              {type.description !== '' && (
                                <span className={`type ${texts['type']}`}>
                                  {type.description}
                                </span>
                              )}
                            </div>
                          </div>
                        }
                        alignment={
                          type.description === '' ? 'CENTER' : 'DEFAULT'
                        }
                      />
                    ))}
                  </ul>
                ),
                spacingModifier: 'TIGHT',
              },
            ]}
          />
        </Feature>
      </div>
    )
  }
}
