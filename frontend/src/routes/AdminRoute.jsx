import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // O useAuthContext según tu proyecto
import { useTranslation } from 'react-i18next';
import { Toast } from '../services/toast/toastActions';
import { ShieldCheck, Loader2 } from 'lucide-react';

// Definimos el Loader con estética ELARX aquí mismo para evitar el ReferenceError
const AdminLoader = () => (
      <div className="min-h-screen bg-elarx-black flex flex-col items-center justify-center gap-4">
            <div className="relative">
                  <Loader2 className="w-12 h-12 text-elarx-gold animate-spin" />
                  <ShieldCheck className="w-6 h-6 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-elarx-gold animate-pulse">
                  Verificando Credenciales
            </span>
      </div>
);

export const AdminRoute = () => {
      const { user, loading } = useAuth();
      const { t } = useTranslation();

      useEffect(() => {
            // Si terminó de cargar, hay usuario pero NO es admin
            if (!loading && user && user.role !== 'admin') {
                  Toast.error(t('notifications.error.unauthorized') || "Acceso Denegado: Se requieren permisos de administrador");
            }
      }, [loading, user, t]);

      // 1. Mientras verifica la sesión
      if (loading) return <AdminLoader />;

      // 2. Si no hay usuario logueado -> Al Login
      if (!user) return <Navigate to="/login" replace />;

      // 3. Si hay usuario pero NO es admin -> Al Catálogo (Evita el bucle con Login)
      if (user.role !== 'admin') return <Navigate to="/catalog" replace />;

      // 4. Si es admin -> Renderiza el panel
      return <Outlet />;
};