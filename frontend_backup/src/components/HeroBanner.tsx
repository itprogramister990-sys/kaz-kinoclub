import Link from 'next/link';
import { Movie } from '@/lib/types';

interface HeroBannerProps {
  movie: Movie;
}

export default function HeroBanner({ movie }: HeroBannerProps) {
  return (
    <section className="relative min-h-[70vh] flex items-end overflow-hidden" aria-label="Баннер рекомендуемого фильма">
      {/* Background poster */}
      <div className="absolute inset-0">
        <img
          src={movie.poster_url || '/placeholder-poster.jpg'}
          alt={`Фоновое изображение: ${movie.title}`}
          crossOrigin="anonymous"
          className="w-full h-full object-cover object-top scale-105"
        />
        {/* Multi-layer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d1a] via-transparent to-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24 pt-32">
        <div className="max-w-2xl animate-slide-up">
          {/* Featured badge */}
          <div className="inline-flex items-center gap-2 bg-brand-red/90 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4 backdrop-blur-sm">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Рекомендуем сегодня
          </div>

          {/* Title */}
          <h1 className="font-display font-black text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-4">
            {movie.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="rating-badge">⭐ {movie.rating.toFixed(1)}</span>
            <span className="genre-badge">{movie.genre}</span>
            <span className="text-white/50 text-sm">{movie.year}</span>
          </div>

          {/* Description */}
          <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8 line-clamp-3">
            {movie.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link
              href={`/movies/${movie.id}`}
              id="hero-watch-btn"
              className="btn-primary text-base px-8 py-3.5"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Смотреть онлайн
            </Link>
            <Link
              href={`/movies/${movie.id}`}
              className="btn-secondary text-base px-8 py-3.5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Подробнее
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
