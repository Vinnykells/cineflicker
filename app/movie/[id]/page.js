import { getMovieDetails } from '@/lib/tmdb'
import MovieDetailClient from '@/components/MovieDetailClient'

export default async function MoviePage({ params }) {
  const { id } = await params
  const { data: movie } = await getMovieDetails(id)
  return <MovieDetailClient movie={movie} type="movie" />
}
