import { getApiBaseUrl } from './apiBaseUrl';

const API_BASE_URL = getApiBaseUrl();

function authEndpoint(path) {
  return `${API_BASE_URL}/api/auth/${path}`;
}

function flattenErrors(errors) {
  if (!errors) return '';

  return Object.values(errors)
    .flat()
    .filter(Boolean)
    .join(' ');
}

async function submitAuth(path, payload) {
  const response = await fetch(authEndpoint(path), {
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
    throw new Error(validationMessage || data.message || 'Auth gagal diproses.');
  }

  return data;
}

export function loginCustomer(payload) {
  return submitAuth('login', payload);
}

export function registerCustomer(payload) {
  return submitAuth('register', payload);
}

export function loginGoogleCustomer(payload) {
  return submitAuth('google', payload);
}
