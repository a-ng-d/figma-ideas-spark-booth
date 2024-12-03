import { FeatureStatus, SemanticMessage } from '@a_ng_d/figmug-ui'
import React, { PureComponent } from 'react'
import { locals } from '../../content/locals'
import { Language, PlanStatus } from '../../types/app'
import features from '../../utils/config'

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
