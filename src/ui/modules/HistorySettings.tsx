import {
  Button,
  Icon,
  layouts,
  Section,
  SectionTitle,
  SemanticMessage,
  SimpleItem,
  texts,
} from '@a_ng_d/figmug-ui'
import { FeatureStatus } from '@a_ng_d/figmug-utils'
import { PureComponent } from 'preact/compat'
import React from 'react'
import features from '../../config'
import { locals } from '../../content/locals'
import { EditorType, Language, PlanStatus } from '../../types/app'
import { SessionConfiguration } from '../../types/configurations'
import setFriendlyDate from '../../utils/setFriendlyDate'
import Feature from '../components/Feature'

interface HistorySettingsProps {
  activityId: string
  sessions: Array<SessionConfiguration>
  editorType: EditorType
  planStatus: PlanStatus
  sessionCount: number
  lang: Language
  onRunSession: (id: string) => void
  onOpenSessionHistory: React.MouseEventHandler<Element> &
    React.KeyboardEventHandler<Element>
  onOpenImportDialog: () => void
}

export default class HistorySettings extends PureComponent<HistorySettingsProps> {
  static features = (planStatus: PlanStatus) => ({
    ACTIVITIES_RUN: new FeatureStatus({
      features: features,
      featureName: 'ACTIVITIES_RUN',
      planStatus: planStatus,
    }),
    SETTINGS_IMPORT: new FeatureStatus({
      features: features,
      featureName: 'SETTINGS_IMPORT',
      planStatus: planStatus,
    }),
    HISTORY: new FeatureStatus({
      features: features,
      featureName: 'HISTORY',
      planStatus: planStatus,
    }),
  })

  // Templates
  History = () => {
    return (
      <Section
        title={
          <SimpleItem
            leftPartSlot={
              <SectionTitle
                label={locals[this.props.lang].settings.history.title}
                indicator={this.props.sessions.length}
              />
            }
            rightPartSlot={
              <Feature
                isActive={HistorySettings.features(
                  this.props.planStatus
                ).SETTINGS_IMPORT.isActive()}
              >
                <Button
                  type="icon"
                  icon="import"
                  helper={
                    locals[this.props.lang].settings.actions.importSessions
                  }
                  isBlocked={HistorySettings.features(
                    this.props.planStatus
                  ).SETTINGS_IMPORT.isReached(this.props.sessionCount)}
                  isNew={HistorySettings.features(
                    this.props.planStatus
                  ).SETTINGS_IMPORT.isNew()}
                  action={this.props.onOpenImportDialog}
                />
              </Feature>
            }
            isListItem={false}
          />
        }
        body={[
          {
            node: (
              <ul>
                {this.props.sessions
                  .sort(
                    (a, b) =>
                      new Date(b.metrics.startDate).getTime() -
                      new Date(a.metrics.startDate).getTime()
                  )
                  .map((session, index) => (
                    <SimpleItem
                      key={index}
                      id={session.id}
                      leftPartSlot={
                        <div
                          style={{
                            paddingLeft: 'var(--size-xxsmall)',
                          }}
                          className={`${layouts['snackbar--large']}`}
                        >
                          <span
                            className={`${texts['type']} ${texts['type--truncated']} type`}
                            style={{ flex: '0 0 200px' }}
                          >
                            {setFriendlyDate(
                              session.metrics.startDate,
                              this.props.lang,
                              'RELATIVE'
                            )}
                          </span>
                          <span
                            className={`${texts['type']} ${texts['type--secondary']} type`}
                            style={{ flex: '0 0 auto' }}
                          >
                            {`${session.metrics.participants} ${session.metrics.participants > 1 ? locals[this.props.lang].settings.history.participants.plural : locals[this.props.lang].settings.history.participants.single}・${session.metrics.ideas} ${session.metrics.ideas > 1 ? locals[this.props.lang].settings.history.ideas.plural : locals[this.props.lang].settings.history.ideas.single}`}
                          </span>
                        </div>
                      }
                      rightPartSlot={
                        <Icon
                          type="PICTO"
                          iconName="forward"
                        />
                      }
                      alignment="CENTER"
                      isInteractive={true}
                      action={this.props.onOpenSessionHistory}
                    />
                  ))}
              </ul>
            ),
            spacingModifier: 'NONE',
          },
        ]}
        border={undefined}
      />
    )
  }

  EmptyHistory = () => {
    return (
      <Section
        title={
          <SimpleItem
            leftPartSlot={
              <SectionTitle
                label={locals[this.props.lang].settings.history.title}
                indicator={this.props.sessions.length}
              />
            }
            isListItem={false}
          />

        }
        body={[
          {
            node: (
              <SemanticMessage
                type="NEUTRAL"
                message={locals[this.props.lang].settings.history.empty}
                actionsSlot={
                  <>
                    <Feature
                      isActive={HistorySettings.features(
                        this.props.planStatus
                      ).SETTINGS_IMPORT.isActive()}
                    >
                      <Button
                        type="secondary"
                        label={
                          locals[this.props.lang].settings.actions
                            .importSessions
                        }
                        isBlocked={HistorySettings.features(
                          this.props.planStatus
                        ).SETTINGS_IMPORT.isReached(this.props.sessionCount)}
                        isNew={HistorySettings.features(
                          this.props.planStatus
                        ).SETTINGS_IMPORT.isNew()}
                        action={this.props.onOpenImportDialog}
                      />
                    </Feature>
                    <Feature
                      isActive={HistorySettings.features(
                        this.props.planStatus
                      ).ACTIVITIES_RUN.isActive()}
                    >
                      <Button
                        type="primary"
                        label={locals[this.props.lang].sessions.newSession}
                        feature="SESSION_RUN"
                        isBlocked={HistorySettings.features(
                          this.props.planStatus
                        ).ACTIVITIES_RUN.isReached(this.props.sessionCount)}
                        isNew={HistorySettings.features(
                          this.props.planStatus
                        ).ACTIVITIES_RUN.isNew()}
                        action={() =>
                          this.props.onRunSession(this.props.activityId)
                        }
                      />
                    </Feature>
                  </>
                }
                orientation="VERTICAL"
              />
            ),
          },
        ]}
        border={undefined}
      />
    )
  }

  // Render
  render() {
    if (this.props.sessions.length > 0) return <this.History />
    else return <this.EmptyHistory />
  }
}
