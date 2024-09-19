import { HexModel } from '@a_ng_d/figmug-ui'

export interface ActivityConfiguration {
  name: string
  id: string
  description: string
  instructions: string
  groupedBy: GroupedBy
  timer: TimerConfiguration
  noteTypes: Array<NoteConfiguration>
  isEnabled: boolean
  date: DatesConfiguration
  publicationStatus: PublicationConfiguration
  creatorIdentity: UserConfiguration
}

export type GroupedBy = 'PARTICIPANT' | 'NOTE_TYPE'

export interface TimerConfiguration {
  minutes: number
  seconds: number
}

export interface NoteConfiguration {
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
  userFullName: string
  userAvatar: string
  userId: string
}

export interface MetaConfiguration {
  id: string
  dates: DatesConfiguration
  publicationStatus: PublicationConfiguration
  creatorIdentity: UserConfiguration
}
