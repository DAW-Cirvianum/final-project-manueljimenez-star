import React, { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';

export const ImageUploader = ({
      label,
      preview: initialPreview,
      onSelect,
      onClear,
      error,
      aspect = "video"
}) => {
      const { t } = useTranslation();
      const aspectClasses = aspect === "video" ? "aspect-video" : "aspect-[2/3]";

      const [preview, setPreview] = useState(initialPreview || null);

      useEffect(() => {
            setPreview(initialPreview);
      }, [initialPreview]);

      const handleFileChange = (e) => {
            const file = e.target.files[0];
            if (file) {
                  onSelect(file);
                  const reader = new FileReader();
                  reader.onload = () => setPreview(reader.result); 
                  reader.readAsDataURL(file);
            }
      };

      const handleClear = () => {
            setPreview(null);
            onClear();
      };

      return (
            <div className="space-y-2">
                  {label && (
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-2">
                              {label}
                        </label>
                  )}

                  <div className={`
                        relative group overflow-hidden rounded-[2rem] border-2 border-dashed transition-all duration-500
                        ${error ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 bg-white/5 hover:border-elarx-gold/30'}
                        ${aspectClasses}
                  `}>
                        {preview ? (
                              <>
                                    <img
                                          src={preview}
                                          alt="Preview"
                                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                          <Button
                                                type="button"
                                                onClick={handleClear}
                                                className="p-4 bg-red-500 text-white rounded-full hover:scale-110 transition-transform flex items-center justify-center"
                                          >
                                                <X size={20} />
                                          </Button>
                                    </div>
                              </>
                        ) : (
                              <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer group">
                                    <div className="p-4 rounded-2xl bg-white/5 text-gray-500 group-hover:text-elarx-gold group-hover:bg-elarx-gold/10 transition-all">
                                          <Upload size={24} />
                                    </div>
                                    <span className="mt-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">
                                          {t('common.upload_image')}
                                    </span>
                                    <input
                                          type="file"
                                          accept="image/*"
                                          className="hidden"
                                          onChange={handleFileChange}
                                    />
                              </label>
                        )}
                  </div>

                  {error && (
                        <p className="text-red-500 text-[10px] font-bold mt-1 ml-2 uppercase italic">
                              {Array.isArray(error) ? error[0] : error}
                        </p>
                  )}
            </div>
      );
};
