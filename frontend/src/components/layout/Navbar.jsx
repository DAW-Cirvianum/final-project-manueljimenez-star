import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '../../context/AuthContext';
import { useContents } from '../../hooks/useContents';

import { Button } from '../ui/Button';
import SearchModal from '../ui/SearchModal';
import { Toast } from '../../services/toast/toastActions';
import { LogOut, User, Shield, LayoutDashboard, Star, Search } from 'lucide-react';

export default function Navbar() {
      const { user, logout } = useAuthContext();
      const { contents: allContents, fetchContents } = useContents();

      const navigate = useNavigate();
      const location = useLocation();
      const { t, i18n } = useTranslation();

      const [isSearchOpen, setIsSearchOpen] = useState(false);
      const [isScrolled, setIsScrolled] = useState(false);

      const changeLanguage = (lang) => {
            i18n.changeLanguage(lang);
            localStorage.setItem('elarx_language', lang);
      };

      useEffect(() => {
            if (user && allContents.length === 0) {
                  fetchContents({ all: true }).catch()
            }
      }, [user, allContents.length, fetchContents]);

      useEffect(() => {
            const handleScroll = () => setIsScrolled(window.scrollY > 20);
            window.addEventListener('scroll', handleScroll, { passive: true });
            return () => window.removeEventListener('scroll', handleScroll);
      }, []);

      const handleLogout = useCallback(() => {
            logout();
            Toast.success(t('notifications.success.logout') || "Session closed");
            navigate('/login');
      }, [logout, navigate, t]);

      return (
            <>
                  <nav
                        className={`fixed top-0 w-full z-50 transition-all duration-500 select-none ${isScrolled
                                    ? 'bg-elarx-black/80 backdrop-blur-xl border-b border-white/5 py-3 shadow-2xl'
                                    : 'bg-transparent py-6'
                              }`}
                        role="navigation"
                        aria-label="Main Navigation"
                  >
                        <div className="max-w-[1800px] mx-auto px-6 md:px-10">
                              <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-10">
                                          <Link to="/" className="flex items-center gap-3 group" aria-label="Elarx Home">
                                                <div className="w-9 h-9 bg-elarx-gold rounded-lg flex items-center justify-center font-black text-black group-hover:rotate-[10deg] transition-all duration-luxury shadow-gold-glow">
                                                      E
                                                </div>
                                                <span className="text-xl font-black tracking-tighter text-white uppercase italic group-hover:text-elarx-gold transition-colors">
                                                      Elarx<span className="text-elarx-gold">.</span>
                                                </span>
                                          </Link>

                                          <div className="hidden lg:flex items-center gap-8 border-l border-white/10 pl-10">
                                                <Link
                                                      to="/catalog"
                                                      className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all italic ${location.pathname === '/catalog'
                                                                  ? 'text-elarx-gold'
                                                                  : 'text-gray-400 hover:text-white'
                                                            }`}
                                                >
                                                      {t('nav.catalog')}
                                                </Link>
                                          </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                          <button
                                                onClick={() => setIsSearchOpen(true)}
                                                className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/5 rounded-full text-gray-400 hover:border-elarx-gold/30 hover:text-white transition-all group"
                                                aria-label={t('common.search')}
                                          >
                                                <Search size={14} className="group-hover:scale-110 transition-transform" />
                                                <span className="text-[9px] font-black uppercase tracking-widest">{t('common.search')}</span>
                                          </button>

                                          <div className="h-6 w-[1px] bg-white/10 mx-2 hidden md:block" aria-hidden="true" />

                                          <div className="hidden sm:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/5">
                                                {['es', 'en'].map((lang) => (
                                                      <button
                                                            key={lang}
                                                            onClick={() => changeLanguage(lang)}
                                                            className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase transition-all ${i18n.language.includes(lang) ? 'bg-elarx-gold text-black' : 'text-gray-500 hover:text-white'
                                                                  }`}
                                                            aria-pressed={i18n.language.includes(lang)}
                                                      >
                                                            {lang}
                                                      </button>
                                                ))}
                                          </div>

                                          {user ? (
                                                <div className="flex items-center gap-4 ml-2">
                                                      {/* REPUTACIÓN */}
                                                      <div className="hidden xs:flex items-center gap-2 bg-elarx-gold/5 px-3 py-1.5 rounded-full border border-elarx-gold/20">
                                                            <Star size={10} className="text-elarx-gold fill-elarx-gold" />
                                                            <span className="text-xs font-black text-white">{user.reputation_score || 0}</span>
                                                      </div>

                                                      <div className="hidden sm:flex flex-col items-end justify-center">
                                                            <span className="text-[10px] font-black text-white uppercase tracking-tight leading-none mb-1">
                                                                  {user.name}
                                                            </span>
                                                            <span className="text-[8px] font-bold text-elarx-gold/80 italic leading-none uppercase">
                                                                  @{user.username || 'member'}
                                                            </span>
                                                      </div>

                                                      <Link
                                                            to="/profile"
                                                            className="relative flex w-10 h-10 rounded-xl bg-elarx-card border border-white/10 items-center justify-center text-gray-400 hover:text-elarx-gold hover:border-elarx-gold/50 transition-all duration-300"
                                                            aria-label="Profile"
                                                      >
                                                            {user.role === 'admin' ? <Shield size={18} /> : <User size={18} />}
                                                            <span
                                                                  className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-elarx-black ${user.role === 'admin' ? 'bg-elarx-gold' : 'bg-blue-500'
                                                                        }`}
                                                            />
                                                      </Link>

                                                      {user.role === 'admin' && (
                                                            <Link to="/admin" className="p-2 text-gray-500 hover:text-elarx-gold transition-colors">
                                                                  <LayoutDashboard size={18} />
                                                            </Link>
                                                      )}

                                                      <button
                                                            onClick={handleLogout}
                                                            className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                                                            aria-label="Logout"
                                                      >
                                                            <LogOut size={18} />
                                                      </button>
                                                </div>
                                          ) : (
                                                <div className="flex items-center gap-2">
                                                      <Button
                                                            variant="ghost"
                                                            onClick={() => navigate('/login')}
                                                            className="text-[10px] uppercase font-black"
                                                      >
                                                            {t('auth.login_action')}
                                                      </Button>
                                                      <Button
                                                            onClick={() => navigate('/register')}
                                                            className="text-[10px] px-6 uppercase font-black"
                                                      >
                                                            {t('auth.register_action')}
                                                      </Button>
                                                </div>
                                          )}
                                    </div>
                              </div>
                        </div>
                  </nav>

                  <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} items={allContents} />
            </>
      );
}
