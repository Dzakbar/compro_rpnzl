const PRODUCTION_API_BASE_URL = 'https://admin-rpnzl.vercel.app';

function isLoopbackUrl(url) {
  if (!url) return false;

  try {
    const parsed = new URL(url);
    return ['127.0.0.1', 'localhost', '::1'].includes(parsed.hostname);
  } catch {
    return false;
  }
}

export function getApiBaseUrl() {
  const configuredUrl = import.meta.env.VITE_API_BASE_URL || '';

  if (import.meta.env.PROD && (!configuredUrl || isLoopbackUrl(configuredUrl))) {
    return PRODUCTION_API_BASE_URL;
  }

  return configuredUrl.replace(/\/$/, '');
}
