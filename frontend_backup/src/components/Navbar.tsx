'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import SearchBar from './SearchBar';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-transparent backdrop-blur-sm" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-wrap items-center justify-between gap-y-4">
          
          {/* Logo & Hamburger */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-white/80 hover:text-white p-2 -ml-2"
              aria-label="Открыть меню"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            <Link href="/" className="flex items-center gap-2 group shrink-0" onClick={() => setIsOpen(false)}>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-brand-gradient rounded-lg flex items-center justify-center shadow-glow-red group-hover:scale-110 transition-transform">
                <span className="text-white font-display font-black text-lg md:text-xl">К</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-display font-black text-lg md:text-xl text-white">
                  Кино<span className="text-gradient-red">Клуб</span>
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav links */}
          <div className="hidden lg:flex items-center gap-6 flex-wrap justify-center">
            <Link href="/" className="text-white/80 hover:text-white transition-colors text-sm font-medium">Главная</Link>
            <Link href="/top" className="text-brand-red hover:text-red-400 transition-colors text-sm font-bold flex items-center gap-1">
              Топ-100
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            </Link>
            <Link href="/genre/drama" className="text-white/80 hover:text-white transition-colors text-sm font-medium">Драмы</Link>
            <Link href="/genre/fiction" className="text-white/80 hover:text-white transition-colors text-sm font-medium">Фантастика</Link>
            <Link href="/genre/action" className="text-white/80 hover:text-white transition-colors text-sm font-medium">Боевики</Link>
            <Link href="/genre/comedy" className="text-white/80 hover:text-white transition-colors text-sm font-medium">Комедии</Link>
            <Link href="/genre/horror" className="text-white/80 hover:text-white transition-colors text-sm font-medium">Ужасы</Link>
            <Link href="/genre/cartoon" className="text-white/80 hover:text-white transition-colors text-sm font-medium">Мультфильмы</Link>
          </div>

          {/* SearchBar */}
          <div className="w-full lg:w-auto flex-1 lg:flex-none lg:min-w-[300px] shrink-0 order-last lg:order-none">
            <Suspense fallback={<div className="h-10 animate-pulse bg-white/5 rounded-lg w-full"></div>}>
              <SearchBar />
            </Suspense>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-[#0d0d1a]/95 backdrop-blur-xl border-b border-white/10 p-5 flex flex-col gap-5 animate-slide-up shadow-2xl">
            <Link href="/" onClick={() => setIsOpen(false)} className="text-white hover:text-brand-red transition-colors text-lg font-medium">Главная</Link>
            <Link href="/top" onClick={() => setIsOpen(false)} className="text-brand-red hover:text-red-400 transition-colors text-lg font-bold flex items-center gap-1">
              Топ-100
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            </Link>
            <div className="h-px bg-white/10 w-full my-1"></div>
            <Link href="/genre/drama" onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors text-base font-medium">Драмы</Link>
            <Link href="/genre/fiction" onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors text-base font-medium">Фантастика</Link>
            <Link href="/genre/action" onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors text-base font-medium">Боевики</Link>
            <Link href="/genre/comedy" onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors text-base font-medium">Комедии</Link>
            <Link href="/genre/horror" onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors text-base font-medium">Ужасы</Link>
            <Link href="/genre/cartoon" onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors text-base font-medium">Мультфильмы</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
