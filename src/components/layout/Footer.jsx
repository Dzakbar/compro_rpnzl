// src/components/layout/Footer.jsx
const navLinks  = ['Home', 'About', 'Gallery', 'Booking'];
const contacts  = ['Instagram', 'WhatsApp', 'Email', 'TikTok'];

export default function Footer() {
  return (
    <footer className="bg-[var(--p-dark)] px-5 pb-7 pt-10 md:px-10 md:pt-12">
      <div className="mb-9 grid gap-8 md:grid-cols-[2fr_1fr_1fr] md:gap-9">

        {/* Brand */}
        <div>
          <div className="font-serif text-[21px] font-light tracking-[3px] text-[var(--p-mid)] mb-2">
            RPNZL <span className="text-[var(--p)]">Art</span>
          </div>
          <p className="text-[11px] text-[rgba(245,208,223,0.4)] leading-relaxed max-w-[230px]">
            Henna art profesional untuk momen spesial Anda. Melayani Jabodetabek dan sekitarnya.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-[9px] tracking-[3px] uppercase text-[var(--p)] mb-3.5">Navigasi</h4>
          <ul className="list-none space-y-2">
            {navLinks.map((l) => (
              <li key={l} className="text-[11px] text-[rgba(245,208,223,0.45)] cursor-pointer hover:text-[var(--p-light)] transition-colors">{l}</li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-[9px] tracking-[3px] uppercase text-[var(--p)] mb-3.5">Kontak</h4>
          <ul className="list-none space-y-2">
            {contacts.map((c) => (
              <li key={c} className="text-[11px] text-[rgba(245,208,223,0.45)] cursor-pointer hover:text-[var(--p-light)] transition-colors">{c}</li>
            ))}
          </ul>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="flex flex-col gap-2 border-t border-[rgba(232,164,187,0.12)] pt-5 text-left md:flex-row md:justify-between">
        <p className="text-[10px] text-[rgba(245,208,223,0.25)] tracking-[0.5px]">© 2026 RPNZL Art. All rights reserved.</p>
        <p className="text-[10px] text-[rgba(245,208,223,0.25)]">Made with ♡ in Indonesia</p>
      </div>
    </footer>
  );
}
