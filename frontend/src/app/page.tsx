import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import HeroBanner from '@/components/HeroBanner';
import MainMovieGrid from '@/components/MainMovieGrid';
import SearchBar from '@/components/SearchBar';
import Footer from '@/components/Footer';
import { fetchMovies } from '@/lib/api';
import type { Movie } from '@/lib/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'КиноКлуб Казахстан — Лучшие фильмы для казахстанского сообщества',
  description: 'Откройте для себя лучшие фильмы, читайте отзывы и смотрите легально. КиноКлуб Казахстан — ваше кино сообщество.',
};

export const dynamic = 'force-dynamic';

async function MovieContent() {
  let movies: Movie[] = [];
  let error = '';

  try {
    const data = await fetchMovies();
    movies = data.movies;
  } catch (err: any) {
    error = 'Сервер просыпается, обновите страницу. Это может занять около 50 секунд.';
  }

  const featuredMovie = movies[0];

  return (
    <main>
      {/* Hero Banner — only on initial load */}
      {featuredMovie && (
        <HeroBanner movie={featuredMovie} />
      )}

      {/* Search section */}
      <section className="relative z-10 py-10 px-4" aria-label="Поиск фильмов">
        <div className="max-w-7xl mx-auto">
          {/* Search header */}
          <div className="text-center mb-8">
            <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-2">
              Найдите свой следующий любимый фильм
            </h2>
            <p className="text-white/50">Поиск по названию, жанру или году</p>
          </div>
          <Suspense fallback={<div className="h-16 bg-white/5 rounded-2xl animate-pulse w-full max-w-2xl mx-auto"></div>}>
            <SearchBar />
          </Suspense>
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
              <a 
                href="/" 
                className="inline-block bg-white/10 hover:bg-white/20 transition-colors px-6 py-2 rounded-lg text-white"
              >
                Обновить страницу
              </a>
            </div>
          ) : movies.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Нет данных</h2>
            </div>
          ) : (
            <MainMovieGrid initialMovies={movies} />
          )}
        </div>
      </section>
    </main>
  );
}

function HomeSkeleton() {
  return (
    <main className="min-h-screen">
      <section className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] flex items-center justify-center bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-slate-800/30 animate-pulse" />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 mt-20">
          <div className="h-10 w-32 bg-brand-red/20 rounded-full animate-pulse mx-auto mb-6" />
          <div className="h-12 md:h-16 w-3/4 bg-white/10 rounded-xl animate-pulse mx-auto mb-4" />
          <div className="h-12 md:h-16 w-1/2 bg-white/10 rounded-xl animate-pulse mx-auto mb-8" />
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="h-14 w-48 bg-white/10 rounded-xl animate-pulse" />
            <div className="h-14 w-48 bg-white/10 rounded-xl animate-pulse" />
          </div>
        </div>
      </section>
      <section className="relative z-10 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 w-64 bg-white/5 rounded-lg animate-pulse mx-auto mb-4" />
          <div className="h-16 w-full max-w-2xl bg-white/5 rounded-2xl animate-pulse mx-auto" />
        </div>
      </section>
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="aspect-[2/3] w-full bg-slate-800/50 rounded-xl animate-pulse" />
                <div className="h-4 w-3/4 bg-slate-800/50 rounded animate-pulse mt-1" />
                <div className="h-3 w-1/2 bg-slate-800/30 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function Home() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<HomeSkeleton />}>
        <MovieContent />
      </Suspense>
      <Footer />
    </>
  );
}
