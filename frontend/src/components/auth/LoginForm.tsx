'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { PasswordInput } from './PasswordInput';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Неверный email или пароль');
        } else {
          setError(error.message);
        }
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err: any) {
      setError('Произошла ошибка при входе');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/` : undefined,
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError('Ошибка при входе через Google');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-3xl backdrop-blur-xl bg-slate-950/60 border border-slate-700/50 shadow-2xl animate-in fade-in zoom-in duration-300">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2 text-white">С возвращением</h2>
        <p className="text-slate-400">Войдите, чтобы продолжить в Kinoklub</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
            placeholder="name@example.com"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Пароль</label>
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={isLoading}
            showStrength={false}
          />
        </div>

        {error && (
          <div className="text-red-400 text-sm text-center animate-in slide-in-from-top-1 bg-red-400/10 py-2 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 mt-2 flex justify-center items-center rounded-xl bg-brand-gradient hover:shadow-glow-red text-white font-semibold transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Войти"}
        </button>
      </form>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-700/50"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-[#0d0d1a] text-slate-400">Или продолжите через</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-medium transition-all transform hover:scale-[1.02] shadow-md disabled:opacity-50 disabled:hover:scale-100"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        <span>Войти через Google</span>
      </button>

      <p className="text-center text-sm text-slate-400 mt-6">
        Нет аккаунта?{" "}
        <Link href="/register" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
          Создать аккаунт
        </Link>
      </p>
    </div>
  );
}
