'use client'

export default function Footer() {
  return (
    <footer className="border-t border-flicker-border px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-1">
            <span className="text-flicker-red font-bold text-xl tracking-tight">Cine</span>
            <span className="text-white font-bold text-xl tracking-tight">flicker</span>
          </div>

          <div className="flex items-center gap-6">
            {[
              { label: 'Movies', href: '/movies' },
              { label: 'TV Shows', href: '/shows' },
              { label: 'Top Rated', href: '/top-rated' },
              { label: 'Coming Soon', href: '/movies' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-flicker-gray hover:text-white transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          <p className="text-flicker-gray text-sm">
            Powered by{' '}
            <a
              href="https://themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-flicker-red hover:text-white transition-colors duration-200"
            >
              TMDB
            </a>
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-flicker-border text-center">
          <p className="text-flicker-gray text-sm">
            © {new Date().getFullYear()} Cineflicker. Built with Next.js & Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  )
}
