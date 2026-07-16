export const OWNER_WHATSAPP_NUMBER = '6282114352721';
export const SUPPORT_WHATSAPP_NUMBER = '6288140625940';

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
export function saveAdminBooking() {
  console.warn('saveAdminBooking is deprecated. Use POST /api/bookings endpoint instead.');
}

export function normalizeWhatsAppNumber(number) {
  const digitsOnly = String(number || '').replace(/\D/g, '');

  if (!digitsOnly) {
    return '';
  }

  if (digitsOnly.startsWith('0')) {
    return `62${digitsOnly.slice(1)}`;
  }

  if (digitsOnly.startsWith('620')) {
    return `62${digitsOnly.slice(3)}`;
  }

  return digitsOnly;
}

export function createWhatsAppUrl(number, message = '') {
  const normalizedNumber = normalizeWhatsAppNumber(number);
  const textQuery = message ? `?text=${encodeURIComponent(message)}` : '';

  return `https://wa.me/${normalizedNumber}${textQuery}`;
}

function parseMessageFromUrl(url) {
  if (!url) {
    return '';
  }

  try {
    const parsedUrl = new URL(url);
    const directText = parsedUrl.searchParams.get('text');

    if (directText) {
      return directText;
    }

    const deeplink = parsedUrl.searchParams.get('deeplink');

    if (!deeplink) {
      return '';
    }

    const deeplinkUrl = new URL(deeplink, 'https://wa.me');

    return deeplinkUrl.searchParams.get('text') || '';
  } catch {
    return '';
  }
}

export function createOwnerWhatsAppUrl(message) {
  return createWhatsAppUrl(OWNER_WHATSAPP_NUMBER, message);
}

export function createOwnerWhatsAppUrlFromApi(apiUrl, fallbackMessage) {
  const message = parseMessageFromUrl(apiUrl) || fallbackMessage;

  return createOwnerWhatsAppUrl(message);
}
