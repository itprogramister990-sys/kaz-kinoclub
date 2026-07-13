import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'КиноКлуб — Смотреть фильмы, официальные трейлеры и отзывы',
  description: 'Удобный международный онлайн-кинокаталог. Актуальные мировые премьеры, легальные трейлеры, честные рейтинги от зрителей и обсуждения любимых фильмов в кругу единомышленников.',
  keywords: 'киноклуб, смотреть фильмы, трейлеры онлайн, топ 100 фильмов, кино отзывы, новинки кино',
  openGraph: {
    title: 'КиноКлуб',
    description: 'Удобный международный онлайн-кинокаталог',
    siteName: 'КиноКлуб',
    locale: 'ru_RU',
    type: 'website',
  },
  verification: {
    google: 'WuCUsJM09tzTtDSvo9x-Lz0jJUH-zlsTd-3qYAE9J7I',
    yandex: 'mo8hlt1fyd84dj9j',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <script src="https://kinobox.tv/kinobox.min.js" defer></script>
      </head>
      <body className="min-h-screen bg-[#0d0d1a] antialiased">
        {children}
      </body>
    </html>
  );
}
