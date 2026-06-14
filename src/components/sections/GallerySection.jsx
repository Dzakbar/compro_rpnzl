// src/components/sections/GallerySection.jsx
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import RevealSection from '../ui/RevealSection';
import SectionTitle from '../ui/SectionTitle';

const portfolioItems = [
  {
    title: 'Bridal Henna',
    subtitle: 'Signature full hand detail',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=80',
    featured: true,
  },
  {
    title: 'Engagement Detail',
    subtitle: 'Soft floral motif',
    image: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Wedding Series',
    subtitle: 'Modern bridal pattern',
    image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=80',
    muted: true,
  },
  {
    title: 'Party Henna',
    subtitle: 'Minimal elegant design',
    image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=900&q=80',
  },
];

export default function GallerySection() {
  const [featuredItem, ...gridItems] = portfolioItems;

  return (
    <section className="bg-white px-5 py-[72px] md:px-10">
      <RevealSection>
        <SectionTitle label="Portfolio" title="Karya Kami" center />

        <div className="mx-auto mt-8 max-w-[1180px] space-y-5">
          <Link
            to="/booking"
            className="group relative block min-h-[260px] overflow-hidden bg-[var(--p-light)] md:min-h-[380px]"
            aria-label={`Booking untuk ${featuredItem.title}`}
          >
            <img
              src={featuredItem.image}
              alt={featuredItem.title}
              className="h-full min-h-[260px] w-full object-cover object-center transition duration-500 group-hover:scale-[1.03] md:min-h-[380px]"
            />
            <div className="absolute inset-0 bg-white/15 transition group-hover:bg-white/5" />
            <div className="absolute right-4 top-1/2 w-[220px] -translate-y-1/2 bg-[rgba(61,31,43,0.72)] px-7 py-7 text-right text-white backdrop-blur-[2px] md:right-8 md:w-[300px] md:px-8 md:py-8">
              <h3 className="font-serif text-[26px] font-semibold leading-[1.05] md:text-[31px]">
                {featuredItem.title}
              </h3>
              <p className="mt-4 text-[12px] leading-relaxed text-white/85">
                {featuredItem.subtitle}
              </p>
              <span className="mt-7 inline-flex items-center gap-2 text-[13px] font-semibold text-white">
                Book Now <FiArrowRight size={18} />
              </span>
            </div>
          </Link>

          <div className="grid gap-5 md:grid-cols-3">
            {gridItems.map((item) => (
              <Link
                key={item.title}
                to="/booking"
                className="group relative block min-h-[420px] overflow-hidden bg-[var(--p-light)]"
                aria-label={`Booking untuk ${item.title}`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className={`h-full min-h-[420px] w-full object-cover object-center transition duration-500 group-hover:scale-[1.04] ${
                    item.muted ? 'grayscale' : ''
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(61,31,43,0.28)] via-transparent to-transparent opacity-80 transition group-hover:opacity-60" />
                <div className="absolute bottom-8 right-7 max-w-[250px] bg-white/82 px-6 py-5 text-right backdrop-blur-[2px]">
                  <h3 className="font-serif text-[25px] font-semibold uppercase leading-[1.1] text-[var(--p-deep)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[11px] uppercase tracking-[1.5px] text-[var(--p-muted)]">
                    {item.subtitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </RevealSection>
    </section>
  );
}
