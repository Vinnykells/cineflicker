'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import MovieCard from './MovieCard'

export default function MovieSection({ title, movies, type = 'movie' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  if (!movies || movies.length === 0) return null

  return (
    <section ref={ref} className="px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-flicker-red rounded-full" />
            <h2 className="text-white font-semibold text-xl">{title}</h2>
          </div>
          <motion.button
            whileHover={{ x: 4 }}
            className="text-flicker-gray hover:text-white text-sm transition-colors duration-200 flex items-center gap-1"
          >
            See all →
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {movies.slice(0, 12).map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <MovieCard movie={movie} type={type} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
