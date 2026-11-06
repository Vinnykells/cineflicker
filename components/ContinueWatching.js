'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { getImageUrl } from '@/lib/tmdb'

export default function ContinueWatching() {
  const [items, setItems] = useState([])
  const router = useRouter()

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('cineflicker_continue') || '[]')
      setItems(saved)
    } catch { setItems([]) }
  }, [])

  const remove = (id, e) => {
    e.stopPropagation()
    const updated = items.filter((i) => i.id !== id)
    setItems(updated)
    localStorage.setItem('cineflicker_continue', JSON.stringify(updated))
  }

  if (items.length === 0) return null

  return (
    <div className="px-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-6 bg-flicker-red rounded-full" />
        <h2 className="text-white font-semibold text-xl">Continue Watching</h2>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {items.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.03, y: -4 }}
            onClick={() => router.push(`/${item.type}/${item.id}`)}
            className="relative flex-shrink-0 w-32 cursor-pointer group"
          >
            <div className="relative rounded-xl overflow-hidden aspect-[2/3] bg-flicker-card border border-flicker-border mb-2">
              {item.poster
                ? <img src={getImageUrl(item.poster, 'w185')} alt={item.title} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-2xl">🎬</div>
              }
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-center pb-3">
                <span className="text-white text-lg">▶</span>
              </div>
              {item.season && (
                <div className="absolute bottom-2 left-2 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded-full">
                  S{item.season} · E{item.episode}
                </div>
              )}
            </div>
            <p className="text-white text-xs font-medium truncate">{item.title}</p>
            <button
              onClick={(e) => remove(item.id, e)}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-flicker-red"
            >
              ✕
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
