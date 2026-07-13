import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Comments from '@/components/Comments';
import Footer from '@/components/Footer';
import AdsterraButton from '@/components/AdsterraButton';
import { fetchMovie, fetchComments } from '@/lib/api';
import type { Movie } from '@/lib/types';
import type { Comment } from '@/lib/types';
import type { Metadata } from 'next';

interface MoviePageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  try {
    const movie = await fetchMovie(params.id);
    return {
      title: `${movie.title} (${movie.year}) — КиноКлуб Казахстан`,
      description: movie.description.slice(0, 160),
      openGraph: {
        title: movie.title,
        description: movie.description.slice(0, 160),
        images: [{ url: movie.poster_url }],
      },
    };
  } catch {
    return { title: 'Фильм — КиноКлуб Казахстан' };
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  let movie: Movie | undefined;
  let comments: Comment[] = [];

  try {
    movie = await fetchMovie(params.id);
  } catch (err: any) {
    if (err.message?.includes('не найден')) notFound();
    // Backend not available — show error
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-6xl mb-4">🎬</p>
            <h1 className="text-2xl font-bold text-white mb-3">Не удалось загрузить фильм</h1>
            <p className="text-white/50 mb-6">{err.message}</p>
            <Link href="/" className="btn-primary">← Вернуться на главную</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  try {
    const commentsData = await fetchComments(params.id);
    comments = commentsData.comments;
  } catch {
    // Comments fail silently
  }

  // Narrowing guard — TypeScript cannot infer that movie is always set
  // after the catch block (which either returns or calls notFound).
  if (!movie) return notFound();

  return (
    <>
      <Navbar />

      <main>
        {/* ─── Hero section ──────────────────────────────────────────── */}
        <section className="relative min-h-[55vh] flex items-end overflow-hidden" aria-label="Информация о фильме">
          {/* Background blur */}
          <div className="absolute inset-0">
            <Image
              src={movie.poster_url}
              alt={`Фон: ${movie.title}`}
              fill
              priority
              className="object-cover object-top blur-xl scale-110 opacity-30"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d1a] via-[#0d0d1a]/80 to-black/50" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-28 w-full">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
              {/* Poster */}
              <div className="shrink-0 w-48 md:w-64 lg:w-72 mx-auto md:mx-0">
                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                  <Image
                    src={movie.poster_url}
                    alt={`Постер: ${movie.title}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 192px, 288px"
                    priority
                  />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 animate-slide-up">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-white/40 text-sm mb-4" aria-label="Навигация">
                  <Link href="/" className="hover:text-white/70 transition-colors">Главная</Link>
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
                  <span className="rating-badge text-base">⭐ {movie.rating.toFixed(1)}</span>
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
                    Комментарии ({comments.length})
                  </a>
                </div>


              </div>
            </div>
          </div>
        </section>

        {/* ─── Video Player ─────────────────────────────────────────────── */}
        <section id="video-player" className="max-w-4xl mx-auto px-4 sm:px-6 pb-12 pt-8">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-white">Смотреть онлайн</h2>
            <div className="px-3 py-1 bg-brand-red/20 text-brand-red text-xs font-bold rounded-md uppercase tracking-wider">HD 1080</div>
          </div>

          <div className="flex justify-center w-full mb-4">
            <AdsterraButton />
          </div>

          <div className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl bg-gray-900 border border-gray-800">
            <iframe 
              src={`https://www.2embed.cc/embed/${movie.id}`} 
              className="w-full h-full border-0" 
              allowFullScreen 
            />
          </div>
          
          <div className="flex justify-center mt-6">
            <a
              href={`https://kinopoisk.ru/index.php?kp_query=${encodeURIComponent(movie.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-brand-gradient text-white font-bold
                         text-base md:text-lg px-10 py-4 rounded-xl hover:shadow-glow-red
                         transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
              aria-label={`Смотреть ${movie.title} фильм`}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
              </svg>
              Открыть в источнике (Кинопоиск)
            </a>
          </div>
        </section>

        {/* ─── Comments ───────────────────────────────────────────────── */}
        <section id="comments-section" className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
          <Comments movieId={movie.id} initialComments={comments} />
        </section>
      </main>

      <Footer />
    </>
  );
}
