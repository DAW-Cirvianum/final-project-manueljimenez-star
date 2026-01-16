import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authService } from '../../services/authService';
import { Mail, ArrowLeft, LifeBuoy } from 'lucide-react';

import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Toast } from '../../services/toast/toastActions';

export default function ForgotPassword() {
      const [email, setEmail] = useState('');
      const [loading, setLoading] = useState(false);
      const { t } = useTranslation();
      const navigate = useNavigate();

      const handleSubmit = async (e) => {
            e.preventDefault();
            if (!email.trim()) return Toast.error(t('forgot.error_required') || "Ingresa un email válido");

            setLoading(true);
            try {
                  await authService.forgotPassword(email);
                  Toast.success(t('notifications.success.reset_email') || "Se envió un correo de recuperación");
                  setTimeout(() => navigate('/login'), 3000);
            } catch (err) {
                  const message = err.response?.data?.message || t('notifications.error.email_not_found');
                  Toast.error(message);
            } finally {
                  setLoading(false);
            }
      };

      return (
            <main className="min-h-screen flex items-center justify-center bg-elarx-black px-4 select-none">
                  <div className="max-w-md w-full bg-[#0a0a0a] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">

                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-elarx-gold/5 blur-[100px] rounded-full" />

                        <div className="relative z-10">

                              <button
                                    onClick={() => navigate('/login')}
                                    className="group flex items-center gap-2 text-gray-600 hover:text-white transition-all text-[9px] font-black uppercase tracking-[0.3em] mb-10"
                              >
                                    <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-1" />
                                    {t('common.back')}
                              </button>

                              <header className="mb-8">
                                    <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter mb-2">
                                          {t('forgot.title')}<span className="text-elarx-gold">.</span>
                                    </h2>
                                    <p className="text-gray-500 text-[11px] font-bold uppercase tracking-[0.2em] border-l-2 border-elarx-gold/20 pl-4 leading-relaxed">
                                          {t('forgot.description')}
                                    </p>
                              </header>

                              <form onSubmit={handleSubmit} className="space-y-6">
                                    <Input
                                          label={t('forgot.label')}
                                          type="email"
                                          icon={Mail}
                                          placeholder={t('forgot.placeholder') || "tu@email.com"}
                                          value={email}
                                          onChange={(e) => setEmail(e.target.value)}
                                          required
                                    />

                                    <Button
                                          type="submit"
                                          loading={loading}
                                          className="w-full mt-2"
                                    >
                                          {t('forgot.button')}
                                    </Button>
                              </form>

                              <footer className="mt-12 text-center border-t border-white/5 pt-8">
                                    <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em] flex flex-col items-center gap-3">
                                          {t('forgot.help_text')}
                                          <a
                                                href="mailto:support@elarx.com"
                                                className="flex items-center gap-2 text-elarx-gold hover:text-elarx-gold-light transition-colors"
                                          >
                                                <LifeBuoy size={14} />
                                                <span className="underline underline-offset-4">{t('forgot.support_link')}</span>
                                          </a>
                                    </p>
                              </footer>

                        </div>
                  </div>
            </main>
      );
}
