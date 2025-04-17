import type { Metadata } from 'next'
import './globals.css'
import './brand-voice-highlights.css'

export const metadata: Metadata = {
  title: 'Choir - Harmonizing Your Brand Voice',
  description: 'Choir helps you find, create, and maintain your perfect brand voice across all content channels with AI-powered harmony.',
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
