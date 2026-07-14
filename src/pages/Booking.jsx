// src/pages/Booking.jsx
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FiCalendar, FiLock, FiMail, FiStar, FiX } from 'react-icons/fi';
import { useSearchParams } from 'react-router-dom';
import AvailabilityCalendar from '../components/sections/AvailabilityCalendar';
import TestimonialFormModal from '../components/testimonials/TestimonialFormModal';
import { notifyAuthChanged } from '../hooks/useAuth';
import { getCompanyProfileCategory, useCompanyProfile } from '../hooks/useCompanyProfile';
import { getApiBaseUrl } from '../lib/apiBaseUrl';
import { fetchTestimonials } from '../lib/testimonialsApi';
import { createOwnerWhatsAppUrl } from '../data/bookingConfig';

const API_BASE_URL = getApiBaseUrl();

const emptyForm = {
  name: '',
  whatsapp: '',
  eventType: '',
  location: '',
  notes: '',
};

function getStoredUserName() {
  try {
    const userDataStr = localStorage.getItem('rpnzl_user_data');
    const userData = userDataStr ? JSON.parse(userDataStr) : null;
    return userData?.name || '';
  } catch (error) {
    console.error('Error parsing user data:', error);
    return '';
  }
}

function getStoredUser() {
  try {
    const userDataStr = localStorage.getItem('rpnzl_user_data');
    return userDataStr ? JSON.parse(userDataStr) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
}

function normalizePackageName(value) {
  return String(value || '').trim().toLowerCase();
}

function getInitialForm() {
  return {
    ...emptyForm,
    name: getStoredUserName(),
  };
}

function buildWhatsAppMessage(booking) {
  return [
    'Halo RPNZL Art, saya ingin booking henna.',
    '',
    `Booking ID: ${booking.id}`,
    `Kategori: ${booking.category.name}`,
    `Harga: ${booking.category.price}`,
    `Tanggal: ${booking.schedule.dateLabel}`,
    `Jam: ${booking.schedule.slot}`,
    '',
    `Nama: ${booking.customer.name}`,
    `WhatsApp: ${booking.customer.whatsapp}`,
    `Acara: ${booking.customer.eventType}`,
    `Lokasi: ${booking.customer.location}`,
    `Catatan: ${booking.customer.notes || '-'}`,
  ].join('\n');
}

const inputClass =
  'h-12 w-full border border-[var(--p-border)] bg-[#f8f6f0] px-4 text-[16px] text-[var(--p-dark)] outline-none transition placeholder:text-[var(--p-muted)]/60 focus:border-[var(--p)]';

const textareaClass =
  'min-h-[104px] w-full border border-[var(--p-border)] bg-[#f8f6f0] px-4 py-3 text-[16px] text-[var(--p-dark)] outline-none transition placeholder:text-[var(--p-muted)]/60 focus:border-[var(--p)]';

function LoginModal({ onClose, onLogin }) {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Email/password login - optional fallback
    setIsLoggingIn(true);
    // Simulate email login
    setTimeout(() => {
      const userData = {
        name: loginForm.email.split('@')[0],
        email: loginForm.email,
        provider: 'email',
      };
      localStorage.setItem('rpnzl_user_login', 'true');
      localStorage.setItem('rpnzl_user_data', JSON.stringify(userData));
      notifyAuthChanged();
      onLogin(userData);
      setIsLoggingIn(false);
    }, 500);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLoginForm((current) => ({ ...current, [name]: value }));
  };

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const userData = {
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
        provider: 'google',
      };
      localStorage.setItem('rpnzl_user_login', 'true');
      localStorage.setItem('rpnzl_user_data', JSON.stringify(userData));
      notifyAuthChanged();
      onLogin(userData);
    } catch (error) {
      console.error('Failed to decode Google token:', error);
      setLoginError('Gagal login dengan Google');
    }
  };

  const handleGoogleError = () => {
    setLoginError('Gagal login dengan Google');
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-[rgba(61,31,43,0.42)] px-4 py-6">
      <div className="relative grid max-h-[calc(100vh-48px)] w-full max-w-[1040px] gap-6 overflow-y-auto bg-white px-5 py-7 shadow-xl md:grid-cols-[0.9fr_1.1fr] md:gap-8 md:px-12 md:py-12">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center text-[var(--p-muted)] transition hover:text-[var(--p-mid)]"
          aria-label="Tutup login"
        >
          <FiX size={24} />
        </button>

        <div className="flex flex-col justify-center border-b border-[var(--p-border)] pb-6 text-center md:border-b-0 md:border-r md:pb-0 md:pr-10">
          <p className="text-[16px] leading-relaxed text-[var(--p-mid)] md:text-[18px]">
            Atau Sign In dengan:
          </p>

          <div className="mt-7 flex items-center justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="signin_with"
              size="large"
              logo_alignment="center"
            />
          </div>

          {loginError && (
            <p className="mt-4 text-[15px] text-red-500">{loginError}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="md:pl-3">
          <h2 className="font-serif text-[38px] font-light leading-none text-[var(--p-mid)] md:text-[62px]">
            Member Sign In
          </h2>

          <label className="mt-8 block">
            <span className="mb-3 block text-[15px] font-semibold uppercase tracking-[1px] text-[var(--p-mid)]">
              Email
            </span>
            <div className="flex h-14 items-center border border-[var(--p-mid)] px-3 md:px-4">
              <FiMail className="shrink-0 text-[var(--p)]" size={20} />
              <input
                required
                type="email"
                name="email"
                value={loginForm.email}
                onChange={handleChange}
                className="h-full min-w-0 flex-1 bg-transparent px-4 text-[16px] text-[var(--p-dark)] outline-none placeholder:text-[var(--p-muted)]"
                placeholder="Your email"
              />
            </div>
          </label>

          <label className="mt-5 block">
            <span className="mb-3 block text-[15px] font-semibold uppercase tracking-[1px] text-[var(--p-mid)]">
              Password
            </span>
            <div className="flex h-14 items-center border border-[var(--p-border)] px-3 md:px-4">
              <FiLock className="shrink-0 text-[var(--p)]" size={20} />
              <input
                required
                type="password"
                name="password"
                value={loginForm.password}
                onChange={handleChange}
                className="h-full min-w-0 flex-1 bg-transparent px-4 text-[16px] text-[var(--p-dark)] outline-none placeholder:text-[var(--p-muted)]"
                placeholder="Your password"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="mt-8 h-14 w-full bg-[var(--p)] text-[15px] font-semibold uppercase tracking-[1.8px] text-white transition hover:bg-[var(--p-deep)] disabled:opacity-50"
          >
            {isLoggingIn ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Booking() {
  const [searchParams] = useSearchParams();
  const { categories } = useCompanyProfile();
  
  const category = useMemo(
    () => getCompanyProfileCategory(categories, searchParams.get('category')),
    [categories, searchParams],
  );

  const [activeImageByCategory, setActiveImageByCategory] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem('rpnzl_user_login') === 'true',
  );
  const [isLoginOpen, setIsLoginOpen] = useState(
    () => localStorage.getItem('rpnzl_user_login') !== 'true',
  );
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [form, setForm] = useState(getInitialForm);
  const [submitStatus, setSubmitStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedBooking, setCompletedBooking] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewPromptStatus, setReviewPromptStatus] = useState('');
  const [reviewSummary, setReviewSummary] = useState({ average: 0, total: 0 });
  const [isBookingEligibilityLoading, setIsBookingEligibilityLoading] = useState(false);

  const activeImageIndex = activeImageByCategory[category.id] || 0;
  const activeImage = category.images[activeImageIndex] || category.images[0];
  const bookableSlots = useMemo(
    () => (selectedSchedule?.availability.slots || []).filter((slot) => slot.bookable),
    [selectedSchedule],
  );
  const selectedSlot = useMemo(
    () => bookableSlots.find((slot) => slot.id === selectedSlotId) || null,
    [bookableSlots, selectedSlotId],
  );

  useEffect(() => {
    let isCancelled = false;

    async function loadReviewSummary() {
      if (!category.packageId) {
        setReviewSummary({ average: 0, total: 0 });
        return;
      }

      try {
        const result = await fetchTestimonials({ limit: 24 });
        const categoryName = normalizePackageName(category.name);
        const categoryReviews = (result.data || []).filter(
          (testimonial) => normalizePackageName(testimonial.package_name) === categoryName,
        );
        const ratingTotal = categoryReviews.reduce(
          (total, testimonial) => total + Number(testimonial.rating || 0),
          0,
        );

        if (!isCancelled) {
          setReviewSummary({
            average: categoryReviews.length ? ratingTotal / categoryReviews.length : 0,
            total: categoryReviews.length,
          });
        }
      } catch (error) {
        console.error('Failed to load booking rating summary:', error);
      }
    }

    loadReviewSummary();

    return () => {
      isCancelled = true;
    };
  }, [category.name, category.packageId]);

  useEffect(() => {
    let isCancelled = false;

    async function loadEligibleBooking() {
      const storedUser = getStoredUser();

      if (!isLoggedIn || !storedUser?.email || !category.packageId) {
        return;
      }

      setIsBookingEligibilityLoading(true);

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/user/bookings?email=${encodeURIComponent(storedUser.email)}`,
          { headers: { Accept: 'application/json' } },
        );

        if (!response.ok) {
          throw new Error(`Booking API ${response.status}`);
        }

        const data = await response.json();
        const categoryName = normalizePackageName(category.name);
        const matchingBookings = (data.bookings || []).filter(
          (booking) =>
            (booking.package_id === category.packageId ||
              normalizePackageName(booking.package_name) === categoryName) &&
            booking.status !== 'rejected',
        );
        const eligibleBooking = matchingBookings.find((booking) => !booking.has_testimonial);

        if (!isCancelled && eligibleBooking) {
          setCompletedBooking({
            id: eligibleBooking.id,
            packageId: eligibleBooking.package_id,
            packageName: eligibleBooking.package_name || category.name,
            customer: {
              name: eligibleBooking.customer_name || storedUser.name || '',
              email: storedUser.email,
              whatsapp_number: storedUser.whatsapp_number || storedUser.phone || '',
            },
          });
        } else if (!isCancelled && matchingBookings.some((booking) => booking.has_testimonial)) {
          setReviewPromptStatus('Testimoni untuk booking kategori ini sudah pernah dikirim.');
        }
      } catch (error) {
        console.error('Failed to check rating eligibility:', error);
      } finally {
        if (!isCancelled) {
          setIsBookingEligibilityLoading(false);
        }
      }
    }

    loadEligibleBooking();

    return () => {
      isCancelled = true;
    };
  }, [category.name, category.packageId, isLoggedIn]);

  const handleSelectDate = useCallback((schedule) => {
    // Check if user is logged in
    if (!isLoggedIn) {
      setIsLoginOpen(true);
      return;
    }
    setSelectedSchedule(schedule);
    setSelectedSlotId('');
  }, [isLoggedIn]);

  const handleLogin = (userData) => {
    if (userData) {
      localStorage.setItem('rpnzl_user_login', 'true');
      localStorage.setItem('rpnzl_user_data', JSON.stringify(userData));
      notifyAuthChanged();
      setForm((current) => ({
        ...current,
        name: current.name || userData.name || '',
      }));
    }
    setIsLoggedIn(true);
    setIsLoginOpen(false);
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleBookingRating = (rating) => {
    setReviewRating(rating);

    if (!completedBooking) {
      if (!isLoggedIn) {
        setReviewPromptStatus('Silakan sign in dan selesaikan booking kategori ini terlebih dahulu.');
        setIsLoginOpen(true);
        return;
      }

      setReviewPromptStatus(
        isBookingEligibilityLoading
          ? 'Sedang memeriksa data booking Anda...'
          : 'Selesaikan booking kategori ini terlebih dahulu sebelum memberi rating.',
      );
      return;
    }

    if (rating >= 4) {
      setReviewPromptStatus('Terima kasih. Ceritakan pengalaman Anda agar bisa tampil di halaman utama.');
      setIsReviewModalOpen(true);
      return;
    }

    setReviewPromptStatus('Terima kasih sudah memberi rating. Masukan Anda membantu kami memperbaiki layanan.');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitStatus('');
    setReviewRating(0);
    setReviewPromptStatus('');

    if (!isLoggedIn) {
      setIsLoginOpen(true);
      return;
    }

    if (!selectedSchedule?.isBookable || !selectedSlot) {
      setSubmitStatus('Pilih tanggal dan jam yang masih tersedia.');
      return;
    }

    if (!category.packageId) {
      setSubmitStatus('Paket belum tersedia dari admin. Coba refresh halaman.');
      return;
    }

    // Validate required fields
    if (!form.name) {
      setSubmitStatus('Masukkan nama Anda.');
      return;
    }

    if (!form.whatsapp) {
      setSubmitStatus('Masukkan nomor WhatsApp Anda.');
      return;
    }

    setIsSubmitting(true);

    // Read email from login data stored in localStorage
    const userDataStr = localStorage.getItem('rpnzl_user_data');
    let userEmail = '';
    
    try {
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        userEmail = userData.email || '';
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }

    // Validate email is not empty
    if (!userEmail) {
      setSubmitStatus('Email Anda tidak ditemukan. Coba login ulang.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Extract time from selectedSlot.time (format: "10:00")
      const bookingTime = selectedSlot.time;
      
      // Build payload for API
      const payload = {
        package_id: category.packageId,
        booking_date: selectedSchedule.dateKey,
        booking_time: bookingTime,
        event_type: form.eventType,
        location: form.location,
        customization_notes: form.notes || null,
        customer: {
          name: form.name,
          whatsapp_number: form.whatsapp,
          email: userEmail,
        },
      };

      // POST to backend API
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors from API
        if (response.status === 422 && data.errors) {
          const errorMessages = Object.values(data.errors)
            .flat()
            .join(' ');
          setSubmitStatus(`❌ ${errorMessages || 'Validasi gagal. Coba lagi.'}`);
        } else if (data.message) {
          setSubmitStatus(`❌ ${data.message}`);
        } else {
          setSubmitStatus(`❌ Booking gagal dikirim. Status: ${response.status}`);
        }
        return;
      }

      // Success - keep the real backend booking id so testimonial validation can link to it.
      const bookingId = data.booking?.id || null;
      const booking = {
        id: bookingId || `RPNZL-${Date.now()}`,
        category: {
          name: category.name,
          price: category.price,
        },
        schedule: {
          dateLabel: selectedSchedule.dateLabel,
          slot: selectedSlot.time,
        },
        customer: {
          name: form.name,
          whatsapp: form.whatsapp,
          eventType: form.eventType,
          location: form.location,
          notes: form.notes,
        },
      };

      const completedBookingData = {
        id: bookingId,
        packageId: category.packageId,
        packageName: category.name,
        customer: {
          name: form.name,
          email: userEmail,
          whatsapp_number: form.whatsapp,
        },
      };

      // Reset form
      setCompletedBooking(completedBookingData);
      setForm(getInitialForm());
      setSelectedSlotId('');
      setSubmitStatus(
        'Booking berhasil dikirim! Detail bookingmu sudah kami terima. Silakan lanjutkan konfirmasi melalui WhatsApp.',
      );
      
      // Build WhatsApp message and open immediately
      const fallbackMessage = buildWhatsAppMessage(booking);
      const waUrl = data.wa_url || createOwnerWhatsAppUrl(fallbackMessage);
      setTimeout(() => {
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      }, 1000);
    } catch (error) {
      console.error('Booking error:', error);
      setSubmitStatus(error.message || 'Booking gagal dikirim. Coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-white">
      <section className="px-5 py-12 md:px-10 md:py-16">
        <div className="mx-auto grid max-w-[1180px] items-start gap-10 lg:grid-cols-[minmax(0,1fr)_430px]">
          <div className="grid items-start gap-5 md:grid-cols-[92px_minmax(0,1fr)]">
            <div className="order-2 flex gap-3 overflow-x-auto md:order-1 md:block md:space-y-4 md:overflow-visible">
              {category.images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => {
                    setActiveImageByCategory((current) => ({
                      ...current,
                      [category.id]: index,
                    }));
                  }}
                  className={`h-24 w-20 shrink-0 overflow-hidden border bg-white transition md:h-28 md:w-full ${
                    activeImage === image ? 'border-[var(--p)]' : 'border-transparent hover:border-[var(--p-border)]'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${category.name} thumbnail ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>

            <div className="order-1 self-start overflow-hidden bg-white md:order-2">
              <img
                src={activeImage}
                alt={category.name}
                className="block h-auto max-h-[650px] w-full object-contain object-top"
              />
            </div>
          </div>

          <aside>
            <h1 className="font-sans text-[30px] font-semibold uppercase tracking-[0.5px] text-[var(--p-mid)]">
              {category.name}
            </h1>

            <div className="mt-6 flex flex-wrap items-baseline gap-x-5 gap-y-2">
              <span className="font-serif text-[26px] font-semibold text-[var(--p-dark)]">
                Start from
              </span>
              <span className="font-serif text-[26px] font-semibold text-[var(--p-mid)] md:text-[30px]">
                {category.price}
              </span>
            </div>

            <div className="mt-6 flex items-center gap-2">
              {Array.from({ length: 5 }, (_, index) => {
                const rating = index + 1;
                const displayedRating = reviewRating || Math.round(reviewSummary.average);
                const isActive = rating <= displayedRating;

                return (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleBookingRating(rating)}
                    className={`flex h-8 w-8 items-center justify-center transition ${
                      isActive ? 'text-[var(--p-deep)]' : 'text-[var(--p-muted)]'
                    } hover:text-[var(--p-deep)]`}
                    aria-label={`${rating} bintang`}
                  >
                    <FiStar size={24} fill={isActive ? 'currentColor' : 'none'} />
                  </button>
                );
              })}
              <span className="ml-2 text-[14px] text-[var(--p-muted)]">
                {reviewSummary.total > 0
                  ? `${reviewSummary.average.toFixed(1)} (${reviewSummary.total} review)`
                  : 'Belum ada review'}
              </span>
            </div>

            {reviewPromptStatus && (
              <p className="mt-2 text-[14px] leading-relaxed text-[var(--p-mid)]" role="status">
                {reviewPromptStatus}
              </p>
            )}

            <div className="mt-7 border-y border-[var(--p-border)] py-5">
              <p className="text-[15px] font-semibold uppercase tracking-[1px] text-[var(--p-mid)]">
                Paket
              </p>
              <div className="mt-3 flex items-start gap-3">
                <span
                  className="mt-1 h-10 w-10 shrink-0 rounded-full border border-[var(--p-border)]"
                  style={{ backgroundColor: category.color }}
                  aria-hidden="true"
                />
                <div>
                  <p className="text-[15px] font-medium text-[var(--p-dark)]">{category.tone}</p>
                  <p className="mt-1 text-[14px] leading-relaxed text-[var(--p-muted)]">
                    {category.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <p className="mb-4 text-[15px] font-semibold uppercase tracking-[1px] text-[var(--p-mid)]">
                Availability
              </p>
              
              {!isLoggedIn && (
                <div className="mb-4 border border-dashed border-amber-300 bg-amber-50 p-4 text-center">
                  <p className="text-[14px] text-amber-900">
                    <span className="font-semibold">Sign in required</span> to select date and time
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsLoginOpen(true)}
                    className="mt-3 h-10 w-full bg-amber-600 text-[14px] font-semibold uppercase tracking-[1px] text-white transition hover:bg-amber-700"
                  >
                    Sign in now
                  </button>
                </div>
              )}
              
              <AvailabilityCalendar
                bookingMode
                compact
                onSelectDate={handleSelectDate}
                className="shadow-none"
              />
              <div className="mt-4 space-y-3 text-[15px] text-[var(--p-mid)]">
                <div className="flex items-center gap-4">
                  <span className="h-7 w-7 bg-emerald-50 border border-emerald-200" aria-hidden="true" />
                  <span>Tersedia</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="h-7 w-7 bg-amber-50 border border-amber-200" aria-hidden="true" />
                  <span>Terbatas</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="h-7 w-7 bg-[var(--p-light)] border border-[var(--p-border)]" aria-hidden="true" />
                  <span>Full booked</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-7">
              <div className="grid gap-4">
                <label className="block">
                  <span className="mb-2 block text-[15px] font-semibold uppercase tracking-[1px] text-[var(--p-mid)]">
                    Pick up date
                  </span>
                  <div className="flex h-12 items-center gap-3 border border-[var(--p-border)] bg-[#f8f6f0] px-4 text-[15px] text-[var(--p-dark)]">
                    <FiCalendar className="text-[var(--p)]" size={16} />
                    {selectedSchedule?.dateLabel || 'Select date'}
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-[15px] font-semibold uppercase tracking-[1px] text-[var(--p-mid)]">
                    Jam
                  </span>
                  <select
                    required
                    value={selectedSlotId}
                    onChange={(event) => setSelectedSlotId(event.target.value)}
                    disabled={!selectedSchedule?.isBookable}
                    className={inputClass}
                  >
                    <option value="">Pilih jam</option>
                    {bookableSlots.map((slot) => (
                      <option key={slot.id} value={slot.id}>
                        {slot.remainingSlots > 0 ? `${slot.time} (${slot.remainingSlots} tersisa)` : slot.time}
                      </option>
                    ))}
                  </select>
                </label>

                {!isLoggedIn ? (
                  <div className="border border-dashed border-[var(--p-border)] bg-white p-5 text-center">
                    <button
                      type="button"
                      onClick={() => setIsLoginOpen(true)}
                      className="h-12 w-full bg-[var(--p)] px-7 text-[13px] font-semibold uppercase tracking-[1.8px] text-white transition hover:bg-[var(--p-deep)]"
                    >
                      Sign in to book
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-4 border-t border-[var(--p-border)] pt-6 md:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-[12px] font-medium uppercase tracking-[1.5px] text-[var(--p-muted)]">
                        Nama
                      </span>
                      <input
                        required
                        name="name"
                        value={form.name}
                        onChange={handleFieldChange}
                        className={inputClass}
                        placeholder="Nama lengkap"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-[12px] font-medium uppercase tracking-[1.5px] text-[var(--p-muted)]">
                        WhatsApp
                      </span>
                      <input
                        required
                        name="whatsapp"
                        value={form.whatsapp}
                        onChange={handleFieldChange}
                        className={inputClass}
                        placeholder="08xxxxxxxxxx"
                      />
                    </label>

                    <label className="block md:col-span-2">
                      <span className="mb-1.5 block text-[12px] font-medium uppercase tracking-[1.5px] text-[var(--p-muted)]">
                        Acara
                      </span>
                      <input
                        required
                        name="eventType"
                        value={form.eventType}
                        onChange={handleFieldChange}
                        className={inputClass}
                        placeholder="Akad, resepsi, lamaran"
                      />
                    </label>

                    <label className="block md:col-span-2">
                      <span className="mb-1.5 block text-[12px] font-medium uppercase tracking-[1.5px] text-[var(--p-muted)]">
                        Lokasi
                      </span>
                      <input
                        required
                        name="location"
                        value={form.location}
                        onChange={handleFieldChange}
                        className={inputClass}
                        placeholder="Alamat lengkap"
                      />
                    </label>

                    <label className="block md:col-span-2">
                      <span className="mb-1.5 block text-[12px] font-medium uppercase tracking-[1.5px] text-[var(--p-muted)]">
                        Catatan
                      </span>
                      <textarea
                        name="notes"
                        value={form.notes}
                        onChange={handleFieldChange}
                        className={textareaClass}
                        placeholder="Request motif, jumlah orang, atau detail lain"
                      />
                    </label>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-12 bg-[var(--p)] px-7 text-[13px] font-semibold uppercase tracking-[1.8px] text-white transition hover:bg-[var(--p-deep)] md:col-span-2"
                    >
                      {isSubmitting ? 'Mengirim...' : 'Kirim booking'}
                    </button>
                  </div>
                )}

                {submitStatus && (
                  <div
                    className={`rounded-[6px] border p-4 ${
                      submitStatus.startsWith('Booking berhasil')
                        ? 'border-emerald-200 bg-emerald-50'
                        : 'border-dashed border-amber-300 bg-amber-50'
                    }`}
                    role="status"
                  >
                    <p
                      className={`text-[14px] leading-relaxed ${
                        submitStatus.startsWith('Booking berhasil')
                          ? 'text-emerald-900'
                          : 'text-amber-900'
                      }`}
                    >
                      {submitStatus}
                    </p>
                    {submitStatus.includes('Email Anda tidak ditemukan') && (
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitStatus('');
                          setIsLoginOpen(true);
                        }}
                        className="mt-3 h-9 w-full rounded-[4px] bg-amber-600 text-[13px] font-semibold uppercase tracking-[1px] text-white transition hover:bg-amber-700"
                      >
                        Login ulang
                      </button>
                    )}
                  </div>
                )}

                {completedBooking && (
                  <div className="border border-[var(--p-border)] bg-[var(--p-ultra)] p-5">
                    <p className="text-[14px] font-semibold uppercase tracking-[1.4px] text-[var(--p-mid)]">
                      Rating pengalaman booking
                    </p>
                    <p className="mt-2 text-[14px] leading-relaxed text-[var(--p-muted)]">
                      Beri rating untuk pengalaman booking Anda. Rating 4 atau 5 akan membuka form testimoni.
                    </p>
                    <div className="mt-4 flex items-center gap-1.5">
                      {Array.from({ length: 5 }, (_, index) => {
                        const rating = index + 1;
                        const isActive = rating <= reviewRating;

                        return (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => handleBookingRating(rating)}
                            className={`flex h-10 w-10 items-center justify-center transition ${
                              isActive ? 'text-[var(--p-deep)]' : 'text-[var(--p-border)]'
                            }`}
                            aria-label={`${rating} bintang`}
                          >
                            <FiStar size={23} fill={isActive ? 'currentColor' : 'none'} />
                          </button>
                        );
                      })}
                    </div>

                    {reviewPromptStatus && (
                      <p className="mt-3 text-[14px] leading-relaxed text-[var(--p-mid)]">
                        {reviewPromptStatus}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </form>
          </aside>
        </div>
      </section>

      {isLoginOpen && (
        <LoginModal onClose={() => setIsLoginOpen(false)} onLogin={handleLogin} />
      )}

      <TestimonialFormModal
        open={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        source="booking"
        initialRating={reviewRating || 5}
        bookingId={completedBooking?.id}
        packageId={completedBooking?.packageId}
        packageName={completedBooking?.packageName}
        customer={completedBooking?.customer}
        onSubmitted={() => {
          setCompletedBooking(null);
          setReviewPromptStatus('Testimoni terkirim dan menunggu approval admin.');
        }}
      />
    </main>
  );
}
