'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Loader2, Tv, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function DevicePage() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'checking' | 'ready' | 'success' | 'error'>('checking');
  const [errorMessage, setErrorMessage] = useState('');
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setStatus(data.session ? 'ready' : 'error');
      if (!data.session) {
        setErrorMessage('Пожалуйста, войдите в свой аккаунт на этом устройстве, чтобы подключить телевизор.');
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.refresh_token) return;
    
    // Validate 6 digits
    const cleanCode = code.replace(/\D/g, '');
    if (cleanCode.length !== 6) {
      setStatus('error');
      setErrorMessage('Код должен состоять из 6 цифр');
      return;
    }

    setIsLoading(true);
    setStatus('ready');
    setErrorMessage('');

    try {
      // 1. Check if the code exists and is pending
      const { data: codeData, error: fetchError } = await supabase
        .from('device_codes')
        .select('id, status')
        .eq('code', cleanCode)
        .eq('status', 'pending')
        .single();

      if (fetchError || !codeData) {
        throw new Error('Код не найден или уже использован. Проверьте правильность или сгенерируйте новый код на телевизоре.');
      }

      // 2. Update the code with the refresh token and confirm it
      const { error: updateError } = await supabase
        .from('device_codes')
        .update({
          status: 'confirmed',
          refresh_token: session.refresh_token
        })
        .eq('code', cleanCode);

      if (updateError) throw updateError;

      setStatus('success');
    } catch (error: any) {
      console.error('Error confirming code:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Произошла ошибка при подключении устройства');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d1a] text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4 relative pt-24 pb-12">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 w-full max-w-md p-8 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-700/50 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Tv className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-2">Подключение устройства</h1>
          
          {status === 'checking' ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500 mb-4" />
              <p className="text-slate-400">Проверка авторизации...</p>
            </div>
          ) : status === 'success' ? (
            <div className="text-center py-6 animate-in fade-in zoom-in">
              <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Устройство подключено!</h2>
              <p className="text-slate-400 mb-8">
                Телевизор успешно авторизован. Приятного просмотра!
              </p>
              <Link 
                href="/"
                className="w-full py-3 inline-flex justify-center items-center rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
              >
                На главную
              </Link>
            </div>
          ) : !session ? (
            <div className="text-center py-6">
              <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <p className="text-slate-300 mb-6 leading-relaxed">
                {errorMessage}
              </p>
              <Link 
                href={`/login?redirect=/device`}
                className="w-full py-3 inline-flex justify-center items-center rounded-xl bg-brand-gradient hover:shadow-glow-red text-white font-semibold transition-all transform hover:scale-[1.02]"
              >
                Войти в аккаунт
              </Link>
            </div>
          ) : (
            <>
              <p className="text-slate-400 text-center mb-8">
                Введите 6-значный код, который отображается на экране вашего телевизора.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setCode(val);
                      if (status === 'error') setStatus('ready');
                    }}
                    placeholder="000000"
                    className="w-full px-4 py-4 text-center text-4xl tracking-[0.5em] font-bold rounded-2xl bg-slate-950/50 border border-slate-700 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all font-mono"
                    maxLength={6}
                    disabled={isLoading}
                    autoFocus
                  />
                </div>

                {status === 'error' && errorMessage && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center animate-in slide-in-from-top-2">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || code.length !== 6}
                  className="w-full py-4 mt-2 flex justify-center items-center rounded-xl bg-brand-gradient hover:shadow-glow-red text-white font-semibold transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed text-lg"
                >
                  {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Подключить"}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
