import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import Footer from '@/components/Footer';
import type { Movie } from '@/lib/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Топ-100 фильмов — КиноКлуб Казахстан',
  description: 'Лучшие фильмы по версии сообщества и TMDB.',
};

export const dynamic = 'force-dynamic';

async function TopMoviesContent() {
  let movies: Movie[] = [];
  let error = '';

  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL || 'https://onrender.com'}/api/movies/top`;
    const res = await fetch(url, { next: { revalidate: 43200 } });
    
    if (!res.ok) {
      throw new Error(`Ошибка загрузки топ фильмов: ${res.status}`);
    }
    
    const data = await res.json();
    movies = data.movies || [];
  } catch (err: any) {
    console.error('Top movies fetch error:', err);
    error = 'Не удалось загрузить топ фильмов. Пожалуйста, обновите страницу.';
  }

  return (
    <main className="pt-24 pb-12 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display font-black text-3xl md:text-5xl text-white mb-4">
            Топ фильмов по версии <span className="text-gradient-red">КиноКлуба</span>
          </h1>
          <p className="text-white/60 text-lg">
            Самые высокооцененные картины, которые должен посмотреть каждый
          </p>
        </div>

        {error ? (
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold text-white mb-2">Ошибка загрузки</h2>
            <p className="text-white/50 mb-6">{error}</p>
            <a 
              href="/top" 
              className="inline-block bg-white/10 hover:bg-white/20 transition-colors px-6 py-2 rounded-lg text-white"
            >
              Обновить страницу
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {movies.map((movie, index) => (
              <div key={movie.id} className="relative group">
                <div className="absolute -top-3 -left-3 w-8 h-8 md:w-10 md:h-10 bg-brand-red text-white font-bold rounded-full flex items-center justify-center z-20 shadow-lg border-2 border-[#0a0a0a]">
                  {index + 1}
                </div>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function TopSkeleton() {
  return (
    <main className="pt-24 pb-12 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="h-10 md:h-12 w-3/4 max-w-lg bg-slate-800/50 rounded-lg animate-pulse mx-auto mb-4" />
          <div className="h-6 w-1/2 max-w-md bg-slate-800/30 rounded-lg animate-pulse mx-auto" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2 relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 md:w-10 md:h-10 bg-slate-800/80 rounded-full z-20 animate-pulse border-2 border-[#0a0a0a]" />
              <div className="aspect-[2/3] w-full bg-slate-800/50 rounded-xl animate-pulse" />
              <div className="h-4 w-3/4 bg-slate-800/50 rounded animate-pulse mt-1" />
              <div className="h-3 w-1/2 bg-slate-800/30 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

import { Suspense } from 'react';

export default function TopMoviesPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<TopSkeleton />}>
        <TopMoviesContent />
      </Suspense>
      <Footer />
    </>
  );
}
