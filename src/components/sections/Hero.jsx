// src/components/sections/Hero.jsx
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

const heroPhotos = ['/photo_utama.jpeg', '/photo_utama2.jpeg'];

export default function Hero() {
  const [activePhoto, setActivePhoto] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActivePhoto((current) => (current + 1) % heroPhotos.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, [prefersReducedMotion]);

  return (
    <section className="relative flex min-h-[520px] items-center justify-center overflow-hidden bg-[var(--p-dark)] text-center md:min-h-[500px]">
      <AnimatePresence initial={false}>
        <motion.img
          key={heroPhotos[activePhoto]}
          src={heroPhotos[activePhoto]}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center"
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.01 }}
          transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-[rgba(61,31,43,0.58)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(61,31,43,0.24)] via-[rgba(61,31,43,0.4)] to-[rgba(61,31,43,0.72)]" />

      <motion.div
        className="relative z-10 mx-auto max-w-[560px] px-5 py-20 sm:px-10"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.p
          className="mb-3.5 text-[10px] uppercase tracking-[3px] text-[var(--p-light)] opacity-80 sm:tracking-[4px]"
          initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 0.2, duration: 0.5 }}
        >
          &#10022; Henna Art & Beauty
        </motion.p>

        <motion.h1
          className="mb-4 font-serif text-[42px] font-light leading-[1.08] text-[#FDF0F5] sm:text-[54px]"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
        >
          Crafted with <em className="italic text-[var(--p)]">love,</em><br />worn on skin
        </motion.h1>

        <motion.div
          className="mt-7 flex justify-center gap-2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.5 }}
        >
          {heroPhotos.map((photo, index) => (
            <button
              key={photo}
              type="button"
              onClick={() => setActivePhoto(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                activePhoto === index
                  ? 'w-7 bg-[var(--p-light)]'
                  : 'w-2.5 bg-white/35 hover:bg-white/60'
              }`}
              aria-label={`Tampilkan foto hero ${index + 1}`}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
