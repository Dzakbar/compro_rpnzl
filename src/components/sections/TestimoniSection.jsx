// src/components/sections/TestimoniSection.jsx
import RevealSection from '../ui/RevealSection';
import SectionTitle from '../ui/SectionTitle';

export default function TestimoniSection() {
  return (
    <section className="py-[72px] px-10 bg-white">
      <RevealSection>
        <SectionTitle label="Testimonials" title="Apa Kata Mereka" center />
        <div className="max-w-[600px] mx-auto mt-8 text-center italic text-[14px] text-[var(--p-mid)]">
          "Henna-nya bagus banget, awet dan warnanya keluar banget! Super recommended."
          <div className="mt-4 text-[11px] font-bold not-italic">— Customer A</div>
        </div>
      </RevealSection>
    </section>
  );
}
