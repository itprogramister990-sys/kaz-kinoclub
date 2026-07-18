import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-[#0d0d1a]">
      <div className="text-center animate-fade-in">
        {/* Big 404 */}
        <div className="relative mb-6">
          <p className="font-display font-black text-[120px] md:text-[180px] text-white/5 leading-none select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-5xl mb-2">🎬</p>
              <p className="font-display font-bold text-xl text-white">Фильм не найден</p>
            </div>
          </div>
        </div>

        <p className="text-white/50 mb-8 max-w-sm mx-auto">
          Похоже, этот фильм исчез из нашей коллекции. Возможно, он скрылся за горизонтом...
        </p>

        <Link
          href="/"
          className="btn-primary inline-flex"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Вернуться на главную
        </Link>
      </div>
    </main>
  );
}
