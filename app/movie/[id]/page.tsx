import { getMovieDetails } from '@/lib/tmdb'
import MovieDetailClient from '@/components/MovieDetailClient'

interface MoviePageProps {
  params: { id: string }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params
  const { data: movie } = await getMovieDetails(id)
  return <MovieDetailClient movie={movie} type="movie" />
}
