import {
  Chip,
  ConsentConfiguration,
  FeatureStatus,
  Message,
  SectionTitle,
  SimpleItem,
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
  TypeConfiguration,
  UserConfiguration,
} from '../../types/configurations'
import { UserSession } from '../../types/user'
import ColorChip from '../components/ColorChip'
import features from '../../utils/config'
import Feature from '../components/Feature'

interface FacilitatorInfoProps {
  activity: ActivityConfiguration
  ideas: Array<IdeaConfiguration>
  activeParticipants: Array<ActiveParticipants>
  userSession: UserSession
  userConsent: Array<ConsentConfiguration>
  userIdentity: UserConfiguration
  planStatus: PlanStatus
  lang: Language
}

interface FacilitatorInfoStates {
  canBeSubmitted: boolean
  currentType: TypeConfiguration
  currentText: string
  selfIdeas: Array<IdeaConfiguration>
}

export default class FacilitatorInfo extends React.Component<
  FacilitatorInfoProps,
  FacilitatorInfoStates
> {
  static features = (planStatus: PlanStatus) => ({
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

  render() {
    const sortedIdeas = this.props.ideas.reduce(
      (acc: { [key: string]: IdeaConfiguration[] }, idea) => {
        const { type } = idea
        if (!acc[type.name]) {
          acc[type.name] = []
        }
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
          <div className="group">
            <SimpleItem
              leftPartSlot={
                <SectionTitle
                  label={'Session ideas'}
                  indicator={this.props.ideas.length.toString()}
                />
              }
              isListItem={false}
              alignment="CENTER"
            />
            {this.props.ideas.length === 0 ? (
              <Message
                icon="draft"
                messages={[
                  locals[this.props.lang].participate.noParticipantIdea,
                ]}
              />
            ) : (
              <div className="group__item group__item--tight">
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
              </div>
            )}
          </div>
        </Feature>
        <Feature
          isActive={FacilitatorInfo.features(
            this.props.planStatus
          ).PARTICIPATE_INFO_PARTICIPANTS.isActive()}
        >
          <div className="group">
            <SimpleItem
              leftPartSlot={
                <SectionTitle
                  label={'Participants'}
                  indicator={this.props.activeParticipants.length.toString()}
                />
              }
              isListItem={false}
            />
            <div className="group__item group__item--tight">
              <ul className="list list--fill">
                {this.props.activeParticipants.map((participant, index) => (
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
                        {participant.hasFinished && (
                          <Chip>
                            {locals[this.props.lang].participate.finished}
                          </Chip>
                        )}
                      </div>
                    }
                  />
                ))}
              </ul>
            </div>
          </div>
        </Feature>
        <Feature
          isActive={
            FacilitatorInfo.features(
              this.props.planStatus
            ).PARTICIPATE_INFO_DESCRIPTION.isActive() &&
            this.props.activity.description !== ''
          }
        >
          <div className="group">
            <SimpleItem
              leftPartSlot={<SectionTitle label={'Description'} />}
              isListItem={false}
            />
            <div className="group__item">
              <div
                style={{ paddingLeft: 'var(--size-xxsmall)' }}
                className={`type ${texts['type']}`}
              >
                {this.props.activity.description}
              </div>
            </div>
          </div>
        </Feature>
        <Feature
          isActive={
            FacilitatorInfo.features(
              this.props.planStatus
            ).PARTICIPATE_INFO_INSTRUCTIONS.isActive() &&
            this.props.activity.instructions !== ''
          }
        >
          <div className="group">
            <SimpleItem
              leftPartSlot={<SectionTitle label={'Instructions'} />}
              isListItem={false}
            />
            <div className="group__item">
              <div
                style={{ paddingLeft: 'var(--size-xxsmall)' }}
                className={`type ${texts['type']}`}
              >
                {this.props.activity.instructions}
              </div>
            </div>
          </div>
        </Feature>
        <Feature
          isActive={FacilitatorInfo.features(
            this.props.planStatus
          ).PARTICIPATE_INFO_TYPES.isActive()}
        >
          <div className="group">
            <SimpleItem
              leftPartSlot={
                <SectionTitle
                  label={'Types'}
                  indicator={this.props.activity.types.length.toString()}
                />
              }
              isListItem={false}
            />
            <div className="group__item group__item--tight">
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
                          <span className={`type type--bold ${texts['type']}`}>
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
                    alignment={type.description === '' ? 'CENTER' : 'DEFAULT'}
                  />
                ))}
              </ul>
            </div>
          </div>
        </Feature>
      </div>
    )
  }
}
