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
  screenshot: string | undefined
  selection: object | undefined
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
      screenshot: undefined,
      selection: undefined,
    }
  }

  // Lifecycle
  componentDidMount = () => {
    window.addEventListener('message', this.handleMessage)
    parent.postMessage(
      {
        pluginMessage: {
          type: 'GET_TEMPLATE',
          activityId: this.props.activityId,
        },
      },
      '*'
    )
    parent.postMessage(
      {
        pluginMessage: {
          type: 'GET_THUMBNAIL',
          activityId: this.props.activityId,
        },
      },
      '*'
    )
    parent.postMessage(
      {
        pluginMessage: {
          type: 'SUBSCRIBE_SELECTION',
        },
      },
      '*'
    )
  }

  componentWillUnmount = () => {
    window.removeEventListener('message', this.handleMessage)
    parent.postMessage(
      {
        pluginMessage: {
          type: 'UNSUBSCRIBE_SELECTION',
        },
      },
      '*'
    )
  }

  // Handlers
  handleMessage = (e: MessageEvent) => {
    const actions: ActionsList = {
      GET_SELECTION: async () =>
        this.setState({
          selection: e.data.pluginMessage?.selection as object,
          screenshot: await this.getImageSrc(
            e.data.pluginMessage?.screenshot as Uint8Array | null
          ),
        }),
      GET_THUMBNAIL: () =>
        this.setState({
          screenshot: e.data.pluginMessage?.screenshot as string | undefined,
        }),
      GET_TEMPLATE: () =>
        this.setState({
          selection: e.data.pluginMessage?.selection as object | undefined,
        }),
      DEFAULT: () => null,
    }

    return actions[e.data.pluginMessage?.type ?? 'DEFAULT']?.()
  }

  // Direct Actions
  getImageSrc = async (screenshot: Uint8Array | null) => {
    if (screenshot !== null) {
      const blob = new Blob([screenshot], {
        type: 'image/png',
      })

      return new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          console.log(reader.result)
          if (reader.result) resolve(reader.result as string)
        }
        reader.onerror = () => ''
        reader.readAsDataURL(blob)
      })
    } else return ''
  }

  onAddTemplate = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'ADD_TEMPLATE',
          activityId: this.props.activityId,
          selection: this.state.selection,
        },
      },
      '*'
    )
  }

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
                    <Thumbnail
                      key={this.state.screenshot}
                      src={this.state.screenshot ?? ''}
                    />
                    <div className={'card__actions'}>
                      <Button
                        type="secondary"
                        label={
                          locals[this.props.lang].settings.template.addTemplate
                        }
                        action={this.onAddTemplate}
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
