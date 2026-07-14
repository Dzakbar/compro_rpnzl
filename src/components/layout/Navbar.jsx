// src/components/layout/Navbar.jsx
import { useState } from 'react';
import { FiChevronDown, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { NavLink, useNavigate } from 'react-router-dom';
import { getAdminBookings } from '../../data/bookingConfig';
import { getHennaCategorySlug } from '../../data/hennaCategories';
import { useAuth } from '../../hooks/useAuth';
import { useCompanyProfile } from '../../hooks/useCompanyProfile';
import Button from '../ui/Button';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Booking', to: '/booking' },
];

const navLinkClass = ({ isActive }) => `
  text-[14px] tracking-[1.5px] uppercase no-underline transition-colors
  ${isActive
    ? 'text-[var(--p-mid)] border-b border-[var(--p)] pb-0.5'
    : 'text-[var(--p-muted)] hover:text-[var(--p-mid)]'
  }
`;

const mobileNavLinkClass = ({ isActive }) => `
  rounded-[6px] px-3 py-3 text-[14px] font-medium uppercase tracking-[1.5px] no-underline transition-colors
  ${isActive ? 'bg-[var(--p-ultra)] text-[var(--p-mid)]' : 'text-[var(--p-muted)]'}
`;

const mobileCategoryLinkClass = ({ isActive }) => `
  rounded-[6px] px-3 py-2 text-[13px] uppercase tracking-[1.2px] no-underline transition-colors
  ${isActive ? 'bg-[var(--p-ultra)] text-[var(--p-mid)]' : 'text-[var(--p-muted)]'}
`;

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { categories } = useCompanyProfile();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getUserBookings = () => {
    if (!user) return [];
    const allBookings = getAdminBookings();
    return allBookings.filter((booking) => (
      booking.customer?.whatsapp === user.phone || booking.customer?.email === user.email
    ));
  };

  const userBookings = getUserBookings();
  const pendingBookings = userBookings.filter((booking) => booking.status === 'pending');
  const confirmedBookings = userBookings.filter((booking) => booking.status === 'confirmed');

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const handleNavigate = (path) => {
    setShowUserMenu(false);
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  const handleOpenUserDashboard = () => {
    handleNavigate('/user/bookings');
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?';
  };

  const userContact = user?.phone || user?.email || '';

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--p-border)] bg-[rgba(253,240,245,0.97)] backdrop-blur-sm">
      <div className="flex min-h-[64px] items-center justify-between gap-4 px-5 py-3 md:px-10 md:py-4">
        <button
          type="button"
          onClick={() => handleNavigate('/')}
          className="flex shrink-0 items-center"
          aria-label="Ke halaman home"
        >
          <img
            src="/rapunzl-logo.svg"
            alt=""
            aria-hidden="true"
            className="h-8 w-auto md:h-9"
          />
        </button>

        <ul className="hidden list-none gap-7 md:flex">
          {navItems.slice(0, 2).map((item) => (
            <li key={item.label}>
              <NavLink to={item.to} className={navLinkClass}>
                {item.label}
              </NavLink>
            </li>
          ))}

          <li className="group relative">
            <NavLink to="/gallery" className={navLinkClass} aria-haspopup="true">
              <span className="inline-flex items-center gap-1.5">
                Gallery <FiChevronDown size={13} aria-hidden="true" />
              </span>
            </NavLink>

            <div className="invisible absolute left-1/2 top-full z-50 w-[190px] -translate-x-1/2 pt-3 opacity-0 transition duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <div className="border border-[var(--p-border)] bg-white/95 py-2 shadow-[0_18px_45px_rgba(61,31,43,0.12)] backdrop-blur-sm">
                {categories.map((category) => (
                  <NavLink
                    key={category.id}
                    to={`/gallery/${getHennaCategorySlug(category)}`}
                    className={({ isActive }) => `
                      block px-4 py-2.5 text-[13px] uppercase tracking-[1.4px] no-underline transition-colors
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
              <NavLink to={item.to} className={navLinkClass}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          {isAuthenticated ? (
            <div className="relative flex items-center gap-2">
              <UserPill
                user={user}
                getInitials={getInitials}
                onClick={handleOpenUserDashboard}
              />

              <button
                type="button"
                onClick={() => setShowUserMenu((current) => !current)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--p)] text-[var(--p-mid)] transition-colors hover:bg-[var(--p-light)]"
                aria-label="Buka menu user"
                aria-expanded={showUserMenu}
              >
                <FiChevronDown size={15} />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full z-50 mt-2 w-[280px] rounded-[6px] border border-[var(--p-border)] bg-white shadow-[0_18px_45px_rgba(61,31,43,0.12)] backdrop-blur-sm">
                  <UserMenuContent
                    user={user}
                    userContact={userContact}
                    userBookings={userBookings}
                    pendingBookings={pendingBookings}
                    confirmedBookings={confirmedBookings}
                    onOpenDashboard={handleOpenUserDashboard}
                    onLogout={handleLogout}
                  />
                </div>
              )}
            </div>
          ) : (
            <Button variant="outline" onClick={() => navigate('/booking')}>
              Login
            </Button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((current) => !current)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--p-border)] text-[var(--p-mid)] md:hidden"
          aria-label={isMobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-[var(--p-border)] bg-white/95 px-5 py-5 shadow-[0_18px_45px_rgba(61,31,43,0.10)] md:hidden">
          <div className="grid gap-2">
            {[...navItems.slice(0, 2), { label: 'Gallery', to: '/gallery' }, ...navItems.slice(2)].map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={mobileNavLinkClass}
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="mt-4 border-t border-[var(--p-border)] pt-4">
            <p className="mb-2 px-3 text-[12px] font-medium uppercase tracking-[1.5px] text-[var(--p-muted)]">
              Kategori Gallery
            </p>
            <div className="grid gap-1">
              {categories.map((category) => (
                <NavLink
                  key={category.id}
                  to={`/gallery/${getHennaCategorySlug(category)}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={mobileCategoryLinkClass}
                >
                  {category.name}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="mt-4 border-t border-[var(--p-border)] pt-4">
            {isAuthenticated ? (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleOpenUserDashboard}
                  className="flex w-full items-center gap-3 rounded-[8px] bg-[var(--p-ultra)] px-3 py-3 text-left"
                >
                  {user?.picture ? (
                    <img src={user.picture} alt="" className="h-9 w-9 rounded-full object-cover" />
                  ) : (
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--p-mid)] text-[14px] font-bold text-white">
                      {getInitials(user?.name)}
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="block truncate text-[15px] font-medium text-[var(--p-dark)]">
                      {user?.name || 'User'}
                    </span>
                    <span className="block truncate text-[13px] text-[var(--p-muted)]">
                      {userContact}
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-[6px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-semibold uppercase tracking-[1px] text-red-600"
                >
                  <FiLogOut size={14} />
                  Logout
                </button>
              </div>
            ) : (
              <Button variant="outline" onClick={() => handleNavigate('/booking')} className="w-full">
                Login
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function UserPill({ user, getInitials, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex max-w-[180px] items-center gap-2 rounded-full bg-[var(--p)] py-2 pl-2 pr-3 text-white transition-colors hover:bg-[var(--p-light)]"
      aria-label="Buka halaman user"
    >
      {user?.picture ? (
        <img src={user.picture} alt="" className="h-8 w-8 rounded-full object-cover" />
      ) : (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--p-mid)] text-[14px] font-bold">
          {getInitials(user?.name)}
        </div>
      )}
      <span className="truncate text-[13px] font-medium uppercase tracking-[1px]">
        {user?.name?.split(' ')[0] || 'User'}
      </span>
    </button>
  );
}

function UserMenuContent({
  user,
  userContact,
  userBookings,
  pendingBookings,
  confirmedBookings,
  onOpenDashboard,
  onLogout,
}) {
  return (
    <>
      <div className="border-b border-[var(--p-border)] px-4 py-4">
        <p className="text-[13px] font-medium uppercase tracking-[1.5px] text-[var(--p-muted)]">
          Akun Anda
        </p>
        <p className="mt-2 text-[15px] font-serif text-[var(--p-dark)]">
          {user?.name}
        </p>
        <p className="break-words text-[13px] text-[var(--p-muted)]">
          {userContact}
        </p>
      </div>

      <div className="border-b border-[var(--p-border)] px-4 py-4">
        <p className="mb-3 text-[12px] font-medium uppercase tracking-[1.5px] text-[var(--p-muted)]">
          Status Booking
        </p>

        {userBookings.length === 0 ? (
          <p className="text-[13px] text-[var(--p-muted)]">
            Belum ada booking
          </p>
        ) : (
          <div className="space-y-2">
            {pendingBookings.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                <span className="text-[13px] text-[var(--p-muted)]">
                  {pendingBookings.length} Pending
                </span>
              </div>
            )}

            {confirmedBookings.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-[13px] text-[var(--p-muted)]">
                  {confirmedBookings.length} Confirmed
                </span>
              </div>
            )}

            <div className="mt-3 space-y-1 text-[12px] text-[var(--p-muted)]">
              {userBookings.slice(0, 3).map((booking) => (
                <div key={booking.id} className="rounded bg-[var(--p-ultra)] px-2 py-1">
                  <p className="font-medium text-[var(--p-dark)]">
                    {booking.category.name}
                  </p>
                  <p className="text-[12px] text-[var(--p-muted)]">
                    {booking.schedule.dateLabel} - {booking.schedule.slot}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2 px-4 py-3">
        <button
          onClick={onOpenDashboard}
          className="w-full rounded px-3 py-2 text-left text-[13px] font-medium uppercase tracking-[1px] text-[var(--p-mid)] transition-colors hover:bg-[var(--p-ultra)]"
        >
          Lihat Booking
        </button>
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-2 rounded px-3 py-2 text-[13px] font-medium uppercase tracking-[1px] text-red-600 transition-colors hover:bg-red-50"
        >
          <FiLogOut size={12} />
          Logout
        </button>
      </div>
    </>
  );
}
