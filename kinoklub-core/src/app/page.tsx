export default function Home() {
  return (
    <main className="min-h-screen pt-20">
      
      <section className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[80vh] text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Добро пожаловать в <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Kinoklub</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10">
          Смотрите лучшие фильмы и сериалы в высоком качестве. Присоединяйтесь к нашему клубу сегодня!
        </p>
        <div className="flex gap-4">
          <button className="px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg hover:shadow-blue-500/50 hover:-translate-y-1">
            Начать просмотр
          </button>
          <button className="px-8 py-4 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all border border-slate-700 hover:border-slate-500">
            Подробнее
          </button>
        </div>
      </section>
    </main>
  );
}
