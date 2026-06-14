// src/components/sections/CalendarSection.jsx
import RevealSection from '../ui/RevealSection';
import SectionTitle from '../ui/SectionTitle';
import AvailabilityCalendar from './AvailabilityCalendar';

export default function CalendarSection() {
  return (
    <section className="py-[72px] px-10 bg-white">
      <RevealSection>
        <SectionTitle
          label="Availability"
          title="Cek Jadwal"
          subtitle="Lihat slot dummy mingguan atau bulanan sebelum booking."
          center
        />
        <AvailabilityCalendar className="mx-auto mt-8 max-w-[1040px]" />
      </RevealSection>
    </section>
  );
}
