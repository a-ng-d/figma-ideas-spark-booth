import {
  ActivityConfiguration,
  GroupedBy,
  IdeaConfiguration,
  SessionConfiguration,
  TypeConfiguration,
  UserConfiguration,
} from './configurations'

export interface ExternalActivitiesData {
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

export interface SessionDataToCanvas {
  activity: ActivityConfiguration
  session: SessionConfiguration
  ideas: { [key: string]: Array<IdeaConfiguration> }
  participants: Array<UserConfiguration>
  stringifiedChart: string
}

export interface FileContent {
  name: string
  content: string | ArrayBuffer | null | undefined
  isValid?: boolean
  status?: 'EXISTING' | 'NOT_LINKED' | 'OK'
}
