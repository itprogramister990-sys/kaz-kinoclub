import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import HeroBanner from '@/components/HeroBanner';
import MovieCard from '@/components/MovieCard';
import SearchBar from '@/components/SearchBar';
import Footer from '@/components/Footer';
import { fetchMovies } from '@/lib/api';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'КиноКлуб Казахстан — Лучшие фильмы для казахстанского сообщества',
  description: 'Откройте для себя лучшие фильмы, читайте отзывы и смотрите легально. КиноКлуб Казахстан — ваше кино сообщество.',
};

interface HomePageProps {
  searchParams: { q?: string };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const query = searchParams.q || '';

  let movies = [];
  let error = '';

  try {
    const data = await fetchMovies(query);
    movies = data.movies;
  } catch (err: any) {
    error = err.message || 'Не удалось загрузить фильмы';
  }

  const featuredMovie = movies[0];
  const isSearching = Boolean(query);

  return (
    <>
      <Navbar />

      <main>
        {/* Hero Banner — only on initial load */}
        {!isSearching && featuredMovie && (
          <HeroBanner movie={featuredMovie} />
        )}

        {/* Search section */}
        <section className="relative z-10 py-10 px-4" aria-label="Поиск фильмов">
          <div className="max-w-7xl mx-auto">
            {/* Search header */}
            <div className="text-center mb-8">
              {!isSearching ? (
                <>
                  <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-2">
                    Найдите свой следующий любимый фильм
                  </h2>
                  <p className="text-white/50">Поиск по названию, жанру или году</p>
                </>
              ) : (
                <h2 className="font-display font-bold text-2xl text-white">
                  Результаты для:{' '}
                  <span className="text-gradient-red">«{query}»</span>
                </h2>
              )}
            </div>
            <SearchBar initialQuery={query} />
          </div>
        </section>

        {/* Movies grid */}
        <section className="py-8 px-4" aria-label="Коллекция фильмов">
          <div className="max-w-7xl mx-auto">
            {error ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">Ошибка загрузки</h2>
                <p className="text-white/50 mb-6">{error}</p>
                <p className="text-white/30 text-sm">
                  Убедитесь, что бэкенд запущен на{' '}
                  <code className="bg-white/10 px-2 py-0.5 rounded text-brand-red">localhost:4000</code>
                </p>
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
                <p className="text-white/50">Попробуйте другой запрос</p>
              </div>
            ) : (
              <>
                {/* Section title */}
                <h2 className="section-title">
                  {isSearching ? `Найдено ${movies.length} фильмов` : 'Все фильмы'}
                </h2>

                {/* Grid */}
                <div
                  id="movies-grid"
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
                >
                  {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
