// src/pages/AdminDashboard.jsx
import { useState } from 'react';
import SectionTitle from '../components/ui/SectionTitle';

export default function AdminDashboard() {
  const [bookings] = useState([]);

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

          <div className="rounded-[8px] border border-dashed border-[var(--p-border)] bg-white px-5 py-10 text-center text-[12px] text-[var(--p-muted)]">
            <p>Dashboard booking sudah dipindahkan ke <strong>rpnzl-art admin panel</strong>.</p>
            <p className="mt-2">Akses admin panel di: <code className="bg-gray-100 px-2 py-1 rounded">http://127.0.0.1:8000/admin/bookings</code></p>
            <p className="mt-2 text-[11px]">Semua booking sekarang tersimpan di Supabase database dan dapat diakses melalui dashboard admin.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
