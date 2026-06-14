// src/components/layout/Navbar.jsx
import { NavLink } from 'react-router-dom';
import Button from '../ui/Button';

const navItems = ['Home', 'About', 'Services', 'Gallery', 'Booking', 'Contact'];

export default function Navbar() {
  return (
    <nav className="
      flex items-center justify-between px-10 py-4
      bg-[rgba(253,240,245,0.97)] border-b border-[var(--p-border)]
      sticky top-0 z-50 backdrop-blur-sm
    ">
      <div className="font-serif text-[21px] font-light tracking-[3px] text-[var(--p-mid)]">
        RPNZL <span className="text-[var(--p)]">Art</span>
      </div>

      <ul className="flex gap-7 list-none">
        {navItems.map((item) => (
          <li key={item}>
            <NavLink
              to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
              className={({ isActive }) => `
                text-[12px] tracking-[1.5px] uppercase no-underline transition-colors
                ${isActive
                  ? 'text-[var(--p-mid)] border-b border-[var(--p)] pb-0.5'
                  : 'text-[var(--p-muted)] hover:text-[var(--p-mid)]'
                }
              `}
            >
              {item}
            </NavLink>
          </li>
        ))}
      </ul>

      <Button variant="outline">Login</Button>
    </nav>
  );
}
