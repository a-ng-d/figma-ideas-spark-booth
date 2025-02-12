const processSelection = async () => {
  const currentSelection = figma.currentPage.selection

  if (currentSelection.length > 0) {
    const currentSelectedParent = currentSelection[0]

    if (currentSelectedParent.type === 'SECTION')
      figma.ui.postMessage({
        type: 'GET_SELECTION',
        nodes: await currentSelectedParent.exportAsync({
          format: 'JSON_REST_V1',
        }),
        screenshot: await currentSelectedParent.exportAsync({
          format: 'PNG',
          constraint: { type: 'WIDTH', value: 480 },
        }),
      })
  } else
    figma.ui.postMessage({
      type: 'GET_SELECTION',
      nodes: undefined,
      screenshot: undefined,
    })
}

export default processSelection
