import { Layout, SemanticMessage } from '@a_ng_d/figmug-ui'
import { FeatureStatus } from '@a_ng_d/figmug-utils'
import { PureComponent } from 'preact/compat'
import React from 'react'
import features from '../../config'
import { locals } from '../../content/locals'
import { EditorType, Language, PlanStatus } from '../../types/app'

interface CorruptedDataProps {
  editorType: EditorType
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
      <section className="context">
        <Layout
          id="corrupted-data"
          column={[
            {
              node: (
                <SemanticMessage
                  type="ERROR"
                  message={
                    this.props.editorType === 'figjam'
                      ? locals[this.props.lang].error.corruptedDataOnFigJam
                      : locals[this.props.lang].error.corruptedDataOnSlides
                  }
                />
              ),
              typeModifier: 'CENTERED',
            },
          ]}
          isFullHeight
        />
      </section>
    )
  }
}
