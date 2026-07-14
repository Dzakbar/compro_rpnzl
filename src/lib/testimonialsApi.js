import { getApiBaseUrl } from './apiBaseUrl';

const API_BASE_URL = getApiBaseUrl();

function testimonialEndpoint(query = '') {
  return `${API_BASE_URL}/api/testimonials${query}`;
}

function flattenErrors(errors) {
  if (!errors) return '';

  return Object.values(errors)
    .flat()
    .filter(Boolean)
    .join(' ');
}

export async function fetchTestimonials({ limit = 6 } = {}) {
  const query = new URLSearchParams();

  if (limit) {
    query.set('limit', String(limit));
  }

  const response = await fetch(testimonialEndpoint(`?${query.toString()}`), {
    headers: { Accept: 'application/json' },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Testimoni API ${response.status}`);
  }

  return data;
}

export async function submitTestimonial(payload) {
  const response = await fetch(testimonialEndpoint(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    const validationMessage = flattenErrors(data.errors);
    throw new Error(validationMessage || data.message || 'Testimoni gagal dikirim.');
  }

  return data;
}
