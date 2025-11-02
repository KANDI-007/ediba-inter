import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import LogoIcon from './components/LogoIcon';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import DashboardModern from './components/DashboardModern';
import Layout from './components/Layout';
import InvoiceModule from './components/modules/InvoiceModule';
import ClientsModule from './components/modules/ClientsModule';
import SuppliersModule from './components/modules/SuppliersModule';
import SuppliersModuleFinal from './components/modules/SuppliersModuleFinal';
import ReportsModule from './components/modules/ReportsModule';
import DischargeModule from './components/modules/DischargeModule';
import DischargeModuleModern from './components/modules/DischargeModuleModern';
import FiscalYearModule from './components/modules/FiscalYearModule';
import BackupModule from './components/modules/BackupModule';
import ActivityLogModule from './components/modules/ActivityLogModule';
import ActivityLogModuleModern from './components/modules/ActivityLogModuleModern';
import ParametersModule from './components/modules/ParametersModule';
import ArticlesModule from './components/modules/ArticlesModule';
import UsersModule from './components/modules/UsersModule';
import PayrollModule from './components/modules/PayrollModule';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ActivityProvider } from './contexts/ActivityContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { FiscalYearProvider } from './contexts/FiscalYearContext';
import { BackupProvider } from './contexts/BackupContext';
import { ChatProvider } from './contexts/ChatContextProduction';
import { UserPresenceProvider } from './contexts/UserPresenceContext';
import ChatModule from './components/modules/ChatModuleSimple';
import NotificationContainer from './components/NotificationToast';
import ActivityNotificationManager from './components/ActivityNotificationManager';
import PWAInstaller from './components/PWAInstaller';
import InvoiceProforma from './components/InvoiceProforma';
import { NotificationPermissionRequest } from './components/NotificationPermissionRequest';

// Composant de gestion d'erreur
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Erreur JavaScript détectée:', event.error);
      setError(event.error);
      setHasError(true);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Promesse rejetée:', event.reason);
      setError(new Error(event.reason));
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (hasError) {
    return (
      <div style={{ 
        padding: '20px', 
        fontFamily: 'Arial, sans-serif',
        background: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '8px',
        margin: '20px'
      }}>
        <h2 style={{ color: '#dc2626', marginTop: 0 }}>❌ Erreur Détectée</h2>
        <p style={{ color: '#991b1b' }}>
          Une erreur s'est produite dans l'application. Voici les détails :
        </p>
        <details style={{ marginTop: '15px' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
            Détails de l'erreur
          </summary>
          <pre style={{ 
            background: '#f3f4f6', 
            padding: '10px', 
            borderRadius: '4px',
            marginTop: '10px',
            fontSize: '12px',
            overflow: 'auto'
          }}>
            {error?.stack || error?.message || 'Erreur inconnue'}
          </pre>
        </details>
        <button 
          onClick={() => {
            setHasError(false);
            setError(null);
            window.location.reload();
          }}
          style={{
            background: '#dc2626',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            marginTop: '15px'
          }}
        >
          🔄 Recharger la page
        </button>
      </div>
    );
  }

  return <>{children}</>;
}

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center relative overflow-hidden">
        {/* Effets de fond animés */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="text-center relative z-10">
          {/* Logo avec animation moderne */}
          <div className="relative mb-8 inline-block">
            <div className="relative bg-white p-6 rounded-3xl shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl"></div>
              <div className="relative flex items-center justify-center">
                <LogoIcon size={100} variant="default" className="mx-auto" />
              </div>
            </div>
          </div>

          {/* Loader moderne avec icône SVG */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-20 h-20 mb-4">
              <img src="./loading-spinner.svg" alt="Chargement" className="w-full h-full" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Chargement...</h2>
            <p className="text-white/80">Initialisation de l'application</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Layout><DashboardModern /></Layout> : <Navigate to="/login" />} 
          />
          <Route 
            path="/invoices" 
            element={isAuthenticated ? <Layout><InvoiceModule /></Layout> : <Navigate to="/login" />} 
          />
          <Route 
            path="/clients" 
            element={isAuthenticated ? <Layout><ClientsModule /></Layout> : <Navigate to="/login" />} 
          />
          <Route 
            path="/suppliers" 
            element={isAuthenticated ? <Layout><SuppliersModuleFinal /></Layout> : <Navigate to="/login" />} 
          />
          <Route 
            path="/reports" 
            element={isAuthenticated ? <Layout><ReportsModule /></Layout> : <Navigate to="/login" />} 
          />
          <Route 
            path="/discharge" 
            element={isAuthenticated ? <Layout><DischargeModuleModern /></Layout> : <Navigate to="/login" />} 
          />
          <Route 
            path="/fiscal-year" 
            element={isAuthenticated ? <Layout><FiscalYearModule /></Layout> : <Navigate to="/login" />} 
          />
          <Route 
            path="/backups" 
            element={isAuthenticated ? <Layout><BackupModule /></Layout> : <Navigate to="/login" />} 
          />
          {/* Redirection pour compatibilité avec l'ancienne route */}
          <Route 
            path="/backup" 
            element={<Navigate to="/backups" replace />} 
          />
          <Route 
            path="/activity-log" 
            element={isAuthenticated ? <Layout><ActivityLogModuleModern /></Layout> : <Navigate to="/login" />} 
          />
          <Route 
            path="/parameters" 
            element={isAuthenticated ? <Layout><ParametersModule /></Layout> : <Navigate to="/login" />} 
          />
          <Route 
            path="/articles" 
            element={isAuthenticated ? <Layout><ArticlesModule /></Layout> : <Navigate to="/login" />} 
          />
          <Route 
            path="/users" 
            element={isAuthenticated ? <Layout><UsersModule /></Layout> : <Navigate to="/login" />} 
          />
          <Route 
            path="/chat" 
            element={isAuthenticated ? <Layout><ChatModule /></Layout> : <Navigate to="/login" />} 
          />
          <Route 
            path="/payroll" 
            element={isAuthenticated ? <Layout><PayrollModule /></Layout> : <Navigate to="/login" />} 
          />
          <Route 
            path="/invoice-proforma" 
            element={isAuthenticated ? <Layout><InvoiceProforma /></Layout> : <Navigate to="/login" />} 
          />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <DataProvider>
          <ActivityProvider>
            <NotificationProvider>
              <FiscalYearProvider>
                <BackupProvider>
                  <ChatProvider>
                    <UserPresenceProvider>
                      <AppContent />
                      <NotificationContainer />
                      <ActivityNotificationManager />
                      <PWAInstaller />
                      <NotificationPermissionRequest />
                    </UserPresenceProvider>
                  </ChatProvider>
                </BackupProvider>
              </FiscalYearProvider>
            </NotificationProvider>
          </ActivityProvider>
        </DataProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
