import React from 'react';
import { ThumbsUp, Trash2 } from 'lucide-react';
import { Toast } from '../../services/toast/toastActions';
import { RatingStars } from './RatingStars';

export const ReviewCard = ({ rev, currentUser, onLike, onDelete, t }) => {
      const isOwner = currentUser && (
            Number(currentUser.id) === Number(rev.user_id) ||
            currentUser.name === rev.usuario
      );

      return (
            <div className="group bg-white/[0.03] border border-white/5 p-6 rounded-[2rem] hover:bg-white/[0.06] transition-all duration-500 relative">
                  <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-elarx-gold/10 border border-elarx-gold/20 flex items-center justify-center text-elarx-gold font-black italic text-xs shadow-inner">
                                    {rev.usuario?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                    <h4 className="text-white font-black uppercase italic text-[10px] tracking-widest leading-none">
                                          {rev.usuario}
                                    </h4>
                                    <p className="text-gray-600 text-[9px] font-bold mt-1 uppercase tracking-tighter">
                                          {rev.date || 'Reciente'}
                                    </p>
                              </div>
                        </div>

                        <RatingStars rating={rev.nota || rev.note} size={12} />
                  </div>

                  <p className="text-gray-300 text-sm italic leading-relaxed mb-6 pl-2 border-l-2 border-elarx-gold/20">
                        "{rev.comentario || rev.comment}"
                  </p>

                  <div className="flex justify-between items-center">
                        <button
                              onClick={() => onLike(rev.id)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${rev.is_liked_by_me
                                    ? 'bg-elarx-gold text-black font-black'
                                    : 'bg-white/5 text-gray-500 hover:text-white hover:bg-white/10'
                                    }`}
                        >
                              <ThumbsUp size={12} fill={rev.is_liked_by_me ? "black" : "none"} />
                              <span className="text-[10px] uppercase">{rev.likes_count || 0}</span>
                        </button>

                        {isOwner && (
                              <button
                                    onClick={(e) => {
                                          e.stopPropagation();
                                          onDelete(rev.id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-600 hover:text-red-500 transition-all duration-300"
                              >
                                    <Trash2 size={16} />
                              </button>
                        )}
                  </div>
            </div>
      );
};
