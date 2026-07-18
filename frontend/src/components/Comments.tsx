'use client';

import { useState, useEffect } from 'react';
import { Comment } from '@/lib/types';
import { supabase } from '@/lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';
import Link from 'next/link';

interface CommentsProps {
  movieId: number;
  initialComments: Comment[];
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

function getInitial(name: string) {
  return name ? name.charAt(0).toUpperCase() : '?';
}

const AVATAR_COLORS = [
  'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500',
  'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function Comments({ movieId, initialComments }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!session) {
      setError('Необходима авторизация');
      return;
    }

    if (text.trim().length < 5) {
      setError('Комментарий слишком короткий (минимум 5 символов)');
      return;
    }

    setSubmitting(true);
    try {
      const authorName = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Аноним';

      const { data: newComment, error: insertError } = await supabase
        .from('comments')
        .insert({
          user_name: authorName,
          user_id: session.user.id,
          movie_id: movieId,
          text: text.trim(),
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setComments((prev) => [newComment, ...prev]);
      setText('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Не удалось отправить комментарий');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="comments-section" className="mt-12">
      {/* Header */}
      <h2 className="section-title">
        Комментарии
        <span className="ml-2 text-lg text-white/40 font-normal">({comments.length})</span>
      </h2>

      {/* Comment form */}
      {session ? (
        <div className="glass rounded-2xl p-6 mb-8 animate-slide-up">
          <h3 className="text-white/80 font-semibold mb-4">Оставить отзыв</h3>
          <form onSubmit={handleSubmit} id="comment-form" className="space-y-4">
            <div>
              <label htmlFor="comment-text" className="block text-white/60 text-sm mb-1.5">
                Ваш отзыв
              </label>
              <textarea
                id="comment-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Поделитесь своими впечатлениями о фильме..."
                rows={4}
                maxLength={2000}
                className="input-field resize-none"
                disabled={submitting}
              />
              <p className="text-white/30 text-xs mt-1 text-right">{text.length}/2000</p>
            </div>

            {/* Status messages */}
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
                Комментарий успешно добавлен!
              </div>
            )}

            <button
              type="submit"
              id="submit-comment-btn"
              disabled={submitting}
              className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {submitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Отправка...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Отправить отзыв
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="glass rounded-2xl p-6 mb-8 text-center bg-slate-900/50 border border-slate-800 animate-slide-up">
          <p className="text-slate-300 mb-4">Чтобы оставить комментарий, пожалуйста, войдите в аккаунт.</p>
          <Link href="/login" className="btn-primary inline-flex px-8">Войти в аккаунт</Link>
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-12 text-white/40">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p>Пока нет комментариев. Будьте первым!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <article
              key={comment.id}
              id={`comment-${comment.id}`}
              className="glass rounded-xl p-5 animate-fade-in"
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full ${getAvatarColor(comment.user_name)} flex items-center justify-center shrink-0 font-semibold text-white`}>
                  {getInitial(comment.user_name)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-white text-sm">{comment.user_name}</span>
                    <span className="text-white/30 text-xs">{formatDate(comment.created_at)}</span>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">{comment.text}</p>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
