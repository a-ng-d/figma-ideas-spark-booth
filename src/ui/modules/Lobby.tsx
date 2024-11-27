import { Message } from '@a_ng_d/figmug-ui'
import React from 'react'

import { IconList } from '@a_ng_d/figmug-ui/dist/types/icon.types'
import { Language, PlanStatus } from '../../types/app'

interface LobbyProps {
  messages: Array<string>
  icon?: IconList
  children?: React.ReactNode
  planStatus: PlanStatus
  lang: Language
}

interface LobbyStates {}

export default class Lobby extends React.Component<LobbyProps, LobbyStates> {
  static defaultProps = {
    icon: 'info',
  }

  constructor(props: LobbyProps) {
    super(props)
    this.state = {}
  }

  // Render
  render() {
    return (
      <div className="onboarding__callout--centered">
        <Message
          icon={this.props.icon}
          messages={this.props.messages}
        />
        {this.props.children !== undefined && (
          <div className="onboarding__actions">{this.props.children}</div>
        )}
      </div>
    )
  }
}
