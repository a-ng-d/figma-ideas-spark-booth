import { trialTime } from '../utils/config'

export const lang = 'en-US'

const glossary: {
  [key: string]: string
} = {
  name: 'Ideas Brainstorming Booth',
  tagline: 'Brainstorm secretly 🤫 with your team',
  url: 'ideas.yelbo.lt',
}

export const locals: { [key: string]: any } = {
  'en-US': {
    name: glossary.name,
    tagline: glossary.tagline,
    url: glossary.url,
    global: {
      description: {
        label: 'Description',
        placeholder: "What's it for?",
      },
    },
    onboarding: {},
    shortcuts: {
      feedback: 'Give feedback',
      trialFeedback: 'How was it?',
      news: "What's new",
      about: 'About',
    },
    publication: {
      publish: 'Publish…',
    },
    relaunch: {},
    contexts: {
      activities: 'Activities',
      explore: 'Explore',
    },
    activities: {
      title: 'Local activities',
      newActivity: 'New activity',
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
    },
    participate: {
      noSelfIdea: 'You have not added any idea yet',
      noParticipantIdea: 'No participant has added any idea yet',
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
      repository: 'Repository',
      getHelp: {
        title: 'Have help',
        documentation: 'Read the documentation',
        email: 'Contact support',
      },
      beInvolved: {
        title: 'Get involved',
        issue: 'Report a bug',
        discuss: 'Start a discussion',
        request: 'Post a feature request',
      },
      giveSupport: {
        title: 'Give support',
        follow: 'Follow us',
      },
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
      dev: 'Developer plan',
    },
    proPlan: {
      welcome: {
        title: `Welcome to ${glossary.name} Pro!`,
        message: '-',
        trial: '-',
        cta: '',
      },
      trial: {
        title: `Would you like to upgrade to the Pro plan within the next ${trialTime} hours?`,
        message: '-',
        cta: `Enable the ${trialTime}-hour trial`,
        option: 'Purchase',
      },
    },
    user: {
      signIn: 'Sign in',
      signOut: 'Sign out',
      welcomeMessage: 'Hello $[]',
      updateConsent: 'Manage your cookies',
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
    success: {},
    info: {
      noResult: 'No activity match your search',
    },
    generic: {},
    warning: {},
    error: {
      generic: '✕ Something went wrong',
      badResponse: '✕ The response is not valid',
      authentication: '✕ The authentication has failed',
      timeout: '✕ The authentication has been timed out',
      fetch: 'The activities cannot be loaded',
      addToFile: '✕ The activities cannot be added',
      noInternetConnection:
        '✕ The connection with the remote activity is unlinked',
      announcements: 'The announcements cannot be loaded',
    },
  },
}
