export const hennaCategories = [
  {
    id: 'white',
    slug: 'white',
    name: 'White Henna',
    tone: 'Soft white',
    price: 'Mulai dari Rp 450.000',
    shortDescription: 'Detail putih yang lembut untuk tampilan bridal yang clean dan elegan.',
    description:
      'Pilihan untuk acara akad, resepsi, atau intimate wedding dengan detail putih yang clean dan anggun.',
    color: '#efe9e2',
    images: ['/photo_utama.jpeg', '/about1.jpeg', '/photo_utama2.jpeg'],
  },
  {
    id: 'nude-semi-gold',
    slug: 'nude-semi-gold',
    name: 'Nude Semi Gold Henna',
    tone: 'Warm glow',
    price: 'Mulai dari Rp 400.000',
    shortDescription: 'Nuansa nude natural dengan aksen gold yang halus dan mewah.',
    description:
      'Pilihan untuk pengantin yang ingin hasil nude yang natural dengan kilau gold yang lembut.',
    color: '#c7a169',
    images: ['/about1.jpeg', '/photo_utama2.jpeg', '/about2.jpeg'],
  },
  {
    id: 'maroon',
    slug: 'maroon',
    name: 'Henna Maroon',
    tone: 'Deep romantic',
    price: 'Mulai dari Rp 380.000',
    shortDescription: 'Warna maroon yang tegas untuk motif elegan dan klasik.',
    description:
      'Cocok untuk pengantin yang ingin hasil lebih bold, hangat, dan tetap terlihat anggun di foto.',
    color: '#7b2f3c',
    images: ['/photo_utama2.jpeg', '/photo_utama.jpeg', '/about2.jpeg'],
  },
  {
    id: 'pink-rose',
    slug: 'pink-rose',
    name: 'Pink Rose Henna',
    tone: 'Romantic rose',
    price: 'Mulai dari Rp 350.000',
    shortDescription: 'Pink rose yang manis untuk tampilan henna yang lembut dan romantis.',
    description:
      'Pilihan yang manis untuk lamaran, engagement, atau acara spesial dengan nuansa pink yang lembut.',
    color: '#d8899d',
    images: ['/about2.jpeg', '/photo_utama.jpeg', '/about1.jpeg'],
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
