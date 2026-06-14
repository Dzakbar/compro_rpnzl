// src/pages/Booking.jsx
import AvailabilityCalendar from '../components/sections/AvailabilityCalendar';
import SectionTitle from '../components/ui/SectionTitle';

export default function Booking() {
  return (
    <main className="bg-[var(--p-ultra)]">
      <section className="px-5 py-14 md:px-10 md:py-16">
        <div className="mx-auto max-w-[1120px]">
          <div className="mb-8 max-w-[560px]">
            <SectionTitle
              label="Booking"
              title="Pilih Jadwal"
              subtitle="Kalender ini memakai data dummy dulu, lengkap dengan tampilan minggu dan bulan."
            />
          </div>

          <AvailabilityCalendar />
        </div>
      </section>
    </main>
  );
}
