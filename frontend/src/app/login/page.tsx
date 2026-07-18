import { LoginForm } from '@/components/auth/LoginForm';
import { DeviceLoginComponent } from '@/components/auth/DeviceLoginComponent';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-4 pt-24 pb-12 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[#0d0d1a]">
          <div className="absolute inset-0 bg-brand-gradient opacity-10 blur-[100px] pointer-events-none" />
        </div>
        
        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
          <div className="w-full max-w-md shrink-0">
            <DeviceLoginComponent />
          </div>
          
          <div className="hidden lg:flex flex-col items-center justify-center opacity-30 h-[400px]">
            <div className="w-px flex-1 bg-white"></div>
            <span className="my-6 text-white font-bold tracking-widest text-sm">ИЛИ</span>
            <div className="w-px flex-1 bg-white"></div>
          </div>
          
          <div className="w-full max-w-md shrink-0">
            <LoginForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
