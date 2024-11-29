const checkCounts = async () => {
  const sessionCount: number | undefined =
    await figma.clientStorage.getAsync('session_count')

  if (sessionCount !== undefined)
    figma.ui.postMessage({
      type: 'CHECK_COUNTS',
      data: {
        sessionCount: sessionCount,
      },
    })

  return true
}

export default checkCounts
