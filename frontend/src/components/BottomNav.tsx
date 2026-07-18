'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Trophy, Search, User, Tv } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';

export default function BottomNav() {
  const pathname = usePathname();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Hide BottomNav on desktop
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0d0d1a]/95 backdrop-blur-xl border-t border-white/10 pb-[env(safe-area-inset-bottom)]">
      <nav className="flex justify-around items-center h-16 px-2">
        <Link 
          href="/" 
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${pathname === '/' ? 'text-brand-red' : 'text-slate-400 hover:text-white transition-colors'}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Главная</span>
        </Link>
        
        <Link 
          href="/top" 
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${pathname === '/top' ? 'text-brand-red' : 'text-slate-400 hover:text-white transition-colors'}`}
        >
          <Trophy className="w-5 h-5" />
          <span className="text-[10px] font-medium">Топ-100</span>
        </Link>

        <Link 
          href="/search-results?q=" 
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${pathname === '/search-results' ? 'text-brand-red' : 'text-slate-400 hover:text-white transition-colors'}`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-medium">Поиск</span>
        </Link>

        <Link 
          href="/device" 
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${pathname === '/device' ? 'text-purple-400' : 'text-slate-400 hover:text-purple-400 transition-colors'}`}
        >
          <Tv className="w-5 h-5" />
          <span className="text-[10px] font-medium">Код ТВ</span>
        </Link>

        <Link 
          href="/login" 
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${pathname === '/login' || pathname === '/profile' ? 'text-brand-red' : 'text-slate-400 hover:text-white transition-colors'}`}
        >
          {session?.user?.user_metadata?.avatar_url ? (
            <img src={session.user.user_metadata.avatar_url} alt="Profile" className="w-5 h-5 rounded-full object-cover border border-slate-700" />
          ) : (
            <User className="w-5 h-5" />
          )}
          <span className="text-[10px] font-medium">{session ? 'Профиль' : 'Войти'}</span>
        </Link>
      </nav>
    </div>
  );
}
