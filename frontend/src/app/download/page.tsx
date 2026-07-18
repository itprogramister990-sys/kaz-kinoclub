"use client";

import { usePWAInstall } from "@/hooks/usePWAInstall";
import { Monitor, Smartphone, CheckCircle2, Info, Tv } from "lucide-react";
import { useState } from "react";

export default function DownloadPage() {
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();
  const [showToast, setShowToast] = useState(false);

  const handleDesktopDownload = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen pt-24 px-4 flex items-center justify-center bg-[#0d0d1a] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      
      <div className="relative w-full max-w-4xl grid md:grid-cols-2 gap-8 z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Info Column */}
        <div className="flex flex-col justify-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse"></span>
            <span className="text-xs font-medium text-slate-300 uppercase tracking-wider">Доступно везде</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
            Смотрите Kino<span className="text-brand-red">Klub</span> на любом устройстве
          </h1>
          
          <p className="text-lg text-slate-400">
            Установите наше приложение, чтобы получить быстрый доступ к фильмам прямо с рабочего стола или домашнего экрана вашего смартфона.
          </p>

          {!isInstallable && !isInstalled && (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-200">
              <Info className="w-6 h-6 shrink-0 text-blue-400" />
              <p className="text-sm">
                Если вы используете iOS Safari, нажмите кнопку «Поделиться» и выберите «На экран &quot;Домой&quot;», чтобы установить приложение.
              </p>
            </div>
          )}
        </div>

        {/* Cards Column */}
        <div className="flex flex-col gap-6">
          
          {/* Mobile/PWA Card */}
          <div className="p-6 md:p-8 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-700/50 shadow-[0_0_40px_rgba(0,0,0,0.3)] relative overflow-hidden group hover:border-purple-500/50 transition-colors">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Smartphone className="w-24 h-24 text-purple-400" />
            </div>
            
            <div className="relative z-10">
              <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/30">
                <Smartphone className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Для смартфона</h2>
              <p className="text-slate-400 mb-6 text-sm">
                Легкое веб-приложение (PWA). Не занимает много места и обновляется автоматически.
              </p>

              {isInstalled ? (
                <div className="flex items-center gap-2 text-green-400 font-medium bg-green-500/10 w-fit px-4 py-2 rounded-xl border border-green-500/20">
                  <CheckCircle2 className="w-5 h-5" />
                  Приложение установлено
                </div>
              ) : (
                <button
                  onClick={promptInstall}
                  disabled={!isInstallable}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-purple-500/25 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Smartphone className="w-5 h-5" />
                  Установить на телефон
                </button>
              )}
            </div>
          </div>

          {/* Desktop/Tauri Card */}
          <div className="p-6 md:p-8 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-700/50 shadow-[0_0_40px_rgba(0,0,0,0.3)] relative overflow-hidden group hover:border-brand-red/50 transition-colors">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Monitor className="w-24 h-24 text-brand-red" />
            </div>
            
            <div className="relative z-10">
              <div className="w-12 h-12 bg-brand-red/20 rounded-2xl flex items-center justify-center mb-6 border border-brand-red/30">
                <Monitor className="w-6 h-6 text-brand-red" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Для ПК (Windows)</h2>
              <p className="text-slate-400 mb-6 text-sm">
                Полноценное десктопное приложение. Максимальная производительность и интеграция с ОС.
              </p>

              <button
                onClick={handleDesktopDownload}
                className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all flex items-center gap-2 relative overflow-hidden group-hover:border-brand-red/30"
              >
                <Monitor className="w-5 h-5" />
                Скачать для ПК (.exe)
              </button>
            </div>
          </div>

          {/* Smart TV Card */}
          <div className="p-6 md:p-8 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-700/50 shadow-[0_0_40px_rgba(0,0,0,0.3)] relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Tv className="w-24 h-24 text-emerald-400" />
            </div>
            
            <div className="relative z-10">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/30">
                <Tv className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Smart TV (Android / WebOS)</h2>
              <p className="text-slate-400 mb-6 text-sm">
                Оптимизировано для браузеров LG WebOS и Tizen. Для Android TV скачайте установочный файл.
              </p>

              <button
                onClick={handleDesktopDownload}
                className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all flex items-center gap-2 relative overflow-hidden group-hover:border-emerald-500/30"
              >
                <Tv className="w-5 h-5" />
                Скачать для Android TV (.apk)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification for Desktop App */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="px-6 py-3 rounded-2xl bg-slate-800/90 backdrop-blur-md border border-slate-700 shadow-2xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
            <span className="text-white font-medium text-sm">
              Сборка для Windows в процессе компиляции... 🛠
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
