import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';


// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Client Pages
import Home from './pages/client/Home';
import Catalog from './pages/client/Catalog';
import ContentDetail from './pages/client/ContentDetail';
import Profile from './pages/client/Profile';

// Admin Pages
import AdminPanel from './pages/admin/AdminPanel';

// Guards
import ProtectedRoute from './routes/ProtectedRoute';
import { AdminRoute } from './routes/AdminRoute';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="bottom-center"
          toastOptions={{
            className: 'bg-[var(--color-elarx-card)] border border-white/5 text-white rounded-2xl font-black italic uppercase tracking-[0.15em] text-[10px] shadow-2xl shadow-black',
            duration: 3000,
            style: {
              background: 'var(--color-elarx-card)',
              color: 'var(--color-elarx-text-primary)',
              border: '1px solid rgba(255,255,255,0.05)'
            }
          }}
        />
        <Routes>
          {/* Usamos MainLayout para que todas estas páginas tengan el Navbar automáticamente */}
          <Route element={<MainLayout />}>

            {/* Rutas Públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Rutas Protegidas (Usuario logueado) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/contents/:id" element={<ContentDetail />} />
            </Route>

            {/* Rutas de Administrador */}
            <Route element={<AdminRoute />}>
              <Route path="/admin/*" element={<AdminPanel />} />
            </Route>

            {/* Error 404 */}
            <Route path="*" element={
              <div className="text-white p-20 text-center text-2xl font-bold">
                Página no encontrada (404)
              </div>
            } />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;