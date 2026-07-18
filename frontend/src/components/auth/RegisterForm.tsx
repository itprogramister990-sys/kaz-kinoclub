'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { PasswordInput } from './PasswordInput';
import { Loader2, MailCheck } from 'lucide-react';
import Link from 'next/link';

export function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
        }
      });

      if (error) {
        // Handle specific supabase errors
        if (error.message.includes('User already registered') || error.message.includes('already exists')) {
          setError('Этот email уже зарегистрирован. Попробуйте войти или восстановить пароль');
        } else {
          setError(error.message);
        }
      } else {
        // Success
        if (data.user?.identities?.length === 0) {
          // This happens if the user already existed but implicit signup returned no identities
          setError('Этот email уже зарегистрирован. Попробуйте войти или восстановить пароль');
        } else if (data.session) {
          // If auto-confirm is enabled, session will be returned immediately
          window.location.href = '/';
        } else {
          // Email confirmation required
          setIsEmailSent(true);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="w-full max-w-md p-8 rounded-3xl backdrop-blur-xl bg-slate-950/60 border border-slate-700/50 shadow-2xl animate-in fade-in zoom-in duration-300 text-center">
        <div className="flex justify-center mb-6 text-green-400">
          <MailCheck size={64} />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-white">Проверьте почту</h2>
        <p className="text-slate-400 mb-6">
          Письмо с подтверждением отправлено на <strong>{email}</strong>. Пожалуйста, перейдите по ссылке в письме, чтобы завершить регистрацию.
        </p>
        <button
          onClick={() => router.push('/')}
          className="w-full py-3 flex justify-center items-center rounded-xl border border-slate-700 hover:bg-slate-800 text-white font-medium transition-colors"
        >
          Вернуться на главную
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-8 rounded-3xl backdrop-blur-xl bg-slate-950/60 border border-slate-700/50 shadow-2xl animate-in fade-in zoom-in duration-300">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2 text-white">Создать аккаунт</h2>
        <p className="text-slate-400">Присоединяйтесь к КиноКлубу</p>
      </div>

      <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl flex gap-3 text-sm text-purple-200">
        <svg className="w-5 h-5 shrink-0 mt-0.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>
          <strong>Внимание:</strong> Если у вас возникла ошибка при регистрации (например, на Smart TV), пожалуйста, зарегистрируйтесь с телефона или компьютера, а затем просто войдите в свой аккаунт на этом устройстве.
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
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
            placeholder="Придумайте пароль"
            required
            disabled={isLoading}
            showStrength={true}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Подтвердите пароль</label>
          <PasswordInput
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Повторите пароль"
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
          className="w-full py-3 mt-4 flex justify-center items-center rounded-xl bg-brand-gradient hover:shadow-glow-red text-white font-semibold transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Зарегистрироваться"}
        </button>
      </form>
      
      <div className="mt-6 text-center text-sm text-slate-400">
        Уже есть аккаунт?{" "}
        <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
          Войти
        </Link>
      </div>
    </div>
  );
}
