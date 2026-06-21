// src/components/layout/Navbar.jsx
import { NavLink } from 'react-router-dom';
import { FiChevronDown } from 'react-icons/fi';
import Button from '../ui/Button';
import { getHennaCategorySlug, hennaCategories } from '../../data/hennaCategories';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Booking', to: '/booking' },
];

const navLinkClass = ({ isActive }) => `
  text-[12px] tracking-[1.5px] uppercase no-underline transition-colors
  ${isActive
    ? 'text-[var(--p-mid)] border-b border-[var(--p)] pb-0.5'
    : 'text-[var(--p-muted)] hover:text-[var(--p-mid)]'
  }
`;

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
        {navItems.slice(0, 2).map((item) => (
          <li key={item.label}>
            <NavLink
              to={item.to}
              className={navLinkClass}
            >
              {item.label}
            </NavLink>
          </li>
        ))}

        <li className="group relative">
          <NavLink
            to="/gallery"
            className={navLinkClass}
            aria-haspopup="true"
          >
            <span className="inline-flex items-center gap-1.5">
              Gallery <FiChevronDown size={13} aria-hidden="true" />
            </span>
          </NavLink>

          <div className="
            invisible absolute left-1/2 top-full z-50 w-[190px] -translate-x-1/2 pt-3
            opacity-0 transition duration-200
            group-hover:visible group-hover:opacity-100
            group-focus-within:visible group-focus-within:opacity-100
          ">
            <div className="border border-[var(--p-border)] bg-white/95 py-2 shadow-[0_18px_45px_rgba(61,31,43,0.12)] backdrop-blur-sm">
              {hennaCategories.map((category) => (
                <NavLink
                  key={category.id}
                  to={`/gallery/${getHennaCategorySlug(category)}`}
                  className={({ isActive }) => `
                    block px-4 py-2.5 text-[11px] uppercase tracking-[1.4px] no-underline transition-colors
                    ${isActive
                      ? 'bg-[var(--p-ultra)] text-[var(--p-mid)]'
                      : 'text-[var(--p-muted)] hover:bg-[var(--p-ultra)] hover:text-[var(--p-mid)]'
                    }
                  `}
                >
                  {category.name}
                </NavLink>
              ))}
            </div>
          </div>
        </li>

        {navItems.slice(2).map((item) => (
          <li key={item.label}>
            <NavLink
              to={item.to}
              className={navLinkClass}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <Button variant="outline">Login</Button>
    </nav>
  );
}
