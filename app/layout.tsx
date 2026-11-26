import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cineflicker — Discover Movies & TV Shows',
  description: 'Discover trending movies, top rated films and popular TV shows. Your ultimate cinema companion.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en">
      <body className="bg-flicker-black min-h-screen">
        {children}
      </body>
    </html>
  )
}
