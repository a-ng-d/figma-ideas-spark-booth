import { lang, locals } from '../content/locals'
import { windowSize } from '../types/app'
import { ActiveParticipant } from '../types/configurations'
import { SessionDataToCanvas } from '../types/data'
import { ActionsList } from '../types/models'
import checkCounts from './checks/checkCounts'
import checkEditorType from './checks/checkEditorType'
import checkHighlightStatus from './checks/checkHighlightStatus'
import checkPlanStatus from './checks/checkPlanStatus'
import checkUserConsent from './checks/checkUserConsent'
import enableTrial from './enableTrial'
import addOverviewToSlides from './export/addOverviewToSlides'
import addSessionToBoard from './export/addSessionToBoard'
import addSessionToSlides from './export/addSessionToSlides'
import addTemplateToBoard from './export/addTemplateToBoard'
import exportCsv from './export/exportCsv'
import getProPlan from './getProPlan'
import importActivities from './imports/importActivities'
import importSessions from './imports/importSessions'
import processSelection from './processSelection'
import addTemplate from './updates/addTemplate'
import addThumbnail from './updates/addThumbnail'
import detachPublishedActivity from './updates/detachPublishedActivity'
import duplicatePublishedActivity from './updates/duplicatePublishedActivity'
import endSession from './updates/endSession'
import getTemplate from './updates/getTemplate'
import getThumnail from './updates/getThumbnail'
import removeTemplate from './updates/removeTemplate'
import removeThumbnail from './updates/removeThumbnail'
import startSession from './updates/startSession'
import startSessionFromCommand from './updates/startSessionFromCommand'
import updateParticipants from './updates/updateParticipants'
import updateSingleActivity from './updates/updateSingleActivity'
import updateSingleSession from './updates/updateSingleSession'
import updateSingleTemplate from './updates/updateSingleTemplate'
import updateSingleThumbnail from './updates/updateSingleThumbnail'

const loadUI = async () => {
  let lastData = ''

  const windowSize: windowSize = {
    w: (await figma.clientStorage.getAsync('plugin_window_width')) ?? 640,
    h: (await figma.clientStorage.getAsync('plugin_window_height')) ?? 320,
  }

  figma.showUI(__html__, {
    width: windowSize.w,
    height: windowSize.h,
    title: `${locals[lang].name}${locals[lang].separator}${locals[lang].tagline}`,
    themeColors: true,
  })

  await figma.loadAllPagesAsync()

  // Checks
  checkUserConsent()
    .then(() => checkEditorType())
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
      figma.ui.postMessage({
        type: 'GET_THUMBNAILS',
        thumbnails: JSON.parse(figma.root.getPluginData('thumbnails')),
      })
    })
    .then(() => {
      if (figma.command === 'run')
        startSessionFromCommand(figma.currentPage.selection[0] as SectionNode)
    })
    .then(() => checkCounts())

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
      GET_ACTIVITY_THUMBNAIL: () => getThumnail(msg.activityId),
      GET_ACTIVITY_TEMPLATE: () => getTemplate(msg.activityId),
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
      ADD_THUMBNAIL: () => addThumbnail(msg.data),
      ADD_TEMPLATE: () => addTemplate(msg.data),
      UPDATE_THUMBNAIL: () => updateSingleThumbnail(msg.data),
      UPDATE_TEMPLATE: () => updateSingleTemplate(msg.data),
      REMOVE_THUMBNAIL: () => removeThumbnail(msg.activityId),
      REMOVE_TEMPLATE: () => removeTemplate(msg.activityId),
      DETACH_ACTIVITY: () => detachPublishedActivity(msg.data, msg.newId),
      //
      JOIN_SESSION: () =>
        updateParticipants({
          hasFinished: false,
          joinedSessionId: msg.sessionId,
        }),
      LEAVE_SESSION: () =>
        updateParticipants({ hasFinished: false, joinedSessionId: '' }),
      FLAG_AS_DONE: () => updateParticipants({ hasFinished: true }),
      UNFLAG_AS_DONE: () => updateParticipants({ hasFinished: false }),
      BLOCK_PARTICIPANT: () => updateParticipants({ isBlocked: true }),
      UNBLOCK_PARTICIPANT: () => updateParticipants({ isBlocked: false }),
      //
      ADD_TEMPLATE_TO_BOARD: () =>
        addTemplateToBoard(msg.data)
          .finally(() => figma.ui.postMessage({ type: 'STOP_LOADER' }))
          .catch(() => figma.notify(locals[lang].error.addTemplateToBoard)),
      ADD_SESSION_TO_BOARD: () =>
        addSessionToBoard(msg.data)
          .finally(() => figma.ui.postMessage({ type: 'STOP_LOADER' }))
          .catch(() => figma.notify(locals[lang].error.addSessionToBoard)),
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
      //
      EXPORT_CSV: () => exportCsv(msg.data),
      //
      IMPORT_SESSIONS: () =>
        importSessions(msg.data.files, msg.data.activityId)
          .then((messages) =>
            figma.notify(messages.join(locals[lang].separator), {
              timeout: 10000,
            })
          )
          .finally(() => figma.ui.postMessage({ type: 'STOP_IMPORTER' }))
          .catch((error) => {
            figma.notify(locals[lang].error.generic)
            throw error
          }),
      IMPORT_ACTIVITIES: () =>
        importActivities(msg.data.files)
          .then((messages) =>
            figma.notify(messages.join(locals[lang].separator), {
              timeout: 10000,
            })
          )
          .finally(() => figma.ui.postMessage({ type: 'STOP_IMPORTER' }))
          .catch((error) => {
            figma.notify(locals[lang].error.generic)
            throw error
          }),
      //
      SUBSCRIBE_SELECTION: () => {
        processSelection()
        figma.on('selectionchange', processSelection)
      },
      UNSUBSCRIBE_SELECTION: () =>
        figma.off('selectionchange', processSelection),
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

    if (figma.root.getPluginData('event') !== '') {
      if (
        JSON.parse(figma.root.getPluginData('event')).name === 'SESSION_STARTED'
      ) {
        const participant = JSON.parse(
          figma.root.getPluginData('activeParticipants')
        ).find((participant: ActiveParticipant) => participant.hasStarted)

        if (participant !== undefined)
          figma.notify(
            locals[lang].success.startSession
              .replace(
                '$1',
                JSON.parse(figma.root.getPluginData('event')).activityName
              )
              .replace('$2', participant.userIdentity.fullName)
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
        JSON.parse(figma.root.getPluginData('event')).name === 'SESSION_ENDED'
      ) {
        const participant = JSON.parse(
          figma.root.getPluginData('activeParticipants')
        ).find((participant: ActiveParticipant) => participant.hasEnded)

        if (participant !== undefined)
          figma.notify(
            locals[lang].success.endSession
              .replace(
                '$1',
                JSON.parse(figma.root.getPluginData('event')).activityName
              )
              .replace('$2', participant.userIdentity.fullName),
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

    if (
      rootPluginDataChange !== undefined &&
      dataDidUpdate(figma.root.getPluginData('thumbnails'))
    )
      figma.ui.postMessage({
        type: 'GET_THUMBNAILS',
        thumbnails: JSON.parse(figma.root.getPluginData('thumbnails')),
      })
  })

  const dataDidUpdate = (data: string) => {
    if (lastData !== data) {
      lastData = data
      return true
    }
    return false
  }

  // Commands
  figma.root.setRelaunchData({
    open: locals[lang].relaunch.open.description,
  })
}

export default loadUI
