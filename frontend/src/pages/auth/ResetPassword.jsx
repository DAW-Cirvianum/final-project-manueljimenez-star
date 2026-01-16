import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authService } from '../../services/authService';
import { Lock, CheckCircle, ArrowLeft, ShieldCheck } from 'lucide-react';

import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Toast } from '../../services/toast/toastActions';

export default function ResetPassword() {
      const [searchParams] = useSearchParams();
      const navigate = useNavigate();
      const { t } = useTranslation();

      const [password, setPassword] = useState('');
      const [passwordConfirmation, setPasswordConfirmation] = useState('');
      const [loading, setLoading] = useState(false);
      const [success, setSuccess] = useState(false);

      const token = searchParams.get('token');
      const email = searchParams.get('email');

      const handleSubmit = async (e) => {
            e.preventDefault();

            if (password !== passwordConfirmation) {
                  return Toast.error(t('notifications.error.mismatch'));
            }

            setLoading(true);
            try {
                  await authService.resetPassword({ token, email, password, password_confirmation: passwordConfirmation });
                  setSuccess(true);
                  Toast.success(t('notifications.success.password_changed'));
                  setTimeout(() => navigate('/login'), 5000);
            } catch (err) {
                  const message = err.response?.data?.message || t('notifications.error.invalid_link');
                  Toast.error(message);
            } finally {
                  setLoading(false);
            }
      };

      if (success) {
            return (
                  <div className="min-h-screen flex items-center justify-center bg-elarx-black px-4 select-none">
                        <div className="max-w-md w-full bg-[#0a0a0a] p-12 rounded-[2.5rem] border border-elarx-gold/20 text-center shadow-[0_0_50px_rgba(212,175,55,0.05)] relative overflow-hidden">
                              <div className="absolute -top-24 -left-24 w-48 h-48 bg-elarx-gold/10 blur-[100px] rounded-full" />

                              <div className="relative z-10">
                                    <div className="w-24 h-24 bg-elarx-gold/5 border border-elarx-gold/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                                          <CheckCircle className="text-elarx-gold" size={48} strokeWidth={1.5} />
                                    </div>

                                    <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter mb-4">
                                          {t('reset.success_title') || 'Password Updated'}<span className="text-elarx-gold">.</span>
                                    </h2>

                                    <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-10 leading-relaxed">
                                          {t('reset.success_sub')}
                                    </p>

                                    <Button onClick={() => navigate('/login')} className="w-full" icon={ShieldCheck}>
                                          {t('common.login')}
                                    </Button>
                              </div>
                        </div>
                  </div>
            );
      }

      return (
            <div className="min-h-screen flex items-center justify-center bg-elarx-black px-4 select-none">
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
                                          {t('reset.title')}<span className="text-elarx-gold">.</span>
                                    </h2>
                                    <p className="text-gray-500 text-[11px] font-bold uppercase tracking-[0.2em] border-l-2 border-elarx-gold/20 pl-4 leading-relaxed">
                                          {t('reset.description')}
                                    </p>
                              </header>

                              <form onSubmit={handleSubmit} className="space-y-6">
                                    <Input
                                          label={t('reset.new_pass')}
                                          type="password"
                                          icon={Lock}
                                          value={password}
                                          onChange={(e) => setPassword(e.target.value)}
                                          placeholder="••••••••"
                                          required
                                          autoComplete="new-password"
                                    />

                                    <Input
                                          label={t('reset.confirm_pass')}
                                          type="password"
                                          icon={Lock}
                                          value={passwordConfirmation}
                                          onChange={(e) => setPasswordConfirmation(e.target.value)}
                                          placeholder="••••••••"
                                          required
                                          autoComplete="new-password"
                                    />

                                    <Button
                                          type="submit"
                                          loading={loading}
                                          className="w-full mt-4"
                                          icon={ShieldCheck}
                                    >
                                          {t('reset.button')}
                                    </Button>
                              </form>
                        </div>
                  </div>
            </div>
      );
}
