import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AuthProvider from './components/AuthProvider.jsx';

// Pages
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import TopicsPage from './pages/TopicsPage.jsx';
import NewsletterPage from './pages/NewsletterPage.jsx';
import SourcesPage from './pages/admin/SourcesPage.jsx';

function App() {
  const { isAuthenticated, loading } = useSelector(state => state.auth);
  
  // Debug logging
  console.log('App - Auth state:', { isAuthenticated, loading });

  if (loading) {
    console.log('App - Showing loading spinner');
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} 
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Navigate to="/dashboard" replace />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/topics"
          element={
            <ProtectedRoute>
              <Layout>
                <TopicsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/newsletter"
          element={
            <ProtectedRoute>
              <Layout>
                <NewsletterPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/sources"
          element={
            <ProtectedRoute requireAdmin={true}>
              <Layout>
                <SourcesPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
