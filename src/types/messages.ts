import { ActivityConfiguration, SessionConfiguration } from './configurations'

export interface ActivitiesMessage {
  type: 'UPDATE_ACTIVITIES'
  data: Array<ActivityConfiguration>
}

export interface SessionsMessage {
  type: 'UPDATE_SESSIONS'
  data: Array<SessionConfiguration>
}
