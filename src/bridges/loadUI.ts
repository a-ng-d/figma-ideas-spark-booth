import { lang, locals } from '../content/locals'
import { windowSize } from '../types/app'
import { ActiveParticipant } from '../types/configurations'
import { ActionsList } from '../types/models'
import checkCounts from './checks/checkCounts'
import checkEditorType from './checks/checkEditorType'
import checkHighlightStatus from './checks/checkHighlightStatus'
import checkPlanStatus from './checks/checkPlanStatus'
import checkUserConsent from './checks/checkUserConsent'
import enableTrial from './enableTrial'
import addOverviewToSlides from './export/addOverviewToSlides'
import addToBoard from './export/addToBoard'
import addSessionToSlides from './export/addSessionToSlides'
import exportCsv from './export/exportCsv'
import getProPlan from './getProPlan'
import duplicatePublishedActivity from './updates/duplicatePublishedActivity'
import endSession from './updates/endSession'
import startSession from './updates/startSession'
import updateParticipants from './updates/updateParticipants'
import updateSingleActivity from './updates/updateSingleActivity'
import updateSingleSession from './updates/updateSingleSession'
import { SessionDataToCanvas } from '../types/data'
import importSessions from './imports/importSessions'
import importActivities from './imports/importActivities'

const loadUI = async () => {
  let lastData = ''

  const windowSize: windowSize = {
    w: (await figma.clientStorage.getAsync('plugin_window_width')) ?? 640,
    h: (await figma.clientStorage.getAsync('plugin_window_height')) ?? 320,
  }

  figma.showUI(__html__, {
    width: windowSize.w,
    height: windowSize.h,
    title: locals[lang].name,
    themeColors: true,
  })

  await figma.loadAllPagesAsync()

  // Checks
  checkUserConsent()
    .then(() => checkEditorType())
    .then(() => checkPlanStatus())
    .then(() => updateParticipants())
    .then(() => checkCounts())
    .then(async (activeParticipants) => {
      figma.ui.postMessage({
        type: 'CHECK_USER_AUTHENTICATION',
        id: figma.currentUser?.id,
        data: {
          accessToken: await figma.clientStorage.getAsync(
            'supabase_access_token'
          ),
          refreshToken: await figma.clientStorage.getAsync(
            'supabase_refresh_token'
          ),
        },
      })
      figma.ui.postMessage({
        type: 'GET_ACTIVITIES',
        data: JSON.parse(figma.root.getPluginData('activities')),
      })
      figma.ui.postMessage({
        type: 'GET_SESSIONS',
        data: JSON.parse(figma.root.getPluginData('sessions')),
      })
      figma.ui.postMessage({
        type: 'GET_IDEAS',
        data: JSON.parse(figma.root.getPluginData('ideas')),
      })
      figma.ui.postMessage({
        type: 'GET_ACTIVE_PARTICIPANTS',
        data: activeParticipants,
      })
      figma.ui.postMessage({
        type: 'GET_USER',
        data: {
          id: figma.currentUser?.id,
          fullName: figma.currentUser?.name,
          avatar: figma.currentUser?.photoUrl,
        },
      })
    })

  // UI > Canvas
  figma.ui.onmessage = async (msg) => {
    const actions: ActionsList = {
      RESIZE_UI: async () => {
        const scaleX = Math.abs(msg.origin.x - msg.cursor.x - msg.shift.x),
          scaleY = Math.abs(msg.origin.y - msg.cursor.y - msg.shift.y)

        if (scaleX > 540) windowSize.w = scaleX
        else windowSize.w = 540
        if (scaleY > 300) windowSize.h = scaleY
        else windowSize.h = 300

        await figma.clientStorage.setAsync('plugin_window_width', windowSize.w)
        await figma.clientStorage.setAsync('plugin_window_height', windowSize.h)

        figma.ui.resize(windowSize.w, windowSize.h)
      },
      //
      UPDATE_ACTIVITIES: () =>
        figma.root.setPluginData('activities', JSON.stringify(msg.data)),
      UPDATE_SESSIONS: () =>
        figma.root.setPluginData('sessions', JSON.stringify(msg.data)),
      UPDATE_ACTIVITY: () => updateSingleActivity(msg.data),
      DUPLICATE_ACTIVITY: () => duplicatePublishedActivity(msg.data),
      START_SESSION: () => startSession(msg.data),
      END_SESSION: () => endSession(msg.data),
      UPDATE_SESSION: () => updateSingleSession(msg.data),
      PUSH_IDEA: () =>
        figma.root.setPluginData('ideas', JSON.stringify(msg.data)),
      UPDATE_IDEAS: () =>
        figma.root.setPluginData('ideas', JSON.stringify(msg.data)),
      FLAG_AS_DONE: () => updateParticipants({ hasFinished: true }),
      UNFLAG_AS_DONE: () => updateParticipants({ hasFinished: false }),
      BLOCK_PARTICIPANT: () => updateParticipants({ isBlocked: true }),
      UNBLOCK_PARTICIPANT: () => updateParticipants({ isBlocked: false }),
      //
      ADD_TO_BOARD: () => addToBoard(msg.data),
      ADD_OVERVIEW_TO_SLIDES: () =>
        addOverviewToSlides(msg.data)
          .finally(() => figma.ui.postMessage({ type: 'STOP_LOADER' }))
          .catch(() => figma.notify(locals[lang].error.addOverviewToSlides)),
      ADD_SESSION_TO_SLIDES: () =>
        addSessionToSlides(msg.data)
          .finally(() => figma.ui.postMessage({ type: 'STOP_LOADER' }))
          .catch(() => figma.notify(locals[lang].error.addSessionToSlides)),
      ADD_REPORT_TO_SLIDES: () => {
        const processSessions = async () => {
          await Promise.all(
            msg.data.sessions.map(async (data: SessionDataToCanvas) => {
              await addSessionToSlides({
                activity: msg.data.activity,
                session: data.session,
                ideas: data.ideas,
                participants: data.participants,
                stringifiedChart: data.stringifiedChart,
              })
            })
          )
        }

        processSessions()
          .then(() => addOverviewToSlides(msg.data))
          .finally(() => figma.ui.postMessage({ type: 'STOP_LOADER' }))
          .catch(() => figma.notify(locals[lang].error.addReportToSlides))
      },
      EXPORT_CSV: () => exportCsv(msg.data),
      //
      IMPORT_SESSIONS: () =>
        importSessions(msg.data.files, msg.data.activityId)
          .then((messages) =>
            figma.notify(messages.join('・'), { timeout: 10000 })
          )
          .catch((error) => {
            figma.notify(locals[lang].error.generic)
            throw error
          }),
      IMPORT_ACTIVITIES: () =>
        importActivities(msg.data.files)
          .then((messages) =>
            figma.notify(messages.join('・'), { timeout: 10000 })
          )
          .catch((error) => {
            figma.notify(locals[lang].error.generic)
            throw error
          }),
      //
      CHECK_USER_CONSENT: () => checkUserConsent(),
      CHECK_HIGHLIGHT_STATUS: () => checkHighlightStatus(msg.version),
      CHECK_PLAN_STATUS: async () => await checkPlanStatus(),
      //
      OPEN_IN_BROWSER: () => figma.openExternal(msg.url),
      //
      SEND_MESSAGE: () => figma.notify(msg.message),
      SET_ITEMS: () => {
        msg.items.forEach(
          async (item: { key: string; value: string }) =>
            await figma.clientStorage.setAsync(item.key, item.value)
        )
      },
      DELETE_ITEMS: () =>
        msg.items.forEach(
          async (item: string) => await figma.clientStorage.deleteAsync(item)
        ),
      //
      GET_PRO_PLAN: async () => await getProPlan(),
      ENABLE_TRIAL: async () => {
        await enableTrial()
        await checkPlanStatus()
      },
      //
      SIGN_OUT: () =>
        figma.ui.postMessage({
          type: 'SIGN_OUT',
          data: {
            connectionStatus: 'UNCONNECTED',
            userFullName: '',
            userAvatar: '',
            userId: undefined,
            accessToken: undefined,
            refreshToken: undefined,
          },
        }),
      //
      DEFAULT: () => null,
    }

    return actions[msg.type ?? 'DEFAULT']?.()
  }

  // Listeners
  figma.on('close', () => {
    let activeParticipants = JSON.parse(
      figma.root.getPluginData('activeParticipants')
    )
    activeParticipants = activeParticipants.filter(
      (participant: ActiveParticipant) =>
        participant.userIdentity.id !== figma.currentUser?.id
    )
    figma.root.setPluginData(
      'activeParticipants',
      JSON.stringify(activeParticipants)
    )
  })

  figma.on('timerdone', () => {
    figma.notify(locals[lang].warning.timesUp)
  })

  figma.on('documentchange', async (event) => {
    await checkPlanStatus()

    const rootPluginDataChange = event.documentChanges.find(
      (change) =>
        change.type === 'PROPERTY_CHANGE' &&
        'node' in change &&
        change.node.id === figma.root.id &&
        change.properties.includes('pluginData')
    )

    if (
      figma.root.getPluginData('event') === 'TRIAL_ENABLED' ||
      figma.root.getPluginData('event') === 'PRO_PLAN_ENABLED'
    ) {
      figma.root.setPluginData('event', '')
      const self = JSON.parse(
        figma.root.getPluginData('activeParticipants')
      ).find(
        (participant: ActiveParticipant) =>
          participant.userIdentity.id === figma.currentUser?.id
      )
      if (self.isBlocked) {
        figma.notify(locals[lang].success.unblockedParticipation)
        updateParticipants({
          isBlocked: false,
        })
      }
    }

    if (figma.root.getPluginData('event') === 'SESSION_STARTED') {
      figma.notify(
        `${locals[lang].success.startSession} ${JSON.parse(figma.root.getPluginData('activeParticipants')).find((participant: ActiveParticipant) => participant.hasStarted).userIdentity.fullName}`
      )
      setTimeout(() => {
        figma.root.setPluginData('event', '')
        updateParticipants({
          hasStarted: false,
          hasEnded: false,
          hasFinished: false,
        })
      }, 3000)
    }

    if (figma.root.getPluginData('event') === 'SESSION_ENDED') {
      figma.notify(
        `${locals[lang].success.endSession} ${JSON.parse(figma.root.getPluginData('activeParticipants')).find((participant: ActiveParticipant) => participant.hasEnded).userIdentity.fullName}`,
        {
          timeout: Infinity,
          button: {
            text: locals[lang].close,
            action: () => figma.closePlugin(),
          },
        }
      )
      setTimeout(() => {
        figma.root.setPluginData('event', '')
        updateParticipants({
          hasStarted: false,
          hasEnded: false,
          hasFinished: false,
          isBlocked: false,
        })
      }, 3000)
    }

    if (
      rootPluginDataChange !== undefined &&
      dataDidUpdate(figma.root.getPluginData('activities'))
    )
      figma.ui.postMessage({
        type: 'GET_ACTIVITIES',
        data: JSON.parse(figma.root.getPluginData('activities')),
      })

    if (
      rootPluginDataChange !== undefined &&
      dataDidUpdate(figma.root.getPluginData('sessions'))
    )
      figma.ui.postMessage({
        type: 'GET_SESSIONS',
        data: JSON.parse(figma.root.getPluginData('sessions')),
      })

    if (
      rootPluginDataChange !== undefined &&
      dataDidUpdate(figma.root.getPluginData('ideas'))
    )
      figma.ui.postMessage({
        type: 'GET_IDEAS',
        data: JSON.parse(figma.root.getPluginData('ideas')),
      })

    if (
      rootPluginDataChange !== undefined &&
      dataDidUpdate(figma.root.getPluginData('activeParticipants'))
    )
      figma.ui.postMessage({
        type: 'GET_ACTIVE_PARTICIPANTS',
        data: JSON.parse(figma.root.getPluginData('activeParticipants')),
      })
  })

  const dataDidUpdate = (data: string) => {
    if (lastData !== data) {
      lastData = data
      return true
    }
    return false
  }
}

export default loadUI
