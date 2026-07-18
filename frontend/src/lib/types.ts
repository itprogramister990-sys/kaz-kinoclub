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
  youtube_key?: string;
  imdb_id?: string;
}

export interface Comment {
  id: string;
  user_name?: string;
  text: string;
  created_at: string;
  movie_id?: number | string;
  user_id?: string;
  parent_id?: string | null;
}

export interface MoviesResponse {
  movies: Movie[];
  total: number;
}

export interface CommentsResponse {
  comments: Comment[];
  total: number;
}
