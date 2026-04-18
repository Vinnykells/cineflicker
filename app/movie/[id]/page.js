import { getMovieDetails } from '@/lib/tmdb'
import MovieDetailClient from '@/components/MovieDetailClient'

export default async function MoviePage({ params }) {
  const { data: movie } = await getMovieDetails(params.id)
  return <MovieDetailClient movie={movie} type="movie" />
}
