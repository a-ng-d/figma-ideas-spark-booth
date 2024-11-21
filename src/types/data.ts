import { GroupedBy, TypeConfiguration } from './configurations'

export interface ExternalActivities {
  activity_id: string
  name: string
  description: string
  instructions: string
  grouped_by: GroupedBy
  timer_minutes: number
  timer_seconds: number
  types: Array<TypeConfiguration>
  created_at: Date | string
  updated_at: Date | string
  published_at: Date | string
  creator_avatar: string
  creator_full_name: string
  creator_id: string
  is_shared: boolean
}
