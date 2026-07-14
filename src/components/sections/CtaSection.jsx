// src/components/sections/CtaSection.jsx
import RevealSection from '../ui/RevealSection';
import Button from '../ui/Button';

export default function CtaSection() {
  return (
    <section className="bg-[var(--p-mid)] px-5 py-16 text-center text-white md:px-10 md:py-[100px]">
      <RevealSection>
        <h2 className="mb-4 font-serif text-[30px] leading-tight text-[#FDF0F5] md:text-4xl">Siap untuk tampil memukau?</h2>
        <p className="mb-8 text-[15px] text-[rgba(245,208,223,0.8)]">Hubungi kami sekarang untuk booking jadwal Anda.</p>
        <Button variant="outline" className="text-white border-white hover:bg-white hover:text-[var(--p-mid)]">Hubungi Kami</Button>
      </RevealSection>
    </section>
  );
}
