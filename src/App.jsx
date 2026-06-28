// src/App.jsx
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AnimatePresence } from 'framer-motion';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';

import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';
import PageTransition from './components/layout/PageTransition';

import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard';
import Booking from './pages/Booking';
import Gallery from './pages/Gallery';
import Home from './pages/Home';
import UserDashboard from './pages/UserDashboard';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"          element={<PageTransition><Home /></PageTransition>} />
        <Route path="/about"     element={<PageTransition><About /></PageTransition>} />
        <Route path="/gallery"   element={<PageTransition><Gallery /></PageTransition>} />
        <Route path="/gallery/:categorySlug" element={<PageTransition><Gallery /></PageTransition>} />
        <Route path="/booking"   element={<PageTransition><Booking /></PageTransition>} />
        <Route path="/user/bookings" element={<PageTransition><UserDashboard /></PageTransition>} />
        <Route path="/admin"     element={<PageTransition><AdminDashboard /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    console.warn('Google Client ID not configured. Sign in with Google will not work.');
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId || ''}>
      <BrowserRouter>
        <Navbar />
        <AnimatedRoutes />
        <Footer />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}
