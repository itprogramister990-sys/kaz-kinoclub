'use client';

export default function AdsterraButton() {
  const handleClick = () => {
    // Принудительно открываем рекламную смартлинку в соседней новой вкладке (зарабатываем деньги)
    window.open('https://www.effectivecpmnetwork.com/e0pznwz36u?key=ad93782941cf93ba779cb2b526d7e68d', '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center justify-center gap-3 bg-red-600 text-white font-black text-lg md:text-xl px-6 py-5 rounded-2xl hover:bg-red-500 transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(220,38,38,0.5)] animate-pulse"
    >
      🚀 Включить Fast-Stream / Выбрать озвучку (1080p Full HD)
    </button>
  );
}
