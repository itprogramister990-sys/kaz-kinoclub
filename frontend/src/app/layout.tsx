import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import BottomNav from '@/components/BottomNav';

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
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'КиноКлуб',
  },
};

export const viewport = {
  themeColor: '#0f172a',
  viewportFit: 'cover',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-[#0d0d1a] antialiased pb-16 lg:pb-0">
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

            ym(110730294, "init", {
                 clickmap:true,
                 trackLinks:true,
                 accurateTrackBounce:true,
                 webvisor:true
            });
          `}
        </Script>
        <noscript>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://mc.yandex.ru/watch/110730294" style={{ position: 'absolute', left: '-9999px' }} alt="" />
          </div>
        </noscript>
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
