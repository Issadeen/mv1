'use client';
import { createContext, useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as tmdbService from '../services/tmdb';

export type Movie = {
  rating: any;
  id: number;
  title: string;
  overview?: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  vote_average?: number;
  genre_ids?: number[];
  genre?: string[];
  duration?: string;
  year?: string;
  trailerUrl?: string;
  image?: string;
};

export interface MoviesContextType {
  trendingMovies: Movie[];
  latestMovies: Movie[];
  popularMovies: Movie[];
  topRatedMovies: Movie[];
  upcomingMovies: Movie[];
  watchlist: Movie[];
  searchMovies: (query: string) => Promise<Movie[]>;
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: number) => void;
  isLoading: boolean;
  error: Error | null;
}

const MoviesContext = createContext<MoviesContextType | undefined>(undefined);

export function MoviesProvider({ children }: { children: React.ReactNode }) {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);

  const { data: trendingMovies = [], isLoading: trendingLoading, error: trendingError } = useQuery({
    queryKey: ['trendingMovies'],
    queryFn: tmdbService.fetchTrendingMovies,
  });

  const { data: latestMovies = [], isLoading: latestLoading, error: latestError } = useQuery({
    queryKey: ['latestMovies'],
    queryFn: tmdbService.fetchLatestMovies,
  });

  const { data: popularMovies = [], isLoading: popularLoading, error: popularError } = useQuery({
    queryKey: ['popularMovies'],
    queryFn: tmdbService.fetchPopularMovies,
  });

  const { data: topRatedMovies = [], isLoading: topRatedLoading, error: topRatedError } = useQuery({
    queryKey: ['topRatedMovies'],
    queryFn: tmdbService.fetchTopRatedMovies,
  });

  const { data: upcomingMovies = [], isLoading: upcomingLoading, error: upcomingError } = useQuery({
    queryKey: ['upcomingMovies'],
    queryFn: tmdbService.fetchUpcomingMovies,
  });

  const searchMovies = async (query: string) => {
    if (!query.trim()) return [];
    const results = await tmdbService.searchContent(query);
    return results;
  };

  const addToWatchlist = (movie: Movie) => {
    setWatchlist(prev => {
      if (!prev.find(m => m.id === movie.id)) {
        return [...prev, movie];
      }
      return prev;
    });
  };

  const removeFromWatchlist = (movieId: number) => {
    setWatchlist(prev => prev.filter(movie => movie.id !== movieId));
  };

  const isLoading = trendingLoading || latestLoading || popularLoading || topRatedLoading || upcomingLoading;
  const error = trendingError || latestError || popularError || topRatedError || upcomingError;

  return (
    <MoviesContext.Provider value={{
      trendingMovies,
      latestMovies,
      popularMovies,
      topRatedMovies,
      upcomingMovies,
      watchlist,
      searchMovies,
      addToWatchlist,
      removeFromWatchlist,
      isLoading,
      error: error as Error | null,
    }}>
      {children}
    </MoviesContext.Provider>
  );
}

export function useMovies() {
  const context = useContext(MoviesContext);
  if (context === undefined) {
    throw new Error('useMovies must be used within a MoviesProvider');
  }
  return context;
}