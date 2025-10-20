import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import DashboardModern from './components/DashboardModern';
import Layout from './components/Layout';
import InvoiceModule from './components/modules/InvoiceModule';
import ClientsModule from './components/modules/ClientsModule';
import SuppliersModule from './components/modules/SuppliersModule';
import SuppliersModuleTest from './components/modules/SuppliersModuleTest';
import SuppliersModuleWorking from './components/modules/SuppliersModuleWorking';
import SuppliersModuleComplete from './components/modules/SuppliersModuleComplete';
import SuppliersModuleTest2 from './components/modules/SuppliersModuleTest2';
import SuppliersModuleSimple2 from './components/modules/SuppliersModuleSimple2';
import SuppliersModuleFinal from './components/modules/SuppliersModuleFinal';
import TestSuppliersModule from './components/modules/TestSuppliersModule';
import SuppliersModuleSimple from './components/modules/SuppliersModuleSimple';
import SimpleTest from './components/modules/SimpleTest';
import BasicTest from './components/modules/BasicTest';
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
import UserProfileDemo from './components/UserProfileDemo';
import ProfileTest from './components/ProfileTest';
import DashboardDemo from './components/DashboardDemo';
import ActivityLogDemo from './components/ActivityLogDemo';
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

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
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
          path="/fiscal-years" 
          element={isAuthenticated ? <Layout><FiscalYearModule /></Layout> : <Navigate to="/login" />} 
        />
        <Route 
          path="/backups" 
          element={isAuthenticated ? <Layout><BackupModule /></Layout> : <Navigate to="/login" />} 
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
          path="/users" 
          element={isAuthenticated ? <Layout><UsersModule /></Layout> : <Navigate to="/login" />} 
        />
        <Route 
          path="/articles" 
          element={isAuthenticated ? <Layout><ArticlesModule /></Layout> : <Navigate to="/login" />} 
        />
        <Route 
          path="/chat" 
          element={isAuthenticated ? <Layout><ChatModule /></Layout> : <Navigate to="/login" />} 
        />
        <Route
          path="/profile-demo"
          element={isAuthenticated ? (
            <Layout>
              <UserProfileDemo />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )}
        />
        <Route
          path="/profile-test"
          element={isAuthenticated ? (
            <Layout>
              <ProfileTest />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )}
        />
        <Route
          path="/dashboard-demo"
          element={isAuthenticated ? (
            <DashboardDemo />
          ) : (
            <Navigate to="/login" />
          )}
        />
        <Route
          path="/activity-log-demo"
          element={isAuthenticated ? (
            <ActivityLogDemo />
          ) : (
            <Navigate to="/login" />
          )}
        />
        <Route
          path="/invoice-proforma"
          element={isAuthenticated ? (
            <Layout>
              <InvoiceProforma />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )}
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <DataProvider>
            <ActivityProvider>
              <NotificationProvider>
                <FiscalYearProvider>
                  <BackupProvider>
                    <UserPresenceProvider 
                      currentUserId="current-user-id"
                      currentUserName="Utilisateur Actuel"
                      currentUserAvatar="./default-avatar.png"
                    >
                      <AppContent />
                      <NotificationContainer />
                      <ActivityNotificationManager />
                      <NotificationPermissionRequest />
                      <PWAInstaller />
                    </UserPresenceProvider>
                  </BackupProvider>
                </FiscalYearProvider>
              </NotificationProvider>
            </ActivityProvider>
          </DataProvider>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
