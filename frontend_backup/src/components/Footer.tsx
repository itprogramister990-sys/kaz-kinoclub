export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-20 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-brand-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-display font-black">К</span>
              </div>
              <span className="font-display font-black text-lg text-white">
                Кино<span className="text-gradient-red">Клуб</span> Казахстан
              </span>
            </div>
            <p className="text-white/40 text-sm">
              Легальное сообщество любителей кино в Казахстане.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white/70 font-semibold mb-3 text-sm uppercase tracking-wider">Разделы</h4>
            <ul className="space-y-2">
              {['Главная', 'Все фильмы', 'Топ рейтинга', 'Новинки'].map((item) => (
                <li key={item}>
                  <a href="/" className="text-white/40 hover:text-white/80 text-sm transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white/70 font-semibold mb-3 text-sm uppercase tracking-wider">Информация</h4>
            <p className="text-white/40 text-sm leading-relaxed">
              Все ссылки на фильмы ведут на легальные платформы.
              КиноКлуб Казахстан не хранит и не распространяет нелицензионный контент.
            </p>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            © 2024 КиноКлуб Казахстан. Только легальный контент.
          </p>
          <div className="flex items-center gap-1 text-white/30 text-xs">
            <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Защита от XSS и SQL-инъекций
          </div>
        </div>
      </div>
    </footer>
  );
}
