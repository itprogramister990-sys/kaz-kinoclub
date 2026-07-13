'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  initialQuery?: string;
}

export default function SearchBar({ initialQuery = '' }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      if (query.trim()) {
        router.push(`/?q=${encodeURIComponent(query.trim())}`);
      } else {
        router.push('/');
      }
    });
  };

  const handleClear = () => {
    setQuery('');
    router.push('/');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto"
      role="search"
      aria-label="Поиск фильмов"
    >
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
          placeholder="Поиск по названию, жанру..."
          className="w-full bg-white/10 border border-white/20 rounded-2xl pl-12 pr-36 py-4
                     text-white placeholder-white/40 focus:outline-none focus:border-brand-red/60
                     focus:bg-white/15 transition-all duration-200 text-base backdrop-blur-sm"
          aria-label="Строка поиска"
        />

        {/* Clear button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-28 text-white/40 hover:text-white/80 transition-colors p-1"
            aria-label="Очистить поиск"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isPending}
          id="search-submit-btn"
          className="absolute right-2 bg-brand-gradient text-white font-semibold px-5 py-2.5
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
    </form>
  );
}
