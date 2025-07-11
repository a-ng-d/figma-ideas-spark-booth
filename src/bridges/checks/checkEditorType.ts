const checkEditorType = () =>
  figma.ui.postMessage({
    type: 'CHECK_EDITOR_TYPE',
    data: {
      id: figma.currentUser?.id,
      editor: figma.vscode ? 'dev_vscode' : figma.editorType,
    },
  })

export default checkEditorType
