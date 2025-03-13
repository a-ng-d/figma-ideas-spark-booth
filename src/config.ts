import { doSpecificMode, featuresScheme } from './stores/features'

// Theme
export const theme = 'figma-ui3'

// Limitations
export const isTrialEnabled = false
export const isProEnabled = false
export const trialTime = 168
export const oldTrialTime = 168
export const pageSize = 20

// Versions
export const versionStatus = 'BETA'
export const userConsentVersion = '2024.01'
export const trialVersion = '2024.01'

// URLs
export const authWorkerUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8787'
    : (process.env.REACT_APP_AUTH_WORKER_URL as string)
export const announcementsWorkerUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8888'
    : (process.env.REACT_APP_ANNOUNCEMENTS_WORKER_URL as string)
export const databaseUrl = process.env.REACT_APP_SUPABASE_URL as string
export const authUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : (process.env.REACT_APP_AUTH_URL as string)

export const activitiesDbTableName =
  process.env.NODE_ENV === 'development' ? 'sandbox.activities' : 'activities'
export const activitiesStorageName =
  process.env.NODE_ENV === 'development'
    ? 'activity.thumbnails'
    : 'activity.thumbnails'
export const templatesDbTableName =
  process.env.NODE_ENV === 'development' ? 'sandbox.templates' : 'templates'

// External URLs
export const documentationUrl = 'https://isb.ylb.lt/docs'
export const repositoryUrl = 'https://isb.ylb.lt/repository'
export const supportEmail = 'https://isb.ylb.lt/contact'
export const feedbackUrl = 'https://isb.ylb.lt/feedback'
export const trialFeedbackUrl = 'https://isb.ylb.lt/feedback-trial'
export const requestsUrl = 'https://isb.ylb.lt/ideas'
export const networkUrl = 'https://isb.ylb.lt/network'
export const authorUrl = 'https://isb.ylb.lt/author'
export const licenseUrl = 'https://isb.ylb.lt/license'
export const privacyUrl = 'https://isb.ylb.lt/privacy'
export const uicpUrl = 'https://uicp.ylb.lt/run'

// Note colors
export const whiteColor = '#FFFFFF'
export const grayColor = '#E6E6E6'
export const greenColor = '#B3EFBD'
export const tealColor = '#B3F4EF'
export const blueColor = '#A8DAFF'
export const violetColor = '#D3BDFF'
export const pinkColor = '#FFA8DB'
export const redColor = '#FFB8A8'
export const orangeColor = '#FFD3A8'
export const yellowColor = '#FFE299'

// Features modes
const devMode = featuresScheme
const prodMode = doSpecificMode()

export const features =
  process.env.NODE_ENV === 'development' ? devMode : prodMode

export default features
