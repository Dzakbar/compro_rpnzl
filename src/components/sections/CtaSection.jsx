// src/components/sections/CtaSection.jsx
import RevealSection from '../ui/RevealSection';
import Button from '../ui/Button';

export default function CtaSection() {
  return (
    <section className="py-[100px] px-10 bg-[var(--p-mid)] text-center text-white">
      <RevealSection>
        <h2 className="font-serif text-4xl mb-4 text-[#FDF0F5]">Siap untuk tampil memukau?</h2>
        <p className="mb-8 text-[13px] text-[rgba(245,208,223,0.8)]">Hubungi kami sekarang untuk booking jadwal Anda.</p>
        <Button variant="outline" className="text-white border-white hover:bg-white hover:text-[var(--p-mid)]">Hubungi Kami</Button>
      </RevealSection>
    </section>
  );
}
