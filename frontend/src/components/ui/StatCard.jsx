import React from 'react';

export const StatCard = ({ icon, label, value = 0, className = "", ...props }) => (
      <div
            className={`bg-white/5 p-8 rounded-[2rem] border border-white/5 flex items-center gap-6 group hover:border-elarx-gold/20 transition-all ${className}`}
            {...props}
      >
            <div className="p-4 bg-black rounded-2xl group-hover:scale-110 transition-transform">
                  {icon}
            </div>
            <div>
                  <p className="text-3xl font-black text-white italic leading-none">
                        {value}
                  </p>
                  {label && (
                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-2">
                              {label}
                        </p>
                  )}
            </div>
      </div>
);
