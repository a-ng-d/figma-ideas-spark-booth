import {
  ConsentConfiguration,
  Section,
  SectionTitle,
  SimpleItem,
  layouts,
  texts,
  ColorChip,
} from '@a_ng_d/figmug-ui'
import { FeatureStatus } from '@a_ng_d/figmug-utils'
import { PureComponent } from 'preact/compat'
import React from 'react'
import features from '../../config'
import { locals } from '../../content/locals'
import { Language, PlanStatus } from '../../types/app'
import {
  ActivityConfiguration,
  UserConfiguration,
} from '../../types/configurations'
import { UserSession } from '../../types/user'
import Feature from '../components/Feature'

interface ParticipantInfoProps {
  activity: ActivityConfiguration
  userSession: UserSession
  userConsent: Array<ConsentConfiguration>
  userIdentity: UserConfiguration
  planStatus: PlanStatus
  lang: Language
}

export default class ParticipantInfo extends PureComponent<ParticipantInfoProps> {
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
      <>
        <Feature
          isActive={
            ParticipantInfo.features(
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
                    className={`${texts['type']}`}
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
            ParticipantInfo.features(
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
                    className={`${texts['type']}`}
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
          isActive={ParticipantInfo.features(
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
                                className={`${texts['type']} ${texts['type--bold']}`}
                              >
                                {type.name}
                              </span>
                              {type.description !== '' && (
                                <span className={`${texts['type']}`}>
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
      </>
    )
  }
}
