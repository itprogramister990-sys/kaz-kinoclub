'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Loader2 } from 'lucide-react';

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      // Handle ?code= URL params (PKCE flow)
      const code = searchParams.get('code');
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setError(error.message);
          return;
        }
      }

      // Handle #access_token= URL fragments (Implicit flow)
      // Supabase-js automatically picks this up, so we just wait a bit and redirect
      
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/');
      } else if (!code) {
        setError('Не удалось подтвердить авторизацию.');
      }
    };

    handleCallback();
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="text-red-400 mb-4 bg-red-400/10 px-4 py-2 rounded-lg">
          Ошибка: {error}
        </div>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-colors"
        >
          Вернуться на главную
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-300 gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
      <p className="text-lg">Завершение авторизации...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <main className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center bg-[#0d0d1a]">
      <Suspense fallback={<Loader2 className="w-10 h-10 animate-spin text-purple-500" />}>
        <CallbackHandler />
      </Suspense>
    </main>
  );
}
