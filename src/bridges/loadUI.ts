import { lang, locals } from '../content/locals'
import { windowSize } from '../types/app'
import { ActionsList } from '../types/models'
import checkHighlightStatus from './checks/checkHighlightStatus'
import checkPlanStatus from './checks/checkPlanStatus'
import checkUserConsent from './checks/checkUserConsent'
import enableTrial from './enableTrial'
import getProPlan from './getProPlan'
import startSession from './startSession'

const loadUI = async () => {
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

  checkUserConsent()

  await checkPlanStatus()

  figma.ui.postMessage({
    type: 'CHECK_USER_AUTHENTICATION',
    id: figma.currentUser?.id,
    data: {
      accessToken: await figma.clientStorage.getAsync('supabase_access_token'),
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
    type: 'GET_USER_IDENTITY',
    data: {
      userFullName: figma.currentUser?.name ?? 'John Doe',
      id: figma.currentUser?.id ?? '1234567890',
      userAvatar:
        figma.currentUser?.photoUrl ??
        'https://www.gravatar.com/avatar/?d=retro&s=32',
    },
  })

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
      START_SESSION: () => startSession(msg.data),
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
}

export default loadUI
