import { getShowDetails } from '@/lib/tmdb'
import MovieDetailClient from '@/components/MovieDetailClient'

export default async function ShowPage({ params }) {
  const { id } = await params
  const { data: show } = await getShowDetails(id)
  return <MovieDetailClient movie={show} type="tv" />
}
