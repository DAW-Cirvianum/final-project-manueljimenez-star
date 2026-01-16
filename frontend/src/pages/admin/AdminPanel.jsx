import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import {
      LayoutDashboard, Film, Users, Settings
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Badge } from '../../components/ui/Badge';
import ContentManager from './ContentManager';
import UserManager from './UserManager';
import SettingsManager from './SettingsManager';
import StatsOverview from './StatsOverview';
import { useAuthContext } from '../../context/AuthContext';

export default function AdminPanel() {
      const { t } = useTranslation();
      const { user } = useAuthContext();
      const [activeTab, setActiveTab] = useState('dashboard');
      const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 });
      const tabsRef = useRef([]);

      const tabs = [
            { id: 'dashboard', label: t('admin.tabs.dashboard'), icon: LayoutDashboard },
            { id: 'contents', label: t('admin.tabs.content'), icon: Film },
            { id: 'users', label: t('admin.tabs.users'), icon: Users },
            { id: 'settings', label: t('admin.tabs.settings'), icon: Settings },
      ];

      useEffect(() => {
            const currentIndex = tabs.findIndex(t => t.id === activeTab);
            const activeTabElement = tabsRef.current[currentIndex];
            if (activeTabElement) {
                  setSliderStyle({
                        left: activeTabElement.offsetLeft,
                        width: activeTabElement.clientWidth,
                  });
            }
      }, [activeTab, t]);

      if (!user) return null;

      return (
            <div className="min-h-screen bg-elarx-black text-white pt-24 pb-20 px-6">
                  <div className="max-w-7xl mx-auto">
                        <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                              <div>
                                    <p className="text-elarx-gold font-black uppercase tracking-[0.4em] text-[10px] mb-3 opacity-80">
                                          {t('admin.management')}
                                    </p>
                                    <h2 className="text-6xl font-black italic uppercase tracking-tighter leading-none">
                                          {t('admin.title')}<span className="text-elarx-gold">.</span>
                                    </h2>
                              </div>
                              <Badge variant="gold" className="px-5 py-2 flex items-center gap-3 self-start md:self-auto">
                                    <span className="relative flex h-2 w-2">
                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-elarx-gold opacity-75"></span>
                                          <span className="relative inline-flex rounded-full h-2 w-2 bg-elarx-gold"></span>
                                    </span>
                                    <span className="tracking-[0.2em]">{t('admin.system')}</span>
                              </Badge>
                        </header>

                        <div className="flex justify-center md:justify-start mb-10">
                              <div className="relative flex bg-[#080808] p-1.5 rounded-full border border-white/5 shadow-2xl overflow-hidden overflow-x-auto no-scrollbar">
                                    <div
                                          className="absolute top-1.5 bottom-1.5 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
                                          style={{
                                                left: `${sliderStyle.left}px`,
                                                width: `${sliderStyle.width}px`,
                                          }}
                                    >
                                          <div className="w-full h-full rounded-full bg-elarx-gold shadow-[0_0_20px_rgba(212,175,55,0.3)] relative overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-40" />
                                          </div>
                                    </div>

                                    {tabs.map((tab, index) => {
                                          const Icon = tab.icon;
                                          const isActive = activeTab === tab.id;
                                          return (
                                                <button
                                                      key={tab.id}
                                                      ref={el => tabsRef.current[index] = el}
                                                      onClick={() => setActiveTab(tab.id)}
                                                      className={`relative z-10 flex items-center gap-3 px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 whitespace-nowrap ${isActive ? 'text-black' : 'text-gray-500 hover:text-white'
                                                            }`}
                                                >
                                                      <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                                                      {tab.label}
                                                </button>
                                          );
                                    })}
                              </div>
                        </div>
                  </div>

                  <GlassCard className="p-1 rounded-[3rem] border-white/5 overflow-hidden">
                        <div className="bg-black/20 backdrop-blur-3xl p-8 md:p-12 min-h-[600px]">
                              <div className="animate-in fade-in zoom-in-95 duration-500">
                                    {activeTab === 'dashboard' && <StatsOverview />}
                                    {activeTab === 'contents' && <ContentManager />}
                                    {activeTab === 'users' && <UserManager />}
                                    {activeTab === 'settings' && <SettingsManager />}
                              </div>
                        </div>
                  </GlassCard>
            </div>
      );
}
