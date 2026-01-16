import React, { useState, useEffect } from 'react';
import { X, ImageIcon } from 'lucide-react';

export const ImagePreview = ({ file, label, onRemove, aspect = "video", className = "" }) => {
      const [preview, setPreview] = useState(null);

      useEffect(() => {
            if (!file) {
                  setPreview(null);
                  return;
            }

            const objectUrl = typeof file === 'string' ? file : URL.createObjectURL(file);
            setPreview(objectUrl);

            return () => {
                  if (typeof file !== 'string') URL.revokeObjectURL(objectUrl);
            };
      }, [file]);

      const aspectClasses = {
            video: "aspect-video",
            portrait: "aspect-[2/3]",
            square: "aspect-square"
      };

      return (
            <div className={`space-y-2 ${className}`}>
                  {label && (
                        <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest block">
                              {label}
                        </label>
                  )}

                  {/* Contenedor */}
                  <div className={`relative group overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 ${aspectClasses[aspect]} transition-all hover:border-elarx-gold/30`}>
                        {preview ? (
                              <>
                                    <img
                                          src={preview}
                                          alt="Preview"
                                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                          <button
                                                type="button"
                                                onClick={onRemove}
                                                className="p-3 bg-red-500/20 hover:bg-red-500 text-white rounded-full transition-all flex items-center justify-center"
                                          >
                                                <X size={20} />
                                          </button>
                                    </div>
                              </>
                        ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-2">
                                    <ImageIcon size={28} strokeWidth={1} />
                                    <span className="text-[9px] uppercase tracking-tighter font-bold">
                                          {`No ${label} selected`}
                                    </span>
                              </div>
                        )}
                  </div>
            </div>
      );
};
