"use client";

import { signIn } from "next-auth/react";
import { X, Loader2 } from "lucide-react";
import { useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function AuthModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  
  const router = useRouter();

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!turnstileToken) {
      setError("Пожалуйста, пройдите проверку на бота");
      return;
    }

    if (password.length < 4) {
      setError("Пароль слишком короткий");
      return;
    }

    setIsLoading(true);

    try {
      const res = await signIn("credentials", { 
        email, 
        password, 
        redirect: false 
      });

      if (res?.error) {
        setError("Неверный email или пароль");
      } else {
        router.refresh();
        onClose();
      }
    } catch (err) {
      setError("Произошла ошибка при входе");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-8 rounded-3xl backdrop-blur-xl bg-slate-950/60 border border-slate-700/50 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors disabled:opacity-50"
          disabled={isLoading}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2 text-white">С возвращением</h2>
          <p className="text-slate-400">Войдите, чтобы продолжить в Kinoklub</p>
        </div>

        <form onSubmit={handleCredentialsLogin} className="space-y-4 mb-6">
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
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>

          {/* Turnstile Integration */}
          <div className="flex justify-center my-4 min-h-[65px]">
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"} // dummy key for testing
              onSuccess={(token) => setTurnstileToken(token)}
              onError={() => setError("Ошибка проверки анти-бот")}
              options={{
                theme: 'dark'
              }}
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center animate-in slide-in-from-top-1 bg-red-400/10 py-2 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !turnstileToken}
            className="w-full py-3 flex justify-center items-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-purple-500/25 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Войти"}
          </button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700/50"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-slate-950/60 text-slate-400">Или продолжите через</span>
          </div>
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-2 py-3 mb-6 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-medium transition-all transform hover:scale-[1.02] shadow-md disabled:opacity-50 disabled:hover:scale-100"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span>Войти через Google</span>
        </button>

        <p className="text-center text-sm text-slate-400">
          Нет аккаунта?{" "}
          <Link 
            href="/register" 
            onClick={onClose}
            className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
          >
            Создать аккаунт
          </Link>
        </p>
      </div>
    </div>
  );
}
