"use client";

import { Suspense, useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import MainMovieGrid from '@/components/MainMovieGrid';
import { fetchMovies } from '@/lib/api';
import type { Movie } from '@/lib/types';
import { useSearchParams } from 'next/navigation';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const years = searchParams.get('years') || '';
  const genres = searchParams.get('genres') || '';

  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await fetchMovies(query, genres, 1, years);
        setMovies(data.movies || []);
      } catch (err: any) {
        setError('Ошибка загрузки результатов поиска.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [query, genres, years]);

  return (
    <>
      <Navbar />

      <main className="pt-24 pb-12 px-4 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Search section */}
          <section className="mb-8" aria-label="Поиск фильмов">
            <div className="text-center mb-8">
              <h1 className="font-display font-bold text-2xl md:text-3xl text-white mb-2">
                Результаты поиска
              </h1>
              {query && (
                <p className="text-white/70 text-lg">
                  по запросу: <span className="text-gradient-red font-semibold">«{query}»</span>
                </p>
              )}
            </div>
            <SearchBar />
          </section>

          {/* Movies grid */}
          <section aria-label="Найденные фильмы">
            {loading ? (
              <div className="text-center py-20 text-white">Загрузка...</div>
            ) : error ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">Ошибка загрузки</h2>
                <p className="text-white/50 mb-6">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="inline-block bg-white/10 hover:bg-white/20 transition-colors px-6 py-2 rounded-lg text-white"
                >
                  Обновить страницу
                </button>
              </div>
            ) : movies.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">Ничего не найдено</h2>
                <p className="text-white/50">Попробуйте изменить параметры фильтров</p>
              </div>
            ) : (
              <MainMovieGrid initialMovies={movies} query={query} genres={genres} years={years} />
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 text-center text-white">Загрузка...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
