import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import MovieSection from '@/components/MovieSection'
import Footer from '@/components/Footer'
import {
  getTrending,
  getPopularMovies,
  getTopRated,
  getPopularShows,
  getUpcoming,
} from '@/lib/tmdb'

export default async function Home() {
  const [trending, popular, topRated, shows, upcoming] = await Promise.all([
    getTrending(),
    getPopularMovies(),
    getTopRated(),
    getPopularShows(),
    getUpcoming(),
  ])

  return (
    <main className="bg-flicker-black min-h-screen">
      <Navbar />
      <Hero movies={trending.data.results} />
      <div className="space-y-16 pb-20">
        <MovieSection title="Trending This Week" movies={trending.data.results} type="movie" />
        <MovieSection title="Popular Movies" movies={popular.data.results} type="movie" />
        <MovieSection title="Top Rated" movies={topRated.data.results} type="movie" />
        <MovieSection title="Popular TV Shows" movies={shows.data.results} type="tv" />
        <MovieSection title="Coming Soon" movies={upcoming.data.results} type="movie" />
      </div>
      <Footer />
    </main>
  )
}
