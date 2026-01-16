import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthContext } from "../../context/AuthContext";
import { useTranslation } from 'react-i18next';
import { Mail, Lock, LogIn } from 'lucide-react';

import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { Toast } from '../../services/toast/toastActions';

export default function Login() {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  // Consumimos directamente del contexto unificado
  const { login, user, loading: authLoading } = useAuthContext();

  const navigate = useNavigate();
  const { t } = useTranslation();


  useEffect(() => {
    const status = searchParams.get('verified');
    const error = searchParams.get('error');

    if (status === '1') {
      Toast.success(t('notifications.success.verified_ready') || "Cuenta verificada.");
      navigate('/login', { replace: true });
    }

    // CAMBIO AQUÍ: react-hot-toast no suele tener .info por defecto, usa .success o el genérico toast()
    if (status === 'already') {
      Toast.success(t('notifications.info.already_verified') || "Tu cuenta ya está verificada.");
      navigate('/login', { replace: true });
    }

    if (error === 'invalid_token') {
      Toast.error(t('notifications.error.invalid_link') || "Link inválido.");
      navigate('/login', { replace: true });
    }
  }, [searchParams, t, navigate]);

  // --- REDIRECCIÓN AUTOMÁTICA ---
  useEffect(() => {
    // Si ya hay un usuario cargado al entrar, lo mandamos a su sitio
    if (!authLoading && user) {
      navigate('/catalog', { replace: true });
    }
  }, [user, authLoading]);

  // --- GESTIÓN DE NOTIFICACIONES EXTERNAS ---
  useEffect(() => {
    const status = searchParams.get('verified');
    const error = searchParams.get('error');

    if (status === '1') {
      Toast.success(t('notifications.success.verified_ready') || "Cuenta verificada.");
      navigate('/login', { replace: true });
    }
    if (status === 'already') Toast.success(t('notifications.info.already_verified'));
    if (error === 'invalid_token') Toast.error(t('notifications.error.invalid_link'));
  }, [searchParams, t, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const userData = await login({
        login: emailOrUsername,
        password
      });

      Toast.success(t('login.success') || "Acceso concedido.");

      const destination = userData.role === 'admin' ? '/profile' : '/catalog';
      navigate(destination, { replace: true });

    } catch (err) {
      const msg = err.response?.data?.message || t('login.error_credentials');
      Toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-elarx-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-elarx-gold/20 border-t-elarx-gold rounded-full animate-spin" />
        <script>
          {setTimeout(() => { if (document.querySelector('.animate-spin')) window.location.reload() }, 5000)}
        </script>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-elarx-black px-4 select-none relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-elarx-gold/10 blur-[100px] rounded-full pointer-events-none" />

      <GlassCard className="max-w-md w-full p-10 relative">
        <header className="mb-10">
          <h1 className="text-4xl font-black italic text-white uppercase tracking-tighter mb-2">
            {t('login.title')}<span className="text-elarx-gold">.</span>
          </h1>
          <p className="text-gray-500 text-[11px] font-bold uppercase tracking-[0.2em] border-l-2 border-elarx-gold/20 pl-4">
            {t('login.welcome_back')}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label={t('login.identifier_label')}
            icon={Mail}
            placeholder="johndoe@elarx.com"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            required
            autoComplete="username"
          />

          <div className="space-y-2">
            <Input
              label={t('login.password_label')}
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-elarx-gold transition-colors italic bg-transparent border-none cursor-pointer"
              >
                {t('forgot.help_text')}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            loading={loading}
            icon={LogIn}
            className="w-full mt-4 py-4"
          >
            {t('login.button')}
          </Button>

          <footer className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">
              {t('register.new_to_network')}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="ml-2 text-white hover:text-elarx-gold transition-colors font-black italic bg-transparent border-none cursor-pointer"
              >
                {t('register.register_action')}
              </button>
            </p>
          </footer>
        </form>
      </GlassCard>
    </main>
  );
}