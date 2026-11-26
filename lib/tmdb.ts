import axios from 'axios'
import type {
  MediaType,
  TmdbMediaDetails,
  TmdbMediaItem,
  TmdbPaginatedResponse,
  TmdbSeasonDetailsResponse,
} from '@/types/tmdb'

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL
const IMAGE_URL = process.env.NEXT_PUBLIC_TMDB_IMAGE_URL

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US',
  },
})

export const getImageUrl = (path: string | null | undefined, size = 'w500'): string | null => {
  if (!path) return null
  return `${IMAGE_URL}/${size}${path}`
}

export const getBackdropUrl = (path: string | null | undefined): string | null => {
  if (!path) return null
  return `${IMAGE_URL}/original${path}`
}

export const getTrending = () => tmdb.get<TmdbPaginatedResponse<TmdbMediaItem>>('/trending/movie/week')
export const getPopularMovies = () => tmdb.get<TmdbPaginatedResponse<TmdbMediaItem>>('/movie/popular')
export const getTopRated = () => tmdb.get<TmdbPaginatedResponse<TmdbMediaItem>>('/movie/top_rated')
export const getUpcoming = () => tmdb.get<TmdbPaginatedResponse<TmdbMediaItem>>('/movie/upcoming')
export const getPopularShows = () => tmdb.get<TmdbPaginatedResponse<TmdbMediaItem>>('/tv/popular')
export const getTopRatedShows = () => tmdb.get<TmdbPaginatedResponse<TmdbMediaItem>>('/tv/top_rated')
export const getNowPlaying = () => tmdb.get<TmdbPaginatedResponse<TmdbMediaItem>>('/movie/now_playing')

export const getMovieDetails = (id: string | number) =>
  tmdb.get<TmdbMediaDetails>(`/movie/${id}`, {
    params: { append_to_response: 'credits,videos,similar,reviews' },
  })

export const getShowDetails = (id: string | number) =>
  tmdb.get<TmdbMediaDetails>(`/tv/${id}`, {
    params: { append_to_response: 'credits,videos,similar' },
  })

export const searchMulti = (query: string) =>
  tmdb.get<TmdbPaginatedResponse<TmdbMediaItem>>('/search/multi', { params: { query } })

export const getSeasonDetails = (showId: string | number, seasonNumber: number) =>
  tmdb.get<TmdbSeasonDetailsResponse>(`/tv/${showId}/season/${seasonNumber}`)

export const discoverByGenre = (genreId: number, mediaType: MediaType = 'movie', page = 1) =>
  tmdb.get<TmdbPaginatedResponse<TmdbMediaItem>>(`/discover/${mediaType}`, {
    params: { with_genres: genreId, page, sort_by: 'popularity.desc' },
  })

export default tmdb
