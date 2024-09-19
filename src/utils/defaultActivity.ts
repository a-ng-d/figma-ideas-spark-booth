import { uid } from 'uid'

import { lang, locals } from '../content/locals'
import { yellowColor } from './config'

export const defaultActivity = {
  name: 'Classic Brainstorming',
  id: uid(),
  description: 'A classic session with a batch of yellow notes',
  instructions:
    'Write down your ideas and feedback on the following yellow note',
  groupedBy: 'PARTICIPANT',
  timer: {
    minutes: 10,
    seconds: 0,
  },
  noteTypes: [
    {
      name: locals[lang].settings.noteTypes.defaultNoteType,
      color: 'YELLOW',
      hex: yellowColor,
      id: uid(),
    },
  ],
  isEnabled: false,
  publicationStatus: {
    isPublished: false,
    isShared: false,
  },
  date: {
    createdAt: new Date().toISOString(),
    updatedAt: '',
    publishedAt: '',
  },
  creatorIdentity: {
    creatorFullName: 'Ideas Brainstorming Booth',
    creatorId: uid(),
    creatorAvatar: '',
  },
}
