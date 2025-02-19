import axios from 'axios';

const tmdbApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_TMDB_BASE_URL,
  params: {
    api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY,
  },
});

export const fetchTrendingMovies = async () => {
  const { data } = await tmdbApi.get('/trending/movie/week');
  return data.results;
};

export const fetchLatestMovies = async () => {
  const { data } = await tmdbApi.get('/movie/now_playing');
  return data.results;
};

export const fetchMovieDetails = async (movieId: number) => {
  const { data } = await tmdbApi.get(`/movie/${movieId}`);
  return data;
};

export const fetchMovieTrailer = async (movieId: number) => {
  const { data } = await tmdbApi.get(`/movie/${movieId}/videos`);
  const trailer = data.results.find(
    (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
  );
  return trailer ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0&modestbranding=1` : null;
};

export const searchMovies = async (query: string) => {
  const { data } = await tmdbApi.get('/search/movie', {
    params: { query },
  });
  return data.results;
};

export const fetchMoviesByGenre = async (genreId: number) => {
  const { data } = await tmdbApi.get('/discover/movie', {
    params: { with_genres: genreId },
  });
  return data.results;
};

export const fetchTVShows = async () => {
  const { data } = await tmdbApi.get('/trending/tv/week');
  return data.results;
};

export const fetchMovieGenres = async () => {
  const { data } = await tmdbApi.get('/genre/movie/list');
  return data.genres;
};

export const fetchPopularMovies = async () => {
  const { data } = await tmdbApi.get('/movie/popular');
  return data.results;
};

export const fetchTopRatedMovies = async () => {
  const { data } = await tmdbApi.get('/movie/top_rated');
  return data.results;
};

export const fetchUpcomingMovies = async () => {
  const { data } = await tmdbApi.get('/movie/upcoming');
  return data.results;
};

// Enhanced search function with type parameter
export const searchContent = async (query: string, type: 'movie' | 'multi' = 'movie') => {
  const { data } = await tmdbApi.get(`/search/${type}`, {
    params: { query },
  });
  return data.results;
};