// src/components/ui/InfoCard.jsx
export default function InfoCard({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-3 bg-[var(--p-ultra)] border border-[var(--p-border)] rounded-[4px] p-4 mb-2.5">
      <Icon className="text-[var(--p)] text-lg mt-0.5 flex-shrink-0" />
      <div>
        <div className="text-[14px] font-medium text-[var(--p-mid)] mb-1">{title}</div>
        <div className="text-[13px] text-[var(--p-muted)] leading-relaxed">{description}</div>
      </div>
    </div>
  );
}
