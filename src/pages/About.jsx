// src/pages/About.jsx
export default function About() {
  return (
    <main className="min-h-screen bg-[var(--p-ultra)]">
      <section className="bg-[#f8f6f0] px-6 pb-8 pt-24 text-center">
        <p className="mb-3 text-sm font-medium uppercase tracking-wide2 text-[var(--p-muted)]">
          Tentang Kami
        </p>
        <h1 className="font-serif text-4xl text-[var(--p-mid)] md:text-6xl">
          About Us
        </h1>
      </section>

      <section className="px-6 pb-20 pt-16 md:pt-24">
        <div className="mx-auto grid max-w-6xl items-start gap-10 md:grid-cols-2 md:gap-16">
          <div className="w-full max-w-[520px] overflow-hidden rounded-lg">
            <img
              src="/about1.jpeg"
              alt="About 1"
              className="h-[300px] w-full object-cover md:h-[460px]"
            />
          </div>
          <div className="text-center md:pt-12">
            <p className="mb-6 text-sm font-medium uppercase tracking-wide2 text-[var(--p-muted)]">
              Visi
            </p>
            <h2 className="font-serif text-3xl text-[var(--p-mid)] md:text-4xl">
              Menjadi mitra terpercaya.
            </h2>
            <p className="mt-8 text-base leading-8 text-[var(--p-dark)] md:text-lg">
              Menjadi perusahaan yang dikenal karena kualitas layanan, integritas,
              dan kemampuan memberikan nilai nyata bagi pelanggan melalui solusi
              yang profesional, relevan, dan berkelanjutan.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--p-border)] bg-white/25 px-6 pb-24 pt-20">
        <div className="mx-auto grid max-w-6xl items-start gap-10 md:grid-cols-2 md:gap-16">
          <div className="w-full max-w-[520px] overflow-hidden rounded-lg">
            <img
              src="/about2.jpeg"
              alt="About 2"
              className="h-[300px] w-full object-cover md:h-[460px]"
            />
          </div>
          <div className="text-center md:pt-12">
            <p className="mb-6 text-sm font-medium uppercase tracking-wide2 text-[var(--p-muted)]">
              Misi
            </p>
            <h2 className="font-serif text-3xl text-[var(--p-mid)] md:text-4xl">
              Memberikan pelayanan terbaik.
            </h2>
            <p className="mt-8 text-base leading-8 text-[var(--p-dark)] md:text-lg">
              Memberikan layanan yang ramah, konsisten, dan berkualitas dengan
              mengutamakan kebutuhan pelanggan, membangun komunikasi yang terbuka,
              serta menciptakan pengalaman kerja sama yang dapat dipercaya.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
