// src/pages/UserDashboard.jsx
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiClock, FiCheck } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import BookingCard from '../components/sections/BookingCard';
import SectionTitle from '../components/ui/SectionTitle';
import { getApiBaseUrl } from '../lib/apiBaseUrl';

const API_BASE_URL = getApiBaseUrl();

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasLoadedBookings = useRef(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && user === null) {
      // Delay check to allow useAuth to initialize
      const timer = setTimeout(() => {
        const userDataStr = localStorage.getItem('rpnzl_user_data');
        if (!userDataStr) {
          navigate('/booking');
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch user bookings
  const fetchBookings = useCallback(async () => {
    try {
      // Get user email from stored data
      const userDataStr = localStorage.getItem('rpnzl_user_data');
      if (!userDataStr) {
        setBookings([]);
        return;
      }

      const userData = JSON.parse(userDataStr);
      const userEmail = userData.email;

      // Fetch from API
      const response = await fetch(`${API_BASE_URL}/api/user/bookings?email=${encodeURIComponent(userEmail)}`, {
        headers: { 'Accept': 'application/json' },
      });

      if (!response.ok) {
        console.error('Failed to fetch bookings');
        setBookings([]);
        return;
      }

      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load bookings once when entering the user page.
  useEffect(() => {
    if (!isAuthenticated || hasLoadedBookings.current) return;

    hasLoadedBookings.current = true;
    const timer = window.setTimeout(() => {
      fetchBookings();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fetchBookings, isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusCounts = () => {
    return {
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      completed: bookings.filter(b => b.status === 'done').length,
    };
  };

  const counts = getStatusCounts();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="px-5 py-12 md:px-10 md:py-16">
        <div className="mx-auto max-w-[1120px]">
          {/* Header */}
          <div className="mb-8 max-w-[560px]">
            <SectionTitle
              label="Akun"
              title="My Bookings"
              subtitle={`Welcome back, ${user?.name || 'Guest'}`}
            />
          </div>

          {/* Booking Stats */}
          {bookings.length > 0 && (
            <div className="mb-8 grid gap-4 md:grid-cols-3">
              {/* Pending */}
              <div className="rounded-[8px] border border-[var(--p-border)] bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-50">
                    <FiClock className="text-yellow-600" size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[1.5px] text-[var(--p-muted)]">
                      Pending
                    </p>
                    <p className="text-[24px] font-light text-[var(--p-dark)]">
                      {counts.pending}
                    </p>
                  </div>
                </div>
              </div>

              {/* Confirmed */}
              <div className="rounded-[8px] border border-[var(--p-border)] bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
                    <FiCheck className="text-green-600" size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[1.5px] text-[var(--p-muted)]">
                      Confirmed
                    </p>
                    <p className="text-[24px] font-light text-[var(--p-dark)]">
                      {counts.confirmed}
                    </p>
                  </div>
                </div>
              </div>

              {/* Completed */}
              <div className="rounded-[8px] border border-[var(--p-border)] bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                    <FiCheck className="text-blue-600" size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[1.5px] text-[var(--p-muted)]">
                      Completed
                    </p>
                    <p className="text-[24px] font-light text-[var(--p-dark)]">
                      {counts.completed}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bookings Grid */}
          {loading ? (
            <div className="rounded-[8px] border border-dashed border-[var(--p-border)] bg-white px-5 py-10 text-center text-[12px] text-[var(--p-muted)]">
              Loading your bookings...
            </div>
          ) : bookings.length === 0 ? (
            <div className="rounded-[8px] border border-dashed border-[var(--p-border)] bg-white px-5 py-10 text-center text-[12px] text-[var(--p-muted)]">
              <p>Belum ada booking.</p>
              <button
                onClick={() => navigate('/booking')}
                className="mt-4 inline-block text-[var(--p)] hover:text-[var(--p-mid)] transition-colors"
              >
                Buat booking sekarang
              </button>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {bookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          )}

          {/* Logout Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-[8px] border border-red-200 bg-red-50 px-6 py-3 text-[12px] font-medium uppercase tracking-[1.5px] text-red-600 transition hover:bg-red-100"
            >
              <FiLogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
