import { Link, Navigate, useParams } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import RevealSection from '../components/ui/RevealSection';
import SectionTitle from '../components/ui/SectionTitle';
import { getHennaCategorySlug } from '../data/hennaCategories';
import { getCompanyProfileCategory, useCompanyProfile } from '../hooks/useCompanyProfile';

export default function Gallery() {
  const { categorySlug } = useParams();
  const { categories } = useCompanyProfile();
  const defaultSlug = getHennaCategorySlug(categories[0]);

  if (!categorySlug) {
    return <Navigate to={`/gallery/${defaultSlug}`} replace />;
  }

  const category = getCompanyProfileCategory(categories, categorySlug);
  const activeSlug = getHennaCategorySlug(category);

  if (categorySlug !== activeSlug) {
    if (categorySlug === category.id) {
      return <Navigate to={`/gallery/${activeSlug}`} replace />;
    }

    return <Navigate to={`/gallery/${defaultSlug}`} replace />;
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-[var(--p-ultra)] px-5 pb-12 pt-20 text-center md:px-10 md:pt-24">
        <RevealSection>
          <SectionTitle
            label="Gallery"
            title={category.name}
            subtitle={category.description}
            center
          />
        </RevealSection>
      </section>

      <section className="px-5 py-16 md:px-10 md:py-20">
        <RevealSection className="mx-auto max-w-[1180px]">
          <div className="grid gap-5 md:grid-cols-3">
            {category.images.map((image, index) => (
              <figure
                key={`${category.id}-${image}`}
                className={`
                  group overflow-hidden bg-[var(--p-light)]
                  ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}
                `}
              >
                <img
                  src={image}
                  alt={`${category.name} ${index + 1}`}
                  className={`
                    h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.04]
                    ${index === 0 ? 'min-h-[420px] md:min-h-[620px]' : 'min-h-[300px]'}
                  `}
                />
              </figure>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to={`/booking?category=${category.slug}`}
              className="inline-flex items-center gap-2 border border-[var(--p-mid)] px-6 py-3 text-[12px] font-semibold uppercase tracking-[1.5px] text-[var(--p-mid)] no-underline transition-colors hover:bg-[var(--p-mid)] hover:text-white"
            >
              Booking {category.name}
              <FiArrowRight size={17} />
            </Link>
          </div>
        </RevealSection>
      </section>
    </main>
  );
}
