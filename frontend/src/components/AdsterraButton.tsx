'use client';

export default function AdsterraButton() {
  const handleClick = () => {
    // Принудительно открываем рекламную смартлинку в соседней новой вкладке (зарабатываем деньги)
    window.open('https://www.effectivecpmnetwork.com/e0pznwz36u?key=ad93782941cf93ba779cb2b526d7e68d', '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg mb-4 animate-pulse transition duration-300 shadow-lg text-center"
    >
      🚀 Разблокировать Стриминг HD 1080p / Выбрать озвучку
    </button>
  );
}
