// src/App.jsx
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PageTransition from './components/layout/PageTransition';

import Home     from './pages/Home';
import About    from './pages/About';
import Gallery  from './pages/Gallery';
import Booking  from './pages/Booking';
import AdminDashboard from './pages/AdminDashboard';

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
        <Route path="/admin"     element={<PageTransition><AdminDashboard /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AnimatedRoutes />
      <Footer />
    </BrowserRouter>
  );
}
