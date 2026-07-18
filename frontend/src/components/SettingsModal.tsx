'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
}

export function SettingsModal({ isOpen, onClose, session }: SettingsModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !session) return null;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-[#0d0d1a] border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-2xl font-bold text-white">Профиль и Настройки</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          
          {/* Profile Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-300 mb-4">Мой профиль</h3>
            <div className="flex items-center gap-6 p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                {session.user?.user_metadata?.avatar_url ? (
                  <img src={session.user.user_metadata.avatar_url} alt="User avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-slate-300">
                    {session.user?.user_metadata?.full_name?.[0]?.toUpperCase() || session.user?.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">
                  {session.user?.user_metadata?.full_name || 'Пользователь'}
                </h4>
                <p className="text-slate-400">{session.user?.email}</p>
                <div className="mt-2 text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-md inline-block border border-purple-500/30">
                  Участник КиноКлуба
                </div>
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div>
            <h3 className="text-lg font-semibold text-slate-300 mb-4">Параметры</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex justify-between items-center hover:border-slate-700 transition-colors cursor-pointer group">
                <div>
                  <h4 className="text-white font-medium group-hover:text-purple-400 transition-colors">Настройки аккаунта</h4>
                  <p className="text-sm text-slate-400">Управление паролем и безопасностью</p>
                </div>
                <div className="text-slate-500 group-hover:text-purple-400 transition-colors">→</div>
              </div>
              
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex justify-between items-center hover:border-slate-700 transition-colors cursor-pointer group">
                <div>
                  <h4 className="text-white font-medium group-hover:text-purple-400 transition-colors">Уведомления</h4>
                  <p className="text-sm text-slate-400">Настройка email рассылок и новинок</p>
                </div>
                <div className="text-slate-500 group-hover:text-purple-400 transition-colors">→</div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/30 flex justify-end">
          <button
            onClick={handleSignOut}
            className="px-6 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors font-medium"
          >
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </div>
  );
}
