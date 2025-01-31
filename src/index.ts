import loadUI from './bridges/loadUI'
import setMigration from './utils/setMigration'

// Fonts
figma.loadFontAsync({ family: 'Inter', style: 'Regular' })
figma.loadFontAsync({ family: 'Inter', style: 'Medium' })
figma.loadFontAsync({ family: 'Martian Mono', style: 'Bold' })
figma.loadFontAsync({ family: 'Martian Mono', style: 'ExtraBold' })
figma.loadFontAsync({ family: 'Sora', style: 'SemiBold' })
figma.loadFontAsync({ family: 'Sora', style: 'Regular' })

// Loader
figma.on('run', () => loadUI())

// Migration
figma.on('run', () => setMigration())
