"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Turnstile } from "@marsidev/react-turnstile";
import { Loader2, Mail } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!turnstileToken) {
      setError("Пожалуйста, пройдите проверку на бота");
      return;
    }

    if (password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          turnstileToken,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Ошибка при регистрации");
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || "Произошла ошибка при регистрации");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center bg-[#0d0d1a] relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
        
        <div className="relative w-full max-w-md p-8 rounded-3xl backdrop-blur-xl bg-slate-950/60 border border-slate-700/50 shadow-[0_0_40px_rgba(0,0,0,0.5)] z-10 animate-in fade-in zoom-in duration-300 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mb-6">
            <Mail className="w-10 h-10 text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-white">Проверьте почту</h1>
          <p className="text-slate-400 mb-8">
            Ссылка для подтверждения отправлена на <span className="text-white font-medium">{email}</span>. Пожалуйста, перейдите по ней для активации аккаунта.
          </p>
          <Link 
            href="/"
            className="w-full py-3 flex justify-center items-center rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
          >
            На главную
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 flex items-center justify-center bg-[#0d0d1a] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
      
      <div className="relative w-full max-w-md p-8 rounded-3xl backdrop-blur-xl bg-slate-950/60 border border-slate-700/50 shadow-[0_0_40px_rgba(0,0,0,0.5)] z-10 animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">Создать аккаунт</h1>
          <p className="text-slate-400">Присоединяйтесь к Kinoklub</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Имя</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
              placeholder="Иван Иванов"
              required
              disabled={isLoading}
            />
          </div>
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

          <div className="flex justify-center my-4 min-h-[65px]">
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"}
              onSuccess={(token) => setTurnstileToken(token)}
              onError={() => setError("Ошибка проверки анти-бот")}
              options={{ theme: 'dark' }}
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
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Зарегистрироваться"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400">
          Уже есть аккаунт?{" "}
          <Link 
            href="/"
            className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
          >
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}
