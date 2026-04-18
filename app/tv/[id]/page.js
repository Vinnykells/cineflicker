import { getShowDetails } from '@/lib/tmdb'
import MovieDetailClient from '@/components/MovieDetailClient'

export default async function ShowPage({ params }) {
  const { data: show } = await getShowDetails(params.id)
  return <MovieDetailClient movie={show} type="tv" />
}
