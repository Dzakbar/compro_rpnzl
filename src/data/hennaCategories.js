export const hennaCategories = [
  {
    id: 'gold',
    slug: 'gold',
    name: 'Gold Henna',
    tone: 'Warm shimmer',
    price: 'Mulai dari Rp 450.000',
    shortDescription: 'Detail putih lembut dengan aksen gold untuk look bridal yang glowing.',
    description:
      'Pilihan untuk acara akad, resepsi, atau intimate wedding dengan detail floral yang lebih mewah dan berkilau.',
    color: '#d8b765',
    images: ['/photo_utama.jpeg', '/about1.jpeg', '/photo_utama2.jpeg'],
  },
  {
    id: 'marron',
    slug: 'marron',
    name: 'Maroon Henna',
    tone: 'Deep romantic',
    price: 'Mulai dari Rp 380.000',
    shortDescription: 'Warna maroon yang lebih tegas untuk motif elegan dan klasik.',
    description:
      'Cocok untuk pengantin yang ingin hasil lebih bold, hangat, dan tetap terlihat anggun di foto.',
    color: '#7b2f3c',
    images: ['/about1.jpeg', '/photo_utama2.jpeg', '/about2.jpeg'],
  },
  {
    id: 'nude',
    slug: 'nude',
    name: 'Nude Henna',
    tone: 'Soft natural',
    price: 'Mulai dari Rp 320.000',
    shortDescription: 'Nuansa nude yang halus untuk hasil clean, manis, dan modern.',
    description:
      'Pilihan minimal yang tetap detail, cocok untuk engagement, lamaran, atau pengantin dengan look natural.',
    color: '#c9a08f',
    images: ['/photo_utama2.jpeg', '/photo_utama.jpeg', '/about2.jpeg'],
  },
];

export function getHennaCategory(categoryId) {
  const normalizedCategoryId = categoryId?.toLowerCase();

  return (
    hennaCategories.find(
      (category) =>
        category.id === normalizedCategoryId ||
        category.slug === normalizedCategoryId
    ) || hennaCategories[0]
  );
}

export function getHennaCategorySlug(category) {
  return category.slug || category.id;
}
