import { Tooltip } from '@a_ng_d/figmug-ui'
import { PureComponent } from 'preact/compat'
import React from 'react'

interface ColorChipProps {
  color: string
  helper?: string
}

interface ColorChipStates {
  isTooltipVisible: boolean
}

export default class ColorChip extends PureComponent<
  ColorChipProps,
  ColorChipStates
> {
  constructor(props: ColorChipProps) {
    super(props)
    this.state = {
      isTooltipVisible: false,
    }
  }

  render() {
    return (
      <div
        className="color-chip"
        style={{ backgroundColor: this.props.color }}
        onMouseEnter={() => {
          if (this.props.helper !== undefined)
            this.setState({ isTooltipVisible: true })
        }}
        onMouseLeave={() => this.setState({ isTooltipVisible: false })}
      >
        {this.state.isTooltipVisible && <Tooltip>{this.props.helper}</Tooltip>}
      </div>
    )
  }
}
