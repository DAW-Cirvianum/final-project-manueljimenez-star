import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, Star, Send, MessageSquare, Quote, Calendar, Clock } from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';
import { useContents } from '../../hooks/useContents';
import { contentService } from '../../services/contentService';
import { ReviewCard } from '../../components/ui/ReviewCard';
import { Badge } from '../../components/ui/Badge';
import { Toast } from '../../services/toast/toastActions';
import { RatingStars } from '../../components/ui/RatingStars';

export default function ContentDetail() {
      const { id } = useParams();
      const { t } = useTranslation();
      const { user: currentUser } = useAuth();
      const { toggleFavorite } = useContents(false);

      const [item, setItem] = useState(null);
      const [loading, setLoading] = useState(true);
      const [comment, setComment] = useState('');
      const [rating, setRating] = useState(5);
      const [isFavorite, setIsFavorite] = useState(false);
      const [submitting, setSubmitting] = useState(false);

      const loadContent = useCallback(async () => {
            try {
                  setLoading(true);
                  const data = await contentService.getById(id);
                  setItem(data);
                  setIsFavorite(data.is_favorite_by_me);
            } catch (error) {
                  Toast.error(t('notifications.error.load_content'));
            } finally {
                  setLoading(false);
            }
      }, [id, t]);

      useEffect(() => {
            window.scrollTo(0, 0);
            loadContent();
      }, [loadContent]);

      const handleFavorite = async () => {
            if (!currentUser) return Toast.error(t('notifications.error.login_required'));
            try {
                  const res = await toggleFavorite(id);
                  setIsFavorite(res.is_favorite);
                  Toast.success(res.is_favorite ? t('content.favorites.added') : t('content.favorites.removed'));
            } catch {
            }
      };
      const submitReview = async (e) => {
            e.preventDefault();
            if (comment.trim().length < 10) return Toast.error(t('notifications.error.review_too_short'));

            setSubmitting(true);
            try {
                  const response = await contentService.addReview(id, { comment, rating });
                  setItem(prev => ({
                        ...prev,
                        resenas: [response.review, ...(prev.resenas || [])],
                        rating_avg: response.new_avg || prev.rating_avg
                  }));

                  setComment('');
                  setRating(5);
                  Toast.success(t('detail.review_success') || "Reseña publicada");
            } catch (err) {
                  const errorMsg = err.response?.status === 404
                        ? "Endpoint /reviews no encontrado (404)"
                        : (err.response?.data?.message || t('notifications.error.generic'));
                  Toast.error(errorMsg);
            } finally {
                  setSubmitting(false);
            }
      };

      const handleLikeReview = async (reviewId) => {
            try {
                  const data = await contentService.likeReview(reviewId);
                  setItem(prev => ({
                        ...prev,
                        resenas: prev.resenas.map(rev =>
                              rev.id === reviewId ? { ...rev, is_liked_by_me: data.is_liked, likes_count: data.likes_count } : rev
                        )
                  }));
            } catch {
                  Toast.error(t('notifications.error.generic'));
            }
      };

      const handleDeleteReview = async (reviewId) => {
            if (!window.confirm(t('detail.delete_review_confirm'))) return;
            try {
                  await contentService.deleteReview(reviewId);
                  setItem(prev => ({
                        ...prev,
                        resenas: prev.resenas.filter(rev => rev.id !== reviewId)
                  }));
                  Toast.success(t('detail.review_deleted'));
            } catch {
                  Toast.error(t('notifications.error.generic'));
            }
      };

      if (loading) return <LoadingScreen t={t} />;
      if (!item) return <NoContent t={t} />;

      return (
            <article className="relative min-h-screen bg-elarx-black pb-20 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[180vh] pointer-events-none">
                        <img src={item.banner_image} className="w-full h-full object-cover opacity-60 blur-2xl scale-125" alt="" />
                        <div className="absolute inset-0 bg-gradient-to-b from-elarx-black/20 via-elarx-black/80 to-elarx-black" />
                  </div>

                  <div className="relative max-w-[1400px] mx-auto p-6 pt-32">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                              <aside className="lg:col-span-4">
                                    <div className="sticky top-32 space-y-8">
                                          <div className="relative group rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden">
                                                <img src={item.cover_image} className="w-full object-cover aspect-[2/3] transform group-hover:scale-105 transition-transform duration-700" alt={item.title} />
                                          </div>
                                          <button
                                                onClick={handleFavorite}
                                                className={`w-full py-5 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.3em] flex items-center justify-center gap-3 transition-all ${isFavorite ? 'bg-white text-black' : 'bg-elarx-gold text-black hover:scale-105'
                                                      }`}
                                          >
                                                <Heart size={18} fill={isFavorite ? "black" : "none"} />
                                                {isFavorite ? t('detail.in_list') : t('detail.add_list')}
                                          </button>
                                    </div>
                              </aside>

                              <main className="lg:col-span-8 space-y-16">
                                    <Header item={item} t={t} />
                                    <Synopsis description={item.description} t={t} />
                                    <Reviews
                                          t={t}
                                          item={item}
                                          rating={rating}
                                          setRating={setRating}
                                          comment={comment}
                                          setComment={setComment}
                                          onSubmit={submitReview}
                                          onLike={handleLikeReview}
                                          onDelete={handleDeleteReview}
                                          currentUser={currentUser}
                                          submitting={submitting}
                                    />
                              </main>
                        </div>
                  </div>
            </article>
      );
}


const Header = ({ item, t }) => (
      <header>
            <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-[0.8] mb-8">{item.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mb-10">
                  <Badge variant="gold">{item.type}</Badge>
                  {item.genres?.map(g => (
                        <span key={g.id} className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{g.name}</span>
                  ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-md">
                  <div className="md:col-span-2 flex items-center gap-6 border-b md:border-b-0 md:border-r border-white/5 pb-6 md:pb-0">
                        <RatingStars rating={item.rating_avg} size={32} />
                        <div>
                              <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-black text-white italic">{Number(item.rating_avg || 0).toFixed(1)}</span>
                                    <span className="text-gray-600 text-[10px] font-black">/ 5.0</span>
                              </div>
                              <p className="text-[8px] text-elarx-gold font-black uppercase tracking-[0.3em]">{t('detail.community_rating')}</p>
                        </div>
                  </div>
                  <SpecItem icon={<Calendar size={18} />} value={item.release_year} label={t('detail.release')} />
                  <SpecItem icon={<Clock size={18} />} value={item.duration} label={t('detail.duration')} />
            </div>
      </header>
);

const SpecItem = ({ icon, value, label }) => (
      <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-white">{icon} <span className="text-xl font-black">{value}</span></div>
            <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest">{label}</p>
      </div>
);

const Synopsis = ({ description, t }) => (
      <section className="bg-white/[0.02] border border-white/5 p-10 rounded-[2.5rem] relative">
            <Quote className="absolute -top-4 -left-4 w-24 h-24 text-white/5 -rotate-12" />
            <h3 className="text-elarx-gold font-black uppercase tracking-widest text-[10px] mb-4">{t('detail.synopsis')}</h3>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed italic">{description}</p>
      </section>
);

const Reviews = ({ t, item, onSubmit, submitting, ...props }) => (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <ReviewForm t={t} onSubmit={onSubmit} submitting={submitting} {...props} />
            <section className="space-y-6">
                  <h2 className="text-xl font-black text-white uppercase italic flex items-center gap-3">
                        <MessageSquare className="text-elarx-gold" size={20} /> {t('detail.reviews_title')}
                  </h2>
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {item.resenas?.length > 0 ? (
                              item.resenas.map(rev => (
                                    <ReviewCard key={rev.id} rev={rev} t={t} onLike={() => props.onLike(rev.id)} onDelete={() => props.onDelete(rev.id)} currentUser={props.currentUser} />
                              ))
                        ) : (
                              <p className="text-gray-600 italic text-sm">{t('detail.no_reviews_yet') || 'Sé el primero en opinar'}</p>
                        )}
                  </div>
            </section>
      </div>
);

const ReviewForm = ({ t, rating, setRating, comment, setComment, onSubmit, submitting }) => (
      <section className="space-y-6">
            <h2 className="text-xl font-black text-white uppercase italic flex items-center gap-3">
                  <Send className="text-elarx-gold" size={20} /> {t('detail.publish')}
            </h2>
            <form onSubmit={onSubmit} className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                  <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(num => (
                              <button key={num} type="button" onClick={() => setRating(num)} className="hover:scale-110 transition-transform">
                                    <Star size={24} className={rating >= num ? 'text-elarx-gold' : 'text-gray-700'} fill={rating >= num ? 'currentColor' : 'none'} />
                              </button>
                        ))}
                  </div>
                  <textarea
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl text-white text-sm focus:border-elarx-gold outline-none h-40 resize-none"
                        placeholder={t('detail.placeholder')}
                  />
                  <button
                        disabled={submitting || comment.trim().length < 10}
                        className="w-full py-4 bg-elarx-gold text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-xl disabled:opacity-30 transition-all hover:bg-white"
                  >
                        {submitting ? t('common.sending') : t('detail.send_review')}
                  </button>
            </form>
      </section>
);

const LoadingScreen = ({ t }) => (
      <div className='min-h-screen bg-elarx-black flex flex-col items-center justify-center gap-6'>
            <div className="w-12 h-12 border-2 border-elarx-gold/20 border-t-elarx-gold rounded-full animate-spin" />
            <p className="text-elarx-gold font-black uppercase tracking-[0.5em] text-[9px]">{t('common.loading_experience')}</p>
      </div>
);

const NoContent = ({ t }) => (
      <div className='text-white p-20 text-center font-black italic uppercase tracking-widest'>
            {t('catalog.no_results')}
      </div>
);