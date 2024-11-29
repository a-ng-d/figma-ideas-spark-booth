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
