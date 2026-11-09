import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

interface AdBannerProps {
  adSlot?: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  fullWidthResponsive?: boolean;
  className?: string;
  publisherId?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true,
  className = '',
  publisherId = 'ca-pub-7858473531242452',
}) => {
  const adRef = useRef<HTMLModElement | null>(null);
  const isLoadedRef = useRef(false);

  useEffect(() => {
    // Only attempt push once per ad slot mount
    if (isLoadedRef.current) return;
    try {
      if (typeof window !== 'undefined' && adSlot) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isLoadedRef.current = true;
      }
    } catch (e) {
      // Ad blockers or preview environment might throw; safely catch
      console.debug('AdSense placement initialization notice:', e);
    }
  }, [adSlot]);

  // If no specific manual adSlot is provided, return an ad container placeholder that Google Auto-Ads can target or displays an unobtrusive sponsored label
  if (!adSlot) {
    return (
      <div
        className={`w-full my-4 py-2 px-3 border border-dashed border-slate-200 rounded-xl bg-slate-50/70 text-center text-xs text-slate-400 ${className}`}
        aria-label="Advertisement Space"
      >
        <span className="inline-block px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-400 bg-slate-100 rounded mr-2">
          Ad
        </span>
        <span className="text-slate-400">Google AdSense Auto-Ads Enabled (ca-pub-7858473531242452)</span>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden text-center my-4 ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={publisherId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
      />
    </div>
  );
};
