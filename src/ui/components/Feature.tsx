import React, { PureComponent } from 'react'

interface FeatureProps {
  isActive: boolean
  children: React.ReactNode
}

export default class Feature extends PureComponent<FeatureProps> {
  static defaultProps = {
    isActive: false,
    isPro: false,
  }

  // Render
  render() {
    return <>{this.props.isActive && this.props.children}</>
  }
}
