'use client';

import { open } from '@tauri-apps/plugin-shell';

interface Props {
  movieTitle?: string;
}

export default function AdsterraButton({ movieTitle }: Props) {
  const handleClick = async () => {
    try {
      // 1. Открываем нашу рекламную смартлинку Adsterra через Tauri API в браузере по умолчанию
      await open('https://www.effectivecpmnetwork.com/e0pznwz36u?key=ad93782941cf93ba779cb2b526d7e68d');
      
      // 2. Перенаправляем текущее окно (target="_self") на поиск
      if (movieTitle) {
        window.location.href = `https://www.kinopoisk.ru/index.php?kp_query=${encodeURIComponent(movieTitle)}`;
      }
    } catch (err) {
      console.warn("Tauri shell open failed, falling back to window.open", err);
      // Fallback for regular web browsers
      window.open('https://www.effectivecpmnetwork.com/e0pznwz36u?key=ad93782941cf93ba779cb2b526d7e68d', '_self');
      if (movieTitle) {
        window.location.href = `https://www.kinopoisk.ru/index.php?kp_query=${encodeURIComponent(movieTitle)}`;
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg mb-4 animate-pulse transition duration-300 shadow-lg text-center"
    >
      🍿 Смотреть фильм на Кинопоиске (Поддержите автора)
    </button>
  );
}
