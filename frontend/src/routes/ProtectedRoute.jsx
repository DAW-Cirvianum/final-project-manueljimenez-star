import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
      const { user, loading } = useAuthContext();

      if (loading) {
            return (
                  <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
                  </div>
            );
      }

      if (!user) {
            return <Navigate to="/login" replace />;
      }

      return <Outlet />;
};

export default ProtectedRoute;