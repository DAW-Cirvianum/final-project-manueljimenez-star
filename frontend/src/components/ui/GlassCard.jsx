import React from 'react';

export const GlassCard = ({ children, className = "", ...props }) => (
      <div
            className={`bg-white/5 border border-white/10 backdrop-blur-md rounded-[2.5rem] p-6 transition-all ${className}`}
            {...props}
      >
            {children}
      </div>
);
