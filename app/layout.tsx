import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Base Tracker',
  description: 'Base ağında en yüksek hacimli ve yeni tokenleri takip et',
  other: {
    'fc:frame': 'vNext',
    'base:app_id': '69afd436058cbf5b767c47f0',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  )
}
