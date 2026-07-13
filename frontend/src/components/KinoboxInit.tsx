'use client';
import { useEffect } from 'react';

interface KinoboxInitProps {
  imdbId?: string;
  tmdbId?: number | string;
  title?: string;
}

export default function KinoboxInit({ imdbId, tmdbId, title }: KinoboxInitProps) {
  useEffect(() => {
    const initPlayer = () => {
      // @ts-ignore
      if (typeof window !== 'undefined' && window.kinoBox) {
        // @ts-ignore
        window.kinoBox.init({
          selector: '.kinobox_player',
          search: {
            kinopoisk: '',
            imdb: imdbId || '',
            tmdb: tmdbId || '',
            title: title || ''
          }
        });
      } else {
        setTimeout(initPlayer, 300);
      }
    };

    initPlayer();
  }, [imdbId, tmdbId, title]);

  return null;
}
