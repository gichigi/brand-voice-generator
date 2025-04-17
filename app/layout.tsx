import type { Metadata } from 'next'
import './globals.css'
import './brand-voice-highlights.css'

export const metadata: Metadata = {
  title: 'Choir - Harmonize Your Brand Voice with AI',
  description: 'Bring harmony to your content creation. Choir helps you find and maintain your perfect brand voice across all channels.',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
