import Link from 'next/link';
import Image from 'next/image';
import { Movie } from '@/lib/types';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const isUnreleased = movie.release_date && new Date(movie.release_date) > new Date();
  const formattedDate = movie.release_date 
    ? new Date(movie.release_date).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    : '';

  return (
    <Link href={`/movies/${movie.id}`} className="block group">
      <article className="card h-full cursor-pointer" id={`movie-card-${movie.id}`}>
        {/* Poster */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={movie.poster_url || '/placeholder-poster.jpg'}
            alt={`Постер фильма ${movie.title}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-card-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Rating badge */}
          <div className="absolute top-2 right-2">
            <span className="rating-badge text-xs">
              ⭐ {movie.rating.toFixed(1)}
            </span>
          </div>

          {/* Year badge */}
          <div className="absolute top-2 left-2">
            <span className="bg-black/70 text-white/80 text-xs px-2 py-1 rounded-full backdrop-blur-sm">
              {movie.year}
            </span>
          </div>

          {/* Hover CTA */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="w-12 h-12 bg-brand-red/90 rounded-full flex items-center justify-center shadow-glow-red">
              <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="font-semibold text-white text-sm md:text-base leading-tight line-clamp-2 group-hover:text-brand-red transition-colors mb-1">
            {movie.title}
          </h3>
          <p className="text-white/50 text-xs line-clamp-1" title={movie.genre}>
            {movie.genre}
          </p>
          {isUnreleased && (
            <p className="mt-2 text-[10px] sm:text-xs text-brand-red font-medium bg-brand-red/10 border border-brand-red/20 rounded-md px-2 py-1 inline-block">
              Фильм ещё не вышел. Планируемая дата: {formattedDate}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
