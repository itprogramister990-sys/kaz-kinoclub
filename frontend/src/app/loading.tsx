import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Loading() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Skeleton Hero Banner */}
        <section className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] flex items-center justify-center bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 bg-slate-800/30 animate-pulse" />
          <div className="relative z-10 text-center max-w-4xl mx-auto px-4 mt-20">
            <div className="h-10 w-32 bg-brand-red/20 rounded-full animate-pulse mx-auto mb-6" />
            <div className="h-12 md:h-16 w-3/4 bg-white/10 rounded-xl animate-pulse mx-auto mb-4" />
            <div className="h-12 md:h-16 w-1/2 bg-white/10 rounded-xl animate-pulse mx-auto mb-8" />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="h-14 w-48 bg-white/10 rounded-xl animate-pulse" />
              <div className="h-14 w-48 bg-white/10 rounded-xl animate-pulse" />
            </div>
          </div>
        </section>

        {/* Skeleton Search */}
        <section className="relative z-10 py-10 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="h-8 w-64 bg-white/5 rounded-lg animate-pulse mx-auto mb-4" />
            <div className="h-16 w-full max-w-2xl bg-white/5 rounded-2xl animate-pulse mx-auto" />
          </div>
        </section>

        {/* Skeleton Grid */}
        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="aspect-[2/3] w-full bg-slate-800/50 rounded-xl animate-pulse" />
                  <div className="h-4 w-3/4 bg-slate-800/50 rounded animate-pulse mt-1" />
                  <div className="h-3 w-1/2 bg-slate-800/30 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
