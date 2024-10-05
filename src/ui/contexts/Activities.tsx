import { ConsentConfiguration } from '@a_ng_d/figmug-ui';
import React from 'react';
import { uid } from 'uid';



import { locals } from '../../content/locals';
import { Language, PlanStatus } from '../../types/app';
import { ActivityConfiguration, IdeaConfiguration, SessionConfiguration, TypeConfiguration, UserConfiguration } from '../../types/configurations';
import { ActivitiesMessage } from '../../types/messages';
import { ActionsList } from '../../types/models';
import { UserSession } from '../../types/user';
import { AppStates } from '../App';
import ActivitiesList from '../modules/ActivitiesList';
import History from '../modules/History';
import Settings from '../modules/Settings';


interface ActivitiesProps {
  activities: Array<ActivityConfiguration>
  sessions: Array<SessionConfiguration>
  ideas: Array<IdeaConfiguration>
  userSession: UserSession
  userConsent: Array<ConsentConfiguration>
  userIdentity: UserConfiguration
  planStatus: PlanStatus
  lang: Language
  onChangeActivities: React.Dispatch<Partial<AppStates>>
  onRunSession: React.Dispatch<Partial<AppStates>>
}

interface ActivitiesStates {
  view: 'ACTIVITIES' | 'SETTINGS' | 'HISTORY'
  openedActivity?: string
  openedSessionHistory?: string
}

export default class Activities extends React.Component<ActivitiesProps, ActivitiesStates> {
  activitiesMessage: ActivitiesMessage

  constructor(props: ActivitiesProps) {
    super(props)
    this.activitiesMessage = {
      type: 'UPDATE_ACTIVITIES',
      data: [],
    }
    this.state = {
      view: 'ACTIVITIES',
      openedActivity: undefined,
      openedSessionHistory: undefined,
    }
  }

  // Handlers
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  activitiesHandler = (e: any) => {
    const currentElement: HTMLInputElement = e.currentTarget

    const addActivity = () => {
      const hasAlreadyNewActivity = this.activitiesMessage.data.filter(
        (activity) => activity.name.includes('New activity')
      )

      this.activitiesMessage.data = this.props.activities
      this.activitiesMessage.data.push({
        name: `${locals[this.props.lang].activities.newActivity} ${hasAlreadyNewActivity.length + 1}`,
        description: '',
        instructions: '',
        groupedBy: 'PARTICIPANT',
        timer: {
          minutes: 10,
          seconds: 0,
        },
        types: [
          {
            name: locals[this.props.lang].settings.types.defaultType,
            color: 'YELLOW',
            hex: '#FFD966',
            id: uid(),
          },
        ],
        meta: {
          id: uid(),
          publicationStatus: {
            isPublished: false,
            isShared: false,
          },
          dates: {
            createdAt: new Date().toISOString(),
            updatedAt: '',
            publishedAt: '',
          },
          creatorIdentity: {
            fullName: '',
            avatar: '',
            id: '',
          },
        },
      } as ActivityConfiguration)

      return sendData()
    }

    const removeActivity = () => {
      this.activitiesMessage.data = this.props.activities.filter(
        (activity) => activity.meta.id !== this.state.openedActivity
      )

      this.setState({
        view: 'ACTIVITIES',
        openedActivity: undefined,
      })

      return sendData()
    }

    const renameActivity = () => {
      const hasSameName = this.props.activities.filter(
        (activity) => activity.name === currentElement.value
      )

      this.activitiesMessage.data = this.props.activities.map((item) => {
        if (item.meta.id === this.state.openedActivity)
          item.name =
            hasSameName.length > 1
              ? currentElement.value + ' 2'
              : currentElement.value
        return item
      })

      return sendData()
    }

    const updateDescription = () => {
      this.activitiesMessage.data = this.props.activities.map((item) => {
        if (item.meta.id === this.state.openedActivity)
          item.description = currentElement.value
        return item
      })

      return sendData()
    }

    const updateInstructions = () => {
      this.activitiesMessage.data = this.props.activities.map((item) => {
        if (item.meta.id === this.state.openedActivity)
          item.instructions = currentElement.value
        return item
      })

      return sendData()
    }

    const updateGroupedBy = () => {
      this.activitiesMessage.data = this.props.activities.map((item) => {
        if (item.meta.id === this.state.openedActivity)
          item.groupedBy = currentElement.dataset.value as
            | 'PARTICIPANT'
            | 'TYPE'
        return item
      })

      return sendData()
    }

    const updateTimerMinutes = () => {
      let minutes = parseFloat(currentElement.value)
      minutes <= 0 ? (minutes = 0) : minutes
      minutes >= 60 ? (minutes = 60) : minutes
      Number.isNaN(minutes) ? (minutes = 0) : minutes

      this.activitiesMessage.data = this.props.activities.map((item) => {
        if (item.meta.id === this.state.openedActivity)
          item.timer.minutes = minutes
        return item
      })

      return sendData()
    }

    const updateTimerSeconds = () => {
      let secondes = parseFloat(currentElement.value)
      secondes <= 0 ? (secondes = 0) : secondes
      secondes >= 59 ? (secondes = 59) : secondes
      Number.isNaN(secondes) ? (secondes = 0) : secondes

      this.activitiesMessage.data = this.props.activities.map((item) => {
        if (item.meta.id === this.state.openedActivity) {
          item.timer.seconds = secondes
          item.timer.minutes === 0
            ? (item.timer.seconds = 30)
            : item.timer.seconds
        }

        return item
      })

      return sendData()
    }

    const sendData = () => {
      this.props.onChangeActivities({
        activities: this.activitiesMessage.data,
        onGoingStep: 'activities changed',
      })

      parent.postMessage({ pluginMessage: this.activitiesMessage }, '*')
    }

    const actions: ActionsList = {
      ADD_ACTIVITY: () => addActivity(),
      REMOVE_ACTIVITY: () => removeActivity(),
      RENAME_ACTIVITY: () => renameActivity(),
      UPDATE_DESCRIPTION: () => updateDescription(),
      UPDATE_INSTRUCTIONS: () => updateInstructions(),
      UPDATE_GROUPED_BY: () => updateGroupedBy(),
      UPDATE_TIMER_MINUTES: () => updateTimerMinutes(),
      UPDATE_TIMER_SECONDS: () => updateTimerSeconds(),
      NULL: () => null,
    }

    return actions[currentElement.dataset.feature ?? 'NULL']?.()
  }

  typesHandler = (types: Array<TypeConfiguration>) => {
    this.activitiesMessage.data = this.props.activities.map((activity) => {
      if (activity.meta.id === this.state.openedActivity) activity.types = types
      return activity
    })

    this.props.onChangeActivities({
      activities: this.activitiesMessage.data,
      onGoingStep: 'activities changed',
    })

    parent.postMessage({ pluginMessage: this.activitiesMessage }, '*')
  }

  // Direct actions
  onRunSession = (activityId: string) => {
    const newSession: SessionConfiguration = {
      id: uid(),
      facilitator: {
        id: this.props.userIdentity.id,
        fullName: this.props.userIdentity.fullName,
        avatar: this.props.userIdentity.avatar,
      },
      metrics: {
        startDate: new Date().toISOString(),
        endDate: '',
        participants: 0,
        ideas: 0,
      },
      isRunning: true,
      activityId: activityId,
    }

    const sessions = [...this.props.sessions, newSession]

    this.props.onRunSession({
      sessions: sessions,
      onGoingStep: 'session run',
    })

    parent.postMessage(
      {
        pluginMessage: {
          type: 'START_SESSION',
          data: sessions,
        },
      },
      '*'
    )
  }

  // Render
  render() {
    let fragment

    switch (this.state.view) {
      case 'ACTIVITIES': {
        fragment = (
          <ActivitiesList
            {...this.props}
            onChangeActivities={this.activitiesHandler}
            onOpenActivitySettings={(e) =>
              this.setState({
                view: 'SETTINGS',
                openedActivity: e,
              })
            }
            onRunSession={this.onRunSession}
          />
        )
        break
      }
      case 'SETTINGS': {
        fragment = (
          <Settings
            activity={
              this.props.activities.find(
                (activity) => activity.meta.id === this.state.openedActivity
              ) as ActivityConfiguration
            }
            {...this.props}
            onChangeActivities={this.activitiesHandler}
            onChangeTypes={this.typesHandler}
            onOpenSessionHistory={(e) =>
              this.setState({
                view: 'HISTORY',
                openedSessionHistory: (e.currentTarget as HTMLElement).dataset
                  .id,
              })
            }
            onCloseActivitySettings={() =>
              this.setState({
                view: 'ACTIVITIES',
                openedActivity: undefined,
              })
            }
          />
        )
        break
      }
      case 'HISTORY': {
        fragment = (
          <History
            {...this.props}
            sessionDate={
              this.props.sessions.find(
                (session) => session.id === this.state.openedSessionHistory
              )?.metrics.startDate ?? 'Session date'
            }
            ideas={this.props.ideas.filter(
              (idea) => idea.sessionId === this.state.openedSessionHistory
            )}
            onRemoveSession={this.activitiesHandler}
            onCloseSessionHistory={() =>
              this.setState({
                view: 'SETTINGS',
                openedSessionHistory: undefined,
              })
            }
          />
        )
        break
      }
    }
    return <div className="controls__control">{fragment}</div>
  }
}