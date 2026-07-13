'use client';

import { useState } from 'react';
import MovieCard from '@/components/MovieCard';
import type { Movie } from '@/lib/types';

interface MainMovieGridProps {
  initialMovies: Movie[];
  query?: string;
  genre?: string;
  year?: string;
}

export default function MainMovieGrid({ initialMovies, query = '', genre = '', year = '' }: MainMovieGridProps) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialMovies.length === 20);

  const loadMore = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    
    try {
      const nextPage = page + 1;
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://onrender.com';
      let url = `${API_BASE}/api/movies?page=${nextPage}`;
      if (query) url += `&q=${encodeURIComponent(query)}`;
      if (genre) url += `&genre=${encodeURIComponent(genre)}`;
      if (year) url += `&year=${encodeURIComponent(year)}`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.movies && data.movies.length > 0) {
        setMovies((prev) => [...prev, ...data.movies]);
        setPage(nextPage);
        setHasMore(data.movies.length === 20);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Failed to load more movies:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const isSearching = Boolean(query);

  return (
    <>
      <h2 className="section-title">
        {isSearching ? `Найдено ${movies.length} фильмов` : 'Все фильмы'}
      </h2>

      <div
        id="movies-grid"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
      >
        {movies.map((movie) => (
          <MovieCard key={`${movie.id}-${page}`} movie={movie} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-12 text-center">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="inline-flex items-center gap-2 bg-brand-red hover:bg-red-600 disabled:bg-brand-red/50 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-glow-red hover:scale-105"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Загрузка...
              </>
            ) : (
              'Показать еще'
            )}
          </button>
        </div>
      )}
    </>
  );
}
