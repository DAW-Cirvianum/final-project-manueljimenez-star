import SkeletonCard from "./SkeletonCard";

export default function SkeletonRow() {
      const placeholders = Array(6).fill(0);

      return (
            <div className="mb-14 px-6 md:px-12">
                  <div className="flex items-center gap-4 mb-8">
                        <div className="h-8 w-48 bg-white/10 rounded-lg animate-pulse border-l-4 border-elarx-gold/30" />
                        <div className="h-[1px] flex-1 bg-white/5" />
                  </div>

                  {/* Grid de placeholders */}
                  <div className="flex gap-4 md:gap-6 overflow-hidden">
                        {placeholders.map((_, i) => (
                              <div
                                    key={i}
                                    className="min-w-[160px] sm:min-w-[200px] md:min-w-[240px] lg:min-w-[280px]"
                              >
                                    <SkeletonCard />
                              </div>
                        ))}
                  </div>
            </div>
      );
};