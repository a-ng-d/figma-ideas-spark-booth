import {
  Chip,
  ConsentConfiguration,
  Dialog,
  layouts,
  SimpleItem,
  texts,
} from '@a_ng_d/figmug-ui'
import { PureComponent } from 'preact/compat'
import React from 'react'

import { supabase } from '../../bridges/publication/authentication'
import detachActivity from '../../bridges/publication/detachActivity'
import publishActivity from '../../bridges/publication/publishActivity'
import pullActivity from '../../bridges/publication/pullActivity'
import pushActivity from '../../bridges/publication/pushActivity'
import unpublishActivity from '../../bridges/publication/unpublishActivity'
import { activitiesDbTableName } from '../../config'
import { locals } from '../../content/locals'
import { Language, PublicationStatus } from '../../types/app'
import {
  ActivityConfiguration,
  UserConfiguration,
} from '../../types/configurations'
import { UserSession } from '../../types/user'
import { trackPublicationEvent } from '../../utils/eventsTracker'
import ColorChip from '../components/ColorChip'

interface PublicationProps {
  activity: ActivityConfiguration
  isPrimaryActionLoading: boolean
  isSecondaryActionLoading: boolean
  userConsent: Array<ConsentConfiguration>
  userIdentity: UserConfiguration
  userSession: UserSession
  lang: Language
  onLoadPrimaryAction: (e: boolean) => void
  onLoadSecondaryAction: (e: boolean) => void
  onClosePublication: (e: React.MouseEvent<Element>) => void
}

interface PublicationStates {
  isActivityShared: boolean
  publicationStatus: PublicationStatus
}

interface PublicationAction {
  label: string
  state: 'LOADING' | 'DEFAULT' | 'DISABLED'
  action: () => void | Promise<void> | null
}

interface PublicationOption {
  label: string
  state: boolean
  action: () => void | (() => Promise<void>) | null
}

interface PublicationActions {
  primary: PublicationAction | undefined
  secondary: PublicationAction | undefined
}

export default class Publication extends PureComponent<PublicationProps, PublicationStates> {
  counter: number

  constructor(props: PublicationProps) {
    super(props)
    this.counter = 0
    this.state = {
      isActivityShared: this.props.activity.meta.publicationStatus.isShared,
      publicationStatus: 'WAITING',
    }
  }

  // Lifecycle
  componentDidMount = () => {
    if (this.props.activity.meta.publicationStatus.isPublished)
      this.callUICPAgent()
    else
      this.setState({
        publicationStatus: 'UNPUBLISHED',
      })
  }

  componentDidUpdate = (prevProps: Readonly<PublicationProps>) => {
    if (
      this.props.activity.meta.publicationStatus.isPublished &&
      prevProps.activity.meta.id !== this.props.activity.meta.id
    )
      this.callUICPAgent()
    else if (
      !this.props.activity.meta.publicationStatus.isPublished &&
      prevProps.activity.meta.id !== this.props.activity.meta.id
    )
      this.setState({
        publicationStatus: 'UNPUBLISHED',
      })
  }

  // Direct Actions
  callUICPAgent = async () => {
    const localUserId = this.props.userSession.userId,
      localPublicationDate = new Date(
        this.props.activity.meta.dates.publishedAt
      ),
      localUpdatedDate = new Date(this.props.activity.meta.dates.updatedAt)

    const { data, error } = await supabase
      .from(activitiesDbTableName)
      .select('*')
      .eq('activity_id', this.props.activity.meta.id)

    if (!error && data.length !== 0) {
      const isMyPalette = data?.[0].creator_id === localUserId

      if (new Date(data[0].published_at) > localPublicationDate)
        this.setState({
          publicationStatus: isMyPalette ? 'MUST_BE_PULLED' : 'MAY_BE_PULLED',
        })
      else if (new Date(data[0].published_at) < localUpdatedDate)
        this.setState({
          publicationStatus: isMyPalette ? 'CAN_BE_PUSHED' : 'CAN_BE_REVERTED',
        })
      else
        this.setState({
          publicationStatus: isMyPalette ? 'PUBLISHED' : 'UP_TO_DATE',
        })
    } else if (data?.length === 0)
      this.setState({
        publicationStatus: 'IS_NOT_FOUND',
      })
    else if (error) {
      this.setState({
        publicationStatus: 'WAITING',
      })
      parent.postMessage(
        {
          pluginMessage: {
            type: 'SEND_MESSAGE',
            message: locals[this.props.lang].error.noInternetConnection,
          },
        },
        '*'
      )
    }
  }

  getPaletteStatus = () => {
    if (this.state.publicationStatus === 'UNPUBLISHED')
      return (
        <Chip state="INACTIVE">
          {locals[this.props.lang].publication.statusUnpublished}
        </Chip>
      )
    else if (
      this.state.publicationStatus === 'CAN_BE_PUSHED' ||
      this.state.publicationStatus === 'CAN_BE_REVERTED'
    )
      return (
        <Chip>{locals[this.props.lang].publication.statusLocalChanges}</Chip>
      )
    else if (
      this.state.publicationStatus === 'PUBLISHED' ||
      this.state.publicationStatus === 'UP_TO_DATE'
    )
      return (
        <Chip state="INACTIVE">
          {locals[this.props.lang].publication.statusUptoDate}
        </Chip>
      )
    else if (
      this.state.publicationStatus === 'MUST_BE_PULLED' ||
      this.state.publicationStatus === 'MAY_BE_PULLED'
    )
      return (
        <Chip>{locals[this.props.lang].publication.statusRemoteChanges}</Chip>
      )
    else if (this.state.publicationStatus === 'IS_NOT_FOUND')
      return (
        <Chip state="INACTIVE">
          {locals[this.props.lang].publication.statusNotFound}
        </Chip>
      )
    else if (this.state.publicationStatus === 'WAITING')
      return (
        <Chip state="INACTIVE">
          {locals[this.props.lang].publication.statusWaiting}
        </Chip>
      )
  }

  publicationActions = (
    publicationStatus: PublicationStatus
  ): PublicationActions => {
    const actions: Record<string, PublicationActions> = {
      UNPUBLISHED: {
        primary: {
          label: locals[this.props.lang].publication.publish,
          state: this.props.isPrimaryActionLoading ? 'LOADING' : 'DEFAULT',
          action: async () => {
            this.props.onLoadPrimaryAction(true)
            publishActivity(
              this.props.activity,
              this.props.userSession,
              this.state.isActivityShared
            )
              .then(() => {
                this.setState({
                  publicationStatus: 'PUBLISHED',
                })
                parent.postMessage(
                  {
                    pluginMessage: {
                      type: 'SEND_MESSAGE',
                      message: locals[this.props.lang].success.publication,
                    },
                  },
                  '*'
                )
                trackPublicationEvent(
                  this.props.userIdentity.id,
                  this.props.userConsent.find(
                    (consent) => consent.id === 'mixpanel'
                  )?.isConsented ?? false,
                  {
                    feature: 'PUBLISH_ACTIVITY',
                  }
                )
              })
              .finally(() => {
                this.props.onLoadPrimaryAction(false)
              })
              .catch(() => {
                parent.postMessage(
                  {
                    pluginMessage: {
                      type: 'SEND_MESSAGE',
                      message: locals[this.props.lang].error.publication,
                    },
                  },
                  '*'
                )
              })
          },
        },
        secondary: undefined,
      },
      CAN_BE_PUSHED: {
        primary: {
          label: locals[this.props.lang].publication.publish,
          state: this.props.isPrimaryActionLoading ? 'LOADING' : 'DEFAULT',
          action: async () => {
            this.props.onLoadPrimaryAction(true)
            pushActivity(
              this.props.activity,
              this.props.userSession,
              this.state.isActivityShared
            )
              .then((data) => {
                //this.props.onChangePublication(data)
                this.setState({
                  publicationStatus: 'PUBLISHED',
                  isActivityShared: data.publicationStatus?.isShared ?? false,
                })
                parent.postMessage(
                  {
                    pluginMessage: {
                      type: 'SEND_MESSAGE',
                      message: locals[this.props.lang].success.publication,
                    },
                  },
                  '*'
                )
                trackPublicationEvent(
                  this.props.userIdentity.id,
                  this.props.userConsent.find(
                    (consent) => consent.id === 'mixpanel'
                  )?.isConsented ?? false,
                  {
                    feature: 'PUSH_ACTIVITY',
                  }
                )
              })
              .finally(() => {
                this.props.onLoadPrimaryAction(false)
              })
              .catch(() => {
                parent.postMessage(
                  {
                    pluginMessage: {
                      type: 'SEND_MESSAGE',
                      message: locals[this.props.lang].error.publication,
                    },
                  },
                  '*'
                )
              })
          },
        },
        secondary: {
          label: locals[this.props.lang].publication.revert,
          state: this.props.isSecondaryActionLoading ? 'LOADING' : 'DEFAULT',
          action: async () => {
            this.props.onLoadSecondaryAction(true)
            pullActivity(this.props.activity)
              .then((data) => {
                //this.props.onChangePublication(data)
                this.setState({
                  publicationStatus: 'PUBLISHED',
                  isActivityShared:
                    data.meta.publicationStatus?.isShared ?? false,
                })
                parent.postMessage(
                  {
                    pluginMessage: {
                      type: 'SEND_MESSAGE',
                      message: locals[this.props.lang].success.synchronization,
                    },
                  },
                  '*'
                )
                trackPublicationEvent(
                  this.props.userIdentity.id,
                  this.props.userConsent.find(
                    (consent) => consent.id === 'mixpanel'
                  )?.isConsented ?? false,
                  {
                    feature: 'REVERT_ACTIVITY',
                  }
                )
              })
              .finally(() => {
                this.props.onLoadSecondaryAction(false)
              })
              .catch(() => {
                parent.postMessage(
                  {
                    pluginMessage: {
                      type: 'SEND_MESSAGE',
                      message: locals[this.props.lang].error.synchronization,
                    },
                  },
                  '*'
                )
              })
          },
        },
      },
      MUST_BE_PULLED: {
        primary: {
          label: locals[this.props.lang].publication.synchronize,
          state: this.props.isPrimaryActionLoading ? 'LOADING' : 'DEFAULT',
          action: async () => {
            this.props.onLoadPrimaryAction(true)
            pullActivity(this.props.activity)
              .then((data) => {
                //this.props.onChangePublication(data)
                this.setState({
                  publicationStatus: 'PUBLISHED',
                  isActivityShared:
                    data.meta.publicationStatus?.isShared ?? false,
                })
                parent.postMessage(
                  {
                    pluginMessage: {
                      type: 'SEND_MESSAGE',
                      message: locals[this.props.lang].success.synchronization,
                    },
                  },
                  '*'
                )
                trackPublicationEvent(
                  this.props.userIdentity.id,
                  this.props.userConsent.find(
                    (consent) => consent.id === 'mixpanel'
                  )?.isConsented ?? false,
                  {
                    feature: 'PULL_ACTIVITY',
                  }
                )
              })
              .finally(() => {
                this.props.onLoadPrimaryAction(false)
              })
              .catch(() => {
                parent.postMessage(
                  {
                    pluginMessage: {
                      type: 'SEND_MESSAGE',
                      message: locals[this.props.lang].error.synchronization,
                    },
                  },
                  '*'
                )
              })
          },
        },
        secondary: {
          label: locals[this.props.lang].publication.detach,
          state: this.props.isSecondaryActionLoading ? 'LOADING' : 'DEFAULT',
          action: async () => {
            this.props.onLoadSecondaryAction(true)
            detachActivity(this.props.activity)
              .then(() => {
                this.setState({
                  publicationStatus: 'UNPUBLISHED',
                  isActivityShared: false,
                })
                trackPublicationEvent(
                  this.props.userIdentity.id,
                  this.props.userConsent.find(
                    (consent) => consent.id === 'mixpanel'
                  )?.isConsented ?? false,
                  {
                    feature: 'DETACH_ACTIVITY',
                  }
                )
              })
              .finally(() => {
                this.props.onLoadSecondaryAction(false)
              })
          },
        },
      },
      MAY_BE_PULLED: {
        primary: {
          label: locals[this.props.lang].publication.synchronize,
          state: this.props.isPrimaryActionLoading ? 'LOADING' : 'DEFAULT',
          action: async () => {
            this.props.onLoadPrimaryAction(true)
            pullActivity(this.props.activity)
              .then((data) => {
                //this.props.onChangePublication(data)
                this.setState({
                  publicationStatus: 'UP_TO_DATE',
                  isActivityShared:
                    data.meta.publicationStatus?.isShared ?? false,
                })
                parent.postMessage(
                  {
                    pluginMessage: {
                      type: 'SEND_MESSAGE',
                      message: locals[this.props.lang].success.synchronization,
                    },
                  },
                  '*'
                )
                trackPublicationEvent(
                  this.props.userIdentity.id,
                  this.props.userConsent.find(
                    (consent) => consent.id === 'mixpanel'
                  )?.isConsented ?? false,
                  {
                    feature: 'PULL_ACTIVITY',
                  }
                )
              })
              .finally(() => {
                this.props.onLoadPrimaryAction(false)
              })
              .catch(() => {
                parent.postMessage(
                  {
                    pluginMessage: {
                      type: 'SEND_MESSAGE',
                      message: locals[this.props.lang].error.synchronization,
                    },
                  },
                  '*'
                )
              })
          },
        },
        secondary: {
          label: locals[this.props.lang].publication.detach,
          state: this.props.isSecondaryActionLoading ? 'LOADING' : 'DEFAULT',
          action: async () => {
            this.props.onLoadSecondaryAction(true)
            detachActivity(this.props.activity)
              .then(() => {
                this.setState({
                  publicationStatus: 'UNPUBLISHED',
                  isActivityShared: false,
                })
                trackPublicationEvent(
                  this.props.userIdentity.id,
                  this.props.userConsent.find(
                    (consent) => consent.id === 'mixpanel'
                  )?.isConsented ?? false,
                  {
                    feature: 'DETACH_ACTIVITY',
                  }
                )
              })
              .finally(() => {
                this.props.onLoadSecondaryAction(false)
              })
          },
        },
      },
      PUBLISHED: {
        primary: {
          label: locals[this.props.lang].publication.publish,
          state: (() => {
            if (
              this.props.activity.meta.publicationStatus.isShared !==
              this.state.isActivityShared
            )
              return this.props.isPrimaryActionLoading ? 'LOADING' : 'DEFAULT'

            return 'DISABLED'
          })(),
          action: async () => {
            this.props.onLoadPrimaryAction(true)
            pushActivity(
              this.props.activity,
              this.props.userSession,
              this.state.isActivityShared
            )
              .then((data) => {
                //this.props.onChangePublication(data)
                this.setState({
                  publicationStatus: 'PUBLISHED',
                  isActivityShared: data.publicationStatus?.isShared ?? false,
                })
                parent.postMessage(
                  {
                    pluginMessage: {
                      type: 'SEND_MESSAGE',
                      message: locals[this.props.lang].success.publication,
                    },
                  },
                  '*'
                )
                trackPublicationEvent(
                  this.props.userIdentity.id,
                  this.props.userConsent.find(
                    (consent) => consent.id === 'mixpanel'
                  )?.isConsented ?? false,
                  {
                    feature: 'PUSH_ACTIVITY',
                  }
                )
              })
              .finally(() => {
                this.props.onLoadPrimaryAction(false)
              })
              .catch(() => {
                parent.postMessage(
                  {
                    pluginMessage: {
                      type: 'SEND_MESSAGE',
                      message: locals[this.props.lang].error.publication,
                    },
                  },
                  '*'
                )
              })
          },
        },
        secondary: {
          label: locals[this.props.lang].publication.unpublish,
          state: this.props.isSecondaryActionLoading ? 'LOADING' : 'DEFAULT',
          action: async () => {
            this.props.onLoadSecondaryAction(true)
            unpublishActivity(this.props.activity)
              .then(() => {
                this.setState({
                  publicationStatus: 'UNPUBLISHED',
                  isActivityShared: false,
                })
                parent.postMessage(
                  {
                    pluginMessage: {
                      type: 'SEND_MESSAGE',
                      message: locals[this.props.lang].success.nonPublication,
                    },
                  },
                  '*'
                )
                trackPublicationEvent(
                  this.props.userIdentity.id,
                  this.props.userConsent.find(
                    (consent) => consent.id === 'mixpanel'
                  )?.isConsented ?? false,
                  {
                    feature: 'UNPUBLISH_ACTIVITY',
                  }
                )
              })
              .finally(() => {
                this.props.onLoadSecondaryAction(false)
              })
              .catch(() => {
                parent.postMessage(
                  {
                    pluginMessage: {
                      type: 'SEND_MESSAGE',
                      message: locals[this.props.lang].error.nonPublication,
                    },
                  },
                  '*'
                )
              })
          },
        },
      },
      UP_TO_DATE: {
        primary: {
          label: locals[this.props.lang].publication.detach,
          state: this.props.isPrimaryActionLoading ? 'LOADING' : 'DEFAULT',
          action: async () => {
            this.props.onLoadPrimaryAction(true)
            detachActivity(this.props.activity)
              .then(() => {
                this.setState({
                  publicationStatus: 'UNPUBLISHED',
                  isActivityShared: false,
                })
                trackPublicationEvent(
                  this.props.userIdentity.id,
                  this.props.userConsent.find(
                    (consent) => consent.id === 'mixpanel'
                  )?.isConsented ?? false,
                  {
                    feature: 'DETACH_ACTIVITY',
                  }
                )
              })
              .finally(() => {
                this.props.onLoadPrimaryAction(false)
              })
          },
        },
        secondary: undefined,
      },
      CAN_BE_REVERTED: {
        primary: {
          label: locals[this.props.lang].publication.revert,
          state: this.props.isPrimaryActionLoading ? 'LOADING' : 'DEFAULT',
          action: async () => {
            this.props.onLoadPrimaryAction(true)
            pullActivity(this.props.activity)
              .then((data) => {
                //this.props.onChangePublication(data)
                this.setState({
                  publicationStatus: 'UP_TO_DATE',
                  isActivityShared:
                    data.meta.publicationStatus?.isShared ?? false,
                })
                trackPublicationEvent(
                  this.props.userIdentity.id,
                  this.props.userConsent.find(
                    (consent) => consent.id === 'mixpanel'
                  )?.isConsented ?? false,
                  {
                    feature: 'REVERT_ACTIVITY',
                  }
                )
                parent.postMessage(
                  {
                    pluginMessage: {
                      type: 'SEND_MESSAGE',
                      message: locals[this.props.lang].success.synchronization,
                    },
                  },
                  '*'
                )
              })
              .finally(() => {
                this.props.onLoadPrimaryAction(false)
              })
              .catch(() => {
                parent.postMessage(
                  {
                    pluginMessage: {
                      type: 'SEND_MESSAGE',
                      message: locals[this.props.lang].error.synchronization,
                    },
                  },
                  '*'
                )
              })
          },
        },
        secondary: {
          label: locals[this.props.lang].publication.detach,
          state: this.props.isSecondaryActionLoading ? 'LOADING' : 'DEFAULT',
          action: async () => {
            this.props.onLoadSecondaryAction(true)
            detachActivity(this.props.activity)
              .then(() => {
                this.setState({
                  publicationStatus: 'UNPUBLISHED',
                  isActivityShared: false,
                })
                trackPublicationEvent(
                  this.props.userIdentity.id,
                  this.props.userConsent.find(
                    (consent) => consent.id === 'mixpanel'
                  )?.isConsented ?? false,
                  {
                    feature: 'DETACH_ACTIVITY',
                  }
                )
              })
              .finally(() => {
                this.props.onLoadSecondaryAction(false)
              })
          },
        },
      },
      IS_NOT_FOUND: {
        primary: {
          label: locals[this.props.lang].publication.detach,
          state: this.props.isPrimaryActionLoading ? 'LOADING' : 'DEFAULT',
          action: async () => {
            this.props.onLoadPrimaryAction(true)
            detachActivity(this.props.activity)
              .then(() => {
                this.setState({
                  publicationStatus: 'UNPUBLISHED',
                  isActivityShared: false,
                })
                trackPublicationEvent(
                  this.props.userIdentity.id,
                  this.props.userConsent.find(
                    (consent) => consent.id === 'mixpanel'
                  )?.isConsented ?? false,
                  {
                    feature: 'DETACH_ACTIVITY',
                  }
                )
              })
              .finally(() => {
                this.props.onLoadPrimaryAction(false)
              })
          },
        },
        secondary: undefined,
      },
      WAITING: {
        primary: {
          label: locals[this.props.lang].pending.primaryAction,
          state: 'DISABLED',
          action: () => null,
        },
        secondary: {
          label: locals[this.props.lang].pending.secondaryAction,
          state: 'DISABLED',
          action: () => null,
        },
      },
    }

    return actions[publicationStatus]
  }

  publicationOption = (
    publicationStatus: PublicationStatus
  ): PublicationOption | undefined => {
    const actions: Record<string, PublicationOption | undefined> = {
      UNPUBLISHED: {
        label: locals[this.props.lang].publication.share,
        state: this.state.isActivityShared,
        action: () =>
          this.setState({ isActivityShared: !this.state.isActivityShared }),
      },
      CAN_BE_PUSHED: {
        label: locals[this.props.lang].publication.share,
        state: this.state.isActivityShared,
        action: () =>
          this.setState({ isActivityShared: !this.state.isActivityShared }),
      },
      MUST_BE_PULLED: undefined,
      MAY_BE_PULLED: undefined,
      PUBLISHED: {
        label: locals[this.props.lang].publication.share,
        state: this.state.isActivityShared,
        action: () =>
          this.setState({ isActivityShared: !this.state.isActivityShared }),
      },
      UP_TO_DATE: undefined,
      CAN_BE_REVERTED: undefined,
      IS_NOT_FOUND: undefined,
      WAITING: undefined,
    }

    return actions[publicationStatus]
  }

  // Render
  render() {
    return (
      <Dialog
        title={
          this.props.activity.meta.creatorIdentity.id ===
            this.props.userSession.userId ||
          this.props.activity.meta.creatorIdentity.id === ''
            ? locals[this.props.lang].publication.titlePublish
            : locals[this.props.lang].publication.titleSynchronize
        }
        actions={this.publicationActions(this.state.publicationStatus)}
        select={this.publicationOption(this.state.publicationStatus)}
        onClose={this.props.onClosePublication}
      >
        <div
          className={`dialog__text`}
          style={{ width: '100%' }}
        >
          <div className={`${layouts.stackbar} ${layouts['stackbar--tight']}`}>
            <div
              className={`${layouts.snackbar} ${layouts['snackbar--fill']} ${layouts['snackbar--medium']}`}
              style={{ justifyContent: 'space-between', width: '100%' }}
            >
              <div className={`${layouts.snackbar}`}>
                <div
                  className={`${texts.type} ${texts['type--truncated']} type--large`}
                  style={{ maxWidth: '200px' }}
                >
                  {this.props.activity.name}
                </div>
                <Chip state="INACTIVE">
                  {`${this.props.activity.timer.minutes.toString().padStart(2, '0')}:${this.props.activity.timer.seconds.toString().padStart(2, '0')}`}
                </Chip>
                {this.getPaletteStatus()}
              </div>
              {(this.state.publicationStatus === 'UP_TO_DATE' ||
                this.state.publicationStatus === 'MAY_BE_PULLED' ||
                this.state.publicationStatus === 'CAN_BE_REVERTED') && (
                <div className="user">
                  <div className="user__avatar">
                    <img
                      src={this.props.activity.meta.creatorIdentity.avatar}
                    />
                  </div>
                  <div
                    className={`${texts.type} ${texts['type--secondary']} type user__name`}
                  >
                    {this.props.activity.meta.creatorIdentity.fullName}
                  </div>
                </div>
              )}
            </div>
            {this.props.activity.description !== '' && (
              <div className={`${texts.type} type`}>
                {this.props.activity.description}
              </div>
            )}
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
      </Dialog>
    )
  }
}
