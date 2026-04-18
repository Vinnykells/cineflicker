import './globals.css'

export const metadata = {
  title: 'Cineflicker — Discover Movies & TV Shows',
  description: 'Discover trending movies, top rated films and popular TV shows. Your ultimate cinema companion.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-flicker-black min-h-screen">
        {children}
      </body>
    </html>
  )
}
