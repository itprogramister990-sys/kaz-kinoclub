import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="p-8 rounded-3xl backdrop-blur-xl bg-slate-900/50 border border-slate-800">
        <h1 className="text-3xl font-bold mb-6 text-white">Параметры</h1>
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
            <h3 className="text-lg font-medium text-white mb-2">Настройки аккаунта</h3>
            <p className="text-sm text-slate-400">Управление адресом электронной почты и паролем.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
            <h3 className="text-lg font-medium text-white mb-2">Уведомления</h3>
            <p className="text-sm text-slate-400">Настройте, какие уведомления вы хотите получать.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
