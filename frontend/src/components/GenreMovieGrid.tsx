'use client';

import { useState } from 'react';
import MovieCard from '@/components/MovieCard';
import type { Movie } from '@/lib/types';
import { fetchMovies } from '@/lib/api';

interface GenreMovieGridProps {
  initialMovies: Movie[];
  genreSlug: string;
}

export default function GenreMovieGrid({ initialMovies, genreSlug }: GenreMovieGridProps) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialMovies.length === 20); // TMDB typically returns 20 per page

  const loadMore = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    
    try {
      const nextPage = page + 1;
      const data = await fetchMovies('', genreSlug, nextPage);
      
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

  return (
    <>
      <div className="mb-10 border-b border-white/10 pb-6">
        <p className="text-white/50 mt-2">
          Загружено фильмов: {movies.length}
        </p>
      </div>

      {movies.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-xl font-semibold text-white mb-2">Ничего не найдено</h2>
          <p className="text-white/50">В этом жанре пока нет популярных фильмов.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
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
      )}
    </>
  );
}
