import { RegisterForm } from '@/components/auth/RegisterForm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-4 pt-24 pb-12 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[#0d0d1a]">
          <div className="absolute inset-0 bg-brand-gradient opacity-10 blur-[100px] pointer-events-none" />
        </div>
        
        <div className="relative z-10 w-full flex justify-center">
          <RegisterForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
