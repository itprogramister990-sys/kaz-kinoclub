import { Movie, MoviesResponse, Comment, CommentsResponse } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// ─── Movies ──────────────────────────────────────────────────────────────────

export async function fetchMovies(query?: string): Promise<MoviesResponse> {
  const url = query
    ? `${API_BASE}/api/movies?q=${encodeURIComponent(query)}`
    : `${API_BASE}/api/movies`;

  const res = await fetch(url, { next: { revalidate: 60 } });

  if (!res.ok) {
    throw new Error(`Ошибка загрузки фильмов: ${res.status}`);
  }

  return res.json();
}

export async function fetchMovie(id: number | string): Promise<Movie> {
  const res = await fetch(`${API_BASE}/api/movies/${id}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    if (res.status === 404) throw new Error('Фильм не найден');
    throw new Error(`Ошибка загрузки фильма: ${res.status}`);
  }

  return res.json();
}

// ─── Comments ────────────────────────────────────────────────────────────────

export async function fetchComments(movieId: number | string): Promise<CommentsResponse> {
  const res = await fetch(`${API_BASE}/api/comments/${movieId}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Ошибка загрузки комментариев: ${res.status}`);
  }

  return res.json();
}

export async function postComment(data: {
  user_name: string;
  movie_id: number;
  text: string;
}): Promise<Comment> {
  const res = await fetch(`${API_BASE}/api/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Ошибка отправки комментария: ${res.status}`);
  }

  return res.json();
}
