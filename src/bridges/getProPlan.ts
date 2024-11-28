const getProPlan = async () => {
  await figma.payments
    ?.initiateCheckoutAsync({
      interstitial: 'SKIP',
    })
    .then(() => {
      if (figma.payments?.status.type === 'PAID') {
        figma.ui.postMessage({
          type: 'GET_PRO_PLAN',
          data: figma.payments.status.type,
          id: figma.currentUser?.id,
        })
        figma.root.setPluginData('event', 'PRO_PLAN_ENABLED')
      }
    })
}

export default getProPlan
