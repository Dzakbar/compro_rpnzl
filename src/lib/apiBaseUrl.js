const PRODUCTION_API_BASE_URL = 'https://admin-rpnzl.vercel.app';

function removeTrailingSlash(url) {
  return url.replace(/\/+$/, '');
}

function normalizeApiBaseUrl(url) {
  const normalizedUrl = removeTrailingSlash(url);

  if (normalizedUrl.endsWith('/api')) {
    return normalizedUrl.slice(0, -4);
  }

  return normalizedUrl;
}

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

  const normalizedUrl = normalizeApiBaseUrl(configuredUrl);

  if (import.meta.env.PROD) {
    try {
      const parsed = new URL(normalizedUrl);
      const usesAdminBackend = parsed.hostname === 'admin-rpnzl.vercel.app';

      if (usesAdminBackend) {
        return PRODUCTION_API_BASE_URL;
      }
    } catch {
      return normalizedUrl;
    }
  }

  return normalizedUrl;
}
