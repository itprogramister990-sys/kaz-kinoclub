'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const GENRE_OPTIONS = [
  { slug: 'drama_comedy', label: 'Драма и Комедия' },
  { slug: 'action_thriller', label: 'Экшен и Триллер' },
  { slug: 'horror', label: 'Ужасы' },
  { slug: 'sci_fi_fantasy', label: 'Фантастика и Фэнтези' },
  { slug: 'romance_mystery', label: 'Мелодрама и Детектив' },
  { slug: 'adventure_western', label: 'Приключения и Вестерн' },
  { slug: 'history', label: 'Биопик и Исторический' },
  { slug: 'music', label: 'Мюзикл и Музыкальный' },
  { slug: 'noir', label: 'Нуар' },
  { slug: 'documentary', label: 'Документальное кино' },
  { slug: 'cartoon', label: 'Мультфильмы' }
];

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialQuery = searchParams.get('q') || '';
  const initialGenres = searchParams.get('genres') || searchParams.get('genre') || '';
  const initialYears = searchParams.get('years') || searchParams.get('year') || '';

  const [query, setQuery] = useState(initialQuery);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    initialGenres ? initialGenres.split(',') : []
  );
  const [selectedYears, setSelectedYears] = useState<string[]>(
    initialYears ? initialYears.split(',') : []
  );
  const [showFilters, setShowFilters] = useState(false);
  const [isPending, startTransition] = useTransition();

  const years = Array.from({ length: 27 }, (_, i) => String(2026 - i));

  const toggleGenre = (slug: string) => {
    setSelectedGenres(prev => 
      prev.includes(slug) ? prev.filter(g => g !== slug) : [...prev, slug]
    );
  };

  const toggleYear = (y: string) => {
    setSelectedYears(prev => 
      prev.includes(y) ? prev.filter(item => item !== y) : [...prev, y]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      const params = new URLSearchParams();
      if (query.trim()) params.append('q', query.trim());
      if (selectedGenres.length > 0) params.append('genres', selectedGenres.join(','));
      if (selectedYears.length > 0) params.append('years', selectedYears.join(','));

      const qs = params.toString();
      window.location.href = qs ? `/search-results/?${qs}` : '/search-results/';
      setShowFilters(false);
    });
  };

  const handleClear = () => {
    setQuery('');
    setSelectedGenres([]);
    setSelectedYears([]);
    window.location.href = '/search-results/';
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative z-50">
      <form onSubmit={handleSubmit} role="search" aria-label="Поиск фильмов">
        <div className="relative flex flex-col md:flex-row md:items-center gap-3 md:gap-0">
          
          {/* Input wrapper */}
          <div className="relative w-full">
            <div className="absolute left-4 top-0 bottom-0 flex items-center text-white/40 pointer-events-none">
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
              className="w-full bg-white/10 border border-white/20 rounded-2xl pl-12 pr-12 md:pr-[15rem] py-4
                         text-white placeholder-white/40 focus:outline-none focus:border-brand-red/60
                         focus:bg-white/15 transition-all duration-200 text-base backdrop-blur-sm"
              aria-label="Строка поиска"
            />

            {/* Clear button */}
            {(query || selectedGenres.length > 0 || selectedYears.length > 0) && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-4 top-0 bottom-0 flex items-center text-white/40 hover:text-white/80 transition-colors md:right-[15rem]"
                aria-label="Очистить поиск"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Controls wrapper */}
          <div className="flex items-center gap-2 w-full md:w-auto md:absolute md:right-2">
            {/* Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex-1 md:flex-none flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl transition-colors border md:border-transparent ${showFilters ? 'bg-white/20 text-white border-white/20' : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'}`}
              aria-label="Фильтры"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="md:hidden font-medium">Фильтры</span>
            </button>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isPending}
              id="search-submit-btn"
              className="flex-1 md:flex-none flex justify-center items-center gap-2 bg-brand-gradient text-white font-semibold px-5 py-2.5 md:py-2.5
                         rounded-xl border border-transparent hover:shadow-glow-red transition-all duration-200 md:hover:scale-105
                         active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-base md:text-sm"
            >
              {isPending ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                'Найти'
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Expandable Filters Panel */}
      {showFilters && (
        <div className="absolute top-full left-0 right-0 mt-3 p-5 bg-[#151525]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl animate-slide-up text-left z-50">
          <div className="flex flex-col gap-6">
            
            {/* Жанры */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-3">Жанры (можно выбрать несколько)</label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {GENRE_OPTIONS.map((genre) => (
                  <label key={genre.slug} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/10">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={selectedGenres.includes(genre.slug)}
                        onChange={() => toggleGenre(genre.slug)}
                        className="peer appearance-none w-5 h-5 border-2 border-white/30 rounded focus:outline-none checked:bg-brand-red checked:border-brand-red transition-all cursor-pointer"
                      />
                      <svg
                        className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-white/80 text-sm select-none peer-checked:text-white peer-checked:font-medium transition-all">
                      {genre.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Год */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-3">Год выпуска</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                {years.map(y => (
                  <label key={y} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/10">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={selectedYears.includes(y)}
                        onChange={() => toggleYear(y)}
                        className="peer appearance-none w-5 h-5 border-2 border-white/30 rounded focus:outline-none checked:bg-brand-red checked:border-brand-red transition-all cursor-pointer"
                      />
                      <svg
                        className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-white/80 text-sm select-none peer-checked:text-white peer-checked:font-medium transition-all">
                      {y}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
             <button
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
                className="bg-brand-red hover:bg-red-600 text-white font-medium px-8 py-2.5 rounded-xl transition-all shadow-glow-red hover:scale-105 active:scale-95 w-full md:w-auto"
             >
               Применить фильтры
             </button>
          </div>
        </div>
      )}
    </div>
  );
}
