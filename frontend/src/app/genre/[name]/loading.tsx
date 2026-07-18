import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Loading() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-12 px-4 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Skeleton Title */}
          <div className="mb-8">
            <div className="h-10 w-48 bg-slate-800/50 rounded-lg animate-pulse" />
          </div>

          {/* Skeleton Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
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
