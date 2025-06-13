import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Legal App',
  description: 'Legal document management application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar">
      <body>{children}</body>
    </html>
  )
}