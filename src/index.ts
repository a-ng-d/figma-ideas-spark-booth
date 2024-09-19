import checkPlanStatus from './bridges/checks/checkPlanStatus'
import loadUI from './bridges/loadUI'

// Fonts
figma.loadFontAsync({ family: 'Inter', style: 'Regular' })
figma.loadFontAsync({ family: 'Inter', style: 'Medium' })
figma.loadFontAsync({ family: 'Red Hat Mono', style: 'Medium' })

// Loader
figma.on('run', () => loadUI())

// Migration

// Selection
figma.on('selectionchange', async () => await checkPlanStatus())
