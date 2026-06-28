// src/components/sections/GallerySection.jsx
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import RevealSection from '../ui/RevealSection';
import SectionTitle from '../ui/SectionTitle';
import { useCompanyProfile } from '../../hooks/useCompanyProfile';
import { useImageDimensions } from '../../hooks/useImageDimensions';

export default function GallerySection() {
  const { categories } = useCompanyProfile();
  const [featuredItem, ...gridItems] = categories;
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(1180);

  // Detect featured image aspect ratio (fallback: 16:9)
  const { aspectRatio: featuredRatio } = useImageDimensions(
    featuredItem?.images?.[0],
    16 / 9
  );

  // Calculate featured item height
  const featuredHeight = Math.round(containerWidth / (featuredRatio || 16 / 9));

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }

    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!featuredItem) {
    return null;
  }

  return (
    <section className="bg-white px-5 py-[72px] md:px-10">
      <RevealSection>
        <SectionTitle label="Portfolio" title="Karya Kami" center />

        <div ref={containerRef} className="mx-auto mt-8 max-w-[1180px] space-y-5">
          <Link
            to={`/booking?category=${featuredItem.slug}`}
            className="group relative block overflow-hidden bg-[var(--p-light)]"
            style={{ height: `${featuredHeight}px` }}
            aria-label={`Booking untuk ${featuredItem.name}`}
          >
            <img
              src={featuredItem.images[0]}
              alt={featuredItem.name}
              className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-white/15 transition group-hover:bg-white/5" />
            <div className="absolute right-4 top-1/2 w-[220px] -translate-y-1/2 bg-[rgba(61,31,43,0.72)] px-7 py-7 text-right text-white backdrop-blur-[2px] md:right-8 md:w-[300px] md:px-8 md:py-8">
              <h3 className="font-serif text-[26px] font-semibold leading-[1.05] md:text-[31px]">
                {featuredItem.name}
              </h3>
              <p className="mt-4 text-[12px] leading-relaxed text-white/85">
                {featuredItem.shortDescription}
              </p>
              <p className="mt-4 text-[10px] font-medium uppercase tracking-[1.5px] text-white/75">
                {featuredItem.price}
              </p>
              <span className="mt-7 inline-flex items-center gap-2 text-[13px] font-semibold text-white">
                Book Now <FiArrowRight size={18} />
              </span>
            </div>
          </Link>

          <div className="grid gap-5 md:grid-cols-2">
            {gridItems.map((item) => (
              <GridItem key={item.id} item={item} containerWidth={containerWidth} />
            ))}
          </div>
        </div>
      </RevealSection>
    </section>
  );
}

// Grid item component dengan dynamic height
function GridItem({ item, containerWidth }) {
  const { aspectRatio } = useImageDimensions(item.images?.[0], 1 / 1);
  
  // Hitung width per item: (containerWidth - gap) / 2 untuk md:grid-cols-2
  // gap = 20px (gap-5 = 1.25rem = 20px)
  // mobile: full width, desktop: half width - gap/2
  const itemWidth = containerWidth > 768 
    ? (containerWidth - 20) / 2 
    : containerWidth;
  
  const itemHeight = Math.round(itemWidth / (aspectRatio || 1));

  return (
    <Link
      to={`/booking?category=${item.slug}`}
      className="group relative block overflow-hidden bg-[var(--p-light)]"
      style={{ height: `${itemHeight}px` }}
      aria-label={`Booking untuk ${item.name}`}
    >
      <img
        src={item.images[0]}
        alt={item.name}
        className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(61,31,43,0.28)] via-transparent to-transparent opacity-80 transition group-hover:opacity-60" />
      <div className="absolute bottom-8 right-7 max-w-[250px] bg-white/82 px-6 py-5 text-right backdrop-blur-[2px]">
        <h3 className="font-serif text-[25px] font-semibold uppercase leading-[1.1] text-[var(--p-deep)]">
          {item.name}
        </h3>
        <p className="mt-2 text-[11px] uppercase tracking-[1.5px] text-[var(--p-muted)]">
          {item.price}
        </p>
      </div>
    </Link>
  );
}
