import { useEffect, useState } from 'react';

/**
 * Custom hook untuk detect aspek ratio dari image URL
 * @param {string} imageUrl - URL gambar yang akan didetect
 * @param {number} fallbackRatio - Fallback aspect ratio jika gagal load (default: 16/9)
 * @returns {Object} - { aspectRatio, isLoading }
 */
export function useImageDimensions(imageUrl, fallbackRatio = 16 / 9) {
  const [aspectRatio, setAspectRatio] = useState(fallbackRatio);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!imageUrl) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const img = new Image();

    const handleLoad = () => {
      const ratio = img.naturalWidth / img.naturalHeight;
      setAspectRatio(ratio);
      setIsLoading(false);
    };

    const handleError = () => {
      // Gunakan fallback ratio jika gagal load
      setAspectRatio(fallbackRatio);
      setIsLoading(false);
    };

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);
    img.src = imageUrl;

    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
      img.src = '';
    };
  }, [imageUrl, fallbackRatio]);

  return { aspectRatio, isLoading };
}
