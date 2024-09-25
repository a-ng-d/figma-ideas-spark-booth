import { HexModel } from '@a_ng_d/figmug-ui'

export interface ActivityConfiguration {
  name: string
  description: string
  instructions: string
  groupedBy: GroupedBy
  timer: TimerConfiguration
  types: Array<TypeConfiguration>
  meta: MetaConfiguration
}

export type GroupedBy = 'PARTICIPANT' | 'TYPE'

export interface TimerConfiguration {
  minutes: number
  seconds: number
}

export interface TypeConfiguration {
  id: string
  name: string
  color: ColorConfiguration
  hex: HexModel
  description: string
}

export type ColorConfiguration =
  | 'GRAY'
  | 'ORANGE'
  | 'RED'
  | 'YELLOW'
  | 'GREEN'
  | 'BLUE'
  | 'VIOLET'
  | 'PINK'
  | 'LIGHT_GRAY'

export interface SessionConfiguration {
  id: string
  animator: AnimatorConfiguration
  metrics: {
    startDate: Date | string
    endDate: Date | string
  }
  isRunning: boolean
  activityId: string
}

export interface IdeaConfiguration {
  id: string
  text: string
  type: TypeConfiguration
  userIdentity: UserConfiguration
  date: Date | string
  sessionId: string
  activityId: string
}

export interface DatesConfiguration {
  createdAt: Date | string
  updatedAt: Date | string
  publishedAt: Date | string
}

export interface PublicationConfiguration {
  isPublished: boolean
  isShared: boolean
}

export interface UserConfiguration {
  id: string
  fullName: string
  avatar: string
}

export interface AnimatorConfiguration {
  id: string
  fullName: string
  avatar: string
}

export interface CreatorConfiguration {
  id: string
  fullName: string
  avatar: string
}

export interface MetaConfiguration {
  id: string
  dates: DatesConfiguration
  publicationStatus: PublicationConfiguration
  creatorIdentity: CreatorConfiguration
}
