// src/components/sections/ServicesSection.jsx
import { motion } from 'framer-motion';
import SectionTitle from '../ui/SectionTitle';
import RevealSection from '../ui/RevealSection';

const services = [
  {
    id: 1,
    icon: '♥',
    name: 'Bridal Henna',
    desc: 'Desain eksklusif untuk pengantin — dari motif modern hingga tradisional.',
    price: 'Mulai dari Rp 350.000',
  },
  {
    id: 2,
    icon: '✦',
    name: 'Party Henna',
    desc: 'Cocok untuk ulang tahun, bridal shower, girls night out.',
    price: 'Mulai dari Rp 75.000/orang',
  },
  {
    id: 3,
    icon: '◎',
    name: 'Event Henna',
    desc: 'Untuk pameran, festival, atau corporate event.',
    price: 'Hubungi untuk harga event',
  },
];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const card    = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

export default function ServicesSection() {
  return (
    <section className="py-[72px] px-10 bg-[var(--p-ultra)]">
      <RevealSection>
        <SectionTitle label="Layanan kami" title="Pilih paket<br>yang sesuai" center />
      </RevealSection>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-9"
        variants={stagger} initial="hidden" whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
      >
        {services.map((svc) => (
          <motion.div key={svc.id} variants={card}>
            <div className="
              relative bg-white border border-[var(--p-border)] rounded-[4px] p-6
              before:content-[''] before:absolute before:top-0 before:left-0
              before:right-0 before:h-[2px] before:bg-[var(--p)]
              overflow-hidden
            ">
              <div className="text-[22px] text-[var(--p)] mb-3.5">{svc.icon}</div>
              <div className="font-serif text-[19px] font-light text-[var(--p-mid)] mb-1.5">{svc.name}</div>
              <div className="text-[11px] text-[var(--p-muted)] leading-relaxed mb-3.5">{svc.desc}</div>
              <div className="text-[10px] tracking-[1px] text-[var(--p-deep)] uppercase font-medium">{svc.price}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
