import { ActivityConfiguration } from './configurations'

export interface ActivitiesMessage {
  type: 'UPDATE_ACTIVITIES'
  data: Array<ActivityConfiguration>
}
