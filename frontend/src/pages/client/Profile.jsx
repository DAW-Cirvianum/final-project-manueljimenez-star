import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { useUsers } from '../../hooks/useUsers';

import {
      Mail, Calendar, Star, Heart, Trash2, User,
      Camera, Shield, Save, X, Settings, AtSign, Loader2
} from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { StatCard } from '../../components/ui/StatCard';
import { ReviewCard } from '../../components/ui/ReviewCard';
import ContentCard from '../../components/content/ContentCard';
import { GlassCard } from '../../components/ui/GlassCard';
import { Toast } from '../../services/toast/toastActions';

const Profile = () => {
      const { t } = useTranslation();
      const { user: currentUser } = useAuth();
      const { getProfile, updateProfile, uploadAvatar, deleteUserReview, toggleLike } = useUsers();

      const [profileData, setProfileData] = useState(null);
      const [loading, setLoading] = useState(true);
      const [activeTab, setActiveTab] = useState('favorites');
      const [isEditing, setIsEditing] = useState(false);

      const [formData, setFormData] = useState({
            name: '',
            username: '',
            bio: ''
      });

      useEffect(() => {
            fetchProfile();
      }, []);

      const fetchProfile = async () => {
            try {
                  setLoading(true);
                  const data = await getProfile();
                  if (data && data.user) {
                        setProfileData(data);
                        setFormData({
                              name: data.user.name || '',
                              username: data.user.username || '',
                              bio: data.user.bio || ''
                        });
                  }
            } catch (error) {
                  Toast.error(t('notifications.error.fetch'));
            } finally {
                  setLoading(false);
            }
      };

      const handleUpdateProfile = async () => {
            if (!formData.name.trim() || !formData.username.trim()) {
                  return Toast.error(t('notifications.error.required'));
            }

            const toastId = Toast.loading(t('notifications.loading'));
            try {
                  const data = await updateProfile({
                        name: formData.name,
                        username: formData.username.toLowerCase().replace(/\s/g, ''),
                        bio: formData.bio
                  });
                  setProfileData(prev => ({ ...prev, user: data.user }));
                  setIsEditing(false);
                  Toast.success(t('notifications.success.profile_updated'), { id: toastId });
            } catch {
                  Toast.error(t('notifications.error.profile_failed'), { id: toastId });
            }
      };

      const handleAvatarUpload = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            if (file.size > 2 * 1024 * 1024) return Toast.error(t('notifications.error.image_too_large'));

            const formDataUpload = new FormData();
            formDataUpload.append('avatar', file);

            const toastId = Toast.loading(t('notifications.uploading_image'));
            try {
                  const data = await uploadAvatar(formDataUpload);
                  setProfileData(prev => ({ ...prev, user: data.user }));
                  Toast.success(t('notifications.success.avatar_updated'), { id: toastId });
            } catch {
                  Toast.error(t('notifications.error.avatar_failed'), { id: toastId });
            }
      };

      const handleLikeReview = async (reviewId) => {
            try {
                  const response = await toggleLike(reviewId);
                  setProfileData(prev => ({
                        ...prev,
                        user: {
                              ...prev.user,
                              reviews: prev.user.reviews.map(r => {
                                    if (r.id === reviewId) {
                                          return {
                                                ...r,
                                                is_liked_by_me: response.is_liked,
                                                likes_count: response.likes_count
                                          };
                                    }
                                    return r;
                              })
                        }
                  }));
                  if (response.is_liked) {
                        Toast.success(t('notifications.success.liked'));
                  }
            } catch (error) {
                  console.error("Like error:", error);
                  Toast.error(t('notifications.error.generic'));
            }
      };

      const handleDeleteReview = (reviewId) => {
            Toast.confirm(
                  () => executeDeletion(reviewId),
                  {
                        title: t('profile.confirm_delete_title'),
                        sub: t('profile.confirm_delete_sub'),
                        confirmText: t('common.delete'),
                        cancelText: t('common.cancel')
                  }
            );
      };

      const executeDeletion = async (reviewId) => {
            const toastId = Toast.loading(t('notifications.deleting'));
            try {
                  await deleteUserReview(reviewId);
                  setProfileData(prev => ({
                        ...prev,
                        user: {
                              ...prev.user,
                              reviews: prev.user.reviews.filter(r => r.id !== reviewId)
                        },
                        stats: {
                              ...prev.stats,
                              total_reviews: Math.max(0, (prev.stats?.total_reviews || 0) - 1)
                        }
                  }));
                  Toast.success(t('notifications.success.review_deleted'), { id: toastId });
            } catch (err) {
                  Toast.error(t('notifications.error.generic'), { id: toastId });
            }
      };

      if (loading) return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-8 h-8 text-elarx-gold animate-spin" />
                        <div className="animate-pulse font-black italic text-elarx-gold uppercase tracking-[0.5em] text-xs">
                              {t('common.loading')}
                        </div>
                  </div>
            </div>
      );

      if (!profileData || !profileData.user) return null;

      const { user, stats } = profileData;
      const userReviews = user.reviews || [];
      const userFavorites = user.favorites || [];

      return (
            <main className="min-h-screen bg-black pt-32 pb-20 px-6">
                  <div className="max-w-6xl mx-auto">

                        <GlassCard className="mb-12 p-10 rounded-[3rem] relative overflow-hidden border-white/5">
                              <div className="absolute top-0 right-0 w-80 h-80 bg-elarx-gold/10 blur-[120px] pointer-events-none" />

                              <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                                    <div className="relative group">
                                          <div className="w-44 h-44 rounded-full bg-gradient-to-tr from-elarx-gold to-yellow-200 p-1 shadow-[0_0_50px_-12px_rgba(212,175,55,0.3)]">
                                                <div className="w-full h-full rounded-full bg-black overflow-hidden border-[6px] border-black">
                                                      <img
                                                            src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=D4AF37&color=fff`}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                            alt={user.name}
                                                      />
                                                </div>
                                          </div>
                                          <label className="absolute -bottom-2 right-4 p-3 bg-elarx-gold rounded-full text-black cursor-pointer hover:scale-110 transition-all shadow-2xl border-4 border-black">
                                                <Camera size={20} strokeWidth={2.5} />
                                                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                                          </label>
                                    </div>

                                    <div className="flex-1 text-center md:text-left">
                                          {isEditing ? (
                                                <div className="space-y-4 max-w-2xl animate-in fade-in slide-in-from-top-4 duration-500">
                                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <Input
                                                                  label={t('profile.labels.name')}
                                                                  icon={User}
                                                                  value={formData.name}
                                                                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                            />
                                                            <Input
                                                                  label={t('profile.labels.username')}
                                                                  icon={AtSign}
                                                                  value={formData.username}
                                                                  onChange={e => setFormData({ ...formData, username: e.target.value })}
                                                            />
                                                      </div>
                                                      <textarea
                                                            value={formData.bio}
                                                            onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                                            placeholder={t('profile.placeholders.bio')}
                                                            className="bg-white/5 border border-white/10 text-gray-300 p-4 rounded-2xl w-full h-32 text-sm italic outline-none focus:border-elarx-gold/50 transition-all resize-none"
                                                      />
                                                </div>
                                          ) : (
                                                <>
                                                      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                                                            <h1 className="text-6xl font-black italic text-white uppercase tracking-tighter leading-none">
                                                                  {user.name}<span className="text-elarx-gold">.</span>
                                                            </h1>
                                                            <div className="inline-flex items-center gap-2 bg-elarx-gold/10 border border-elarx-gold/20 px-4 py-1.5 rounded-full">
                                                                  <AtSign size={12} className="text-elarx-gold" />
                                                                  <span className="text-[11px] font-black uppercase tracking-widest text-elarx-gold">@{user.username}</span>
                                                            </div>
                                                      </div>
                                                      <p className="text-gray-400 text-base max-w-xl italic mb-8 leading-relaxed border-l-2 border-elarx-gold/30 pl-6 bg-white/5 py-3 rounded-r-2xl">
                                                            "{user.bio || t('profile.no_bio')}"
                                                      </p>
                                                      <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                                            <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 px-5 py-2.5 rounded-full">
                                                                  <Mail size={14} className="text-elarx-gold" />
                                                                  <span className="text-[12px] text-gray-300 tracking-wide">{user.email}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 px-5 py-2.5 rounded-full">
                                                                  <Calendar size={14} className="text-elarx-gold" />
                                                                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{t('profile.joined')} <span className="text-white ml-1">{user.created_at}</span></span>
                                                            </div>
                                                      </div>
                                                </>
                                          )}
                                    </div>

                                    <div className="flex gap-2">
                                          {isEditing ? (
                                                <>
                                                      <button onClick={handleUpdateProfile} className="p-4 bg-elarx-gold text-black rounded-2xl hover:scale-105 transition-all shadow-lg shadow-elarx-gold/20">
                                                            <Save size={24} />
                                                      </button>
                                                      <button onClick={() => setIsEditing(false)} className="p-4 bg-white/5 text-gray-400 rounded-2xl hover:bg-white/10 transition-all">
                                                            <X size={24} />
                                                      </button>
                                                </>
                                          ) : (
                                                <button onClick={() => setIsEditing(true)} className="p-4 bg-white/[0.03] hover:bg-elarx-gold hover:text-black rounded-2xl border border-white/10 transition-all text-gray-400">
                                                      <Settings size={24} />
                                                </button>
                                          )}
                                    </div>
                              </div>
                        </GlassCard>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                              <StatCard icon={<Star className="text-elarx-gold" />} label={t('profile.stats.reviews')} value={userReviews.length} />
                              <StatCard icon={<Heart className="text-red-500" />} label={t('profile.stats.favorites')} value={userFavorites.length} />
                              <StatCard icon={<Shield className="text-blue-500" />} label={t('profile.stats.level')} value={stats?.reputation || 0} />
                        </div>

                        <GlassCard className="rounded-[3rem] border-white/5">
                              <div className="p-6 border-b border-white/5 flex justify-center">
                                    <div className="relative flex bg-black p-1.5 rounded-full border border-white/10 overflow-hidden">
                                          <div
                                                className="absolute top-1.5 bottom-1.5 left-1.5 transition-all duration-500 bg-elarx-gold rounded-full shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                                                style={{
                                                      width: 'calc(50% - 3px)',
                                                      transform: activeTab === 'favorites' ? 'translateX(0%)' : 'translateX(100%)'
                                                }}
                                          />
                                          {['favorites', 'reviews'].map(tab => (
                                                <button
                                                      key={tab}
                                                      onClick={() => setActiveTab(tab)}
                                                      className={`relative z-10 px-12 py-3.5 rounded-full text-[10px] font-black uppercase tracking-[0.25em] transition-colors duration-500 ${activeTab === tab ? 'text-black' : 'text-gray-500 hover:text-gray-300'}`}
                                                >
                                                      {t(`profile.tabs.${tab}`)}
                                                </button>
                                          ))}
                                    </div>
                              </div>

                              <div className="p-10">
                                    {activeTab === 'favorites' ? (
                                          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                                {userFavorites.length > 0 ? (
                                                      userFavorites.map(fav => (
                                                            <ContentCard key={fav.id} item={{ ...fav, is_favorite_by_me: true }} />
                                                      ))
                                                ) : (
                                                      <p className="col-span-full text-center text-gray-600 italic text-xs py-10 uppercase tracking-widest">{t('profile.empty.favorites')}</p>
                                                )}
                                          </div>
                                    ) : (
                                          <div className="grid grid-cols-1 gap-6">
                                                {userReviews.length > 0 ? (
                                                      userReviews.map(rev => (
                                                            <ReviewCard
                                                                  key={rev.id}
                                                                  rev={{ ...rev, usuario: user.name }}
                                                                  currentUser={currentUser}
                                                                  onDelete={() => handleDeleteReview(rev.id)}
                                                                  onLike={() => handleLikeReview(rev.id)}
                                                                  t={t}
                                                            />
                                                      ))
                                                ) : (
                                                      <p className="text-center text-gray-600 italic text-xs py-10 uppercase tracking-widest">{t('profile.empty.reviews')}</p>
                                                )}
                                          </div>
                                    )}
                              </div>
                        </GlassCard>
                  </div>
            </main>
      );
};

export default Profile;