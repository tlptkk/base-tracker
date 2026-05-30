const ROOT_URL = process.env.NEXT_PUBLIC_URL || 'https://your-app.vercel.app'

export const minikitConfig = {
  accountAssociation: {
    // Bu alanı base.dev/preview üzerinden doldur (adım 4)
    header: '',
    payload: '',
    signature: '',
  },
  miniapp: {
    version: '1',
    name: 'baseDS',
    subtitle: 'Base Ağı Canlı Veriler',
    description:
      'Base ağındaki en yüksek 24s hacimli tokenları ve anlık deploy edilen yeni tokenleri takip et.',
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: '#0A0A0A',
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: 'finance',
    tags: ['defi', 'tokens', 'base', 'tracker', 'volume'],
    heroImageUrl: `${ROOT_URL}/hero.png`,
    ogTitle: 'baseDS',
    ogDescription: 'Base ağında en yüksek hacimli ve yeni tokenları anlık takip et',
    ogImageUrl: `${ROOT_URL}/hero.png`,
  },
} as const
