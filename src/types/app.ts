export type AppStatus = 'LOADING' | 'LOADED' | 'CORRUPTED'

export type Service = 'BROWSE' | 'PARTICIPATE'

export type Context =
  | 'ACTIVITIES'
  | 'ACTIVITIES_LOCAL'
  | 'ACTIVITIES_SELF'
  | 'EXPLORE'

export type FilterOptions =
  | 'ANY'
  | 'YELLOW'
  | 'ORANGE'
  | 'RED'
  | 'GREEN'
  | 'VIOLET'
  | 'BLUE'

export type EditorType = 'figma' | 'figjam' | 'dev'

export type PlanStatus = 'UNPAID' | 'PAID' | 'NOT_SUPPORTED'

export type TrialStatus = 'UNUSED' | 'PENDING' | 'EXPIRED'

export type FetchStatus =
  | 'UNLOADED'
  | 'LOADING'
  | 'LOADED'
  | 'ERROR'
  | 'EMPTY'
  | 'COMPLETE'
  | 'SIGN_IN_FIRST'
  | 'NO_RESULT'

export type HighlightStatus =
  | 'NO_HIGHLIGHT'
  | 'DISPLAY_HIGHLIGHT_NOTIFICATION'
  | 'DISPLAY_HIGHLIGHT_DIALOG'

export type Language = 'en-US'

export interface windowSize {
  w: number
  h: number
}

export interface HighlightDigest {
  version: string
  status: HighlightStatus
}

export type PriorityContext =
  | 'EMPTY'
  | 'HIGHLIGHT'
  | 'WELCOME_TO_PRO'
  | 'WELCOME_TO_TRIAL'
  | 'TRY'
  | 'ABOUT'
  | 'PUBLICATION'
  | 'REPORT'

export interface ContextItem {
  label: string
  id: Context
  isUpdated: boolean
  isActive: boolean
}

export type PublicationStatus =
  | 'UNPUBLISHED'
  | 'CAN_BE_PUSHED'
  | 'MUST_BE_PULLED'
  | 'MAY_BE_PULLED'
  | 'PUBLISHED'
  | 'UP_TO_DATE'
  | 'CAN_BE_REVERTED'
  | 'IS_NOT_FOUND'
  | 'WAITING'
