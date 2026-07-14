import { useMemo, useState } from 'react';
import { FiStar, FiX } from 'react-icons/fi';
import { submitTestimonial } from '../../lib/testimonialsApi';

const emptyCustomer = {
  name: '',
  email: '',
  whatsapp_number: '',
};

const inputClass =
  'h-12 w-full border border-[var(--p-border)] bg-[#f8f6f0] px-4 text-[16px] text-[var(--p-dark)] outline-none transition placeholder:text-[var(--p-muted)]/60 focus:border-[var(--p)]';

const textareaClass =
  'min-h-[118px] w-full border border-[var(--p-border)] bg-[#f8f6f0] px-4 py-3 text-[16px] text-[var(--p-dark)] outline-none transition placeholder:text-[var(--p-muted)]/60 focus:border-[var(--p)]';

function getStoredCustomer() {
  try {
    const rawUser = localStorage.getItem('rpnzl_user_data');
    const user = rawUser ? JSON.parse(rawUser) : null;

    return {
      name: user?.name || '',
      email: user?.email || '',
      whatsapp_number: user?.whatsapp_number || user?.phone || '',
    };
  } catch {
    return emptyCustomer;
  }
}

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  const activeRating = hovered || value;

  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: 5 }, (_, index) => {
        const rating = index + 1;
        const isActive = rating <= activeRating;

        return (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            onMouseEnter={() => setHovered(rating)}
            onMouseLeave={() => setHovered(0)}
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
  );
}

export default function TestimonialFormModal({ open, ...props }) {
  if (!open) {
    return null;
  }

  return <TestimonialFormDialog {...props} />;
}

function TestimonialFormDialog({
  onClose,
  initialRating = 5,
  source = 'home',
  bookingId,
  packageId,
  packageName,
  customer,
  onSubmitted,
}) {
  const mergedCustomer = useMemo(
    () => ({ ...emptyCustomer, ...getStoredCustomer(), ...(customer || {}) }),
    [customer],
  );

  const [rating, setRating] = useState(initialRating || 5);
  const [message, setMessage] = useState('');
  const [customerForm, setCustomerForm] = useState(mergedCustomer);
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCustomerChange = (event) => {
    const { name, value } = event.target;
    setCustomerForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('');

    if (!rating) {
      setStatus('Pilih rating terlebih dahulu.');
      return;
    }

    if (!customerForm.name.trim()) {
      setStatus('Masukkan nama Anda.');
      return;
    }

    if (message.trim().length < 10) {
      setStatus('Isi testimoni minimal 10 karakter.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        rating,
        message: message.trim(),
        source,
        customer: {
          name: customerForm.name.trim(),
          email: customerForm.email.trim() || null,
          whatsapp_number: customerForm.whatsapp_number.trim() || null,
        },
      };

      if (bookingId) payload.booking_id = bookingId;
      if (packageId) payload.package_id = packageId;

      const result = await submitTestimonial(payload);
      setStatus('Testimoni terkirim dan menunggu approval admin.');
      onSubmitted?.(result);

      setTimeout(() => {
        onClose?.();
      }, 1200);
    } catch (error) {
      setStatus(error.message || 'Testimoni gagal dikirim.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-[rgba(61,31,43,0.46)] px-4 py-6">
      <div className="relative max-h-[calc(100vh-48px)] w-full max-w-[620px] overflow-y-auto bg-white px-5 py-7 shadow-xl md:px-8 md:py-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center text-[var(--p-muted)] transition hover:text-[var(--p-mid)]"
          aria-label="Tutup form testimoni"
        >
          <FiX size={22} />
        </button>

        <div className="pr-10">
          <p className="text-[13px] font-semibold uppercase tracking-[1.8px] text-[var(--p-muted)]">
            Testimoni
          </p>
          <h3 className="mt-2 font-serif text-[32px] font-light leading-tight text-[var(--p-mid)]">
            Bagikan pengalaman Anda
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--p-muted)]">
            Testimoni akan tampil di halaman utama setelah disetujui admin.
          </p>
        </div>

        {packageName && (
          <div className="mt-5 border border-[var(--p-border)] bg-[var(--p-ultra)] px-4 py-3 text-[14px] text-[var(--p-mid)]">
            Paket: <span className="font-semibold">{packageName}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <label className="block">
            <span className="mb-2 block text-[12px] font-medium uppercase tracking-[1.5px] text-[var(--p-muted)]">
              Rating
            </span>
            <StarPicker value={rating} onChange={setRating} />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-[12px] font-medium uppercase tracking-[1.5px] text-[var(--p-muted)]">
                Nama
              </span>
              <input
                required
                name="name"
                value={customerForm.name}
                onChange={handleCustomerChange}
                className={inputClass}
                placeholder="Nama lengkap"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[12px] font-medium uppercase tracking-[1.5px] text-[var(--p-muted)]">
                Email
              </span>
              <input
                type="email"
                name="email"
                value={customerForm.email}
                onChange={handleCustomerChange}
                className={inputClass}
                placeholder="nama@email.com"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-[12px] font-medium uppercase tracking-[1.5px] text-[var(--p-muted)]">
              WhatsApp
            </span>
            <input
              name="whatsapp_number"
              value={customerForm.whatsapp_number}
              onChange={handleCustomerChange}
              className={inputClass}
              placeholder="08xxxxxxxxxx"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[12px] font-medium uppercase tracking-[1.5px] text-[var(--p-muted)]">
              Testimoni
            </span>
            <textarea
              required
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className={textareaClass}
              placeholder="Ceritakan pengalaman Anda dengan RPNZL Art"
            />
          </label>

          {status && (
            <div className="border border-dashed border-amber-300 bg-amber-50 p-3">
              <p className="text-[14px] leading-relaxed text-amber-900">{status}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-12 bg-[var(--p)] px-7 text-[13px] font-semibold uppercase tracking-[1.8px] text-white transition hover:bg-[var(--p-deep)] disabled:opacity-50"
          >
            {isSubmitting ? 'Mengirim...' : 'Kirim testimoni'}
          </button>
        </form>
      </div>
    </div>
  );
}
