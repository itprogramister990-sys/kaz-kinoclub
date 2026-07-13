'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialQuery = searchParams.get('q') || '';
  const initialGenre = searchParams.get('genre') || '';
  const initialYear = searchParams.get('year') || '';

  const [query, setQuery] = useState(initialQuery);
  const [genre, setGenre] = useState(initialGenre);
  const [year, setYear] = useState(initialYear);
  const [showFilters, setShowFilters] = useState(false);
  const [isPending, startTransition] = useTransition();

  const years = Array.from({ length: 27 }, (_, i) => 2026 - i);
  const genres = [
    'Все',
    'Драма и Комедия',
    'Экшен и Триллер',
    'Ужасы',
    'Фантастика и Фэнтези',
    'Мелодрама и Детектив',
    'Приключения и Вестерн',
    'Биопик и Исторический',
    'Мюзикл и Музыкальный',
    'Нуар',
    'Документальное и Научно-популярное',
    'Мультфильмы'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      const params = new URLSearchParams();
      if (query.trim()) params.append('q', query.trim());
      if (genre && genre !== 'Все') params.append('genre', genre);
      if (year && year !== 'Все') params.append('year', year);

      const qs = params.toString();
      router.push(qs ? `/?${qs}` : '/');
      setShowFilters(false);
    });
  };

  const handleClear = () => {
    setQuery('');
    setGenre('');
    setYear('');
    router.push('/');
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative">
      <form onSubmit={handleSubmit} role="search" aria-label="Поиск фильмов">
        <div className="relative flex items-center">
          {/* Search icon */}
          <div className="absolute left-4 text-white/40 pointer-events-none">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <input
            id="search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по названию..."
            className="w-full bg-white/10 border border-white/20 rounded-2xl pl-12 pr-[14rem] py-4
                       text-white placeholder-white/40 focus:outline-none focus:border-brand-red/60
                       focus:bg-white/15 transition-all duration-200 text-base backdrop-blur-sm"
            aria-label="Строка поиска"
          />

          {/* Controls right side */}
          <div className="absolute right-2 flex items-center gap-2">
            {/* Clear button */}
            {(query || genre || year) && (
              <button
                type="button"
                onClick={handleClear}
                className="text-white/40 hover:text-white/80 transition-colors p-2"
                aria-label="Очистить поиск"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-lg transition-colors ${showFilters ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
              aria-label="Фильтры"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isPending}
              id="search-submit-btn"
              className="bg-brand-gradient text-white font-semibold px-5 py-2.5
                         rounded-xl hover:shadow-glow-red transition-all duration-200 hover:scale-105
                         active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {isPending ? (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </span>
              ) : (
                'Найти'
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Expandable Filters Panel */}
      {showFilters && (
        <div className="absolute top-full left-0 right-0 mt-3 p-5 bg-[#151525]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Жанр</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-red/50 appearance-none"
              >
                <option value="">Все</option>
                {genres.filter(g => g !== 'Все').map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Год выпуска</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-red/50 appearance-none"
              >
                <option value="">Все</option>
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
             <button
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
                className="bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-2 rounded-xl transition-all"
             >
               Применить фильтры
             </button>
          </div>
        </div>
      )}
    </div>
  );
}
