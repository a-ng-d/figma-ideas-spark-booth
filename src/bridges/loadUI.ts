import { lang, locals } from '../content/locals'
import { windowSize } from '../types/app'
import { ActiveParticipants } from '../types/configurations'
import { ActionsList } from '../types/models'
import addToBoard from './addToBoard'
import checkHighlightStatus from './checks/checkHighlightStatus'
import checkPlanStatus from './checks/checkPlanStatus'
import checkUserConsent from './checks/checkUserConsent'
import enableTrial from './enableTrial'
import endSession from './endSession'
import exportCsv from './export/exportCsv'
import getProPlan from './getProPlan'
import startSession from './startSession'
import updateParticipants from './updates/updateParticipants'

const loadUI = async () => {
  let lastData: string = ''

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

  figma.loadAllPagesAsync()

  // Checks
  checkUserConsent()
    .then(() => checkPlanStatus())
    .then(() => updateParticipants())
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
      START_SESSION: () => startSession(msg.data),
      END_SESSION: () => endSession(msg.data),
      PUSH_IDEA: () =>
        figma.root.setPluginData('ideas', JSON.stringify(msg.data)),
      UPDATE_IDEAS: () =>
        figma.root.setPluginData('ideas', JSON.stringify(msg.data)),
      FLAG_AS_DONE: () => updateParticipants({ hasFinished: true }),
      UNFLAG_AS_DONE: () => updateParticipants({ hasFinished: false }),
      //
      ADD_TO_BOARD: () => addToBoard(msg.data),
      EXPORT_CSV: () => exportCsv(msg.data),
      //
      CHECK_USER_CONSENT: () => checkUserConsent(),
      CHECK_HIGHLIGHT_STATUS: () => checkHighlightStatus(msg.version),
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
    }

    return actions[msg.type]?.()
  }

  // Listeners
  figma.on('close', () => {
    let activeParticipants = JSON.parse(
      figma.root.getPluginData('activeParticipants')
    )
    activeParticipants = activeParticipants.filter(
      (participant: ActiveParticipants) =>
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

  figma.on('documentchange', (event) => {
    const rootPluginDataChange = event.documentChanges.find(
      (change) =>
        change.type === 'PROPERTY_CHANGE' &&
        'node' in change &&
        change.node.id === figma.root.id &&
        change.properties.includes('pluginData')
    )

    if (figma.root.getPluginData('event') === 'SESSION_STARTED') {
      figma.notify(
        `${locals[lang].success.startSession} ${JSON.parse(figma.root.getPluginData('activeParticipants')).find((participant: ActiveParticipants) => participant.hasStarted).userIdentity.fullName}`
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
        `${locals[lang].success.endSession} ${JSON.parse(figma.root.getPluginData('activeParticipants')).find((participant: ActiveParticipants) => participant.hasEnded).userIdentity.fullName}`,
        {
          timeout: Infinity,
          button: {
            text: locals[lang].global.close,
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
        })
      }, 3000)
    }

    if (
      rootPluginDataChange !== undefined &&
      dataDidUpdate(figma.root.getPluginData('activities'))
    ) {
      figma.ui.postMessage({
        type: 'GET_ACTIVITIES',
        data: JSON.parse(figma.root.getPluginData('activities')),
      })
    }
    if (
      rootPluginDataChange !== undefined &&
      dataDidUpdate(figma.root.getPluginData('sessions'))
    ) {
      figma.ui.postMessage({
        type: 'GET_SESSIONS',
        data: JSON.parse(figma.root.getPluginData('sessions')),
      })
    }
    if (
      rootPluginDataChange !== undefined &&
      dataDidUpdate(figma.root.getPluginData('ideas'))
    ) {
      figma.ui.postMessage({
        type: 'GET_IDEAS',
        data: JSON.parse(figma.root.getPluginData('ideas')),
      })
    }
    if (
      rootPluginDataChange !== undefined &&
      dataDidUpdate(figma.root.getPluginData('activeParticipants'))
    ) {
      figma.ui.postMessage({
        type: 'GET_ACTIVE_PARTICIPANTS',
        data: JSON.parse(figma.root.getPluginData('activeParticipants')),
      })
    }
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
