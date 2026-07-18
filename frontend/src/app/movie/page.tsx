'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Comments from '@/components/Comments';
import Footer from '@/components/Footer';
import AdsterraButton from '@/components/AdsterraButton';
import { fetchMovie } from '@/lib/api';
import type { Movie } from '@/lib/types';

function MovieContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    
    async function loadData() {
      try {
        setLoading(true);
        const movieData = await fetchMovie(id!);
        if (isMounted) setMovie(movieData);
      } catch (err: any) {
        if (isMounted) setError(err.message || 'Не удалось загрузить фильм');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => { isMounted = false; };
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="w-16 h-16 border-4 border-brand-red border-t-transparent rounded-full animate-spin shadow-glow-red"></div>
      </main>
    );
  }

  if (error || !movie) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-6xl mb-4">🎬</p>
          <h1 className="text-2xl font-bold text-white mb-3">Не удалось загрузить фильм</h1>
          <p className="text-white/50 mb-6">{error || 'Фильм не найден'}</p>
          <button onClick={() => router.push('/')} className="btn-primary">← Вернуться на главную</button>
        </div>
      </main>
    );
  }

  return (
    <main>
      {/* ─── Hero / Background ────────────────────────────────────────── */}
      <section className="relative min-h-[55vh] flex items-end overflow-hidden" aria-label="Информация о фильме">
        {/* Background blur */}
        <div className="absolute inset-0">
          <img
            src={movie.poster_url || '/placeholder-poster.jpg'}
            alt={`Фон: ${movie.title}`}
            crossOrigin="anonymous"
            className="w-full h-full object-cover object-top blur-xl scale-110 opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d1a] via-[#0d0d1a]/80 to-black/50" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-28 w-full">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
            {/* Poster */}
            <div className="shrink-0 w-48 md:w-64 lg:w-72 mx-auto md:mx-0">
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <img
                  src={movie.poster_url || '/placeholder-poster.jpg'}
                  alt={`Постер: ${movie.title}`}
                  crossOrigin="anonymous"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 animate-slide-up">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-white/40 text-sm mb-4" aria-label="Навигация">
                <button onClick={() => router.push('/')} className="hover:text-white/70 transition-colors">Главная</button>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-white/60 truncate max-w-xs">{movie.title}</span>
              </nav>

              <h1 className="font-display font-black text-3xl md:text-4xl lg:text-5xl text-white mb-4">
                {movie.title}
              </h1>

              {/* Meta badges */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="rating-badge text-base">⭐ {movie.rating?.toFixed(1) || '0.0'}</span>
                <span className="genre-badge">{movie.genre}</span>
                <span className="text-white/50 text-sm">{movie.year} год</span>
              </div>

              {/* Description */}
              <p className="text-white/75 text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
                {movie.description}
              </p>

              {/* ★ ГЛАВНАЯ КНОПКА "Смотреть легально" */}
              <div className="flex flex-wrap gap-4 items-center">
                {movie.release_date && new Date(movie.release_date) > new Date() ? (
                  <button
                    disabled
                    className="inline-flex items-center gap-3 bg-gray-700/80 text-white/60 font-bold
                               text-base md:text-lg px-8 py-4 rounded-xl cursor-not-allowed shadow-lg border border-white/5"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                    </svg>
                    Ждём премьеру
                  </button>
                ) : (
                  <>
                    <a
                      href="#video-player"
                      className="inline-flex items-center gap-3 bg-brand-gradient text-white font-bold
                                 text-base md:text-lg px-8 py-4 rounded-xl hover:shadow-glow-red
                                 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
                      aria-label={`Смотреть ${movie.title} фильм`}
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                      </svg>
                      Смотреть фильм
                    </a>
                    <button
                      onClick={async () => {
                        const url = movie.partner_link || `https://www.kinopoisk.ru/index.php?kp_query=${encodeURIComponent(movie.title)}`;
                        try {
                          const { open } = await import('@tauri-apps/plugin-shell');
                          await open(url);
                        } catch (e) {
                          window.open(url, '_blank');
                        }
                      }}
                      className="inline-flex items-center gap-2 bg-[#f60] text-white font-bold
                                 text-base md:text-lg px-6 py-4 rounded-xl hover:bg-[#ff7a1f]
                                 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7zM5 5h4V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-4h-2v4H5V5z"/>
                      </svg>
                      На Кинопоиске
                    </button>
                  </>
                )}

                {/* Scroll to comments */}
                <a
                  href="#comments-section"
                  className="btn-secondary text-sm md:text-base"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Комментарии
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Video Player ─────────────────────────────────────────────── */}
      <section id="video-player" className="max-w-4xl mx-auto px-4 sm:px-6 pb-12 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center bg-gray-900/50 p-4 rounded-xl border border-gray-800">
          <h2 className="text-2xl font-bold mb-4 md:mb-0">Смотреть онлайн</h2>
          <AdsterraButton movieTitle={movie.title} />
        </div>

        <div className="w-full aspect-video rounded-xl overflow-hidden my-6 shadow-2xl bg-gray-900 border border-gray-800">
          {movie.youtube_key ? (
            <iframe 
              src={`https://www.youtube.com/embed/${movie.youtube_key}`} 
              className="w-full h-full border-0" 
              allowFullScreen 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Трейлер к этому фильму временно недоступен
            </div>
          )}
        </div>
      </section>

      {/* ─── Comments ───────────────────────────────────────────────── */}
      <section id="comments-section" className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
        <Comments movieId={movie.id} />
      </section>
    </main>
  );
}

export default function MoviePage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <main className="min-h-screen flex items-center justify-center px-4">
          <div className="w-16 h-16 border-4 border-brand-red border-t-transparent rounded-full animate-spin shadow-glow-red"></div>
        </main>
      }>
        <MovieContent />
      </Suspense>
      <Footer />
    </>
  );
}
