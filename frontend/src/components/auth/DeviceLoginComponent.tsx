'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Loader2, Tv, Smartphone, RefreshCw, CheckCircle2 } from 'lucide-react';

export function DeviceLoginComponent() {
  const [code, setCode] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [status, setStatus] = useState<'generating' | 'waiting' | 'success' | 'error'>('generating');
  const [errorMsg, setErrorMsg] = useState('');

  const generateAndSubscribe = async () => {
    setStatus('generating');
    setErrorMsg('');
    
    // 1. Generate unique device ID and a 6-digit code
    const newDeviceId = crypto.randomUUID();
    const newCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits

    setDeviceId(newDeviceId);
    setCode(newCode);

    try {
      // 2. Insert into Supabase
      const { error: insertError } = await supabase
        .from('device_codes')
        .insert({
          device_id: newDeviceId,
          code: newCode,
          status: 'pending'
        });

      if (insertError) throw insertError;

      setStatus('waiting');

      // 3. Subscribe to Realtime changes for this device_id
      const channel = supabase
        .channel(`device-${newDeviceId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'device_codes',
            filter: `device_id=eq.${newDeviceId}`
          },
          async (payload) => {
            const updatedRow = payload.new;
            
            if (updatedRow.status === 'confirmed' && updatedRow.refresh_token) {
              setStatus('success');
              
              // We received the refresh token from the phone! Let's log in.
              const { error: sessionError } = await supabase.auth.setSession({
                access_token: '', // setSession accepts just refresh_token
                refresh_token: updatedRow.refresh_token
              });

              // Clean up the code from the database
              await supabase.from('device_codes').delete().eq('device_id', newDeviceId);

              if (sessionError) {
                setStatus('error');
                setErrorMsg('Не удалось применить сессию. Попробуйте еще раз.');
                return;
              }

              // Successfully logged in! Redirect to home
              window.location.href = '/';
            }
          }
        )
        .subscribe();

      // Cleanup subscription after 10 minutes (code expiration)
      setTimeout(() => {
        supabase.removeChannel(channel);
        if (status === 'waiting') {
          setStatus('error');
          setErrorMsg('Время действия кода истекло');
        }
      }, 10 * 60 * 1000);

    } catch (err: any) {
      console.error('Device flow error:', err);
      setStatus('error');
      setErrorMsg('Не удалось сгенерировать код. Убедитесь, что таблица device_codes создана в Supabase.');
    }
  };

  // Generate code on initial mount
  useEffect(() => {
    generateAndSubscribe();
    
    return () => {
      // Cleanup all channels when unmounting
      supabase.removeAllChannels();
    };
  }, []);

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center animate-in zoom-in fade-in">
        <CheckCircle2 className="w-16 h-16 text-green-400 mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">Успешно!</h3>
        <p className="text-slate-400">Вход выполнен. Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center p-6 bg-slate-900/50 rounded-2xl border border-slate-700/50">
      <div className="flex items-center gap-4 mb-6">
        <Tv className="w-8 h-8 text-purple-400" />
        <div className="h-1 w-8 bg-slate-700 rounded-full" />
        <Smartphone className="w-8 h-8 text-indigo-400" />
      </div>

      <h3 className="text-xl font-bold text-white mb-2">Вход по коду</h3>
      <p className="text-slate-400 text-center mb-6 text-sm">
        Используйте телефон или компьютер, чтобы не вводить пароль с пульта
      </p>

      {status === 'generating' ? (
        <div className="py-8 flex flex-col items-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500 mb-2" />
          <span className="text-slate-400 text-sm">Генерация кода...</span>
        </div>
      ) : status === 'error' ? (
        <div className="py-6 flex flex-col items-center text-center">
          <p className="text-red-400 text-sm mb-4">{errorMsg}</p>
          <button 
            onClick={generateAndSubscribe}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Сгенерировать новый код
          </button>
        </div>
      ) : (
        <div className="w-full space-y-6">
          <div className="flex flex-col items-center">
            <span className="text-slate-400 text-xs uppercase tracking-wider mb-2 font-semibold">1. Откройте на телефоне</span>
            <div className="px-4 py-2 bg-slate-950 rounded-xl border border-slate-800 text-white font-medium break-all text-center">
              {typeof window !== 'undefined' ? `${window.location.origin}/device` : 'kaz-kinoclub.vercel.app/device'}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-slate-400 text-xs uppercase tracking-wider mb-2 font-semibold">2. Введите этот код</span>
            <div className="text-5xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 font-mono py-2">
              {code}
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 text-sm text-slate-400 pt-2">
            <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
            <span>Ожидаем подтверждения...</span>
          </div>
        </div>
      )}
    </div>
  );
}
