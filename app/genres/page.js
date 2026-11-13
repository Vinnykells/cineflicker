'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { discoverByGenre } from '@/lib/tmdb'
import MovieCard from '@/components/MovieCard'
import SkeletonCard from '@/components/SkeletonCard'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer' = [
  { id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' }, { id: 80, name: 'Crime' }, { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' }, { id: 14, name: 'Fantasy' }, { id: 27, name: 'Horror' },
  { id: 9648, name: 'Mystery' }, { id: 10749, name: 'Romance' }, { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' }, { id: 10752, name: 'War' },
]

const TV_GENRES = [
  { id: 10759, name: 'Action & Adventure' }, { id: 16, name: 'Animation' }, { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' }, { id: 99, name: 'Documentary' }, { id: 18, name: 'Drama' },
  { id: 10765, name: 'Sci-Fi & Fantasy' }, { id: 9648, name: 'Mystery' }, { id: 10768, name: 'War & Politics' },
]

export default function GenresPage() {
  const [mediaType, setMediaType] = useState('movie')
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const genres = mediaType === 'movie' ? MOVIE_GENRES : TV_GENRES

  useEffect(() => {
    if (!selectedGenre) return
    setLoading(true)
    discoverByGenre(selectedGenre, mediaType, page)
      .then(({ data }) => {
        setResults((prev) => page === 1 ? data.results : [...prev, ...data.results])
        setTotalPages(Math.min(data.total_pages, 10))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [selectedGenre, mediaType, page])

  const handleGenreSelect = (id) => {
    setSelectedGenre(id)
    setPage(1)
    setResults([])
  }

  const handleMediaTypeSwitch = (type) => {
    setMediaType(type)
    setSelectedGenre(null)
    setResults([])
    setPage(1)
  }

  return (
    <main className="bg-flicker-black min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="mb-10">
          <p className="text-flicker-gray text-sm mb-2 uppercase tracking-widest">Browse by</p>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">Genres</h1>

          <div className="flex gap-2 mb-6">
            {['movie', 'tv'].map((t) => (
              <button
                key={t}
                onClick={() => handleMediaTypeSwitch(t)}
                className={`px-5 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                  mediaType === t
                    ? 'bg-flicker-red border-flicker-red text-white'
                    : 'bg-flicker-card border-flicker-border text-flicker-gray hover:text-white'
                }`}
              >
                {t === 'movie' ? 'Movies' : 'TV Shows'}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {genres.map((g) => (
              <button
                key={g.id}
                onClick={() => handleGenreSelect(g.id)}
                className={`px-4 py-2 rounded-full text-sm border transition-all duration-200 ${
                  selectedGenre === g.id
                    ? 'bg-white text-black border-white font-semibold'
                    : 'bg-flicker-card border-flicker-border text-flicker-gray hover:text-white hover:border-white/40'
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>

        {!selectedGenre && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🎭</p>
            <p className="text-flicker-gray">Pick a genre to start browsing</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {selectedGenre && (
            <motion.div key={`${selectedGenre}-${mediaType}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {loading && page === 1 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {[...Array(12)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {results.map((item, i) => (
                      <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (i % 12) * 0.04 }}>
                        <MovieCard movie={item} type={mediaType} />
                      </motion.div>
                    ))}
                  </div>
                  {page < totalPages && (
                    <div className="flex justify-center mt-10">
                      <button
                        onClick={() => setPage((p) => p + 1)}
                        disabled={loading}
                        className="px-8 py-3 rounded-full bg-flicker-card border border-flicker-border text-white text-sm hover:border-white/40 transition-all duration-200 disabled:opacity-50"
                      >
                        {loading ? 'Loading...' : 'Load More'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </main>
  )
}
