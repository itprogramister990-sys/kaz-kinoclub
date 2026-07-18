"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

function VerifyContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await signIn("credentials", {
          token,
          redirect: false,
        });

        if (res?.error) {
          setStatus("error");
        } else {
          setStatus("success");
          // Redirect to home after a brief delay so they see the success message
          setTimeout(() => {
            router.push("/");
            router.refresh(); // Force a refresh to show the avatar in the navbar
          }, 2000);
        }
      } catch (err) {
        setStatus("error");
      }
    };

    verifyToken();
  }, [searchParams, router]);

  return (
    <div className="relative w-full max-w-md p-8 rounded-3xl backdrop-blur-xl bg-slate-950/60 border border-slate-700/50 shadow-[0_0_40px_rgba(0,0,0,0.5)] z-10 animate-in fade-in zoom-in duration-300 flex flex-col items-center text-center">
      {status === "loading" && (
        <>
          <Loader2 className="w-16 h-16 text-purple-500 animate-spin mb-6" />
          <h1 className="text-2xl font-bold text-white mb-2">Проверка токена</h1>
          <p className="text-slate-400">Пожалуйста, подождите, мы активируем ваш аккаунт...</p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Email подтвержден!</h1>
          <p className="text-slate-400">Ваш аккаунт активирован. Выполняем вход...</p>
        </>
      )}

      {status === "error" && (
        <>
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
            <XCircle className="w-12 h-12 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Ошибка верификации</h1>
          <p className="text-slate-400 mb-8">
            Ссылка устарела или недействительна. Пожалуйста, пройдите регистрацию заново.
          </p>
          <Link
            href="/register"
            className="w-full py-3 flex justify-center items-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-lg hover:scale-105 transition-all"
          >
            К регистрации
          </Link>
        </>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen pt-24 px-4 flex items-center justify-center bg-[#0d0d1a] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
      
      <Suspense fallback={<Loader2 className="w-12 h-12 text-white animate-spin" />}>
        <VerifyContent />
      </Suspense>
    </div>
  );
}
