import {
  ConsentConfiguration,
  FeatureStatus,
  SectionTitle,
  SimpleItem,
  layouts,
  texts,
} from '@a_ng_d/figmug-ui'
import React from 'react'
import { Language, PlanStatus } from '../../types/app'
import {
  ActivityConfiguration,
  IdeaConfiguration,
  TypeConfiguration,
  UserConfiguration,
} from '../../types/configurations'
import { UserSession } from '../../types/user'
import ColorChip from '../components/ColorChip'
import features from '../../utils/config'
import Feature from '../components/Feature'

interface ParticipantInfoProps {
  activity: ActivityConfiguration
  userSession: UserSession
  userConsent: Array<ConsentConfiguration>
  userIdentity: UserConfiguration
  planStatus: PlanStatus
  lang: Language
}

interface ParticipantInfoStates {
  canBeSubmitted: boolean
  currentType: TypeConfiguration
  currentText: string
  selfIdeas: Array<IdeaConfiguration>
}

export default class ParticipantInfo extends React.Component<
  ParticipantInfoProps,
  ParticipantInfoStates
> {
  static features = (planStatus: PlanStatus) => ({
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
    return (
      <div
        className="control__block control__block--no-padding"
        style={{
          flex: '0 1 296px',
        }}
      >
        <Feature
          isActive={
            ParticipantInfo.features(
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
            ParticipantInfo.features(
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
          isActive={ParticipantInfo.features(
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
