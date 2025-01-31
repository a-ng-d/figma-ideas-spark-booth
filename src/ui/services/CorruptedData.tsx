import { SemanticMessage } from '@a_ng_d/figmug-ui'
import { FeatureStatus } from '@a_ng_d/figmug-utils'
import { PureComponent } from 'preact/compat'
import React from 'react'
import features from '../../config'
import { locals } from '../../content/locals'
import { Language, PlanStatus } from '../../types/app'

interface CorruptedDataProps {
  lang: Language
}

export default class CorruptedData extends PureComponent<CorruptedDataProps> {
  static features = (planStatus: PlanStatus) => ({
    CORRUPTED_DATA: new FeatureStatus({
      features: features,
      featureName: 'CORRUPTED_DATA',
      planStatus: planStatus,
    }),
  })

  render() {
    return (
      <section className="controller">
        <div className="controls">
          <div className="controls__control">
            <div className="callout--centered">
              <SemanticMessage
                type="ERROR"
                message={locals[this.props.lang].error.corruptedData}
              />
            </div>
          </div>
        </div>
      </section>
    )
  }
}
