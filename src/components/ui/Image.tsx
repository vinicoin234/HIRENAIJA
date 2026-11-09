import React, { useState, useEffect } from 'react';
import { resolveImageUrl, getCategoryDefaultImage, ASSET_IMAGES } from '../../utils/imageAssets';
import { Wrench, Scissors, Zap, Camera, ShieldCheck } from 'lucide-react';

export interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  alt: string;
  className?: string;
  category?: string;
  priority?: boolean;
  width?: number;
  height?: number;
  aspectRatio?: string;
}

/**
 * Lightweight neutral SVG base64 blur/shimmer placeholder.
 * Prevents Layout Shift (CLS) and provides instant visual feedback while images download.
 */
export const BASE64_PLACEHOLDER =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmNXA5Ii8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMzgwIiBoZWlnaHQ9IjI4MCIgZmlsbD0iI2UycGU4ZjAiIHJ4PSIxMiIgb3BhY2l0eT0iMC41Ii8+PC9zdmc+';

/**
 * Normalizes and proxies Supabase storage URLs through an optimized caching layer.
 * 1. Rewrites standard object URLs to Supabase's image render/optimization endpoint.
 * 2. Prepends global edge CDN caching parameters for lightning fast response times and 0% broken images in Vercel.
 */
export function proxySupabaseUrl(rawUrl: string, width = 800): { direct: string; cachedProxy: string } {
  let url = rawUrl.trim();

  // Normalize protocol
  if (url.startsWith('http://')) {
    url = url.replace('http://', 'https://');
  }

  // Handle Supabase Storage endpoints
  if (url.includes('.supabase.co/storage/v1/object/public/')) {
    const renderUrl = url.replace(
      '/storage/v1/object/public/',
      '/storage/v1/render/image/public/'
    ) + `?width=${width}&quality=80&resize=cover`;

    // Global CDN Cache Proxy for Supabase Storage (wsrv.nl / images.weserv.nl Cloudflare edge cache)
    const cleanNoProto = url.replace(/^https?:\/\//, '');
    const cdnProxy = `https://wsrv.nl/?url=${encodeURIComponent(cleanNoProto)}&w=${width}&q=80&output=webp&default=${encodeURIComponent(
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80'
    )}`;

    return {
      direct: renderUrl,
      cachedProxy: cdnProxy,
    };
  }

  // Generic remote URLs: also generate CDN cached proxy fallback
  if (url.startsWith('https://')) {
    const cleanNoProto = url.replace(/^https?:\/\//, '');
    return {
      direct: url,
      cachedProxy: `https://wsrv.nl/?url=${encodeURIComponent(cleanNoProto)}&w=${width}&q=80&output=webp`,
    };
  }

  return { direct: url, cachedProxy: url };
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  className = '',
  category,
  priority = false,
  width,
  height,
  aspectRatio,
  style,
  onError,
  onLoad,
  ...props
}) => {
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExhausted, setIsExhausted] = useState(false);

  // Generate ordered cascade of fallback URLs
  const candidateUrls = React.useMemo(() => {
    const list: string[] = [];

    if (src && typeof src === 'string' && src.trim() !== '') {
      // Resolve any local legacy /src/assets paths first
      const resolved = resolveImageUrl(src, category);

      if (resolved.startsWith('http://') || resolved.startsWith('https://')) {
        const { direct, cachedProxy } = proxySupabaseUrl(resolved, width || 800);
        // 1. Try direct Supabase optimized render URL
        list.push(direct);
        // 2. Try CDN edge cached proxy layer (guarantees delivery on Vercel)
        if (cachedProxy !== direct) {
          list.push(cachedProxy);
        }
        // 3. Try raw unoptimized storage URL
        if (!list.includes(resolved)) {
          list.push(resolved);
        }
      } else {
        list.push(resolved);
      }
    }

    // 4. Bundled local Vite asset for category
    const catAsset = getCategoryDefaultImage(category || 'mechanics');
    if (!list.includes(catAsset)) {
      list.push(catAsset);
    }

    // 5. Hero artisan asset
    if (!list.includes(ASSET_IMAGES.hero)) {
      list.push(ASSET_IMAGES.hero);
    }

    // 6. Public static image path
    list.push('/images/hero_artisan_lagos_1793884432708.jpg');

    return list;
  }, [src, category, width]);

  const currentSrc = candidateUrls[candidateIndex] || candidateUrls[0];

  // Reset when src changes
  useEffect(() => {
    setCandidateIndex(0);
    setIsLoaded(false);
    setIsExhausted(false);
  }, [src]);

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (candidateIndex < candidateUrls.length - 1) {
      setCandidateIndex((prev) => prev + 1);
    } else {
      setIsExhausted(true);
      setIsLoaded(true);
      if (onError) onError(e);
    }
  };

  const handleImgLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const getCategoryIcon = () => {
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

  if (isExhausted) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center bg-slate-100 text-slate-500 overflow-hidden ${className}`}
        style={{ ...style, ...(aspectRatio ? { aspectRatio } : {}) }}
      >
        <div className="p-3 bg-white/90 rounded-xl border border-slate-200 flex flex-col items-center text-center shadow-xs">
          {getCategoryIcon()}
          <span className="text-[11px] font-bold text-slate-800 mt-1 capitalize">
            {category || 'Verified Pro'}
          </span>
          <span className="text-[9px] text-slate-500">HireNaija Verified</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-slate-100 ${className}`}
      style={{ ...style, ...(aspectRatio ? { aspectRatio } : {}) }}
    >
      {/* Base64 placeholder background preview while downloading */}
      {!isLoaded && (
        <img
          src={BASE64_PLACEHOLDER}
          alt="loading placeholder"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover filter blur-xs scale-105 pointer-events-none transition-opacity duration-300"
        />
      )}

      {/* Main optimized image */}
      <img
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={handleImgLoad}
        onError={handleImgError}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
};

export default Image;
