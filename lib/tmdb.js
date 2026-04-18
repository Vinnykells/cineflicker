import axios from 'axios'

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

export const getImageUrl = (path, size = 'w500') => {
  if (!path) return null
  return `${IMAGE_URL}/${size}${path}`
}

export const getBackdropUrl = (path) => {
  if (!path) return null
  return `${IMAGE_URL}/original${path}`
}

export const getTrending = () => tmdb.get('/trending/movie/week')
export const getPopularMovies = () => tmdb.get('/movie/popular')
export const getTopRated = () => tmdb.get('/movie/top_rated')
export const getUpcoming = () => tmdb.get('/movie/upcoming')
export const getPopularShows = () => tmdb.get('/tv/popular')
export const getTopRatedShows = () => tmdb.get('/tv/top_rated')
export const getNowPlaying = () => tmdb.get('/movie/now_playing')

export const getMovieDetails = (id) =>
  tmdb.get(`/movie/${id}`, {
    params: { append_to_response: 'credits,videos,similar,reviews' },
  })

export const getShowDetails = (id) =>
  tmdb.get(`/tv/${id}`, {
    params: { append_to_response: 'credits,videos,similar' },
  })

export const searchMulti = (query) =>
  tmdb.get('/search/multi', { params: { query } })

export default tmdb
