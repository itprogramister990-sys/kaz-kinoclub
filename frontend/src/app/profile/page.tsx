import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="p-8 rounded-3xl backdrop-blur-xl bg-slate-900/50 border border-slate-800">
        <h1 className="text-3xl font-bold mb-6 text-white">Мой профиль</h1>
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-700 overflow-hidden flex items-center justify-center">
            {session.user?.image ? (
              <img src={session.user.image} alt="User avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-bold text-slate-300">
                {session.user?.name?.[0]?.toUpperCase() || session.user?.email?.[0]?.toUpperCase() || 'U'}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">{session.user?.name || 'Пользователь'}</h2>
            <p className="text-slate-400">{session.user?.email}</p>
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-slate-300">Добро пожаловать в личный кабинет! Здесь будет история просмотров и избранные фильмы.</p>
        </div>
      </div>
    </div>
  );
}
