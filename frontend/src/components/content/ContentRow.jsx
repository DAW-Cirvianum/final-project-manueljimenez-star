import { useRef, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import ContentCard from './ContentCard';
import { SectionTitle } from '../ui/SectionTitle';
import { Toast } from '../../services/toast/toastActions';

export default function ContentRow({ title, items = [] }) {
      const rowRef = useRef(null);
      const [scrollState, setScrollState] = useState({ canLeft: false, canRight: true });
      const { t } = useTranslation();

      const updateScrollButtons = useCallback(() => {
            const row = rowRef.current;
            if (!row) return;
            const { scrollLeft, scrollWidth, clientWidth } = row;
            setScrollState({
                  canLeft: scrollLeft > 20,
                  canRight: scrollLeft + clientWidth < scrollWidth - 20
            });
      }, []);

      useEffect(() => {
            const row = rowRef.current;
            if (!row) return;

            updateScrollButtons();
            row.addEventListener('scroll', updateScrollButtons, { passive: true });
            window.addEventListener('resize', updateScrollButtons);

            return () => {
                  row.removeEventListener('scroll', updateScrollButtons);
                  window.removeEventListener('resize', updateScrollButtons);
            };
      }, [items, updateScrollButtons]);

      const handleScroll = (dir) => {
            const row = rowRef.current;
            if (!row) return Toast.error(t('common.errors.scroll_failed'));

            const scrollAmount = row.clientWidth * 0.85;
            row.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
      };

      if (!items?.length) return null;

      return (
            <section className="relative mb-20 group/row-container z-20">
                  <div className="px-6 md:px-14 mb-8 relative z-30">
                        <SectionTitle
                              title={title}
                              subtitle={`${items.length} ${t('content.common.items')}`}
                              variant="minimal"
                        />
                  </div>

                  <div className="relative">
                        <div
                              className={`absolute left-0 inset-y-0 z-50 w-32 bg-gradient-to-r from-elarx-black via-elarx-black/60 to-transparent transition-opacity duration-500 flex items-center pl-6 pointer-events-none ${scrollState.canLeft ? 'opacity-0 group-hover/row-container:opacity-100' : 'opacity-0'
                                    }`}
                        >
                              <button
                                    onClick={() => handleScroll('left')}
                                    className="p-4 rounded-full bg-black/40 border border-white/10 backdrop-blur-2xl text-white hover:bg-elarx-gold hover:text-black hover:scale-110 transition-all duration-300 pointer-events-auto shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                                    aria-label={t('common.scroll_left')}
                              >
                                    <ChevronLeft size={24} strokeWidth={3} />
                              </button>
                        </div>
                        <div
                              ref={rowRef}
                              className="flex gap-5 md:gap-7 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-8 md:px-12 pb-8 pt-2 scroll-smooth"
                        >
                              {items.map((item) => (
                                    <div
                                          key={item.id}
                                          className="min-w-[160px] sm:min-w-[220px] md:min-w-[280px] lg:min-w-[300px] snap-start"
                                    >
                                          <ContentCard item={item} />
                                    </div>
                              ))}
                              <div className="min-w-[40px] shrink-0" />
                        </div>

                        <div
                              className={`absolute right-0 inset-y-0 z-50 w-32 bg-gradient-to-l from-elarx-black via-elarx-black/60 to-transparent transition-opacity duration-500 flex items-center justify-end pr-6 pointer-events-none ${scrollState.canRight ? 'opacity-0 group-hover/row-container:opacity-100' : 'opacity-0'
                                    }`}
                        >
                              <button
                                    onClick={() => handleScroll('right')}
                                    className="p-4 rounded-full bg-black/40 border border-white/10 backdrop-blur-2xl text-white hover:bg-elarx-gold hover:text-black hover:scale-110 transition-all duration-300 pointer-events-auto shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                                    aria-label={t('common.scroll_right')}
                              >
                                    <ChevronRight size={24} strokeWidth={3} />
                              </button>
                        </div>
                  </div>
            </section>
      );
}
