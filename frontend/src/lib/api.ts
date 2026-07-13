import { Movie, MoviesResponse, Comment, CommentsResponse } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://onrender.com';

// ─── Movies ──────────────────────────────────────────────────────────────────

export async function fetchMovies(query?: string, genres?: string, page?: number, years?: string): Promise<MoviesResponse> {
  let url = `${API_BASE}/api/movies`;
  const params = new URLSearchParams();
  if (query) params.append('q', query);
  if (genres) params.append('genres', genres);
  if (page) params.append('page', page.toString());
  if (years) params.append('years', years);
  
  const queryString = params.toString();
  if (queryString) url += `?${queryString}`;

  const res = await fetch(url, { next: { revalidate: 43200 } });

  if (!res.ok) {
    throw new Error(`Ошибка загрузки фильмов: ${res.status}`);
  }

  return res.json();
}

export async function fetchTopMovies(): Promise<MoviesResponse> {
  const url = `${API_BASE}/api/movies/top`;
  const res = await fetch(url, { next: { revalidate: 43200 } });

  if (!res.ok) {
    throw new Error(`Ошибка загрузки топ фильмов: ${res.status}`);
  }

  return res.json();
}

export async function fetchMovie(id: number | string): Promise<Movie> {
  const res = await fetch(`${API_BASE}/api/movies/${id}`, {
    next: { revalidate: 43200 },
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
