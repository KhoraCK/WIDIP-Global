import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuthStore } from './store';
import { useToastStore } from './store/toastStore';
import { ToastContainer, Spinner } from './components/ui';

// Lazy load pages
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Chat = lazy(() => import('./pages/Chat').then(m => ({ default: m.Chat })));

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
