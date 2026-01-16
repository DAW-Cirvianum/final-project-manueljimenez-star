import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Heart, Star } from 'lucide-react';
import { Toast } from '../../services/toast/toastActions';
import { RatingStars } from '../ui/RatingStars';
import api from '../../api/axios';

export default function ContentCard({ item }) {
      const [isFavorite, setIsFavorite] = useState(item?.is_favorite_by_me ?? false);
      const [loading, setLoading] = useState(false);

      useEffect(() => {
            if (item) setIsFavorite(item.is_favorite_by_me);
      }, [item?.is_favorite_by_me]);

      if (!item) return null;

      const handleFavoriteClick = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (loading) return;
            setLoading(true);

            try {
                  const response = await api.post(`/contents/${item.id}/favorite`);
                  setIsFavorite(response.data.is_favorite);
                  Toast.success(response.data.is_favorite ? 'Añadido a favoritos' : 'Eliminado de favoritos');
            } catch {
                  Toast.error('Error al actualizar favoritos');
            } finally {
                  setLoading(false);
            }
      };

      return (
            <Link
                  to={`/contents/${item.id}`}
                  className="group relative block bg-[#0a0a0a] border border-white/5 rounded-[2rem] overflow-hidden hover:border-elarx-gold/30 transition-all duration-700 hover:shadow-[0_0_40px_rgba(212,175,55,0.07)]"
            >
                  <div className="aspect-[2/3] overflow-hidden bg-elarx-dark relative">
                        <img
                              src={item.cover_image || item.banner_image}
                              alt={item.title}
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/20 opacity-80" />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-b from-elarx-gold/5 via-transparent to-elarx-gold/10 transition-opacity duration-700" />

                        <button
                              onClick={handleFavoriteClick}
                              disabled={loading}
                              className={`absolute top-4 right-4 p-3 rounded-2xl backdrop-blur-xl transition-all duration-500 z-30 border ${isFavorite
                                    ? 'bg-elarx-gold border-elarx-gold text-black shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                                    : 'bg-black/40 border-white/10 text-white/70 hover:text-white hover:bg-black/60'
                                    }`}
                        >
                              <Heart
                                    size={18}
                                    fill={isFavorite ? "currentColor" : "none"}
                                    className={`${loading ? "animate-pulse" : "group-active:scale-125 transition-transform"}`}
                                    strokeWidth={2.5}
                              />
                        </button>

                        <div className="absolute bottom-4 left-4 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75">
                              <span className="text-[9px] px-3 py-1 uppercase tracking-[0.2em] bg-black/30 rounded-full">
                                    {item.type || 'Media'}
                              </span>
                        </div>
                  </div>

                  <div className="p-5 relative z-10">
                        <div className="flex justify-between items-start gap-3 mb-2">
                              <h3 className="text-white font-black text-sm italic uppercase tracking-tight group-hover:text-elarx-gold transition-colors line-clamp-1 duration-500">
                                    {item.title}
                              </h3>
                              <RatingStars rating={item.rating_avg} size={10} />
                        </div>

                        <div className="flex items-center gap-2">
                              <span className="text-gray-500 text-[9px] font-bold tracking-[0.2em]">
                                    {item.release_year || '2024'}
                              </span>
                              <span className="w-1 h-1 bg-elarx-gold/30 rounded-full" />
                              <span className="text-gray-600 text-[9px] font-bold tracking-[0.1em] uppercase">
                                    {item.duration || 'N/A'}
                              </span>
                        </div>
                  </div>
            </Link>
      );
}
