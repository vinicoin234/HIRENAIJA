import heroArtisan from '../assets/images/hero_artisan_lagos_1793884432708.jpg';
import proMechanic from '../assets/images/pro_mechanic_workshop_1793884435104.jpg';
import proElectrician from '../assets/images/pro_electrician_solar_1793884434987.jpg';
import proTailor from '../assets/images/pro_tailor_fashion_1793884434473.jpg';
import proPhotographer from '../assets/images/pro_photographer_studio_1793884434563.jpg';

export const ASSET_IMAGES = {
  hero: '/images/hero_artisan_lagos_1793884432708.jpg',
  mechanic: '/images/pro_mechanic_workshop_1793884435104.jpg',
  electrician: '/images/pro_electrician_solar_1793884434987.jpg',
  tailor: '/images/pro_tailor_fashion_1793884434473.jpg',
  photographer: '/images/pro_photographer_studio_1793884434563.jpg',
  default: '/images/hero_artisan_lagos_1793884432708.jpg',
};

export function getCategoryDefaultImage(category: string): string {
  switch (category) {
    case 'mechanics':
      return '/images/pro_mechanic_workshop_1793884435104.jpg';
    case 'electricians':
      return '/images/pro_electrician_solar_1793884434987.jpg';
    case 'tailors':
      return '/images/pro_tailor_fashion_1793884434473.jpg';
    case 'photographers':
      return '/images/pro_photographer_studio_1793884434563.jpg';
    default:
      return '/images/hero_artisan_lagos_1793884432708.jpg';
  }
}

/**
 * Resolves any image URL safely for both local dev and production (Vercel).
 * Automatically migrates legacy or localStorage paths starting with "/src/assets/images/..."
 * to bundled hashed assets so images never return 404 on Vercel.
 */
export function resolveImageUrl(url: string | undefined | null, category?: string): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return category ? getCategoryDefaultImage(category) : ASSET_IMAGES.default;
  }

  // Handle legacy unbundled paths from localStorage or seed
  if (url.includes('pro_mechanic_workshop')) return ASSET_IMAGES.mechanic;
  if (url.includes('pro_electrician_solar')) return ASSET_IMAGES.electrician;
  if (url.includes('pro_tailor_fashion')) return ASSET_IMAGES.tailor;
  if (url.includes('pro_photographer_studio')) return ASSET_IMAGES.photographer;
  if (url.includes('hero_artisan_lagos') || url.startsWith('/src/assets/images/')) {
    return category ? getCategoryDefaultImage(category) : ASSET_IMAGES.hero;
  }

  return url;
}
