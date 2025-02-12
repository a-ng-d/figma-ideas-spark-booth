const processSelection = async () => {
  const currentSelection = figma.currentPage.selection

  if (currentSelection.length > 0) {
    const currentSelectedParent = currentSelection[0]

    if (
      currentSelectedParent.type === 'SECTION' ||
      currentSelectedParent.type === 'GROUP'
    )
      figma.ui.postMessage({
        type: 'GET_SELECTION',
        selection: await currentSelectedParent.exportAsync({
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
      selection: undefined,
      screenshot: undefined,
    })
}

export default processSelection
