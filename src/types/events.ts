export interface TrialEvent {
  date: number
  trialTime: number
  trialVersion: string
}

export interface PublicationEvent {
  feature:
    | 'PUBLISH_ACTIVITY'
    | 'UNPUBLISH_ACTIVITY'
    | 'PUSH_ACTIVITY'
    | 'PULL_ACTIVITY'
    | 'REUSE_ACTIVITY'
    | 'SYNC_ACTIVITY'
    | 'REVERT_ACTIVITY'
    | 'DETACH_ACTIVITY'
    | 'DUPLICATE_ACTIVITY'
    | 'SHARE_ACTIVITY'
}

export interface EndSessionEvent {
  activityName: string
  activityDescription: string
  participantsNumber: number
  finishedParticipantsNumber: number
  unfinishedParticipantsNumber: number
  sessionTimer: number
  sessionDuration: number
  ideasNumber: number
}

export interface ActivityEvent {
  feature:
    | 'ADD_ACTIVITY'
    | 'DELETE_ACTIVITY'
    | 'RENAME_ACTIVITY'
    | 'UPDATE_DESCRIPTION'
    | 'UPDATE_INSTRUCTIONS'
    | 'UPDATE_GROUPED_BY'
    | 'UPDATE_TIMER_MINUTES'
    | 'UPDATE_TIMER_SECONDS'
}

export interface TypeEvent {
  feature:
    | 'ADD_TYPE'
    | 'RENAME_TYPE'
    | 'UPDATE_COLOR'
    | 'UPDATE_DESCRIPTION'
    | 'REMOVE_ITEM'
    | 'REORDER_TYPES'
}

export interface FatalErrorEvent {
  data: 'ACTIVITIES' | 'SESSIONS' | 'IDEAS'
}
