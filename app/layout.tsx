import type { Metadata } from 'next'
// Import globals.css first, then component-specific CSS
import './globals.css'
import './brand-voice-highlights.css'
// CSS test file no longer needed
// import './css-test.css'

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
      <body>
        {/* CSS test marker no longer needed */}
        {children}
      </body>
    </html>
  )
}
