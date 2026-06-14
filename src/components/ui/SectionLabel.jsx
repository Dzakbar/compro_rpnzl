// src/components/ui/SectionLabel.jsx
export default function SectionLabel({ children, light = false }) {
  return (
    <span className={`
      block text-[10px] tracking-[4px] uppercase font-sans mb-2
      ${light ? 'text-[var(--p-light)]' : 'text-[var(--p)]'}
    `}>
      ✦ {children}
    </span>
  );
}
