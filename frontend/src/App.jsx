import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ParkingPage from './pages/ParkingPage.jsx';
import BookingPage from './pages/BookingPage.jsx';
import PaymentPage from './pages/PaymentPage.jsx';
import BookingConfirmationPage from './pages/BookingConfirmationPage.jsx';
import MyBookingsPage from './pages/MyBookingsPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import AdminUsersPage from './pages/AdminUsersPage.jsx';
import AdminBookingsPage from './pages/AdminBookingsPage.jsx';
import AdminParkingPage from './pages/AdminParkingPage.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem('parkconnect_token', token);
  } else {
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem('parkconnect_token');
  }
};

const getStoredToken = () => localStorage.getItem('parkconnect_token');

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    setAuthToken(token);
    api
      .get('/api/auth/me')
      .then((response) => {
        setUser(response.data.user);
      })
      .catch(() => {
        setAuthToken(null);
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div className="page-shell page-loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children({ user });
};

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setCurrentUser(null);
      setIsBooting(false);
      return;
    }

    setAuthToken(token);
    api
      .get('/api/auth/me')
      .then((response) => setCurrentUser(response.data.user))
      .catch(() => {
        setAuthToken(null);
        setCurrentUser(null);
      })
      .finally(() => setIsBooting(false));
  }, []);

  const authValue = useMemo(
    () => ({
      user: currentUser,
      setUser: setCurrentUser,
      logout: () => {
        setAuthToken(null);
        setCurrentUser(null);
      }
    }),
    [currentUser]
  );

  if (isBooting) {
    return <div className="page-shell page-loading">Preparing Park Connect...</div>;
  }

  return (
    <>
      <Navbar user={currentUser} setUser={setCurrentUser} />
      <main className="site-shell">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage setUser={setCurrentUser} />} />
          <Route path="/register" element={<RegisterPage setUser={setCurrentUser} />} />
          <Route path="/dashboard" element={<ProtectedRoute>{({ user }) => <DashboardPage user={user} />}</ProtectedRoute>} />
          <Route path="/parking" element={<ProtectedRoute>{({ user }) => <ParkingPage user={user} />}</ProtectedRoute>} />
          <Route path="/booking" element={<ProtectedRoute>{({ user }) => <BookingPage user={user} />}</ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute>{({ user }) => <PaymentPage user={user} />}</ProtectedRoute>} />
          <Route path="/confirmation" element={<ProtectedRoute>{({ user }) => <BookingConfirmationPage user={user} />}</ProtectedRoute>} />
          <Route path="/bookings" element={<ProtectedRoute>{({ user }) => <MyBookingsPage user={user} />}</ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly>{({ user }) => <AdminPage user={user} />}</ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute adminOnly>{({ user }) => <AdminUsersPage user={user} />}</ProtectedRoute>} />
          <Route path="/admin/bookings" element={<ProtectedRoute adminOnly>{({ user }) => <AdminBookingsPage user={user} />}</ProtectedRoute>} />
          <Route path="/admin/parking" element={<ProtectedRoute adminOnly>{({ user }) => <AdminParkingPage user={user} />}</ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
