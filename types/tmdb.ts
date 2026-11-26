export type MediaType = 'movie' | 'tv'

export interface TmdbMediaItem {
  id: number
  title?: string
  name?: string
  poster_path: string | null
  backdrop_path: string | null
  overview: string
  vote_average: number
  vote_count?: number
  release_date?: string
  first_air_date?: string
  media_type?: 'movie' | 'tv' | 'person'
  genre_ids?: number[]
  popularity?: number
}

export interface TmdbGenre {
  id: number
  name: string
}

export interface TmdbVideo {
  id: string
  key: string
  name: string
  site: string
  type: string
}

export interface TmdbCastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
}

export interface TmdbSeason {
  id: number
  name: string
  season_number: number
  episode_count?: number
  poster_path?: string | null
}

export interface TmdbEpisode {
  id: number
  name: string
  episode_number: number
  season_number?: number
  runtime?: number | null
  overview?: string
  still_path?: string | null
}

export interface TmdbMediaDetails extends TmdbMediaItem {
  genres?: TmdbGenre[]
  runtime?: number | null
  status?: string
  tagline?: string
  original_language?: string
  budget?: number
  revenue?: number
  seasons?: TmdbSeason[]
  videos?: {
    results: TmdbVideo[]
  }
  credits?: {
    cast: TmdbCastMember[]
  }
  similar?: {
    results: TmdbMediaItem[]
  }
}

export interface TmdbPaginatedResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export interface TmdbSeasonDetailsResponse {
  id: number
  season_number: number
  episodes: TmdbEpisode[]
}

export interface WatchlistItem {
  id: number
  title: string
  type: MediaType
  poster: string | null
  date?: string
}

export interface ContinueWatchingItem {
  id: number
  title: string
  type: MediaType
  poster: string | null
  season: number | null
  episode: number | null
  watchedAt: number
}

export type MediaItem = TmdbMediaItem
export type Genre = TmdbGenre
export type Episode = TmdbEpisode
export type MediaDetails = TmdbMediaDetails
export type PaginatedResponse<T> = TmdbPaginatedResponse<T>
export type SeasonDetailsResponse = TmdbSeasonDetailsResponse
