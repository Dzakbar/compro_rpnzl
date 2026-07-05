// src/components/layout/Navbar.jsx
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiChevronDown, FiLogOut } from 'react-icons/fi';
import Button from '../ui/Button';
import { getHennaCategorySlug } from '../../data/hennaCategories';
import { useCompanyProfile } from '../../hooks/useCompanyProfile';
import { useAuth } from '../../hooks/useAuth';
import { getAdminBookings } from '../../data/bookingConfig';

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
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { categories } = useCompanyProfile();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Get user's bookings
  const getUserBookings = () => {
    if (!user) return [];
    const allBookings = getAdminBookings();
    return allBookings.filter((booking) => (
      booking.customer?.whatsapp === user.phone || booking.customer?.email === user.email
    ));
  };
  
  const userBookings = getUserBookings();
  const pendingBookings = userBookings.filter(b => b.status === 'pending');
  const confirmedBookings = userBookings.filter(b => b.status === 'confirmed');
  
  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const handleOpenUserDashboard = () => {
    setShowUserMenu(false);
    navigate('/user/bookings');
  };
  
  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?';
  };

  const userContact = user?.phone || user?.email || '';

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
              {categories.map((category) => (
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

      {isAuthenticated ? (
        <div className="relative flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenUserDashboard}
            className="flex max-w-[180px] items-center gap-2 rounded-full bg-[var(--p)] py-2 pl-2 pr-3 text-white transition-colors hover:bg-[var(--p-light)]"
            aria-label="Buka halaman user"
          >
            {user?.picture ? (
              <img
                src={user.picture}
                alt=""
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--p-mid)] text-[12px] font-bold">
                {getInitials(user?.name)}
              </div>
            )}
            <span className="hidden truncate text-[11px] font-medium uppercase tracking-[1px] sm:inline">
              {user?.name?.split(' ')[0] || 'User'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--p)] text-[var(--p-mid)] transition-colors hover:bg-[var(--p-light)]"
            aria-label="Buka menu user"
            aria-expanded={showUserMenu}
          >
            <FiChevronDown size={15} />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-[280px] rounded-[6px] border border-[var(--p-border)] bg-white shadow-[0_18px_45px_rgba(61,31,43,0.12)] backdrop-blur-sm z-50">
              {/* User Info Header */}
              <div className="border-b border-[var(--p-border)] px-4 py-4">
                <p className="text-[11px] font-medium uppercase tracking-[1.5px] text-[var(--p-muted)]">
                  Akun Anda
                </p>
                <p className="mt-2 text-[13px] font-serif text-[var(--p-dark)]">
                  {user?.name}
                </p>
                <p className="text-[11px] text-[var(--p-muted)]">
                  {userContact}
                </p>
              </div>

              {/* Booking Status */}
              <div className="border-b border-[var(--p-border)] px-4 py-4">
                <p className="text-[10px] font-medium uppercase tracking-[1.5px] text-[var(--p-muted)] mb-3">
                  Status Booking
                </p>
                
                {userBookings.length === 0 ? (
                  <p className="text-[11px] text-[var(--p-muted)]">
                    Belum ada booking
                  </p>
                ) : (
                  <div className="space-y-2">
                    {/* Pending Bookings */}
                    {pendingBookings.length > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <span className="text-[11px] text-[var(--p-muted)]">
                          {pendingBookings.length} Pending
                        </span>
                      </div>
                    )}
                    
                    {/* Confirmed Bookings */}
                    {confirmedBookings.length > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-[11px] text-[var(--p-muted)]">
                          {confirmedBookings.length} Confirmed
                        </span>
                      </div>
                    )}

                    <div className="mt-3 text-[10px] text-[var(--p-muted)] space-y-1">
                      {userBookings.slice(0, 3).map((booking) => (
                        <div key={booking.id} className="rounded px-2 py-1 bg-[var(--p-ultra)]">
                          <p className="font-medium text-[var(--p-dark)]">
                            {booking.category.name}
                          </p>
                          <p className="text-[9px] text-[var(--p-muted)]">
                            {booking.schedule.dateLabel} • {booking.schedule.slot}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

               {/* Actions */}
               <div className="px-4 py-3 space-y-2">
                 <button
                   onClick={handleOpenUserDashboard}
                   className="w-full text-left px-3 py-2 rounded text-[11px] font-medium uppercase tracking-[1px] text-[var(--p-mid)] hover:bg-[var(--p-ultra)] transition-colors"
                 >
                   Lihat Booking
                 </button>
                 <button
                   onClick={handleLogout}
                   className="w-full flex items-center gap-2 px-3 py-2 rounded text-[11px] font-medium uppercase tracking-[1px] text-red-600 hover:bg-red-50 transition-colors"
                 >
                   <FiLogOut size={12} />
                   Logout
                 </button>
               </div>
            </div>
          )}
        </div>
      ) : (
        <Button variant="outline" onClick={() => navigate('/booking')}>
          Login
        </Button>
      )}
    </nav>
  );
}
