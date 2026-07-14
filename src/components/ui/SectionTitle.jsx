// src/components/ui/SectionTitle.jsx
import SectionLabel from './SectionLabel';
import Divider from './Divider';

export default function SectionTitle({ label, title, subtitle, center = false, light = false }) {
  return (
    <div className={center ? 'text-center max-w-[480px] mx-auto' : ''}>
      <SectionLabel light={light}>{label}</SectionLabel>
      <h2 className={`
        font-serif text-[30px] font-light leading-[1.2] md:text-[36px]
        ${light ? 'text-[var(--p-light)]' : 'text-[var(--p-mid)]'}
      `}
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <Divider center={center} />
      {subtitle && (
        <p className="text-[15px] text-[var(--p-muted)] leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}
