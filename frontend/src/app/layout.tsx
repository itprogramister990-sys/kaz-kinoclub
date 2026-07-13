import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'КиноКлуб Казахстан — Легальное кино сообщество',
  description: 'Откройте для себя лучшие фильмы вместе с казахстанским сообществом любителей кино. Легальный просмотр, обсуждения, рейтинги.',
  keywords: 'кино, Казахстан, фильмы, легальное, сообщество, КиноКлуб',
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
