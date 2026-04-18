'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { getImageUrl, getBackdropUrl } from '@/lib/tmdb'
import MovieCard from './MovieCard'

export default function MovieDetailClient({ movie, type }) {
  const router = useRouter()

  if (!movie) return null

  const title = movie.title || movie.name
  const date = movie.release_date || movie.first_air_date
  const year = date?.split('-')[0]
  const rating = movie.vote_average?.toFixed(1)
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null
  const posterUrl = getImageUrl(movie.poster_path, 'w500')
  const backdropUrl = getBackdropUrl(movie.backdrop_path)
  const trailer = movie.videos?.results?.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  )
  const cast = movie.credits?.cast?.slice(0, 8) || []
  const similar = movie.similar?.results?.slice(0, 6) || []

  return (
    <main className="bg-flicker-black min-h-screen">
      <div className="fixed top-6 left-6 z-50">
        <motion.button
          onClick={() => router.back()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-black/80 backdrop-blur border border-flicker-border text-white px-4 py-2 rounded-full text-sm hover:bg-black transition-all duration-200"
        >
          ← Back
        </motion.button>
      </div>

      <div className="relative h-[60vh] overflow-hidden">
        {backdropUrl ? (
          <img src={backdropUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-flicker-dark" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-flicker-black via-flicker-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-flicker-black/80 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-40 relative z-10 pb-20">
        <div className="grid md:grid-cols-4 gap-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="md:col-span-1"
          >
            <div className="rounded-2xl overflow-hidden border border-flicker-border aspect-[2/3] bg-flicker-card">
              {posterUrl ? (
                <img src={posterUrl} alt={title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-6xl">🎬</span>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-3 pt-8"
          >
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="text-xs px-3 py-1 rounded-full bg-flicker-red/10 border border-flicker-red/20 text-flicker-red"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              {title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">★</span>
                <span className="text-white font-semibold">{rating}</span>
                <span className="text-flicker-gray text-sm">
                  ({movie.vote_count?.toLocaleString()} votes)
                </span>
              </div>
              {year && <span className="text-flicker-gray text-sm">{year}</span>}
              {runtime && <span className="text-flicker-gray text-sm">{runtime}</span>}
              {movie.status && (
                <span className="text-xs px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400">
                  {movie.status}
                </span>
              )}
            </div>

            {movie.tagline && (
              <p className="text-flicker-red italic text-lg mb-4">{movie.tagline}</p>
            )}

            <p className="text-flicker-gray leading-relaxed text-lg mb-8">{movie.overview}</p>

            <div className="flex flex-wrap gap-4 mb-10">
              {trailer && (
                <motion.a
                  href={`https://youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-flicker-red hover:bg-flicker-darkred text-white font-medium px-8 py-3.5 rounded-full text-sm transition-all duration-200"
                >
                  ▶ Watch Trailer
                </motion.a>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-white/10 border border-white/20 text-white px-8 py-3.5 rounded-full text-sm hover:bg-white/20 transition-all duration-200"
              >
                + Watchlist
              </motion.button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-flicker-card border border-flicker-border">
              {[
                { label: 'Original Language', value: movie.original_language?.toUpperCase() },
                { label: 'Budget', value: movie.budget ? `$${(movie.budget / 1000000).toFixed(0)}M` : 'N/A' },
                { label: 'Revenue', value: movie.revenue ? `$${(movie.revenue / 1000000).toFixed(0)}M` : 'N/A' },
                { label: 'Popularity', value: movie.popularity?.toFixed(0) },
                { label: 'Vote Average', value: `${rating}/10` },
                { label: 'Release Date', value: date },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-flicker-gray text-xs uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-white text-sm font-medium">{item.value || 'N/A'}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {cast.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-flicker-red rounded-full" />
              <h2 className="text-white font-semibold text-xl">Cast</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
              {cast.map((person) => (
                <motion.div key={person.id} whileHover={{ y: -4 }} className="text-center">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-flicker-card border border-flicker-border mb-2">
                    {person.profile_path ? (
                      <img
                        src={getImageUrl(person.profile_path, 'w185')}
                        alt={person.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
                    )}
                  </div>
                  <p className="text-white text-xs font-medium line-clamp-1">{person.name}</p>
                  <p className="text-flicker-gray text-xs line-clamp-1">{person.character}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {similar.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-flicker-red rounded-full" />
              <h2 className="text-white font-semibold text-xl">You Might Also Like</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {similar.map((item) => (
                <MovieCard key={item.id} movie={item} type={type} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
