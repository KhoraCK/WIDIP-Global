import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuthStore } from './store';
import { useToastStore } from './store/toastStore';
import { ToastContainer, Spinner } from './components/ui';

// Lazy load pages
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Chat = lazy(() => import('./pages/Chat').then(m => ({ default: m.Chat })));
const Supervision = lazy(() => import('./pages/Supervision').then(m => ({ default: m.Supervision })));
const AdminUsers = lazy(() => import('./pages/AdminUsers').then(m => ({ default: m.AdminUsers })));

// Loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-text-secondary">Chargement...</p>
      </div>
    </div>
  );
}

function App() {
  const { initAuth } = useAuthStore();
  const { toasts, removeToast } = useToastStore();

  // Initialiser l'auth depuis localStorage au demarrage
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Redirect root to chat */}
          <Route path="/" element={<Navigate to="/chat" replace />} />

          {/* Login page */}
          <Route path="/login" element={<Login />} />

          {/* Protected chat page */}
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />

          {/* Protected supervision page (admin only - checked in component) */}
          <Route
            path="/supervision"
            element={
              <ProtectedRoute>
                <Supervision />
              </ProtectedRoute>
            }
          />

          {/* Protected admin users page (admin only - checked in component) */}
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <AdminUsers />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to chat */}
          <Route path="*" element={<Navigate to="/chat" replace />} />
        </Routes>
      </Suspense>

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </BrowserRouter>
  );
}

export default App;
