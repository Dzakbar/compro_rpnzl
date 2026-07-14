// src/components/sections/GallerySection.jsx
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import RevealSection from '../ui/RevealSection';
import SectionTitle from '../ui/SectionTitle';
import { useCompanyProfile } from '../../hooks/useCompanyProfile';

const FEATURED_ASPECT_RATIO = '3 / 2';
const GRID_ASPECT_RATIOS = ['3 / 4', '3 / 2'];

export default function GallerySection() {
  const { categories } = useCompanyProfile();
  const [featuredItem, ...gridItems] = categories;

  if (!featuredItem) {
    return null;
  }

  return (
    <section className="bg-white px-5 py-[72px] md:px-10">
      <RevealSection>
        <SectionTitle label="Portfolio" title="Karya Kami" center />

        <div className="mx-auto mt-8 max-w-[1180px] space-y-5">
          <Link
            to={`/booking?category=${featuredItem.slug}`}
            className="group relative block overflow-hidden bg-[var(--p-light)]"
            style={{ aspectRatio: FEATURED_ASPECT_RATIO }}
            aria-label={`Booking untuk ${featuredItem.name}`}
          >
            <img
              src={featuredItem.images[0]}
              alt={featuredItem.name}
              className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-white/15 transition group-hover:bg-white/5" />
            <div className="absolute bottom-3 right-3 w-[min(220px,calc(100%-24px))] bg-[rgba(61,31,43,0.72)] px-4 py-4 text-right text-white backdrop-blur-[2px] md:right-8 md:top-1/2 md:w-[300px] md:-translate-y-1/2 md:px-8 md:py-8">
              <h3 className="font-serif text-[22px] font-semibold leading-[1.05] md:text-[31px]">
                {featuredItem.name}
              </h3>
              <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-white/85 md:mt-4 md:line-clamp-none md:text-[14px]">
                {featuredItem.shortDescription}
              </p>
              <p className="mt-3 text-[12px] font-medium uppercase tracking-[1.2px] text-white/75 md:mt-4 md:tracking-[1.5px]">
                {featuredItem.price}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-[14px] font-semibold text-white md:mt-7 md:text-[15px]">
                Book Now <FiArrowRight size={18} />
              </span>
            </div>
          </Link>

          <div className="grid gap-5 md:grid-cols-2">
            {gridItems.map((item, index) => (
              <GridItem key={item.id} item={item} aspectRatio={GRID_ASPECT_RATIOS[index] || GRID_ASPECT_RATIOS[1]} />
            ))}
          </div>
        </div>
      </RevealSection>
    </section>
  );
}

function GridItem({ item, aspectRatio }) {
  return (
    <Link
      to={`/booking?category=${item.slug}`}
      className="group relative block overflow-hidden bg-[var(--p-light)]"
      style={{ aspectRatio }}
      aria-label={`Booking untuk ${item.name}`}
    >
      <img
        src={item.images[0]}
        alt={item.name}
        className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(61,31,43,0.28)] via-transparent to-transparent opacity-80 transition group-hover:opacity-60" />
      <div className="absolute bottom-3 right-3 max-w-[calc(100%-24px)] bg-white/82 px-4 py-3 text-right backdrop-blur-[2px] md:bottom-8 md:right-7 md:max-w-[250px] md:px-6 md:py-5">
        <h3 className="font-serif text-[20px] font-semibold uppercase leading-[1.1] text-[var(--p-deep)] md:text-[25px]">
          {item.name}
        </h3>
        <p className="mt-2 text-[12px] uppercase tracking-[1.2px] text-[var(--p-muted)] md:text-[13px] md:tracking-[1.5px]">
          {item.price}
        </p>
      </div>
    </Link>
  );
}
