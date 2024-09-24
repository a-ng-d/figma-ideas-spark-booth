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
  name: string
  color: ColorConfiguration
  hex: HexModel
  id: string
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
    ideas: number
    participants: Array<UserConfiguration>
  }
  date: Date | string
  isOngoing: boolean
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
  fullName: string
  avatar: string
  id: string
}

export interface AnimatorConfiguration {
  fullName: string
  avatar: string
  id: string
}

export interface CreatorConfiguration {
  fullName: string
  avatar: string
  id: string
}

export interface MetaConfiguration {
  id: string
  dates: DatesConfiguration
  publicationStatus: PublicationConfiguration
  creatorIdentity: CreatorConfiguration
}
