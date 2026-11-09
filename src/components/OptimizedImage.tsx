import React, { useState, useEffect } from 'react';
import { resolveImageUrl, getCategoryDefaultImage, ASSET_IMAGES } from '../utils/imageAssets';
import { Wrench, Scissors, Zap, Camera, ShieldCheck, Image as ImageIcon } from 'lucide-react';

interface OptimizedImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  category?: string;
  priority?: boolean;
  width?: number;
  height?: number;
  aspectRatio?: string;
  sizes?: string;
  onClick?: () => void;
}

/**
 * Transforms a Supabase Storage URL to use Supabase's image optimization / render endpoint if applicable.
 * If width or quality is specified, converts:
 *   /storage/v1/object/public/<bucket>/<path>
 * to:
 *   /storage/v1/render/image/public/<bucket>/<path>?width=...&quality=80
 */
export function optimizeSupabaseUrl(url: string, width?: number): string {
  if (!url || typeof url !== 'string') return url;

  // Check if it is a Supabase storage URL
  if (url.includes('.supabase.co/storage/v1/object/public/')) {
    if (width) {
      return url.replace(
        '/storage/v1/object/public/',
        `/storage/v1/render/image/public/`
      ) + `?width=${width}&quality=80&resize=cover`;
    }
  }

  // Ensure https
  if (url.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }

  return url;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  category,
  priority = false,
  width,
  height,
  aspectRatio,
  sizes,
  onClick,
}) => {
  // Candidate fallback list:
  // Tier 1: Optimized Supabase/original URL
  // Tier 2: Clean unoptimized original URL (in case render API is disabled on project)
  // Tier 3: Local bundled asset for the category
  // Tier 4: Default hero asset
  const [attemptIndex, setAttemptIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasFatalError, setHasFatalError] = useState(false);

  // Re-resolve candidate list whenever src or category changes
  const candidates = React.useMemo(() => {
    const list: string[] = [];

    if (src && typeof src === 'string' && src.trim() !== '') {
      // Clean legacy /src/assets paths immediately
      const resolved = resolveImageUrl(src, category);
      
      // If it's a remote URL, add optimized version first, then direct raw version
      if (resolved.startsWith('http://') || resolved.startsWith('https://')) {
        const optimized = optimizeSupabaseUrl(resolved, width || 800);
        list.push(optimized);
        if (optimized !== resolved) {
          list.push(resolved);
        }
      } else {
        list.push(resolved);
      }
    }

    // Category default local asset
    const catDefault = getCategoryDefaultImage(category || 'mechanics');
    if (!list.includes(catDefault)) {
      list.push(catDefault);
    }

    // Root hero asset
    if (!list.includes(ASSET_IMAGES.hero)) {
      list.push(ASSET_IMAGES.hero);
    }

    // Public folder copy fallback
    list.push('/images/hero_artisan_lagos_1793884432708.jpg');

    return list;
  }, [src, category, width]);

  const activeSrc = candidates[attemptIndex] || candidates[0];

  // Reset attempt if src prop changes
  useEffect(() => {
    setAttemptIndex(0);
    setIsLoaded(false);
    setHasFatalError(false);
  }, [src]);

  const handleError = () => {
    if (attemptIndex < candidates.length - 1) {
      // Step to next fallback tier
      setAttemptIndex((prev) => prev + 1);
    } else {
      // All fallback URLs exhausted, show stylized category placeholder
      setHasFatalError(true);
      setIsLoaded(true);
    }
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  // Category Icon for stylized fallback if network blocks all image downloads
  const renderCategoryIcon = () => {
    switch (category) {
      case 'mechanics':
        return <Wrench className="w-8 h-8 text-emerald-700" />;
      case 'tailors':
        return <Scissors className="w-8 h-8 text-emerald-700" />;
      case 'electricians':
        return <Zap className="w-8 h-8 text-amber-600" />;
      case 'photographers':
        return <Camera className="w-8 h-8 text-sky-600" />;
      default:
        return <ShieldCheck className="w-8 h-8 text-emerald-700" />;
    }
  };

  if (hasFatalError) {
    return (
      <div
        onClick={onClick}
        className={`relative flex flex-col items-center justify-center bg-slate-100 text-slate-500 overflow-hidden ${className}`}
        style={aspectRatio ? { aspectRatio } : undefined}
      >
        <div className="p-3 bg-white/80 rounded-xl shadow-xs border border-slate-200 flex flex-col items-center text-center">
          {renderCategoryIcon()}
          <span className="text-[11px] font-bold text-slate-800 mt-1 capitalize">
            {category || 'Verified Artisan'}
          </span>
          <span className="text-[9px] text-slate-600">HireNaija Pro</span>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden bg-slate-100 ${className}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Shimmer skeleton while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-200/80 animate-pulse flex items-center justify-center">
          <ImageIcon className="w-6 h-6 text-slate-300 animate-pulse" />
        </div>
      )}

      <img
        src={activeSrc}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
