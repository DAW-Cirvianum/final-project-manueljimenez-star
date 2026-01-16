export default function SkeletonCard() {
      return (
            <div className="w-full animate-pulse">
                  <div className="relative aspect-[2/3] bg-white/5 rounded-2xl overflow-hidden">
                        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-elarx-gold/10 to-transparent" />

                        <div className="absolute top-3 right-3 w-10 h-10 bg-white/10 rounded-xl" />
                  </div>

                  <div className="mt-4 space-y-3">
                        <div className="flex justify-between items-center gap-2">
                              <div className="h-4 w-3/4 bg-white/10 rounded-md" />
                              <div className="h-4 w-10 bg-elarx-gold/20 rounded-md" />
                        </div>
                        <div className="h-3 w-1/2 bg-white/10 rounded-md" />
                  </div>

                  <style dangerouslySetInnerHTML={{
                        __html: `
                        @keyframes shimmer {
                              0% { transform: translateX(-100%); }
                              100% { transform: translateX(100%); }
                        }
                        .animate-shimmer { animation: shimmer 2s infinite; }
                        `
                  }} />
            </div>
      );
}
