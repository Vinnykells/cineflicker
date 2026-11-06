'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  const [showPlayer, setShowPlayer] = useState(false)
  const embedUrl = type === 'tv'
    ? `https://vidsrc.to/embed/tv/${movie.id}`
    : `https://vidsrc.to/embed/movie/${movie.id}`

  const imdbId = movie.imdb_id
  const encodedTitle = encodeURIComponent(title)
  const downloads = [
    { label: '480p', size: '~400MB', url: `https://www.fzmovies.net/csearch.php?searchname=${encodedTitle}&searchby=moviename` },
    { label: '720p', size: '~900MB', url: `https://o2tvmovies.com/?s=${encodedTitle}` },
    { label: '1080p', size: '~2GB', url: `https://www.yify-torrent.org/search/?q=${encodedTitle}` },
  ]

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
                onClick={() => setShowPlayer(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-white text-black font-semibold px-8 py-3.5 rounded-full text-sm hover:bg-white/90 transition-all duration-200"
              >
                ▶ Watch Now
              </motion.button>
            </div>

            <div className="flex items-start gap-2 mb-6 px-4 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <span className="text-yellow-400 text-sm">🛡️</span>
              <p className="text-yellow-300/80 text-xs leading-relaxed">
                For the best experience, use an ad blocker like{' '}
                <a href="https://ublockorigin.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-300">uBlock Origin</a>{' '}
                — blocks all popups so you can watch without interruptions.
              </p>
            </div>

            {downloads.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-10">
                <span className="text-flicker-gray text-sm self-center">⬇ Download:</span>
                {downloads.map(({ label, size, url }) => (
                  <motion.a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center text-xs px-4 py-2 rounded-full bg-flicker-card border border-flicker-border text-white hover:border-flicker-red hover:text-flicker-red transition-all duration-200"
                  >
                    <span className="font-semibold">{label}</span>
                    <span className="text-flicker-gray text-[10px]">{size}</span>
                  </motion.a>
                ))}
              </div>
            )}

            <AnimatePresence>
              {showPlayer && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mb-10 rounded-2xl overflow-hidden border border-flicker-border relative"
                >
                  <button
                    onClick={() => setShowPlayer(false)}
                    className="absolute top-3 right-3 z-10 bg-black/70 text-white text-xs px-3 py-1 rounded-full hover:bg-black transition"
                  >
                    ✕ Close
                  </button>
                  <div className="aspect-video w-full">
                    <iframe
                      src={embedUrl}
                      className="w-full h-full"
                      allowFullScreen
                      allow="autoplay; fullscreen"
                      referrerPolicy="origin"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
