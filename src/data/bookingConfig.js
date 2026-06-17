export const OWNER_WHATSAPP_NUMBER = '6282114352721';
export const ADMIN_BOOKINGS_KEY = 'rpnzl_admin_bookings';

export function getAdminBookings() {
  try {
    return JSON.parse(localStorage.getItem(ADMIN_BOOKINGS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveAdminBooking(booking) {
  const bookings = getAdminBookings();
  localStorage.setItem(ADMIN_BOOKINGS_KEY, JSON.stringify([booking, ...bookings]));
}

export function createOwnerWhatsAppUrl(message) {
  return `https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
