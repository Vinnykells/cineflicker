'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { getImageUrl } from '@/lib/tmdb'

export default function MovieCard({ movie, type = 'movie' }) {
  const router = useRouter()
  const [imageError, setImageError] = useState(false)

  const title = movie.title || movie.name
  const date = movie.release_date || movie.first_air_date
  const year = date?.split('-')[0]
  const rating = movie.vote_average?.toFixed(1)
  const imageUrl = getImageUrl(movie.poster_path, 'w342')

  return (
    <motion.div
      onClick={() => router.push(`/${type}/${movie.id}`)}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="cursor-pointer group"
    >
      <div className="relative rounded-2xl overflow-hidden aspect-[2/3] bg-flicker-card border border-flicker-border mb-3">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-flicker-card gap-3">
            <span className="text-4xl">🎬</span>
            <p className="text-flicker-gray text-xs text-center px-2 line-clamp-2">{title}</p>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur rounded-lg px-2 py-1 flex items-center gap-1">
          <span className="text-yellow-400 text-xs">★</span>
          <span className="text-white text-xs font-medium">{rating}</span>
        </div>

        <div className="absolute top-2 left-2 bg-flicker-red/90 backdrop-blur rounded-lg px-2 py-1">
          <span className="text-white text-xs font-medium uppercase">
            {type === 'tv' ? 'TV' : 'Film'}
          </span>
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center">
            <span className="text-white text-lg ml-1">▶</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-white text-sm font-medium line-clamp-1 group-hover:text-flicker-red transition-colors duration-200">
          {title}
        </h3>
        <p className="text-flicker-gray text-xs mt-1">{year}</p>
      </div>
    </motion.div>
  )
}
