'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setSearchOpen(false)
      setQuery('')
    }
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-flicker-black/95 backdrop-blur-xl border-b border-flicker-border'
            : 'bg-gradient-to-b from-black/80 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.button
            onClick={() => router.push('/')}
            whileHover={{ opacity: 0.8 }}
            className="flex items-center gap-1"
          >
            <span className="text-flicker-red font-bold text-2xl tracking-tight">Cine</span>
            <span className="text-white font-bold text-2xl tracking-tight">flicker</span>
          </motion.button>

          <div className="hidden md:flex items-center gap-6">
            {[
              { label: 'Movies', href: '/movies' },
              { label: 'TV Shows', href: '/shows' },
              { label: 'Top Rated', href: '/top-rated' },
            ].map((link) => (
              <button
                key={link.label}
                onClick={() => router.push(link.href)}
                className="text-sm text-flicker-gray hover:text-white transition-colors duration-200"
              >
                {link.label}
              </button>
            ))}
          </div>

          <motion.button
            onClick={() => setSearchOpen(!searchOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200"
          >
            🔍
          </motion.button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl flex items-start justify-center pt-32 px-6"
            onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false) }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-2xl"
            >
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    autoFocus
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search movies, TV shows..."
                    className="w-full bg-flicker-card border border-flicker-border rounded-2xl px-6 py-5 text-white text-lg placeholder-flicker-gray focus:outline-none focus:border-flicker-red transition-all duration-200"
                  />
                  <button
                    type="submit"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-flicker-red hover:bg-flicker-darkred text-white px-6 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                  >
                    Search
                  </button>
                </div>
              </form>
              <p className="text-flicker-gray text-sm mt-4 text-center">Press ESC to close</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
