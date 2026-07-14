// src/components/sections/TestimoniSection.jsx
import { useEffect, useMemo, useState } from 'react';
import { FiStar } from 'react-icons/fi';
import TestimonialFormModal from '../testimonials/TestimonialFormModal';
import RevealSection from '../ui/RevealSection';
import SectionTitle from '../ui/SectionTitle';
import { fetchTestimonials } from '../../lib/testimonialsApi';

function RatingStars({ rating }) {
  return (
    <div className="flex items-center gap-1 text-[var(--p-deep)]">
      {Array.from({ length: 5 }, (_, index) => {
        const active = index < rating;

        return (
          <FiStar
            key={index}
            size={16}
            fill={active ? 'currentColor' : 'none'}
            className={active ? 'text-[var(--p-deep)]' : 'text-[var(--p-border)]'}
          />
        );
      })}
    </div>
  );
}

function TestimonialCard({ testimonial }) {
  return (
    <article className="flex min-h-[230px] flex-col justify-between border border-[var(--p-border)] bg-white p-5">
      <div>
        <RatingStars rating={testimonial.rating} />
        <p className="mt-4 line-clamp-5 text-[15px] leading-relaxed text-[var(--p-mid)]">
          "{testimonial.message}"
        </p>
      </div>
      <div className="mt-6 border-t border-[var(--p-border)] pt-4">
        <p className="text-[14px] font-semibold text-[var(--p-dark)]">{testimonial.customer_name}</p>
        {testimonial.package_name && (
          <p className="mt-1 text-[13px] uppercase tracking-[1.2px] text-[var(--p-muted)]">
            {testimonial.package_name}
          </p>
        )}
      </div>
    </article>
  );
}

export default function TestimoniSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [meta, setMeta] = useState({ average_rating: 0, total_published: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadTestimonials() {
      try {
        setIsLoading(true);
        const result = await fetchTestimonials({ limit: 6 });

        if (!ignore) {
          setTestimonials(result.data || []);
          setMeta(result.meta || { average_rating: 0, total_published: 0 });
          setError('');
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'Testimoni belum bisa dimuat.');
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadTestimonials();

    return () => {
      ignore = true;
    };
  }, []);

  const averageRating = useMemo(
    () => Number(meta.average_rating || 0).toFixed(1),
    [meta.average_rating],
  );

  return (
    <section className="bg-white px-5 py-14 md:px-10 md:py-[72px]">
      <RevealSection>
        <SectionTitle
          label="Testimonials"
          title="Apa Kata Mereka"
          subtitle="Cerita pelanggan setelah mencoba layanan henna RPNZL Art."
          center
        />

        <div className="mx-auto mt-8 flex max-w-[860px] flex-col items-center gap-4 text-center md:flex-row md:justify-center md:text-left">
          <div className="flex items-center gap-3 border border-[var(--p-border)] px-5 py-3">
            <span className="font-serif text-[30px] text-[var(--p-mid)]">{averageRating}</span>
            <div>
              <RatingStars rating={Math.round(Number(meta.average_rating || 0))} />
              <p className="mt-1 text-[13px] uppercase tracking-[1.2px] text-[var(--p-muted)]">
                {meta.total_published || 0} testimoni published
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setNotice('');
              setIsModalOpen(true);
            }}
            className="h-12 border border-[var(--p)] px-7 text-[13px] font-semibold uppercase tracking-[1.8px] text-[var(--p-mid)] transition hover:bg-[var(--p-ultra)]"
          >
            Tulis testimoni
          </button>
        </div>

        {notice && (
          <div className="mx-auto mt-5 max-w-[720px] border border-dashed border-amber-300 bg-amber-50 p-3 text-center">
            <p className="text-[14px] leading-relaxed text-amber-900">{notice}</p>
          </div>
        )}

        {isLoading ? (
          <div className="mx-auto mt-10 grid max-w-[1040px] gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="h-[230px] animate-pulse border border-[var(--p-border)] bg-[var(--p-ultra)]" />
            ))}
          </div>
        ) : testimonials.length > 0 ? (
          <div className="mx-auto mt-10 grid max-w-[1040px] gap-4 md:grid-cols-3">
            {testimonials.slice(0, 3).map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        ) : (
          <div className="mx-auto mt-10 max-w-[640px] border border-dashed border-[var(--p-border)] bg-[var(--p-ultra)] px-5 py-8 text-center">
            <p className="text-[15px] leading-relaxed text-[var(--p-mid)]">
              {error || 'Belum ada testimoni yang dipublish. Jadilah yang pertama berbagi pengalaman.'}
            </p>
          </div>
        )}
      </RevealSection>

      <TestimonialFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        source="home"
        initialRating={5}
        onSubmitted={() => setNotice('Testimoni terkirim dan akan tampil setelah disetujui admin.')}
      />
    </section>
  );
}
