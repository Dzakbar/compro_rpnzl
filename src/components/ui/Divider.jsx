// src/components/ui/Divider.jsx
export default function Divider({ center = false }) {
  return (
    <div className={`w-9 h-px bg-[var(--p)] my-4 ${center ? 'mx-auto' : ''}`} />
  );
}
