import React from 'react';

export const BadgeSelector = ({ label, items = [], selected = [], onChange, error, className = "" }) => {
      const toggleSelection = (id) => {
            const isSelected = selected.includes(id);
            const newSelection = isSelected
                  ? selected.filter(itemId => itemId !== id)
                  : [...selected, id];
            onChange(newSelection);
      };

      return (
            <div className={`space-y-3 ${className}`}>
                  {label && (
                        <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest block">
                              {label}
                        </label>
                  )}

                  <div className="flex flex-wrap gap-2">
                        {items.map((item) => {
                              const isSelected = selected.includes(item.id);
                              return (
                                    <button
                                          key={item.id}
                                          type="button"
                                          onClick={() => toggleSelection(item.id)}
                                          className={`
                                                px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border
                                                ${isSelected
                                                      ? 'bg-elarx-gold border-elarx-gold text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                                                      : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30 hover:bg-white/10'}
                                          `}
                                    >
                                          {item.name}
                                    </button>
                              );
                        })}
                  </div>

                  {error && (
                        <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight mt-1">
                              {error}
                        </p>
                  )}
            </div>
      );
};
