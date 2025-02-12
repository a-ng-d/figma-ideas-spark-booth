import {
  Button,
  Section,
  SectionTitle,
  SimpleItem,
  texts,
  Thumbnail,
} from '@a_ng_d/figmug-ui'
import { FeatureStatus } from '@a_ng_d/figmug-utils'
import { ChangeEvent, PureComponent } from 'preact/compat'
import React from 'react'
import features from '../../config'
import { locals } from '../../content/locals'
import { EditorType, Language, PlanStatus } from '../../types/app'
import { ActionsList } from 'src/types/models'

type TemplateStatus = 'UNDEFINED' | 'SAVED' | 'NOT_SAVED'

interface TemplateSettingsProps {
  activityId: string
  editorType: EditorType
  planStatus: PlanStatus
  lang: Language
  onChangeActivities: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | Element>
  ) => void
}

interface TemplateSettingsStates {
  imageUrl: string | undefined
  nodes: object | undefined
  templateStatus: TemplateStatus
}

export default class TemplateSettings extends PureComponent<
  TemplateSettingsProps,
  TemplateSettingsStates
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
      imageUrl: undefined,
      nodes: undefined,
      templateStatus: 'UNDEFINED',
    }
  }

  // Lifecycle
  componentDidMount = () => {
    window.addEventListener('message', this.handleMessage)
    parent.postMessage(
      {
        pluginMessage: {
          type: 'GET_ACTIVITY_TEMPLATE',
          activityId: this.props.activityId,
        },
      },
      '*'
    )
    parent.postMessage(
      {
        pluginMessage: {
          type: 'GET_ACTIVITY_THUMBNAIL',
          activityId: this.props.activityId,
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

  componentDidUpdate = (
    prevProps: Readonly<TemplateSettingsProps>,
    prevState: Readonly<TemplateSettingsStates>
  ) => {
    if (
      prevState.templateStatus !== this.state.templateStatus &&
      this.state.templateStatus === 'NOT_SAVED'
    )
      parent.postMessage(
        {
          pluginMessage: {
            type: 'SUBSCRIBE_SELECTION',
          },
        },
        '*'
      )
    else if (
      prevState.templateStatus !== this.state.templateStatus &&
      this.state.templateStatus === 'SAVED'
    )
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
          nodes: e.data.pluginMessage.nodes as object,
          imageUrl: await this.getImageSrc(
            e.data.pluginMessage.screenshot as Uint8Array | null
          ),
        }),
      GET_ACTIVITY_THUMBNAIL: () =>
        this.setState({
          imageUrl: e.data.pluginMessage.imageUrl as string | undefined,
          templateStatus: e.data.pluginMessage.templateStatus as TemplateStatus,
        }),
      GET_ACTIVITY_TEMPLATE: () =>
        this.setState({
          nodes: e.data.pluginMessage.nodes as object | undefined,
          templateStatus: e.data.pluginMessage.templateStatus as TemplateStatus,
        }),
      DEFAULT: () => null,
    }

    return actions[e.data.pluginMessage?.type ?? 'DEFAULT']?.()
  }

  // Direct Actions
  getImageSrc = async (screenshot: Uint8Array | null | undefined) => {
    if (screenshot !== null && screenshot !== undefined) {
      const blob = new Blob([screenshot], {
        type: 'image/png',
      })

      return new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          if (reader.result) resolve(reader.result as string)
        }
        reader.onerror = () => ''
        reader.readAsDataURL(blob)
      })
    } else return undefined
  }

  onAddTemplate = (e: ChangeEvent) => {
    this.setState({ templateStatus: 'SAVED' })
    parent.postMessage(
      {
        pluginMessage: {
          type: 'UPDATE_THUMBNAILS',
          activityId: this.props.activityId,
          imageUrl: this.state.imageUrl,
        },
      },
      '*'
    )
    parent.postMessage(
      {
        pluginMessage: {
          type: 'UPDATE_TEMPLATES',
          activityId: this.props.activityId,
          nodes: this.state.nodes,
        },
      },
      '*'
    )
    this.props.onChangeActivities(
      e as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | Element>
    )
  }

  onRemoveTemplate = (e: ChangeEvent) => {
    this.setState({
      templateStatus: 'NOT_SAVED',
      imageUrl: undefined,
      nodes: undefined,
    })
    parent.postMessage(
      {
        pluginMessage: {
          type: 'REMOVE_THUMBNAIL',
          activityId: this.props.activityId,
        },
      },
      '*'
    )
    parent.postMessage(
      {
        pluginMessage: {
          type: 'REMOVE_TEMPLATE',
          activityId: this.props.activityId,
        },
      },
      '*'
    )
    this.props.onChangeActivities(
      e as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | Element>
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
                      key={this.state.imageUrl}
                      src={this.state.imageUrl ?? ''}
                    />
                    {this.state.nodes !== undefined && (
                      <div className={'card__actions'}>
                        {this.state.templateStatus === 'SAVED' ? (
                          <Button
                            type="destructive"
                            label={
                              locals[this.props.lang].settings.template
                                .removeTemplate
                            }
                            feature="REMOVE_TEMPLATE"
                            action={this.onRemoveTemplate}
                          />
                        ) : (
                          <Button
                            type="secondary"
                            label={
                              locals[this.props.lang].settings.template
                                .addTemplate
                            }
                            feature="ADD_TEMPLATE"
                            action={this.onAddTemplate}
                          />
                        )}
                      </div>
                    )}
                  </div>
                  {this.state.templateStatus === 'SAVED' ? (
                    <span className={`type ${texts.type}`}>
                      {
                        locals[this.props.lang].settings.template.helper
                          .removeTemplate
                      }
                    </span>
                  ) : (
                    <span className={`type ${texts.type}`}>
                      {
                        locals[this.props.lang].settings.template.helper
                          .addTemplate
                      }
                    </span>
                  )}
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
