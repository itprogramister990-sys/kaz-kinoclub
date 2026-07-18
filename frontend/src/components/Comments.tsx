'use client';

import { useState, useEffect } from 'react';
import { Comment } from '@/lib/types';
import { supabase } from '@/lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';
import Link from 'next/link';

interface CommentsProps {
  movieId: number;
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

function getInitial(name?: string) {
  return name ? name.charAt(0).toUpperCase() : '?';
}

const AVATAR_COLORS = [
  'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500',
  'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
];

function getAvatarColor(name?: string) {
  if (!name) return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function Comments({ movieId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // States for Reply and Edit
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  // 1. Загрузка сессии и профиля
  useEffect(() => {
    async function loadAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) checkAdmin(session.user.id);
    }

    loadAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) checkAdmin(session.user.id);
      else setIsAdmin(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdmin = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('role').eq('id', userId).single();
    if (data && data.role === 'admin') {
      setIsAdmin(true);
    }
  };

  // 2. Загрузка комментариев
  const fetchComments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('comments')
      .select('*, profiles(full_name)')
      .eq('movie_id', String(movieId))
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Ошибка загрузки комментариев', error);
    } else if (data) {
      const mappedComments: Comment[] = data.map((c: any) => ({
        id: c.id,
        user_name: c.profiles?.full_name || 'Аноним',
        text: c.content,
        created_at: c.created_at,
        movie_id: c.movie_id,
        user_id: c.user_id,
        parent_id: c.parent_id,
      }));
      setComments(mappedComments);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, [movieId]);

  // 3. Отправка нового комментария или ответа
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
      const { error: insertError } = await supabase
        .from('comments')
        .insert({
          user_id: session.user.id,
          movie_id: String(movieId),
          content: text.trim(),
          parent_id: replyingTo, // null если это обычный комментарий
        });

      if (insertError) throw insertError;

      setText('');
      setReplyingTo(null);
      setSuccess(true);
      fetchComments(); // Перезагружаем
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Не удалось отправить комментарий');
    } finally {
      setSubmitting(false);
    }
  };

  // 4. Сохранение изменений (Редактирование)
  const handleSaveEdit = async (commentId: string) => {
    if (editText.trim().length < 5) return;
    
    try {
      const { error } = await supabase
        .from('comments')
        .update({ content: editText.trim() })
        .eq('id', commentId);

      if (error) throw error;
      setEditingId(null);
      fetchComments();
    } catch (err: any) {
      alert('Ошибка при редактировании: ' + err.message);
    }
  };

  // 5. Удаление комментария
  const handleDelete = async (commentId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот комментарий?')) return;
    
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
      fetchComments();
    } catch (err: any) {
      alert('Ошибка при удалении: ' + err.message);
    }
  };

  // 6. Группировка: Родительские комментарии и их ответы
  const parentComments = comments.filter(c => !c.parent_id);
  const getReplies = (parentId: string) => comments.filter(c => c.parent_id === parentId).reverse(); // Сначала старые ответы

  // 7. Форма ввода (переиспользуемая для ответов)
  const renderForm = (isReply = false) => (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in mt-4">
      <div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isReply ? "Написать ответ..." : "Поделитесь своими впечатлениями о фильме..."}
          rows={3}
          maxLength={2000}
          className="input-field resize-none"
          disabled={submitting}
        />
        <p className="text-white/30 text-xs mt-1 text-right">{text.length}/2000</p>
      </div>

      {error && !isReply && (
        <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">{error}</div>
      )}

      {success && !isReply && (
        <div className="text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3">Успешно добавлено!</div>
      )}

      <div className="flex gap-2">
        <button type="submit" disabled={submitting} className="btn-primary w-full md:w-auto">
          {submitting ? "Отправка..." : "Отправить"}
        </button>
        {isReply && (
          <button type="button" onClick={() => setReplyingTo(null)} className="btn-secondary w-full md:w-auto">
            Отмена
          </button>
        )}
      </div>
    </form>
  );

  // 8. Рендер одиночного комментария
  const renderComment = (comment: Comment, isReply = false) => {
    const isOwner = session?.user?.id === comment.user_id;
    const canDelete = isOwner || isAdmin;
    const canEdit = isOwner; // Админ может удалять, но не редактировать чужие (по логике)

    return (
      <article key={comment.id} id={`comment-${comment.id}`} className={`glass rounded-xl p-5 ${isReply ? 'ml-8 md:ml-12 border-l-4 border-l-brand-red/50' : 'animate-fade-in'}`}>
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-full ${getAvatarColor(comment.user_name)} flex items-center justify-center shrink-0 font-semibold text-white`}>
            {getInitial(comment.user_name)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white text-sm">
                  {comment.user_name}
                  {isAdmin && comment.user_id === session?.user?.id && <span className="ml-2 text-[10px] bg-brand-red text-white px-2 py-0.5 rounded-full">Admin</span>}
                </span>
                <span className="text-white/30 text-xs">{formatDate(comment.created_at)}</span>
              </div>
              
              {/* Context menu / Actions */}
              {(canEdit || canDelete || session) && (
                <div className="flex items-center gap-2 text-xs text-white/40">
                  {session && !isReply && (
                    <button onClick={() => { setReplyingTo(comment.id); setText(''); }} className="hover:text-brand-red transition-colors">Ответить</button>
                  )}
                  {canEdit && (
                    <button onClick={() => { setEditingId(comment.id); setEditText(comment.text); }} className="hover:text-white transition-colors">Изменить</button>
                  )}
                  {canDelete && (
                    <button onClick={() => handleDelete(comment.id)} className="hover:text-red-400 transition-colors">Удалить</button>
                  )}
                </div>
              )}
            </div>

            {/* Content or Edit Form */}
            {editingId === comment.id ? (
              <div className="mt-2 space-y-2">
                <textarea 
                  value={editText} 
                  onChange={(e) => setEditText(e.target.value)} 
                  className="input-field resize-none w-full" 
                  rows={2} 
                />
                <div className="flex gap-2">
                  <button onClick={() => handleSaveEdit(comment.id)} className="btn-primary py-1 px-3 text-xs">Сохранить</button>
                  <button onClick={() => setEditingId(null)} className="btn-secondary py-1 px-3 text-xs">Отмена</button>
                </div>
              </div>
            ) : (
              <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{comment.text}</p>
            )}

            {/* Форма ответа под комментарием */}
            {replyingTo === comment.id && !isReply && renderForm(true)}
          </div>
        </div>
      </article>
    );
  };

  return (
    <section id="comments-section" className="mt-12">
      <h2 className="section-title">
        Комментарии
        <span className="ml-2 text-lg text-white/40 font-normal">({comments.length})</span>
      </h2>

      {session ? (
        !replyingTo && (
          <div className="glass rounded-2xl p-6 mb-8 animate-slide-up">
            <h3 className="text-white/80 font-semibold mb-2">Оставить отзыв</h3>
            {renderForm(false)}
          </div>
        )
      ) : (
        <div className="glass rounded-2xl p-6 mb-8 text-center bg-slate-900/50 border border-slate-800 animate-slide-up">
          <p className="text-slate-300 mb-4">Чтобы оставить комментарий, пожалуйста, войдите в аккаунт.</p>
          <Link href="/login" className="btn-primary inline-flex px-8">Войти в аккаунт</Link>
        </div>
      )}

      {/* Список комментариев */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-12 text-white/40">Загрузка комментариев...</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 text-white/40">Пока нет комментариев. Будьте первым!</div>
        ) : (
          parentComments.map(parent => (
            <div key={parent.id} className="space-y-4">
              {renderComment(parent)}
              
              {/* Рендер ответов под родителем */}
              {getReplies(parent.id).length > 0 && (
                <div className="space-y-4 mt-2">
                  {getReplies(parent.id).map(reply => renderComment(reply, true))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
