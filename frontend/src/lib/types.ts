// Типы данных для всего приложения

export interface Movie {
  id: number;
  title: string;
  description: string;
  poster_url: string;
  partner_link: string;
  genre: string;
  year: number;
  rating: number;
  release_date?: string | null;
}

export interface Comment {
  id: number;
  user_name: string;
  text: string;
  created_at: string;
  movie_id?: number;
}

export interface MoviesResponse {
  movies: Movie[];
  total: number;
}

export interface CommentsResponse {
  comments: Comment[];
  total: number;
}
