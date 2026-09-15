import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ChildProvider } from './contexts/ChildContext';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import DashboardPage from './pages/Dashboard';
import QuickRegisterPage from './pages/QuickRegister';
import TimelinePage from './pages/Timeline';
import ReportsPage from './pages/Reports';
import MorePage from './pages/More';
import ChildrenPage from './pages/Children';
import CalendarPage from './pages/Calendar';
import HealthPage from './pages/Health';
import RemindersPage from './pages/Reminders';
import SettingsPage from './pages/Settings';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminUserDetails from './pages/admin/AdminUserDetails';

import LandingPage from './pages/Landing';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}><div className="skeleton" style={{ width: 200, height: 24 }} /></div>;
  if (!token) return <Navigate to="/login" />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, token, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}><div className="skeleton" style={{ width: 200, height: 24 }} /></div>;
  if (!token) return <Navigate to="/login" />;
  if (user?.role !== 'admin') return <Navigate to="/dashboard" />;
  return <>{children}</>;
}

function AppRoutes() {
  const { token, user } = useAuth();

  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={
        token
          ? (user?.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />)
          : <LandingPage />
      } />
      
      {/* Auth */}
      <Route path="/login" element={
        token
          ? (user?.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />)
          : <LoginPage />
      } />
      <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <RegisterPage />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminLayout><AdminUsers /></AdminLayout></AdminRoute>} />
      <Route path="/admin/users/:id" element={<AdminRoute><AdminLayout><AdminUserDetails /></AdminLayout></AdminRoute>} />

      {/* App Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><ChildProvider><Layout><DashboardPage /></Layout></ChildProvider></ProtectedRoute>} />
      <Route path="/add" element={<ProtectedRoute><ChildProvider><Layout><QuickRegisterPage /></Layout></ChildProvider></ProtectedRoute>} />
      <Route path="/timeline" element={<ProtectedRoute><ChildProvider><Layout><TimelinePage /></Layout></ChildProvider></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><ChildProvider><Layout><ReportsPage /></Layout></ChildProvider></ProtectedRoute>} />
      <Route path="/more" element={<ProtectedRoute><ChildProvider><Layout><MorePage /></Layout></ChildProvider></ProtectedRoute>} />
      <Route path="/children" element={<ProtectedRoute><ChildProvider><Layout><ChildrenPage /></Layout></ChildProvider></ProtectedRoute>} />
      <Route path="/children/new" element={<ProtectedRoute><ChildProvider><Layout><ChildrenPage /></Layout></ChildProvider></ProtectedRoute>} />
      <Route path="/calendar" element={<ProtectedRoute><ChildProvider><Layout><CalendarPage /></Layout></ChildProvider></ProtectedRoute>} />
      <Route path="/health" element={<ProtectedRoute><ChildProvider><Layout><HealthPage /></Layout></ChildProvider></ProtectedRoute>} />
      <Route path="/reminders" element={<ProtectedRoute><ChildProvider><Layout><RemindersPage /></Layout></ChildProvider></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><ChildProvider><Layout><SettingsPage /></Layout></ChildProvider></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '12px',
              padding: '12px 20px',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
