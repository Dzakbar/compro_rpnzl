import { useEffect, useMemo, useRef, useState } from 'react';
import { hennaCategories } from '../data/hennaCategories';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const API_ENDPOINT = `${API_BASE_URL}/api/company-profile`;

const defaultContents = {
  hero_title: 'Crafted with love, worn on skin',
  hero_subtitle: 'Henna art untuk momen spesialmu',
  about_text: 'RPNZL Art adalah studio henna profesional untuk momen spesialmu.',
};

let sharedPromise = null;
let sharedProfile = null;

function toLocalAssetUrl(url) {
  if (!url || API_BASE_URL) {
    return url;
  }

  try {
    const parsed = new URL(url);
    const isLocalBackend =
      ['127.0.0.1', 'localhost'].includes(parsed.hostname) &&
      parsed.port === '8000';

    return isLocalBackend ? `${parsed.pathname}${parsed.search}` : url;
  } catch {
    return url;
  }
}

function normalizeGalleryItem(item) {
  return {
    ...item,
    image_url: toLocalAssetUrl(item.image_url),
  };
}

function normalizeCategory(apiCategory, fallback) {
  const gallery = (apiCategory.gallery || []).map(normalizeGalleryItem);
  const apiImages = (apiCategory.images || []).map(toLocalAssetUrl).filter(Boolean);
  const galleryImages = gallery.map((item) => item.image_url).filter(Boolean);
  const images = apiImages.length || galleryImages.length
    ? [...new Set([...apiImages, ...galleryImages])]
    : fallback.images;

  return {
    ...fallback,
    id: apiCategory.id || fallback.id,
    slug: apiCategory.slug || fallback.slug,
    name: apiCategory.name || fallback.name,
    tone: apiCategory.tone || fallback.tone,
    color: apiCategory.color || fallback.color,
    price: apiCategory.formatted_price || fallback.price,
    priceValue: apiCategory.price ?? null,
    packageId: apiCategory.package_id ?? null,
    shortDescription: apiCategory.short_description || fallback.shortDescription,
    description: apiCategory.description || fallback.description,
    imageUrl: toLocalAssetUrl(apiCategory.image_url),
    gallery,
    images,
  };
}

function mergeCategories(apiCategories = []) {
  return hennaCategories.map((fallback) => {
    const apiCategory = apiCategories.find((item) =>
      item.id === fallback.id ||
      item.slug === fallback.slug ||
      item.name === fallback.name
    );

    return apiCategory ? normalizeCategory(apiCategory, fallback) : fallback;
  });
}

export function useCompanyProfile() {
  const [profile, setProfile] = useState({
    contents: defaultContents,
    categories: hennaCategories,
    gallery: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    if (sharedProfile) {
      setProfile(sharedProfile);
      setLoading(false);
      setError(null);
      return;
    }

    async function loadProfile() {
      try {
        setLoading(true);

        if (!sharedPromise) {
          sharedPromise = fetch(API_ENDPOINT, {
            headers: { Accept: 'application/json' },
          }).then(async (response) => {
            if (!response.ok) {
              throw new Error(`Company profile API ${response.status}`);
            }
            const json = await response.json();
            const data = json.data || {};
            const categories = mergeCategories(data.categories || data.packages || []);
            const gallery = (data.gallery || []).map(normalizeGalleryItem);

            sharedProfile = {
              contents: { ...defaultContents, ...(data.contents || {}) },
              categories,
              gallery,
            };

            return sharedProfile;
          });
        }

        const result = await sharedPromise;

        if (mountedRef.current) {
          setProfile(result);
          setError(null);
        }
      } catch (err) {
        if (mountedRef.current) {
          setError(err);
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => { mountedRef.current = false; };
  }, []);

  return useMemo(
    () => ({ ...profile, loading, error }),
    [profile, loading, error],
  );
}

export function getCompanyProfileCategory(categories, categoryId) {
  const normalizedCategoryId = categoryId?.toLowerCase();

  return (
    categories.find(
      (category) =>
        category.id === normalizedCategoryId ||
        category.slug === normalizedCategoryId
    ) || categories[0] || hennaCategories[0]
  );
}
