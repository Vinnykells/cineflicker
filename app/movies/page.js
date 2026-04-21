import { getPopularMovies, getTopRated, getUpcoming, getNowPlaying } from '@/lib/tmdb'
import MovieSection from '@/components/MovieSection'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default async function MoviesPage() {
  const [popular, topRated, upcoming, nowPlaying] = await Promise.all([
    getPopularMovies(),
    getTopRated(),
    getUpcoming(),
    getNowPlaying(),
  ])

  return (
    <main className="bg-flicker-black min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="mb-12">
          <p className="text-flicker-gray text-sm uppercase tracking-widest mb-2">Browse</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white">Movies</h1>
        </div>
        <div className="space-y-16">
          <MovieSection title="Now Playing" movies={nowPlaying.data.results} type="movie" />
          <MovieSection title="Popular" movies={popular.data.results} type="movie" />
          <MovieSection title="Top Rated" movies={topRated.data.results} type="movie" />
          <MovieSection title="Coming Soon" movies={upcoming.data.results} type="movie" />
        </div>
      </div>
      <Footer />
    </main>
  )
}
