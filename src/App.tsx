import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store/index';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Auth Pages
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';

// Main Pages
import DiscoverPage from './pages/discover/DiscoverPage';
import ChatListPage from './pages/chat/ChatListPage';
import ChatRoomPage from './pages/chat/ChatRoomPage';
import NotificationsPage from './pages/notifications/NotificationsPage';
import PremiumPage from './pages/premium/PremiumPage';

function App() {
  useEffect(() => {
    // Set page title
    document.title = 'FunJok - Find Your Perfect Match';
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/discover" replace />} />
              <Route path="discover" element={<DiscoverPage />} />
              <Route path="matches" element={<Navigate to="/discover" replace />} />
              <Route path="chat" element={<ChatListPage />} />
              <Route path="chat/:chatId" element={<ChatRoomPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="premium" element={<PremiumPage />} />

              {/* Placeholder routes */}
              <Route path="profile" element={<div className="p-8 text-center">Profile page coming soon!</div>} />
              <Route path="settings" element={<div className="p-8 text-center">Settings page coming soon!</div>} />
              <Route path="safety" element={<div className="p-8 text-center">Safety center coming soon!</div>} />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                style: {
                  background: '#10B981',
                },
              },
              error: {
                style: {
                  background: '#EF4444',
                },
              },
            }}
          />
        </div>
      </Router>
    </Provider>
  );
}

export default App;