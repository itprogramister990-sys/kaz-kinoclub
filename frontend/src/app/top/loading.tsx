import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Loading() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-12 px-4 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Skeleton Title */}
          <div className="text-center mb-12">
            <div className="h-10 md:h-12 w-3/4 max-w-lg bg-slate-800/50 rounded-lg animate-pulse mx-auto mb-4" />
            <div className="h-6 w-1/2 max-w-md bg-slate-800/30 rounded-lg animate-pulse mx-auto" />
          </div>

          {/* Skeleton Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2 relative">
                {/* Ranking Badge Skeleton */}
                <div className="absolute -top-3 -left-3 w-8 h-8 md:w-10 md:h-10 bg-slate-800/80 rounded-full z-20 animate-pulse border-2 border-[#0a0a0a]" />
                
                {/* Poster Skeleton */}
                <div className="aspect-[2/3] w-full bg-slate-800/50 rounded-xl animate-pulse" />
                
                {/* Title Skeleton */}
                <div className="h-4 w-3/4 bg-slate-800/50 rounded animate-pulse mt-1" />
                {/* Year/Genre Skeleton */}
                <div className="h-3 w-1/2 bg-slate-800/30 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
