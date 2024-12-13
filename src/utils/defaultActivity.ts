import { uid } from 'uid'
import { yellowColor } from '../config'
import { lang, locals } from '../content/locals'
import { ActivityConfiguration } from '../types/configurations'

const now = new Date().toISOString()

export const defaultActivity: ActivityConfiguration = {
  name: 'Classic Brainstorming',
  description: 'A classic session with a batch of yellow notes',
  instructions:
    'Write down your ideas and feedback on the following yellow note',
  groupedBy: 'PARTICIPANT',
  timer: {
    minutes: 10,
    seconds: 0,
  },
  types: [
    {
      name: locals[lang].settings.types.defaultType,
      color: 'YELLOW',
      hex: yellowColor,
      id: uid(),
      description: '',
    },
  ],
  meta: {
    id: uid(),
    publicationStatus: {
      isPublished: false,
      isShared: false,
    },
    dates: {
      createdAt: now,
      addedAt: now,
      updatedAt: '',
      publishedAt: '',
    },
    creatorIdentity: {
      fullName: '',
      id: '',
      avatar: '',
    },
  },
}
