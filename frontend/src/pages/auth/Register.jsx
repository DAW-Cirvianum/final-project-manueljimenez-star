import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '../../context/AuthContext';

import { User, Mail, Lock, AtSign, ArrowRight } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { Toast } from '../../services/toast/toastActions';

export default function Register() {
      const [formData, setFormData] = useState({
            name: '',
            username: '',
            email: '',
            password: ''
      });
      const [loading, setLoading] = useState(false);
      const [errors, setErrors] = useState({});

      const { register, login } = useAuthContext();
      const navigate = useNavigate();
      const { t } = useTranslation();

      const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);
            setErrors({});

            try {
                  await register(formData);

                  Toast.success(t('notifications.success.register_verify') || "Account created! Please verify your email before logging in.");

                  navigate('/login');

            } catch (err) {
                  console.error("Error completo:", err);
                  if (err.response?.status === 422) {
                        setErrors(err.response.data.errors || {});
                        const firstError = Object.values(err.response.data.errors)[0][0];
                        Toast.error(firstError || "Datos inválidos");
                  } else {
                        Toast.error(err.response?.data?.message || "Error al registrar");
                  }
            } finally {
                  setLoading(false);
            }
      };

      return (
            <main className="min-h-screen flex items-center justify-center bg-elarx-black px-4 relative overflow-hidden select-none">
                  <div className="absolute -top-24 -left-24 w-64 h-64 bg-elarx-gold/5 blur-[120px] rounded-full pointer-events-none" />

                  <div className="relative z-10 w-full max-w-md py-12">
                        <GlassCard className="p-10">

                              <header className="mb-10 text-center">
                                    <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter mb-2">
                                          {t('register.title')}<span className="text-elarx-gold">.</span>
                                    </h2>
                                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] italic border-b border-white/5 pb-4 inline-block">
                                          {t('register.subtitle')}
                                    </p>
                              </header>

                              <form onSubmit={handleSubmit} className="space-y-5">
                                    <Input
                                          label={t('register.labels.name')}
                                          placeholder="John Doe"
                                          icon={User}
                                          value={formData.name}
                                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                          error={errors.name?.[0]}
                                          required
                                    />

                                    <Input
                                          label={t('register.labels.username')}
                                          placeholder="johndoe_elarx"
                                          icon={AtSign}
                                          value={formData.username}
                                          onChange={(e) => setFormData({
                                                ...formData,
                                                username: e.target.value.toLowerCase().replace(/\s/g, '')
                                          })}
                                          error={errors.username?.[0]}
                                          required
                                    />

                                    <Input
                                          label={t('register.labels.email')}
                                          type="email"
                                          placeholder="tu@email.com"
                                          icon={Mail}
                                          value={formData.email}
                                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                          error={errors.email?.[0]}
                                          required
                                    />

                                    <Input
                                          label={t('register.labels.password')}
                                          type="password"
                                          placeholder="••••••••"
                                          icon={Lock}
                                          value={formData.password}
                                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                          error={errors.password?.[0]}
                                          required
                                    />

                                    <Button
                                          type="submit"
                                          loading={loading}
                                          icon={ArrowRight}
                                          className="w-full py-4 mt-4"
                                    >
                                          {t('register.submit_button')}
                                    </Button>
                              </form>

                              <footer className="mt-10 pt-8 border-t border-white/5 text-center flex flex-col gap-4">
                                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.15em]">
                                          {t('register.already_have_account')}{' '}
                                          <Link
                                                to="/login"
                                                className="text-elarx-gold hover:text-white transition-all underline underline-offset-4 ml-1"
                                          >
                                                {t('register.login_link')}
                                          </Link>
                                    </p>
                              </footer>
                        </GlassCard>
                  </div>
            </main>
      );
}
