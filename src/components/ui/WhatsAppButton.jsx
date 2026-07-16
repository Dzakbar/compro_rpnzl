// src/components/ui/WhatsAppButton.jsx
import { FaWhatsapp } from 'react-icons/fa';
import { createWhatsAppUrl, SUPPORT_WHATSAPP_NUMBER } from '../../data/bookingConfig';

export default function WhatsAppButton() {
  const whatsappUrl = createWhatsAppUrl(SUPPORT_WHATSAPP_NUMBER);

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl md:bottom-8 md:right-8 md:h-14 md:w-14"
      aria-label="Chat with us on WhatsApp"
    >
      <FaWhatsapp className="h-6 w-6 text-white md:h-7 md:w-7" />
    </a>
  );
}
