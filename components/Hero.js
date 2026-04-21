'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { getBackdropUrl } from '@/lib/tmdb'

export default function Hero({ movies }) {
  const [current, setCurrent] = useState(0)
  const router = useRouter()
  const featured = movies?.slice(0, 5) || []

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % featured.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [featured.length])

  const movie = featured[current]
  if (!movie) return null

  const backdropUrl = getBackdropUrl(movie.backdrop_path)
  const rating = movie.vote_average?.toFixed(1)
  const year = movie.release_date?.split('-')[0]

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {backdropUrl ? (
            <img src={backdropUrl} alt={movie.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-flicker-dark" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-flicker-black via-transparent to-black/30" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-flicker-red text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-widest">
                  Featured
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400 text-sm">★</span>
                  <span className="text-white text-sm font-medium">{rating}</span>
                </div>
                {year && <span className="text-flicker-gray text-sm">{year}</span>}
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight leading-none">
                {movie.title || movie.name}
              </h1>

              <p className="text-flicker-gray text-lg leading-relaxed mb-8 line-clamp-3 max-w-xl">
                {movie.overview}
              </p>

              <div className="flex flex-wrap gap-4">
                <motion.button
                  onClick={() => router.push(`/${movie.media_type === 'tv' ? 'tv' : 'movie'}/${movie.id}`)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-white text-black font-semibold px-8 py-3.5 rounded-full text-sm hover:bg-white/90 transition-all duration-200"
                >
                  ▶ Watch Now
                </motion.button>
                <motion.button
                  onClick={() => router.push(`/${movie.media_type === 'tv' ? 'tv' : 'movie'}/${movie.id}`)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white font-medium px-8 py-3.5 rounded-full text-sm hover:bg-white/20 transition-all duration-200"
                >
                  ℹ More Info
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-10 left-6 right-6 max-w-7xl mx-auto">
            <div className="flex gap-2">
              {featured.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index === current ? 'w-8 bg-flicker-red' : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
