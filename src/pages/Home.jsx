// src/pages/Home.jsx
import Hero from '../components/sections/Hero';
import ServicesSection from '../components/sections/ServicesSection';
import CalendarSection from '../components/sections/CalendarSection';
import GallerySection from '../components/sections/GallerySection';
import TestimoniSection from '../components/sections/TestimoniSection';
import CtaSection from '../components/sections/CtaSection';
import WhatsAppButton from '../components/ui/WhatsAppButton';

export default function Home() {
  return (
    <main>
      <Hero />
      <ServicesSection />
      <GallerySection />
      <CalendarSection />
      <TestimoniSection />
      <CtaSection />
      <WhatsAppButton />
    </main>
  );
}
