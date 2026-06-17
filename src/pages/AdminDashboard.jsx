// src/pages/AdminDashboard.jsx
import { useState } from 'react';
import SectionTitle from '../components/ui/SectionTitle';
import { getAdminBookings } from '../data/bookingConfig';

export default function AdminDashboard() {
  const [bookings] = useState(() => getAdminBookings());

  return (
    <main className="min-h-screen bg-[var(--p-ultra)]">
      <section className="px-5 py-14 md:px-10 md:py-16">
        <div className="mx-auto max-w-[1120px]">
          <div className="mb-8 max-w-[560px]">
            <SectionTitle
              label="Admin"
              title="Dashboard Booking"
              subtitle="Daftar booking yang masuk dari form website."
            />
          </div>

          {bookings.length === 0 ? (
            <div className="rounded-[8px] border border-dashed border-[var(--p-border)] bg-white px-5 py-10 text-center text-[12px] text-[var(--p-muted)]">
              Belum ada booking masuk.
            </div>
          ) : (
            <div className="grid gap-4">
              {bookings.map((booking) => (
                <article
                  key={booking.id}
                  className="rounded-[8px] border border-[var(--p-border)] bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-3 border-b border-[var(--p-border)] pb-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[1.5px] text-[var(--p-muted)]">
                        {booking.id}
                      </p>
                      <h2 className="mt-1 font-serif text-[26px] font-light leading-tight text-[var(--p-mid)]">
                        {booking.customer.name}
                      </h2>
                    </div>
                    <span className="w-fit rounded-full bg-[var(--p-light)] px-3 py-1 text-[10px] font-medium uppercase tracking-[1px] text-[var(--p-mid)]">
                      {booking.status}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-4 text-[12px] text-[var(--p-muted)] md:grid-cols-3">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[1.5px] text-[var(--p-deep)]">
                        Paket
                      </p>
                      <p className="mt-1 text-[var(--p-dark)]">{booking.category.name}</p>
                      <p>{booking.category.price}</p>
                    </div>

                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[1.5px] text-[var(--p-deep)]">
                        Jadwal
                      </p>
                      <p className="mt-1 text-[var(--p-dark)]">{booking.schedule.dateLabel}</p>
                      <p>{booking.schedule.slot}</p>
                    </div>

                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[1.5px] text-[var(--p-deep)]">
                        Kontak
                      </p>
                      <p className="mt-1 text-[var(--p-dark)]">{booking.customer.whatsapp}</p>
                      <p>{booking.customer.eventType}</p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-[6px] bg-[var(--p-ultra)] px-4 py-3 text-[12px] leading-relaxed text-[var(--p-muted)]">
                    <p className="text-[var(--p-dark)]">{booking.customer.location}</p>
                    <p className="mt-1">{booking.customer.notes || '-'}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
