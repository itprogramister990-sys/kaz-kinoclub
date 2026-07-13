'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery('');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-transparent backdrop-blur-sm" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-brand-gradient rounded-lg flex items-center justify-center shadow-glow-red group-hover:scale-110 transition-transform">
              <span className="text-white font-display font-black text-lg md:text-xl">К</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-display font-black text-lg md:text-xl text-white">
                Кино<span className="text-gradient-red">Клуб</span>
              </span>
              <p className="text-white/50 text-xs leading-none">Казахстан</p>
            </div>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
              Главная
            </Link>
            <Link href="/?genre=drama" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
              Драмы
            </Link>
            <Link href="/?genre=fiction" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
              Фантастика
            </Link>
            <Link href="/?genre=action" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
              Боевики
            </Link>
            <Link href="/?genre=comedy" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
              Комедии
            </Link>
            <Link href="/?genre=horror" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
              Ужасы
            </Link>
          </div>

          {/* Search */}
          <div className="flex items-center gap-3">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center gap-2 animate-fade-in">
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Поиск фильмов..."
                  className="input-field w-48 md:w-64 py-2 text-sm"
                />
                <button
                  type="submit"
                  className="p-2 bg-brand-red rounded-lg hover:bg-red-700 transition-colors"
                >
                  <SearchIcon />
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="p-2 text-white/60 hover:text-white transition-colors"
                >
                  <XIcon />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-white/70 hover:text-white transition-colors hover:bg-white/10 rounded-lg"
                aria-label="Поиск"
              >
                <SearchIcon />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function SearchIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
