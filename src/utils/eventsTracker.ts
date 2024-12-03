import { ConsentConfiguration } from '@a_ng_d/figmug-ui'
import mixpanel from 'mixpanel-figma'
import {
  ActivityEvent,
  EndSessionEvent,
  FatalErrorEvent,
  PublicationEvent,
  TrialEvent,
  TypeEvent,
} from '../types/events'
import { userConsentVersion } from './config'

const eventsRecurringProperties = {
  Env: process.env.NODE_ENV === 'development' ? 'Dev' : 'Prod',
}

export const trackRunningEvent = (id: string, consent: boolean) => {
  if (!consent) return
  mixpanel.identify(id)
  mixpanel.track('Plugin Run', { ...eventsRecurringProperties })
}

export const trackUserConsentEvent = (consent: Array<ConsentConfiguration>) => {
  mixpanel.track('Consent Proof Sent', {
    'User Consent Version': userConsentVersion,
    Consent: consent.map((c) => {
      return { [c.name]: c.isConsented }
    }),
    ...eventsRecurringProperties,
  })
}

export const trackSignInEvent = (id: string, consent: boolean) => {
  if (!consent) return true
  try {
    mixpanel.identify(id)
    mixpanel.track('Signed in', { ...eventsRecurringProperties })
  } catch (error) {
    return true
  }
}

export const trackSignOutEvent = (id: string, consent: boolean) => {
  if (!consent) return true
  try {
    mixpanel.identify(id)
    mixpanel.track('Signed out', { ...eventsRecurringProperties })
  } catch (error) {
    return true
  }
}

export const trackTrialEnablementEvent = (
  id: string,
  consent: boolean,
  options: TrialEvent
) => {
  if (!consent) return true
  try {
    mixpanel.identify(id)
    mixpanel.track('Trial Enabled', {
      'Trial Start Date': new Date(options.date).toISOString(),
      'Trial End Date': new Date(
        options.date + options.trialTime * 3600 * 1000
      ).toISOString(),
      'Trail Time': options.trialTime + ' hours',
      'Trial Version': options.trialVersion,
      ...eventsRecurringProperties,
    })
  } catch (error) {
    return true
  }
}

export const trackPurchaseEvent = (id: string, consent: boolean) => {
  if (!consent) return true
  try {
    mixpanel.identify(id)
    mixpanel.track('Purchase Enabled', { ...eventsRecurringProperties })
  } catch (error) {
    return true
  }
}

export const trackPublicationEvent = (
  id: string,
  consent: boolean,
  options: PublicationEvent
) => {
  if (!consent) return true
  try {
    mixpanel.identify(id)
    mixpanel.track('Activity Managed', {
      Feature: options.feature,
      ...eventsRecurringProperties,
    })
  } catch (error) {
    return true
  }
}

export const trackEndSessionEvent = (
  id: string,
  consent: boolean,
  options: EndSessionEvent
) => {
  if (!consent) return true
  try {
    mixpanel.identify(id)
    mixpanel.track('Session Ended', {
      'Activity Name': options.activityName,
      'Activity Description': options.activityDescription,
      'Participants Number': options.participantsNumber,
      'Finished Participants Number': options.finishedParticipantsNumber,
      'Unfinished Participants Number': options.unfinishedParticipantsNumber,
      'Session Timer': options.sessionTimer,
      'Session Duration': options.sessionDuration,
      'Ideas Number': options.ideasNumber,
      ...eventsRecurringProperties,
    })
  } catch (error) {
    return true
  }
}
export const trackActivityEvent = (
  id: string,
  consent: boolean,
  options: ActivityEvent
) => {
  if (!consent) return true
  try {
    mixpanel.identify(id)
    mixpanel.track('Activity Updated', {
      Feature: options.feature,
      ...eventsRecurringProperties,
    })
  } catch (error) {
    return true
  }
}

export const trackTypeEvent = (
  id: string,
  consent: boolean,
  options: TypeEvent
) => {
  if (!consent) return true
  try {
    mixpanel.identify(id)
    mixpanel.track('Type Updated', {
      Feature: options.feature,
      ...eventsRecurringProperties,
    })
  } catch (error) {
    return true
  }
}

export const trackFatalErrorEvent = (
  id: string,
  consent: boolean,
  options: FatalErrorEvent
) => {
  if (!consent) return true
  try {
    mixpanel.identify(id)
    mixpanel.track('Type Updated', {
      Data: options.data,
      ...eventsRecurringProperties,
    })
  } catch (error) {
    return true
  }
}
