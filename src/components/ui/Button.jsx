// src/components/ui/Button.jsx
const variants = {
  primary: 'bg-[var(--p)] text-[var(--p-dark)] hover:bg-[var(--p-light)]',
  dark:    'bg-[var(--p-mid)] text-white hover:bg-[var(--p-dark)]',
  ghost:   'bg-transparent text-[var(--p-light)] border border-[rgba(245,208,223,0.4)] hover:bg-white/10',
  outline: 'bg-transparent text-[var(--p-mid)] border border-[var(--p)] hover:bg-[var(--p-light)]',
};

export default function Button({ children, variant = 'primary', onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`
        px-8 py-3 text-[11px] font-medium font-sans tracking-[2px] uppercase
        rounded-[2px] transition-colors duration-200 cursor-pointer
        ${variants[variant]} ${className}
      `}
    >
      {children}
    </button>
  );
}
