export const OWNER_WHATSAPP_NUMBER = '6282114352721';

/**
 * @deprecated - Bookings are now stored in Supabase via rpnzl-art backend API
 * Use POST /api/bookings endpoint instead of localStorage
 */
export function getAdminBookings() {
  console.warn('getAdminBookings is deprecated. Admin bookings are now fetched from rpnzl-art backend.');
  return [];
}

/**
 * @deprecated - Use POST /api/bookings endpoint instead
 */
export function saveAdminBooking(booking) {
  console.warn('saveAdminBooking is deprecated. Use POST /api/bookings endpoint instead.');
}

export function createOwnerWhatsAppUrl(message) {
  return `https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
