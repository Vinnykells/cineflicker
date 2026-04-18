'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { searchMulti } from '@/lib/tmdb'
import MovieCard from '@/components/MovieCard'
import SkeletonCard from '@/components/SkeletonCard'
import Navbar from '@/components/Navbar'

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!query) return
    const fetchResults = async () => {
      setLoading(true)
      try {
        const { data } = await searchMulti(query)
        setResults(data.results.filter((r) => r.media_type !== 'person'))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [query])

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <p className="text-flicker-gray text-sm mb-2 uppercase tracking-widest">Search results</p>
        <h1 className="text-3xl md:text-5xl font-bold text-white">{query}</h1>
        {!loading && (
          <p className="text-flicker-gray mt-2">{results.length} results found</p>
        )}
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {results.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <MovieCard movie={item} type={item.media_type === 'tv' ? 'tv' : 'movie'} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">🎬</p>
          <p className="text-white text-xl font-medium mb-2">No results found</p>
          <p className="text-flicker-gray">Try searching for something else</p>
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <main className="bg-flicker-black min-h-screen">
      <Navbar />
      <Suspense fallback={<div className="pt-32 px-6 text-flicker-gray">Loading...</div>}>
        <SearchResults />
      </Suspense>
    </main>
  )
}
