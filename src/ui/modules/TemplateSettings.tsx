import {
  Button,
  Section,
  SectionTitle,
  SimpleItem,
  texts,
  Thumbnail,
} from '@a_ng_d/figmug-ui'
import { FeatureStatus } from '@a_ng_d/figmug-utils'
import { PureComponent } from 'preact/compat'
import React from 'react'
import features from '../../config'
import { locals } from '../../content/locals'
import { EditorType, Language, PlanStatus } from '../../types/app'

interface TemplateSettingsProps {
  activityId: string
  editorType: EditorType
  planStatus: PlanStatus
  lang: Language
}

export default class TemplateSettings extends PureComponent<TemplateSettingsProps> {
  static features = (planStatus: PlanStatus) => ({
    SETTINGS_TEMPLATE: new FeatureStatus({
      features: features,
      featureName: 'SETTINGS_TEMPLATE',
      planStatus: planStatus,
    }),
  })

  // Render
  render() {
    return (
      <Section
        title={
          <SimpleItem
            leftPartSlot={
              <SectionTitle
                label={locals[this.props.lang].settings.template.title}
              />
            }
            isListItem={false}
          />
        }
        body={[
          {
            node: (
              <div
                style={{
                  padding: '0 var(--size-small)',
                }}
              >
                <div className={'card'}>
                  <div className={'card__screenshot'}>
                    <Thumbnail src="" />
                    <div className={'card__actions'}>
                      <Button
                        type="secondary"
                        label={
                          locals[this.props.lang].settings.template.addTemplate
                        }
                        action={() => null}
                      />
                      <Button
                        type="destructive"
                        label={
                          locals[this.props.lang].settings.template
                            .removeTemplate
                        }
                        action={() => null}
                      />
                    </div>
                  </div>

                  <span className={`type ${texts.type}`}>
                    {
                      locals[this.props.lang].settings.template.helper
                        .addViaFigJam
                    }
                  </span>
                </div>
              </div>
            ),
            spacingModifier: 'NONE',
          },
        ]}
        border={['BOTTOM']}
      />
    )
  }
}
