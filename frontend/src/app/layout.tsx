import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'КиноКлуб Казахстан — Смотреть фильмы легально, трейлеры и отзывы',
  description: 'Удобный онлайн-кинокаталог для жителей Казахстана. Актуальные мировые премьеры, трейлеры, честные рейтинги и обсуждения любимых фильмов.',
  keywords: 'киноклуб, фильмы казахстан, смотреть кино, трейлеры онлайн, топ 100 фильмов',
  openGraph: {
    title: 'КиноКлуб Казахстан',
    description: 'Легальное кино сообщество Казахстана',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-[#0d0d1a] antialiased">
        {children}
      </body>
    </html>
  );
}
