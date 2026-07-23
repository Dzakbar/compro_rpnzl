// src/components/sections/ServicesSection.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SectionTitle from '../ui/SectionTitle';
import RevealSection from '../ui/RevealSection';
import { useCompanyProfile } from '../../hooks/useCompanyProfile';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const card = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function ServicesSection() {
  const { categories } = useCompanyProfile();

  return (
    <section className="bg-[var(--p-ultra)] px-5 py-14 md:px-10 md:py-[72px]">
      <RevealSection>
        <SectionTitle label="Layanan kami" title="Pilih warna<br>yang sesuai" center />
      </RevealSection>

      <motion.div
        className="grid grid-cols-1 gap-4 mt-9 sm:grid-cols-2 lg:grid-cols-4"
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
      >
        {categories.map((category) => (
          <motion.div key={category.id} variants={card}>
            <Link
              to={`/booking?category=${category.id}`}
              className="
                block no-underline
                relative bg-white border border-[var(--p-border)] rounded-[4px] p-6
                before:content-[''] before:absolute before:top-0 before:left-0
                before:right-0 before:h-[2px] before:bg-[var(--p)]
                overflow-hidden transition hover:-translate-y-1 hover:shadow-sm
              "
            >
              <div
                className="mb-3.5 h-8 w-8 rounded-full border border-[var(--p-border)]"
                style={{ backgroundColor: category.color }}
                aria-hidden="true"
              />
              <div className="font-serif text-[19px] font-light text-[var(--p-mid)] mb-1.5">
                {category.name}
              </div>
              <div className="text-[13px] text-[var(--p-muted)] leading-relaxed mb-3.5">
                {category.shortDescription}
              </div>
              <div className="text-[12px] tracking-[1px] text-[var(--p-deep)] uppercase font-medium">
                {category.price}
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
