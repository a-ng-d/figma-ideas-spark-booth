import { trialTime } from '../config'

export const lang = 'en-US'

const glossary: {
  [key: string]: string
} = {
  name: 'Ideas Spark Booth',
  tagline: 'Brainstorm secretly 🤫 with your team',
  url: 'isb.yelbolt.co',
  author: 'Aurélien Grimaud',
  license: 'MIT',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const locals: { [key: string]: any } = {
  'en-US': {
    name: glossary.name,
    tagline: glossary.tagline,
    url: glossary.url,
    close: `Close ${glossary.name}`,
    publication: {
      titlePublish: 'Publish activity',
      titleSynchronize: 'Synchronize activity',
      titleSignIn: 'Publish or Synchronize activities',
      message:
        'Publish your activity as a single source of truth and reuse it in other FigJam documents. You can also distribute your activities by sharing them with the community.',
      signIn: 'Sign in to publish or synchronize',
      share: 'Share with the community',
      unshare: 'Remove from the community',
      statusShared: 'Shared',
      statusLocalChanges: 'Local changes',
      statusUptoDate: 'No change',
      statusPublished: 'Published',
      statusUnpublished: 'Unpublished',
      statusRemoteChanges: 'Remote changes',
      statusWaiting: 'Pending…',
      statusNotFound: 'Not found',
      publish: 'Publish…',
      unpublish: 'Unpublish',
      synchronize: 'Synchronize…',
      revert: 'Revert',
      detach: 'Detach',
    },
    relaunch: {},
    contexts: {
      activities: 'Activities',
      activitiesLocal: 'Local',
      activitiesSelf: 'My activities',
      explore: 'Explore',
    },
    activities: {
      title: 'Local activities',
      newActivity: 'New activity',
      addFirst: {
        message: 'Create and configure your own local activities',
        cta: 'Add your first activity',
      },
      signInFirst: {
        message: 'Find and reuse your published activities once authentified',
        signIn: 'Sign in to fetch your activities',
      },
      lazyLoad: {
        search: 'Search activities…',
        loadMore: 'Load more activities',
        completeList: 'The activities list is complete',
      },
      duplicateToLocal: 'Duplicate to local',
    },
    sessions: {
      newSession: 'New session',
      endSession: 'session has ended',
    },
    settings: {
      global: {
        title: 'Global settings',
        name: {
          label: 'Name',
        },
        description: {
          label: 'Description',
          placeholder: "What's it for?",
        },
        instructions: {
          label: 'Instructions',
          placeholder: 'Describe the rules and the goal of the activity',
        },
        groupedBy: {
          label: 'Grouped by',
          participant: 'Participant',
          type: 'Type',
        },
        publish: 'Publish activity',
        synchronize: 'Synchronize activity',
        signIn: 'Sign in to publish',
        delete: 'Delete activity',
      },
      timer: {
        title: 'Timer',
        minutes: {
          label: 'Minutes',
        },
        seconds: {
          label: 'Seconds',
        },
      },
      types: {
        title: 'Types',
        description: {
          label: 'Description',
          placeholder: "What's it for?",
        },
        newType: 'New type',
        defaultType: 'Classic yellow',
        colors: {
          gray: 'Gray',
          orange: 'Orange',
          red: 'Red',
          yellow: 'Yellow',
          green: 'Green',
          blue: 'Blue',
          violet: 'Violet',
          pink: 'Pink',
          lightGray: 'Light gray',
        },
      },
      history: {
        title: 'Session history',
        participants: {
          single: 'participant',
          plural: 'participants',
        },
        ideas: {
          single: 'idea',
          plural: 'ideas',
        },
      },
      deleteActivityDialog: {
        title: 'Delete activity',
        message:
          "You're about to delete the activity $1. This action is irreversible.",
        delete: 'Delete activity',
        cancel: 'Cancel',
      },
      deleteSessionDialog: {
        title: 'Delete session',
        message:
          "You're about to delete the session on $1. This action is irreversible.",
        delete: 'Delete session',
        cancel: 'Cancel',
      },
    },
    history: {
      filter: {
        none: 'None',
        types: 'Types',
        participants: 'Participants',
      },
      sort: {
        recent: 'Most recent',
        old: 'Oldest',
      },
      noIdea: 'This session has no idea',
      addToBoard: 'Add to board',
      addToSlides: 'Add to slides',
      exportCsv: 'Export as CSV',
      deleteSession: 'Delete session',
    },
    participate: {
      ideas: 'Ideas',
      onGoing: 'Ongoing…',
      finished: 'Finished',
      blocked: 'Blocked',
      flagAsDone: 'Flag facilitator you are done',
      unflagAsDone: 'Remove flag',
      noSelfIdea: 'You have not added any idea yet',
      noParticipantIdea: 'No participant has added any idea yet',
      info: {
        sessionIdeas: 'Session ideas',
        participants: 'Participants',
        types: 'Types',
        description: 'Description',
        instructions: 'Instructions',
      },
      endSession: 'End session',
      endSessionDialog: {
        facilitatorTitle: 'Are you sure to end the session?',
        participantTitle:
          "Are you sure to end the session on facilitator's behalf?",
        message:
          'This will close the session and all participants will be notified.',
        cancel: 'Cancel',
      },
    },
    consolisation: {
      analysis: 'Session at a glance',
    },
    shortcuts: {
      documentation: 'Read the documentation',
      news: "What's new",
      repository: 'Repository',
      request: 'Share your ideas',
      feedback: 'Submit feedback',
      email: 'Contact support',
      follow: 'Support us',
      author: 'Support the author',
    },
    report: {
      title: 'Report a bug',
      fullName: {
        label: 'Full name',
        placeholder: 'Optional',
      },
      email: {
        label: 'Email',
        placeholder: 'Optional',
      },
      message: {
        label: 'Message (required)',
        placeholder:
          'Describe the issue you encountered by trying to describe the steps to reproduce it.',
      },
      cta: 'Submit your issue',
    },
    about: {
      title: `About ${glossary.name}`,
      createdBy: 'Created and maintained by ',
      author: glossary.author,
      sourceCode: 'Source code',
      isLicensed: ' is licensed under ',
      license: glossary.license,
    },
    highlight: {
      cta: {
        next: 'Next',
        gotIt: 'Got it',
        learnMore: 'Learn more',
      },
    },
    plan: {
      getPro: 'Get Pro',
      tryPro: 'Try Pro',
      pro: 'Pro plan',
      free: 'Free plan',
      trial: 'Trial',
      trialEnded: 'Your trial has ended',
      trialTimeDays: {
        single: '1 day left in this trial',
        plural: '$1 days left in this trial',
      },
      trialTimeHours: {
        single: '1 hour left in this trial',
        plural: '$1 hours left in this trial',
      },
      trialFeedback: 'How was it?',
      sessionCount: {
        none: 'No session left',
        single: '1 session left',
        plural: '$1 sessions left',
      },
      dev: 'Developer plan',
    },
    proPlan: {
      welcome: {
        title: `Welcome to ${glossary.name} Pro!`,
        message: '-',
        trial: '-',
        cta: '-',
      },
      trial: {
        title: `Would you like to upgrade to the Pro plan within the next ${trialTime} hours?`,
        message: '-',
        cta: `Enable the ${trialTime}-hour trial`,
        option: 'Purchase',
      },
    },
    beta: {
      message: `${glossary.name} is currently in beta. We are working hard to improve it. If you have any feedback, please let us know!`,
      cta: 'Give feedback',
    },
    user: {
      signIn: 'Sign in',
      signOut: 'Sign out',
      welcomeMessage: 'Hello $[]',
      updateConsent: 'Manage your cookies',
      you: 'You',
      cookies: {
        welcome: `${glossary.name} uses cookies to understand how you use our plugin and to improve your experience.`,
        vendors:
          'By accepting this, you agree to our use of cookies and other technologies for the purposes listed above.',
        privacyPolicy: 'Read our Privacy Policy',
        customize: 'Customize cookies',
        back: 'Back',
        deny: 'Deny all',
        consent: 'Accept all',
        save: 'Save preferences',
      },
    },
    vendors: {
      functional: {
        name: 'Functional',
        description: 'Cookies that are necessary for the plugin to work',
      },
      mixpanel: {
        name: 'Mixpanel',
        description:
          'A top analytics platform for tracking and understanding user interactions',
      },
    },
    pending: {
      announcements: 'Pending announcements…',
      primaryAction: '………',
      secondaryAction: '………',
    },
    success: {
      startSession: 'The session has been started by',
      endSession: 'The session has been ended by',
      publication: '✓ The activity has been published',
      nonPublication: '✓ The activity has been unpublished',
      synchronization: '✓ The activity has been synchronized',
      detachment: '✓ The activity has been detached',
      report: '✓ Thanks for your report',
      share: '✓ The activity has been shared with the community',
      unshare: '✓ The activity is no longer shared with the community',
      duplicatedActivity:
        '✓ The activity has been duplicated to the local ones',
      unblockedParticipation: '✓ You can now participate',
    },
    info: {
      noResult: 'No activity match your search',
      inviteParticipants: `Invite participants to join the FigJam board and tell them to open ${glossary.name}`,
      maxNumberOfTypes: 'You cannot add more than $1 types',
      maxNumberOfActivities: 'You cannot add more than $1 activities',
      maxNumberOfParticipants: 'You cannot add more than $1 participants',
      blockedParticipation:
        'Your participation is blocked because the maximum number of $1 participants is reached. You can ask the facilitator to upgrade to Pro plan.',
      signOut: '☻ See you later',
    },
    warning: {
      timesUp: 'The time is up!',
      noSelfactivityOnRemote:
        'This is quite empty around here! Publish your activity to reuse it across multiple boards.',
      noCommunityactivityOnRemote:
        'This is quite empty around here! Be the first to share your activity with other users!',
      activityAlreadyExists:
        'This activity is already duplicated to the local ones',
      blockedParticipations:
        'Some of your participants cannot create ideas due to the limit of $1 participants reached',
    },
    error: {
      generic: '✕ Something went wrong',
      badResponse: '✕ The response is not valid',
      authentication: '✕ The authentication has failed',
      timeout: '✕ The authentication has been timed out',
      publication: '✕ The activity cannot be published',
      nonPublication: '✕ The activity cannot be unpublished',
      synchronization: '✕ The activity has not been synchronized',
      share: '✕ The activity has not been shared with the community',
      unshare: '✕ The activity has not been removed from the community',
      fetchActivity: 'The activities cannot be loaded',
      duplicateToLocal: '✕ The activity cannot be duplicated',
      noInternetConnection:
        '✕ The connection with the remote activity is unlinked',
      announcements: 'The announcements cannot be loaded',
      corruptedData:
        'The data is corrupted. Please restore a previous version of the FigJam board before you have run the last session.',
    },
  },
}
