import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useTranslation } from 'react-i18next';
import { Users, Film, MessageSquare, Tag } from 'lucide-react';
import ContentCard from '../../components/content/ContentCard';
import { Toast } from '../../services/toast/toastActions';

export default function StatsOverview() {
      const [stats, setStats] = useState(null);
      const [loading, setLoading] = useState(true);
      const { t } = useTranslation();

      useEffect(() => {
            const fetchStats = async () => {
                  setLoading(true);
                  try {
                        const res = await api.get('/admin/stats');
                        setStats(res.data);
                  } catch {
                        Toast.error(t('notifications.error.generic'));
                  } finally {
                        setLoading(false);
                  }
            };
            fetchStats();
      }, [t]);

      if (loading) return (
            <div className="flex items-center justify-center h-96">
                  <div className="w-12 h-[1px] bg-elarx-gold animate-pulse" />
            </div>
      );

      return (
            <div className="space-y-20 animate-in fade-in duration-1000">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                        <DataMetric label={t('admin.stats.total_users')} value={stats?.totals?.users} icon={<Users />} />
                        <DataMetric label={t('admin.stats.content_count')} value={stats?.totals?.contents} icon={<Film />} />
                        <DataMetric label={t('admin.stats.active_reviews')} value={stats?.totals?.reviews} icon={<MessageSquare />} />
                        <DataMetric label={t('admin.stats.genres')} value={stats?.totals?.genres} icon={<Tag />} />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        <div className="lg:col-span-4 space-y-8">
                              <header className="flex flex-col gap-2">
                                    <span className="text-elarx-gold font-black text-[10px] uppercase tracking-[0.5em]">
                                          {t('admin.management')}
                                    </span>
                                    <h3 className="text-white font-black text-2xl uppercase italic tracking-tighter">
                                          {t('admin.stats.recent_users')}
                                    </h3>
                              </header>

                              <div className="space-y-1">
                                    {stats?.recent_users?.slice(0, 5).map(user => (
                                          <div key={user.id} className="group relative">
                                                <div className="group flex items-center justify-between p-4 hover:bg-white/[0.03] rounded-2xl transition-all">
                                                      <div className="flex items-center gap-4">
                                                            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[10px] font-black text-gray-500 group-hover:border-elarx-gold/50 group-hover:text-elarx-gold transition-colors">
                                                                  {user.name.charAt(0)}
                                                            </div>
                                                            <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">
                                                                  {user.name}
                                                            </span>
                                                      </div>
                                                </div>
                                                <div className="h-[2px] w-50 bg-elarx-gold/20 mt-4 group-hover:w-80 group-hover:bg-elarx-gold transition-all duration-700" />
                                          </div>
                                    ))}
                              </div>
                        </div>

                        <div className="lg:col-span-8 space-y-8">
                              <header className="flex justify-between items-end">
                                    <div className="flex flex-col gap-2">
                                          <span className="text-white/30 font-black text-[10px] uppercase tracking-[0.5em]">
                                                {t('admin.stats.latest_content')}
                                          </span>
                                          <h3 className="text-white font-black text-2xl uppercase italic tracking-tighter">
                                                {t('admin.new_additions')}
                                          </h3>
                                    </div>
                              </header>

                              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    {stats?.latest_content?.slice(0, 3).map(item => (
                                          <div key={item.id} className="scale-95 hover:scale-100 transition-transform duration-500">
                                                <ContentCard content={item} />
                                          </div>
                                    ))}
                              </div>
                        </div>
                  </div>
            </div>
      );
}

function DataMetric({ label, value, icon }) {
      return (
            <div className="group relative">
                  <div className="flex items-center gap-3 mb-2 opacity-30 group-hover:opacity-100 transition-all duration-500">
                        <span className="scale-75 text-elarx-gold">{icon}</span>
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white">{label}</span>
                  </div>
                  <div className="flex items-baseline">
                        <span className="text-7xl font-black italic tracking-tighter text-white transition-transform group-hover:translate-x-2 duration-700">
                              {value?.toLocaleString() || 0}
                        </span>
                  </div>
                  <div className="h-[2px] w-6 bg-elarx-gold/20 mt-4 group-hover:w-12 group-hover:bg-elarx-gold transition-all duration-700" />
            </div>
      );
}
