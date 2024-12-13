import * as Yup from 'yup'
import {
  ActivityConfiguration,
  IdeaConfiguration,
  SessionConfiguration,
} from '../types/configurations'

const activitySchema = Yup.object().shape({
  name: Yup.string().required(),
  description: Yup.string().nullable(),
  instructions: Yup.string().nullable(),
  groupedBy: Yup.string().required(),
  timer: Yup.object().shape({
    minutes: Yup.number().required(),
    seconds: Yup.number().required(),
  }),
  types: Yup.array().of(
    Yup.object().shape({
      id: Yup.string().required(),
      name: Yup.string().nullable(),
      color: Yup.string().nullable(),
      hex: Yup.string().nullable(),
      description: Yup.string().nullable(),
    })
  ),
  meta: Yup.object().shape({
    id: Yup.string().required(),
    dates: Yup.object().shape({
      createdAt: Yup.string().required(),
      addedAt: Yup.string().nullable(),
      updatedAt: Yup.string().nullable(),
      publishedAt: Yup.string().nullable(),
    }),
    publicationStatus: Yup.object().shape({
      isPublished: Yup.boolean().required(),
      isShared: Yup.boolean().required(),
    }),
    creator: Yup.object().shape({
      id: Yup.string().nullable(),
      fullName: Yup.string().nullable(),
      avatar: Yup.string().nullable(),
    }),
  }),
})

const sessionSchema = Yup.object().shape({
  id: Yup.string().required(),
  facilitator: Yup.object().shape({
    id: Yup.string().nullable(),
    fullName: Yup.string().nullable(),
    avatar: Yup.string().nullable(),
  }),
  metrics: Yup.object().shape({
    startDate: Yup.string().required(),
    endDate: Yup.string().nullable(),
    participants: Yup.number().required(),
    ideas: Yup.number().required(),
  }),
  isRunning: Yup.boolean().required(),
  activityId: Yup.string().required(),
})

const ideaSchema = Yup.object().shape({
  id: Yup.string().required(),
  text: Yup.string().nullable(),
  type: Yup.object().shape({
    id: Yup.string().required(),
    name: Yup.string().nullable(),
    color: Yup.string().required(),
    hex: Yup.string().required(),
    description: Yup.string().nullable(),
  }),
  userIdentity: Yup.object().shape({
    id: Yup.string().nullable(),
    fullName: Yup.string().nullable(),
    avatar: Yup.string().nullable(),
  }),
  createdAt: Yup.string().required(),
  sessionId: Yup.string().required(),
  activityId: Yup.string().required(),
})

export const validateActivitiesStructure = async (
  data: Array<ActivityConfiguration>
) => {
  if (!Array.isArray(data)) throw new Error()

  for (const activity of data)
    try {
      await activitySchema.validate(activity)
    } catch (error) {
      throw new Error()
    }
}

export const validateSessionsStructure = async (
  data: Array<SessionConfiguration>
) => {
  if (!Array.isArray(data)) throw new Error()
  for (const session of data)
    try {
      await sessionSchema.validate(session)
    } catch (error) {
      throw new Error()
    }
}

export const validateIdeasStructure = async (
  data: Array<IdeaConfiguration>
) => {
  if (!Array.isArray(data)) throw new Error()

  for (const idea of data)
    try {
      await ideaSchema.validate(idea)
    } catch (error) {
      throw new Error()
    }
}
