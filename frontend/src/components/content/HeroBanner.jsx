import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Info } from 'lucide-react';
import { Button } from '../ui/Button';
import { RatingStars } from '../ui/RatingStars';

export default function HeroBanner({ contents = [] }) {
      const [index, setIndex] = useState(0);
      const [isExiting, setIsExiting] = useState(false);
      const navigate = useNavigate();
      const { t } = useTranslation();

      if (!contents || contents.length === 0) {
            return (
                  <div className="relative h-[80vh] w-full bg-white/[0.02] rounded-[4rem] animate-pulse flex items-center justify-center">
                        <div className="w-20 h-20 border-2 border-elarx-gold/20 border-t-elarx-gold rounded-full animate-spin" />
                  </div>
            );
      }

      const current = contents[index];
      if (!current) return null;

      useEffect(() => {
            if (!contents || contents.length <= 1) return;

            const interval = setInterval(() => handleNext(), 10000);
            return () => clearInterval(interval);
      }, [contents, index]);

      const handleNext = () => {
            setIsExiting(true);
            setTimeout(() => {
                  setIndex((prev) => (prev + 1) % contents.length);
                  setIsExiting(false);
            }, 600);
      };


      return (
            <div className="relative h-[85vh] md:h-[95vh] w-full overflow-hidden bg-[#050505]">

                  <div className="absolute inset-0 z-0">
                        <img
                              key={current.id}
                              src={current.banner_image || current.cover_image}
                              alt={current.title}
                              className={`w-full h-full object-cover object-top transition-all duration-[1500ms] ease-out ${isExiting ? 'scale-110 blur-xl opacity-0' : 'scale-100 opacity-100'
                                    }`}
                              loading="eager"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent z-10" />
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-20" />
                  </div>

                  <div className="relative z-40 h-full max-w-[1700px] mx-auto flex flex-col justify-end pb-24 md:pb-32 px-8 md:px-20 pointer-events-none">
                        <div className={`max-w-4xl transition-all duration-1000 transform pointer-events-auto ${isExiting ? 'opacity-0 translate-x-12' : 'opacity-100 translate-x-0'
                              }`}>
                              <div className="flex items-center gap-3 mb-6">
                                    <RatingStars rating={current.rating_avg} size={14} />

                                    <span className="text-elarx-gold/80 font-black text-[10px] uppercase tracking-[0.3em] bg-white/5 px-3 py-1 rounded-full border border-white/5 backdrop-blur-md">
                                          {current.type || 'Premium Content'}
                                    </span>
                              </div>

                              <h1 className="text-5xl sm:text-7xl md:text-[8rem] lg:text-[10rem] font-black text-white mb-8 uppercase italic tracking-tighter leading-[0.75] drop-shadow-[0_20px_50px_rgba(0,0,0,1)]">
                                    {current.title}
                              </h1>

                              <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-xl line-clamp-3 font-medium leading-relaxed drop-shadow-md">
                                    {current.description}
                              </p>

                              <div className="flex flex-wrap gap-5">
                                    <Button
                                          variant="outline"
                                          onClick={() => navigate(`/contents/${current.id}`)}
                                          className="group relative flex items-center gap-4 py-6 px-12 bg-elarx-gold/5 text-black rounded-2xl overflow-hidden transition-all hover:pr-14"
                                    >
                                          <Info size={22} className="text-elarx-gold group-hover:rotate-12 transition-transform" />
                                          <span className="font-black italic uppercase tracking-wider">{t('hero.play_button')}</span>
                                    </Button>
                              </div>
                        </div>
                  </div>

                  <div className="absolute bottom-0 left-0 w-full h-[4px] bg-white/5 z-50">
                        <div
                              key={index}
                              className="h-full bg-gradient-to-r from-elarx-gold/10 to-elarx-gold shadow-[0_0_20px_#D4AF37] animate-progress"
                              style={{ animationDuration: '10000ms' }}
                        />
                  </div>


                  <style dangerouslySetInnerHTML={{
                        __html: `
                              @keyframes progress { from { width: 0%; } to { width: 100%; } }
                              .animate-progress { animation-name: progress; animation-timing-function: linear; animation-fill-mode: forwards; }
                        `
                  }} />
            </div>
      );
}
