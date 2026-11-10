'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { getImageUrl, getBackdropUrl, getSeasonDetails } from '@/lib/tmdb'
import MovieCard from './MovieCard'

export default function MovieDetailClient({ movie, type }) {
  const router = useRouter()

  const [showPlayer, setShowPlayer] = useState(false)
  const [overlayVisible, setOverlayVisible] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
  }, [])
  const [selectedSeason, setSelectedSeason] = useState(null)
  const [selectedEpisode, setSelectedEpisode] = useState(null)
  const [episodes, setEpisodes] = useState([])
  const [loadingEpisodes, setLoadingEpisodes] = useState(false)
  const [inWatchlist, setInWatchlist] = useState(false)

  const title = movie?.title || movie?.name
  const date = movie?.release_date || movie?.first_air_date
  const year = date?.split('-')[0]
  const rating = movie?.vote_average?.toFixed(1)
  const runtime = movie?.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null
  const posterUrl = getImageUrl(movie?.poster_path, 'w500')
  const backdropUrl = getBackdropUrl(movie?.backdrop_path)
  const trailer = movie?.videos?.results?.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  )
  const cast = movie?.credits?.cast?.slice(0, 8) || []
  const similar = movie?.similar?.results?.slice(0, 6) || []

  const seasons = type === 'tv'
    ? (movie?.seasons || []).filter((s) => s.season_number > 0)
    : []

  const getPlayerUrl = (src) => `/api/player?src=${encodeURIComponent(src)}`

  const embedUrl = type === 'tv' && selectedSeason && selectedEpisode
    ? `https://vidsrc.to/embed/tv/${movie?.id}/${selectedSeason}/${selectedEpisode}`
    : type !== 'tv'
    ? `https://vidsrc.to/embed/movie/${movie?.id}`
    : null

  // Load watchlist state
  useEffect(() => {
    if (!movie?.id) return
    try {
      const list = JSON.parse(localStorage.getItem('cineflicker_watchlist') || '[]')
      setInWatchlist(list.some((i) => i.id === movie.id))
    } catch {}
  }, [movie?.id])

  // Resume last watched season for TV shows
  useEffect(() => {
    if (type !== 'tv' || !movie?.id) return
    try {
      const history = JSON.parse(localStorage.getItem('cineflicker_continue') || '[]')
      const entry = history.find((i) => i.id === movie.id)
      if (entry?.season) setSelectedSeason(entry.season)
    } catch {}
  }, [movie?.id, type])

  // Fetch episodes when season changes
  useEffect(() => {
    if (type !== 'tv' || !selectedSeason || !movie?.id) return
    setLoadingEpisodes(true)
    getSeasonDetails(movie.id, selectedSeason)
      .then(({ data }) => setEpisodes(data.episodes || []))
      .catch(() => setEpisodes([]))
      .finally(() => setLoadingEpisodes(false))
  }, [selectedSeason, movie?.id, type])

  if (!movie) return null

  const handleSeasonSelect = (seasonNum) => {
    setSelectedSeason(seasonNum)
    setSelectedEpisode(null)
    setShowPlayer(false)
  }

  const saveToHistory = (season = null, episode = null) => {
    try {
      const existing = JSON.parse(localStorage.getItem('cineflicker_continue') || '[]')
      const filtered = existing.filter((i) => i.id !== movie.id)
      const entry = { id: movie.id, title, type, poster: movie?.poster_path, season, episode, watchedAt: Date.now() }
      localStorage.setItem('cineflicker_continue', JSON.stringify([entry, ...filtered].slice(0, 20)))
    } catch {}
  }

  const handleEpisodePlay = (episodeNum) => {
    saveToHistory(selectedSeason, episodeNum)
    if (isMobile) {
      const src = `https://vidsrc.to/embed/tv/${movie.id}/${selectedSeason}/${episodeNum}`
      window.open(getPlayerUrl(src), '_blank')
    } else {
      setSelectedEpisode(episodeNum)
      setShowPlayer(true)
      setOverlayVisible(true)
    }
  }

  const toggleWatchlist = () => {
    try {
      const list = JSON.parse(localStorage.getItem('cineflicker_watchlist') || '[]')
      const exists = list.some((i) => i.id === movie.id)
      const updated = exists
        ? list.filter((i) => i.id !== movie.id)
        : [{ id: movie.id, title, type, poster: movie?.poster_path, date }, ...list]
      localStorage.setItem('cineflicker_watchlist', JSON.stringify(updated))
      setInWatchlist(!exists)
    } catch {}
  }

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
              {type !== 'tv' && (
                <motion.button
                  onClick={() => {
                    if (isMobile) {
                      window.open(getPlayerUrl(`https://vidsrc.to/embed/movie/${movie?.id}`), '_blank')
                    } else {
                      setShowPlayer(true)
                      setOverlayVisible(true)
                      saveToHistory()
                    }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-white text-black font-semibold px-8 py-3.5 rounded-full text-sm hover:bg-white/90 transition-all duration-200"
                >
                  ▶ Watch Now
                </motion.button>
              )}
              <motion.button
                onClick={toggleWatchlist}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                  inWatchlist
                    ? 'bg-flicker-red border-flicker-red text-white'
                    : 'bg-transparent border-flicker-border text-white hover:border-white/60'
                }`}
              >
                {inWatchlist ? '✓ In Watchlist' : '+ Watchlist'}
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

            {/* Movie player */}
            <AnimatePresence>
              {showPlayer && type !== 'tv' && (
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
                  <div className="aspect-video w-full relative">
                    <iframe
                      src={embedUrl}
                      className="w-full h-full"
                      allowFullScreen
                      allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                      referrerPolicy="no-referrer"
                    />
                    {overlayVisible && (
                      <div
                        className="absolute inset-0 flex items-center justify-center bg-black/60 cursor-pointer md:hidden"
                        onClick={() => setOverlayVisible(false)}
                      >
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur border border-white/40 flex items-center justify-center">
                          <span className="text-white text-2xl ml-1">▶</span>
                        </div>
                      </div>
                    )}
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

        {/* TV Seasons & Episodes */}
        {type === 'tv' && seasons.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-flicker-red rounded-full" />
              <h2 className="text-white font-semibold text-xl">Episodes</h2>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {seasons.map((s) => (
                <button
                  key={s.season_number}
                  onClick={() => handleSeasonSelect(s.season_number)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                    selectedSeason === s.season_number
                      ? 'bg-flicker-red border-flicker-red text-white'
                      : 'bg-flicker-card border-flicker-border text-flicker-gray hover:text-white hover:border-white/40'
                  }`}
                >
                  Season {s.season_number}
                </button>
              ))}
            </div>

            {selectedSeason && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedSeason}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {loadingEpisodes ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-20 rounded-xl bg-flicker-card animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {episodes.map((ep) => (
                        <motion.button
                          key={ep.episode_number}
                          onClick={() => handleEpisodePlay(ep.episode_number)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 ${
                            selectedEpisode === ep.episode_number
                              ? 'border-flicker-red bg-flicker-red/10'
                              : 'border-flicker-border bg-flicker-card hover:border-white/30'
                          }`}
                        >
                          <div className="w-10 h-10 rounded-lg bg-flicker-red/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-flicker-red text-xs font-bold">E{ep.episode_number}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-xs font-medium truncate">{ep.name}</p>
                            {ep.runtime && <p className="text-flicker-gray text-xs">{ep.runtime}m</p>}
                          </div>
                          <span className="text-flicker-gray text-xs">▶</span>
                        </motion.button>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}

            <AnimatePresence>
              {showPlayer && selectedEpisode && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mt-6 rounded-2xl overflow-hidden border border-flicker-border relative"
                >
                  <div className="flex items-center justify-between px-4 py-2 bg-flicker-card border-b border-flicker-border">
                    <span className="text-white text-sm font-medium">
                      S{selectedSeason} · E{selectedEpisode}
                    </span>
                    <button
                      onClick={() => setShowPlayer(false)}
                      className="bg-black/70 text-white text-xs px-3 py-1 rounded-full hover:bg-black transition"
                    >
                      ✕ Close
                    </button>
                  </div>
                  <div className="aspect-video w-full relative">
                    <iframe
                      src={embedUrl}
                      className="w-full h-full"
                      allowFullScreen
                      allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                      referrerPolicy="no-referrer"
                    />
                    {overlayVisible && (
                      <div
                        className="absolute inset-0 flex items-center justify-center bg-black/60 cursor-pointer md:hidden"
                        onClick={() => setOverlayVisible(false)}
                      >
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur border border-white/40 flex items-center justify-center">
                          <span className="text-white text-2xl ml-1">▶</span>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

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
