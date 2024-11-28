import loadUI from './bridges/loadUI'
import setMigration from './utils/setMigration'

// Fonts
figma.loadFontAsync({ family: 'Inter', style: 'Regular' })
figma.loadFontAsync({ family: 'Inter', style: 'Medium' })
figma.loadFontAsync({ family: 'Red Hat Mono', style: 'Medium' })

// Loader
figma.on('run', () => loadUI())

// Migration
figma.on('run', () => setMigration())
