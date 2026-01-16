import React from 'react';

export const SectionTitle = ({ title, subtitle, className = "", ...props }) => {
      return (
            <div
                  className={`flex items-center justify-between mb-6 px-6 md:px-12 ${className}`}
                  {...props}
            >
                  <div className="flex items-center gap-4 flex-1 group/title">
                        <div className="relative">
                              <h2 className="text-white text-xl md:text-3xl font-black uppercase tracking-tighter italic border-l-4 border-elarx-gold pl-4 transition-all duration-300 group-hover/title:pl-6">
                                    {title}
                              </h2>

                              <div className="absolute -left-2 top-0 bottom-0 w-1 bg-elarx-gold blur-md opacity-0 group-hover/title:opacity-100 transition-opacity" />
                        </div>

                        <div className="h-[1px] flex-1 bg-gradient-to-r from-elarx-gold/30 via-white/5 to-transparent hidden sm:block" />
                  </div>

                  {subtitle && (
                        <span className="text-[10px] font-black text-gray-500 tracking-[0.4em] uppercase whitespace-nowrap ml-4">
                              {subtitle}
                        </span>
                  )}
            </div>
      );
};
