import { getUpcoming } from '@/lib/tmdb'
import MovieCard from '@/components/MovieCard'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = { title: 'Coming Soon | Cineflicker' }

export default async function ComingSoonPage() {
  let movies = []
  try {
    const { data } = await getUpcoming()
    movies = data.results || []
  } catch {}

  return (
    <main className="bg-flicker-black min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="mb-12">
          <p className="text-flicker-gray text-sm uppercase tracking-widest mb-2">Releasing Soon</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white">Coming Soon</h1>
        </div>

        {movies.length === 0 ? (
          <p className="text-flicker-gray text-center py-20">Nothing to show right now. Check back soon.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map((movie) => (
              <div key={movie.id}>
                <MovieCard movie={movie} type="movie" />
                {movie.release_date && (
                  <p className="mt-1 text-center text-flicker-red text-xs font-medium">
                    {new Date(movie.release_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
