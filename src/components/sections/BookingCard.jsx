// src/components/sections/BookingCard.jsx
import { FiDownload, FiClock, FiCheck, FiAlertCircle } from 'react-icons/fi';

const statusConfig = {
  pending: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-700',
    icon: FiClock,
    label: 'Pending',
  },
  confirmed: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    icon: FiCheck,
    label: 'Confirmed',
  },
  rejected: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    icon: FiAlertCircle,
    label: 'Rejected',
  },
  done: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    icon: FiCheck,
    label: 'Completed',
  },
};

export default function BookingCard({ booking }) {
  const config = statusConfig[booking.status] || statusConfig.pending;
  const StatusIcon = config.icon;

  const handleDownloadInvoice = () => {
    if (booking.invoice?.pdf_url) {
      window.open(booking.invoice.pdf_url, '_blank');
    }
  };

  return (
    <article className="rounded-[8px] border border-[var(--p-border)] bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between border-b border-[var(--p-border)] pb-4">
        <div>
          <p className="text-[12px] font-medium uppercase tracking-[1.5px] text-[var(--p-muted)]">
            {booking.id}
          </p>
          <h3 className="mt-2 font-serif text-[20px] font-light text-[var(--p-dark)]">
            {booking.package_name}
          </h3>
        </div>
        <span className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium uppercase tracking-[1px] border ${config.bg} ${config.border} ${config.text}`}>
          <StatusIcon size={12} />
          {config.label}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-3 text-[14px]">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[1.5px] text-[var(--p-muted)]">
              Tanggal
            </p>
            <p className="mt-1 text-[var(--p-dark)]">{booking.booking_date}</p>
          </div>
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[1.5px] text-[var(--p-muted)]">
              Jam
            </p>
            <p className="mt-1 text-[var(--p-dark)]">{booking.booking_time}</p>
          </div>
        </div>

        <div>
          <p className="text-[12px] font-medium uppercase tracking-[1.5px] text-[var(--p-muted)]">
            Acara
          </p>
          <p className="mt-1 text-[var(--p-dark)]">{booking.event_type}</p>
        </div>

        <div>
          <p className="text-[12px] font-medium uppercase tracking-[1.5px] text-[var(--p-muted)]">
            Lokasi
          </p>
          <p className="mt-1 text-[var(--p-dark)]">{booking.location}</p>
        </div>

        {booking.notes && (
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[1.5px] text-[var(--p-muted)]">
              Catatan
            </p>
            <p className="mt-1 text-[var(--p-dark)]">{booking.notes}</p>
          </div>
        )}
      </div>

      {/* Invoice Section */}
      {booking.status === 'confirmed' && (
        <div className="mt-4 border-t border-[var(--p-border)] pt-4">
          {booking.invoice ? (
            <div className="space-y-2">
              <p className="text-[12px] font-medium uppercase tracking-[1.5px] text-[var(--p-muted)]">
                Invoice
              </p>
              <div className="flex items-center justify-between rounded-[6px] bg-[var(--p-ultra)] p-3">
                <div className="text-[13px]">
                  <p className="font-medium text-[var(--p-dark)]">{booking.invoice.number}</p>
                  <p className="text-[var(--p-muted)]">Rp {booking.invoice.total.toLocaleString('id-ID')}</p>
                </div>
                <button
                  onClick={handleDownloadInvoice}
                  className="flex items-center gap-1.5 rounded-[6px] border border-[var(--p-border)] bg-white px-3 py-1.5 text-[12px] font-medium uppercase tracking-[1px] text-[var(--p)] transition hover:bg-[var(--p-light)]"
                >
                  <FiDownload size={12} />
                  Download
                </button>
              </div>
            </div>
          ) : (
            <p className="text-[13px] text-[var(--p-muted)]">
              Invoice sedang diproses...
            </p>
          )}
        </div>
      )}

      {booking.status !== 'confirmed' && booking.status !== 'done' && booking.status !== 'rejected' && (
        <div className="mt-4 border-t border-[var(--p-border)] pt-4">
          <p className="text-[13px] text-[var(--p-muted)]">
            Invoice akan tersedia setelah booking dikonfirmasi
          </p>
        </div>
      )}
    </article>
  );
}
