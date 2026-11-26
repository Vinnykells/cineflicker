import { getShowDetails } from '@/lib/tmdb'
import MovieDetailClient from '@/components/MovieDetailClient'

interface ShowPageProps {
  params: { id: string }
}

export default async function ShowPage({ params }: ShowPageProps) {
  const { id } = await params
  const { data: show } = await getShowDetails(id)
  return <MovieDetailClient movie={show} type="tv" />
}
