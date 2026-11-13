'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { getImageUrl } from '@/lib/tmdb'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function WatchlistPage() {
  const [items, setItems] = useState([])
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('cineflicker_watchlist') || '[]')
      setItems(saved)
    } catch { setItems([]) }
    setMounted(true)
  }, [])

  const remove = (id) => {
    const updated = items.filter((i) => i.id !== id)
    setItems(updated)
    localStorage.setItem('cineflicker_watchlist', JSON.stringify(updated))
  }

  return (
    <main className="bg-flicker-black min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="mb-10">
          <p className="text-flicker-gray text-sm mb-2 uppercase tracking-widest">Your</p>
          <h1 className="text-3xl md:text-5xl font-bold text-white">Watchlist</h1>
          {mounted && items.length > 0 && (
            <p className="text-flicker-gray mt-2">{items.length} title{items.length !== 1 ? 's' : ''} saved</p>
          )}
        </div>

        {!mounted ? null : items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🎬</p>
            <p className="text-white text-xl font-medium mb-2">Nothing saved yet</p>
            <p className="text-flicker-gray mb-8">Hit the + Watchlist button on any movie or show</p>
            <button
              onClick={() => router.push('/')}
              className="px-8 py-3 rounded-full bg-flicker-red text-white text-sm font-medium hover:bg-flicker-darkred transition-all duration-200"
            >
              Browse titles
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.04 }}
                  className="group cursor-pointer"
                  onClick={() => router.push(`/${item.type}/${item.id}`)}
                >
                  <div className="relative rounded-2xl overflow-hidden aspect-[2/3] bg-flicker-card border border-flicker-border mb-3">
                    {item.poster
                      ? <img src={getImageUrl(item.poster, 'w342')} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      : <div className="w-full h-full flex items-center justify-center text-4xl">🎬</div>
                    }
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-2 left-2 bg-flicker-red/90 backdrop-blur rounded-lg px-2 py-1">
                      <span className="text-white text-xs font-medium uppercase">{item.type === 'tv' ? 'TV' : 'Film'}</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); remove(item.id) }}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-flicker-red"
                    >
                      ✕
                    </button>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center">
                        <span className="text-white text-lg ml-1">▶</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-white text-sm font-medium line-clamp-1 group-hover:text-flicker-red transition-colors duration-200">{item.title}</h3>
                  {item.date && <p className="text-flicker-gray text-xs mt-1">{item.date.split('-')[0]}</p>}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
