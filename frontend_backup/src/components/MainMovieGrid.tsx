'use client';

import { useState, useEffect } from 'react';
import MovieCard from '@/components/MovieCard';
import type { Movie } from '@/lib/types';

interface MainMovieGridProps {
  initialMovies: Movie[];
  query?: string;
  genres?: string;
  years?: string;
}

export default function MainMovieGrid({ initialMovies, query = '', genres = '', years = '' }: MainMovieGridProps) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies.slice(0, 12));
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialMovies.length > 12);

  useEffect(() => {
    setMovies(initialMovies.slice(0, 12));
    setPage(1);
    setHasMore(initialMovies.length > 12);
  }, [initialMovies, query, genres, years]);

  const loadPage = async (newPage: number) => {
    if (isLoading) return;
    setIsLoading(true);
    
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://onrender.com';
      let url = `${API_BASE}/api/movies?page=${newPage}`;
      if (query) url += `&q=${encodeURIComponent(query)}`;
      if (genres) url += `&genres=${encodeURIComponent(genres)}`;
      if (years) url += `&years=${encodeURIComponent(years)}`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.movies && data.movies.length > 0) {
        setMovies(data.movies.slice(0, 12));
        setPage(newPage);
        setHasMore(data.movies.length > 12 || data.movies.length === 20);
      } else {
        if (newPage > page) setHasMore(false);
      }
    } catch (err) {
      console.error('Failed to load movies:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const isSearching = Boolean(query);

  return (
    <>
      <h2 className="section-title">
        {isSearching ? `Найдено фильмов: ${movies.length} на этой странице` : 'Все фильмы'}
      </h2>

      <div
        id="movies-grid"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
      >
        {movies.map((movie) => (
          <MovieCard key={`${movie.id}`} movie={movie} />
        ))}
      </div>

      <div className="mt-12 flex items-center justify-center gap-4">
        <button
          onClick={() => loadPage(page - 1)}
          disabled={page === 1 || isLoading}
          className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:text-white/30 text-white px-6 py-2.5 rounded-full font-semibold transition-all"
        >
          ⬅️ Назад
        </button>
        <span className="text-white/50 font-medium px-2">
          {page}
        </span>
        <button
          onClick={() => loadPage(page + 1)}
          disabled={!hasMore || isLoading}
          className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:text-white/30 text-white px-6 py-2.5 rounded-full font-semibold transition-all"
        >
          Вперед ➡️
        </button>
      </div>
    </>
  );
}
