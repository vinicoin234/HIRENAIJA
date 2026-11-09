import React from 'react';
import {
  Star,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  ShieldCheck,
  Bookmark,
  ExternalLink,
  Award,
} from 'lucide-react';
import { Business } from '../types';
import { formatNaira, createWhatsAppUrl } from '../utils/helpers';
import { Image } from './ui/Image';

interface BusinessCardProps {
  business: Business;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onSelectBusiness: (business: Business) => void;
  onRequestQuote: (business: Business) => void;
  onCallClick: (business: Business) => void;
  onWhatsAppClick: (business: Business) => void;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
  business,
  isBookmarked,
  onToggleBookmark,
  onSelectBusiness,
  onRequestQuote,
  onCallClick,
  onWhatsAppClick,
}) => {
  const isVip = business.plan === 'vip';
  const isGrowth = business.plan === 'growth';

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    onWhatsAppClick(business);
    const url = createWhatsAppUrl(business.whatsapp, business.name);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCallClick(business);
    window.location.href = `tel:${business.phone.replace(/\s+/g, '')}`;
  };

  return (
    <article
      onClick={() => onSelectBusiness(business)}
      className={`group relative bg-white rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden flex flex-col ${
        isVip
          ? 'border-emerald-600/60 shadow-md ring-1 ring-emerald-600/20'
          : isGrowth
          ? 'border-slate-300 shadow-sm hover:border-slate-400'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Top Banner & Photo Showcase */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <Image
          src={business.image}
          alt={business.name}
          category={business.category}
          width={600}
          className="w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges / Indicators */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-white">
            {isVip && (
              <span className="bg-emerald-800 text-white font-bold px-2 py-0.5 rounded text-[11px] tracking-wide shadow-sm flex items-center gap-1">
                <Award className="w-3 h-3" />
                Featured VIP
              </span>
            )}
            {business.verification === 'cac_verified' && (
              <span className="bg-slate-900/90 text-white text-[11px] font-semibold px-2 py-0.5 rounded backdrop-blur-sm flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                CAC Verified
              </span>
            )}
          </div>

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(business.id);
            }}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark pro'}
            className="p-1.5 rounded-full bg-slate-900/60 text-white hover:bg-slate-900 transition-colors backdrop-blur-sm cursor-pointer"
          >
            <Bookmark
              className={`w-4 h-4 ${isBookmarked ? 'fill-emerald-400 text-emerald-400' : 'text-white'}`}
            />
          </button>
        </div>

        {/* Bottom Image Overlay: Category & Price Indicator */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between text-white">
          <span className="text-xs font-medium text-slate-200">
            {business.categoryLabel}
          </span>
          <div className="text-right">
            <span className="text-[11px] text-slate-300 block">From</span>
            <span className="text-sm font-bold text-white tabular-nums">
              {formatNaira(business.startingPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Rating */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
              {business.name}
            </h3>
          </div>

          {/* Clean Unboxed Metadata with Typographic Separator (Zero-Pill Discipline) */}
          <div className="flex items-center gap-2 text-xs text-slate-600 mb-2.5 flex-wrap">
            <span className="font-semibold text-slate-900 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              {business.rating.toFixed(1)}
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="tabular-nums">({business.reviewCount} reviews)</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              {business.neighborhood}, {business.city}
            </span>
          </div>

          {/* Tagline / Summary */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
            {business.tagLine}
          </p>

          {/* Service highlights (preview top 2 services with clean prices) */}
          <div className="space-y-1 mb-4 pt-2 border-t border-slate-100">
            {business.services.slice(0, 2).map((srv) => (
              <div key={srv.id} className="flex items-center justify-between text-xs text-slate-600">
                <span className="truncate pr-2">{srv.name}</span>
                <span className="font-semibold text-slate-900 tabular-nums shrink-0">
                  {formatNaira(srv.price)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer & Direct Action Buttons */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2.5">
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <Clock className="w-3 h-3" />
              {business.responseTime}
            </span>
            <span>{business.yearsInBusiness} yrs in business</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* WhatsApp Direct Action */}
            <button
              onClick={handleWhatsApp}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            {/* Direct Call Action */}
            <button
              onClick={handleCall}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Pro</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
