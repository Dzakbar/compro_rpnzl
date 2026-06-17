// src/pages/Booking.jsx
import { useCallback, useMemo, useState } from 'react';
import { FiCalendar, FiLock, FiMail, FiStar, FiX } from 'react-icons/fi';
import { useSearchParams } from 'react-router-dom';
import AvailabilityCalendar from '../components/sections/AvailabilityCalendar';
import { createOwnerWhatsAppUrl, saveAdminBooking } from '../data/bookingConfig';
import { getHennaCategory } from '../data/hennaCategories';

const emptyForm = {
  name: '',
  whatsapp: '',
  eventType: '',
  location: '',
  notes: '',
};

const inputClass =
  'h-12 w-full border border-[var(--p-border)] bg-[#f8f6f0] px-4 text-[13px] text-[var(--p-dark)] outline-none transition placeholder:text-[var(--p-muted)]/60 focus:border-[var(--p)]';

const textareaClass =
  'min-h-[104px] w-full border border-[var(--p-border)] bg-[#f8f6f0] px-4 py-3 text-[13px] text-[var(--p-dark)] outline-none transition placeholder:text-[var(--p-muted)]/60 focus:border-[var(--p)]';

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

function LoginModal({ onClose, onLogin }) {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  const handleSubmit = (event) => {
    event.preventDefault();
    onLogin();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLoginForm((current) => ({ ...current, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(61,31,43,0.42)] px-4 py-8">
      <div className="relative grid w-full max-w-[1040px] gap-8 bg-white px-7 py-8 shadow-xl md:grid-cols-[0.9fr_1.1fr] md:px-12 md:py-12">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center text-[var(--p-muted)] transition hover:text-[var(--p-mid)]"
          aria-label="Tutup login"
        >
          <FiX size={24} />
        </button>

        <div className="flex flex-col justify-center border-b border-[var(--p-border)] pb-8 text-center md:border-b-0 md:border-r md:pb-0 md:pr-10">
          <p className="text-[18px] leading-relaxed text-[var(--p-mid)]">
            Or you can also Sign In with:
          </p>
          <button
            type="button"
            onClick={onLogin}
            className="mt-7 h-14 bg-[#425f9c] px-6 text-[13px] font-semibold uppercase tracking-[1.6px] text-white transition hover:opacity-90"
          >
            Sign in with Facebook
          </button>
          <button
            type="button"
            onClick={onLogin}
            className="mt-4 h-14 bg-[#d35643] px-6 text-[13px] font-semibold uppercase tracking-[1.6px] text-white transition hover:opacity-90"
          >
            Sign in with Google
          </button>
        </div>

        <form onSubmit={handleSubmit} className="md:pl-3">
          <h2 className="font-serif text-[46px] font-light leading-none text-[var(--p-mid)] md:text-[62px]">
            Member Sign In
          </h2>

          <label className="mt-8 block">
            <span className="mb-3 block text-[13px] font-semibold uppercase tracking-[1px] text-[var(--p-mid)]">
              Email
            </span>
            <div className="flex h-14 items-center border border-[var(--p-mid)] px-4">
              <FiMail className="shrink-0 text-[var(--p)]" size={20} />
              <input
                required
                type="email"
                name="email"
                value={loginForm.email}
                onChange={handleChange}
                className="h-full min-w-0 flex-1 bg-transparent px-4 text-[14px] text-[var(--p-dark)] outline-none placeholder:text-[var(--p-muted)]"
                placeholder="Your email"
              />
            </div>
          </label>

          <label className="mt-5 block">
            <span className="mb-3 block text-[13px] font-semibold uppercase tracking-[1px] text-[var(--p-mid)]">
              Password
            </span>
            <div className="flex h-14 items-center border border-[var(--p-border)] px-4">
              <FiLock className="shrink-0 text-[var(--p)]" size={20} />
              <input
                required
                type="password"
                name="password"
                value={loginForm.password}
                onChange={handleChange}
                className="h-full min-w-0 flex-1 bg-transparent px-4 text-[14px] text-[var(--p-dark)] outline-none placeholder:text-[var(--p-muted)]"
                placeholder="Your password"
              />
            </div>
          </label>

          <button
            type="submit"
            className="mt-8 h-14 w-full bg-[var(--p)] text-[13px] font-semibold uppercase tracking-[1.8px] text-white transition hover:bg-[var(--p-deep)]"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Booking() {
  const [searchParams] = useSearchParams();
  const category = useMemo(
    () => getHennaCategory(searchParams.get('category')),
    [searchParams],
  );

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem('rpnzl_user_login') === 'true',
  );
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [submitStatus, setSubmitStatus] = useState('');

  const activeImage = category.images[activeImageIndex] || category.images[0];

  const handleSelectDate = useCallback((schedule) => {
    setSelectedSchedule(schedule);
    setSelectedSlot('');
  }, []);

  const handleLogin = () => {
    localStorage.setItem('rpnzl_user_login', 'true');
    setIsLoggedIn(true);
    setIsLoginOpen(false);
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitStatus('');

    if (!isLoggedIn) {
      setIsLoginOpen(true);
      return;
    }

    if (!selectedSchedule?.isBookable || !selectedSlot) {
      setSubmitStatus('Pilih tanggal dan jam yang masih tersedia.');
      return;
    }

    const booking = {
      id: `RPNZL-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
      category: {
        id: category.id,
        name: category.name,
        price: category.price,
      },
      schedule: {
        dateKey: selectedSchedule.dateKey,
        dateLabel: selectedSchedule.dateLabel,
        slot: selectedSlot,
      },
      customer: form,
    };

    saveAdminBooking(booking);

    const message = buildWhatsAppMessage(booking);
    window.open(createOwnerWhatsAppUrl(message), '_blank', 'noopener,noreferrer');

    setForm(emptyForm);
    setSelectedSlot('');
    setSubmitStatus(`Booking ${booking.id} sudah masuk ke dashboard admin.`);
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
                  onClick={() => setActiveImageIndex(index)}
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

            <div className="mt-6 flex items-baseline gap-5">
              <span className="font-serif text-[26px] font-semibold text-[var(--p-dark)]">
                Start from
              </span>
              <span className="font-serif text-[30px] font-semibold text-[var(--p-mid)]">
                {category.price}
              </span>
            </div>

            <div className="mt-6 flex items-center gap-2 text-[var(--p-deep)]">
              {Array.from({ length: 5 }, (_, index) => (
                <FiStar key={index} size={22} />
              ))}
              <span className="ml-2 text-[12px] text-[var(--p-muted)]">(No review yet)</span>
            </div>

            <div className="mt-7 border-y border-[var(--p-border)] py-5">
              <p className="text-[13px] font-semibold uppercase tracking-[1px] text-[var(--p-mid)]">
                Paket
              </p>
              <div className="mt-3 flex items-start gap-3">
                <span
                  className="mt-1 h-10 w-10 shrink-0 rounded-full border border-[var(--p-border)]"
                  style={{ backgroundColor: category.color }}
                  aria-hidden="true"
                />
                <div>
                  <p className="text-[13px] font-medium text-[var(--p-dark)]">{category.tone}</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-[var(--p-muted)]">
                    {category.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <p className="mb-4 text-[13px] font-semibold uppercase tracking-[1px] text-[var(--p-mid)]">
                Availability
              </p>
              <AvailabilityCalendar
                bookingMode
                compact
                onSelectDate={handleSelectDate}
                className="shadow-none"
              />
              <div className="mt-4 space-y-3 text-[13px] text-[var(--p-mid)]">
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
                  <span className="mb-2 block text-[13px] font-semibold uppercase tracking-[1px] text-[var(--p-mid)]">
                    Pick up date
                  </span>
                  <div className="flex h-12 items-center gap-3 border border-[var(--p-border)] bg-[#f8f6f0] px-4 text-[13px] text-[var(--p-dark)]">
                    <FiCalendar className="text-[var(--p)]" size={16} />
                    {selectedSchedule?.dateLabel || 'Select date'}
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-[13px] font-semibold uppercase tracking-[1px] text-[var(--p-mid)]">
                    Jam
                  </span>
                  <select
                    required
                    value={selectedSlot}
                    onChange={(event) => setSelectedSlot(event.target.value)}
                    disabled={!selectedSchedule?.isBookable}
                    className={inputClass}
                  >
                    <option value="">Pilih jam</option>
                    {(selectedSchedule?.availability.slots || []).map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </label>

                {!isLoggedIn ? (
                  <div className="border border-dashed border-[var(--p-border)] bg-white p-5 text-center">
                    <button
                      type="button"
                      onClick={() => setIsLoginOpen(true)}
                      className="h-12 w-full bg-[var(--p)] px-7 text-[11px] font-semibold uppercase tracking-[1.8px] text-white transition hover:bg-[var(--p-deep)]"
                    >
                      Sign in to book
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-4 border-t border-[var(--p-border)] pt-6 md:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-[1.5px] text-[var(--p-muted)]">
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
                      <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-[1.5px] text-[var(--p-muted)]">
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
                      <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-[1.5px] text-[var(--p-muted)]">
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
                      <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-[1.5px] text-[var(--p-muted)]">
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
                      <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-[1.5px] text-[var(--p-muted)]">
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
                      className="h-12 bg-[var(--p)] px-7 text-[11px] font-semibold uppercase tracking-[1.8px] text-white transition hover:bg-[var(--p-deep)] md:col-span-2"
                    >
                      Kirim booking
                    </button>
                  </div>
                )}

                {submitStatus && (
                  <p className="text-[12px] leading-relaxed text-[var(--p-muted)]">{submitStatus}</p>
                )}
              </div>
            </form>
          </aside>
        </div>
      </section>

      {isLoginOpen && (
        <LoginModal onClose={() => setIsLoginOpen(false)} onLogin={handleLogin} />
      )}
    </main>
  );
}
