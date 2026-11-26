import { getTopRated, getTopRatedShows } from '@/lib/tmdb'
import MovieSection from '@/components/MovieSection'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default async function TopRatedPage() {
  const [movies, shows] = await Promise.all([
    getTopRated(),
    getTopRatedShows(),
  ])

  return (
    <main className="bg-flicker-black min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="mb-12">
          <p className="text-flicker-gray text-sm uppercase tracking-widest mb-2">Browse</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white">Top Rated</h1>
        </div>
        <div className="space-y-16">
          <MovieSection title="Top Rated Movies" movies={movies.data.results} type="movie" />
          <MovieSection title="Top Rated TV Shows" movies={shows.data.results} type="tv" />
        </div>
      </div>
      <Footer />
    </main>
  )
}
