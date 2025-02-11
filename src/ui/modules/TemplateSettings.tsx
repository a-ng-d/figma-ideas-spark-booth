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
import { ActionsList } from 'src/types/models'

interface TemplateSettingsProps {
  activityId: string
  editorType: EditorType
  planStatus: PlanStatus
  lang: Language
}

interface TemplateSettingsState {
  screenshot: Uint8Array | null
  selection: SceneNode | null
}

export default class TemplateSettings extends PureComponent<
  TemplateSettingsProps,
  TemplateSettingsState
> {
  static features = (planStatus: PlanStatus) => ({
    SETTINGS_TEMPLATE: new FeatureStatus({
      features: features,
      featureName: 'SETTINGS_TEMPLATE',
      planStatus: planStatus,
    }),
  })

  constructor(props: TemplateSettingsProps) {
    super(props)
    this.state = {
      screenshot: null,
      selection: null,
    }
  }

  // Lifecycle
  componentDidMount = () => {
    window.addEventListener('message', this.handleMessage)
  }

  componentWillUnmount = () => {
    window.removeEventListener('message', this.handleMessage)
  }

  // Handlers
  handleMessage = (e: MessageEvent) => {
    const actions: ActionsList = {
      GET_SELECTION: () =>
        this.setState({
          selection: e.data.pluginMessage?.selection,
          screenshot: e.data.pluginMessage?.screenshot,
        }),
      DEFAULT: () => null,
    }

    return actions[e.data.pluginMessage?.type ?? 'DEFAULT']?.()
  }

  // Direct Actions
  getImageSrc = (screenshot: Uint8Array | null) => {
    if (screenshot !== null) {
      const blob = new Blob([screenshot], {
        type: 'image/png',
      })
      return URL.createObjectURL(blob)
    } else return ''
  }

  // Render
  render() {
    console.log(
      this.state.screenshot,
      this.state.selection,
      this.getImageSrc(this.state.screenshot)
    )

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
                    <Thumbnail src={this.getImageSrc(this.state.screenshot)} />
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
