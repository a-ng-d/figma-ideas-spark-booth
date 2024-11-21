export interface TrialEvent {
  date: number
  trialTime: number
}

export interface PublicationEvent {
  feature:
    | 'PUBLISH_PALETTE'
    | 'UNPUBLISH_PALETTE'
    | 'PUSH_PALETTE'
    | 'PULL_PALETTE'
    | 'REUSE_PALETTE'
    | 'SYNC_PALETTE'
    | 'REVERT_PALETTE'
    | 'DETACH_PALETTE'
    | 'ADD_PALETTE'
    | 'SHARE_PALETTE'
}

export interface ImportEvent {
  feature: 'IMPORT_COOLORS' | 'IMPORT_REALTIME_COLORS' | 'IMPORT_COLOUR_LOVERS'
}
