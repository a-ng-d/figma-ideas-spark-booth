import { lang, locals } from '../content/locals'
import { ConsentConfiguration } from '@a_ng_d/figmug-ui'

export const userConsent: Array<ConsentConfiguration> = [
  {
    name: locals[lang].vendors.mixpanel.name,
    id: 'mixpanel',
    icon: 'https://asset.brandfetch.io/idr_rhI2FS/ideb-tnj2D.svg',
    description: locals[lang].vendors.mixpanel.description,
    isConsented: false,
  },
]
