import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import Footer from '@/components/Footer';
import type { Movie } from '@/lib/types';
import type { Metadata } from 'next';

const slugMap: Record<string, string> = {
  action: 'Боевик',
  comedy: 'Комедия',
  drama: 'Драма',
  fiction: 'Фантастика',
  horror: 'Ужасы',
  cartoon: 'Мультфильмы'
};

const GENRE_TITLES: Record<string, string> = {
  'drama': 'Драмы',
  'fiction': 'Фантастика',
  'action': 'Боевики',
  'comedy': 'Комедии',
  'horror': 'Ужасы',
  'cartoon': 'Мультфильмы'
};

export async function generateMetadata({ params }: { params: { name: string } }): Promise<Metadata> {
  const genreTitle = GENRE_TITLES[params.name] || 'Фильмы';
  return {
    title: `${genreTitle} — КиноКлуб Казахстан`,
    description: `Лучшие ${genreTitle.toLowerCase()} на сайте КиноКлуб Казахстан.`,
  };
}

export const dynamic = 'force-dynamic';

export default async function GenrePage({ params }: { params: { name: string } }) {
  const genreSlug = params.name;
  const genreTitle = GENRE_TITLES[genreSlug] || 'Фильмы';

  let movies: Movie[] = [];
  let error = '';

  try {
    const russianGenre = slugMap[genreSlug] || genreSlug;
    const url = `${process.env.NEXT_PUBLIC_API_URL || 'https://onrender.com'}/api/movies?genre=${encodeURIComponent(russianGenre)}`;
    const res = await fetch(url, { cache: 'no-store' });
    
    if (!res.ok) {
      throw new Error(`Ошибка загрузки: ${res.status}`);
    }
    
    const data = await res.json();
    movies = data.movies || [];
  } catch (err: any) {
    console.error('Genre fetch error:', err);
    error = 'Не удалось загрузить фильмы этого жанра.';
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-12 px-4 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 border-b border-white/10 pb-6">
            <h1 className="font-display font-black text-3xl md:text-4xl text-white">
              {genreTitle}
            </h1>
            <p className="text-white/50 mt-2">
              Найдено фильмов: {movies.length}
            </p>
          </div>

          {error ? (
            <div className="text-center py-20">
              <h2 className="text-xl font-semibold text-white mb-2">Ошибка загрузки</h2>
              <p className="text-white/50 mb-6">{error}</p>
              <a 
                href={`/genre/${genreSlug}`} 
                className="inline-block bg-white/10 hover:bg-white/20 transition-colors px-6 py-2 rounded-lg text-white"
              >
                Обновить страницу
              </a>
            </div>
          ) : movies.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="text-xl font-semibold text-white mb-2">Ничего не найдено</h2>
              <p className="text-white/50">В этом жанре пока нет популярных фильмов.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
