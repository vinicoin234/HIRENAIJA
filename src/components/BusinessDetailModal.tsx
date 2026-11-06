import React, { useState } from 'react';
import {
  X,
  Star,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  ShieldCheck,
  CheckCircle,
  Share2,
  Bookmark,
  Calendar,
  Send,
  Sparkles,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Business, Review } from '../types';
import { formatNaira, createWhatsAppUrl } from '../utils/helpers';

interface BusinessDetailModalProps {
  business: Business;
  isOpen: boolean;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onRequestQuote: (business: Business, serviceName?: string) => void;
  onAddReview: (businessId: string, review: Omit<Review, 'id' | 'date' | 'verifiedHire'>) => void;
  onWhatsAppClick: (business: Business) => void;
  onCallClick: (business: Business) => void;
}

export const BusinessDetailModal: React.FC<BusinessDetailModalProps> = ({
  business,
  isOpen,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onRequestQuote,
  onAddReview,
  onWhatsAppClick,
  onCallClick,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewNeighborhood, setReviewNeighborhood] = useState('');
  const [copiedShare, setCopiedShare] = useState(false);

  if (!isOpen) return null;

  const images = business.gallery && business.gallery.length > 0 ? business.gallery : [business.image];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const handleWhatsApp = (serviceName?: string) => {
    onWhatsAppClick(business);
    const url = createWhatsAppUrl(business.whatsapp, business.name, serviceName);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCall = () => {
    onCallClick(business);
    window.location.href = `tel:${business.phone.replace(/\s+/g, '')}`;
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;

    onAddReview(business.id, {
      authorName: reviewAuthor.trim(),
      rating: reviewRating,
      comment: reviewComment.trim(),
      neighborhood: reviewNeighborhood.trim() || business.neighborhood,
    });

    setReviewAuthor('');
    setReviewComment('');
    setReviewNeighborhood('');
    setIsReviewFormOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Modal Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {business.categoryLabel}
            </span>
            <span className="text-xs text-slate-500">
              {business.neighborhood}, {business.city}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1.5"
              title="Share listing"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{copiedShare ? 'Copied Link!' : 'Share'}</span>
            </button>

            <button
              onClick={() => onToggleBookmark(business.id)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Save to bookmarks"
            >
              <Bookmark
                className={`w-4 h-4 ${isBookmarked ? 'fill-emerald-600 text-emerald-600' : ''}`}
              />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-6 space-y-8 flex-1">
          {/* Main Visual & Info Header */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Gallery Column */}
            <div className="md:col-span-5 space-y-3">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs">
                <img
                  src={images[activeImageIndex] || business.image}
                  alt={business.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-12 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer ${
                        activeImageIndex === idx ? 'border-emerald-600' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Summary Column */}
            <div className="md:col-span-7 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  {business.verification === 'cac_verified' && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                      CAC Registered: {business.cacNumber || 'Verified Entity'}
                    </span>
                  )}
                  {business.plan === 'vip' && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Top 1% Featured Pro
                    </span>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight mb-2">
                  {business.name}
                </h2>

                <p className="text-sm font-medium text-slate-700 mb-3">{business.tagLine}</p>

                {/* Rating & Location Meta */}
                <div className="flex items-center gap-3 text-xs text-slate-600 mb-4 flex-wrap">
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                    {business.rating.toFixed(1)} / 5.0
                  </span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="tabular-nums">({business.reviewCount} verified reviews)</span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-emerald-700 font-semibold">{business.yearsInBusiness} years experience</span>
                </div>

                {/* Quick Info Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs text-slate-700 mb-5">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900">{business.fullAddress}</span>
                      {business.landmark && (
                        <span className="text-slate-500 block text-[11px]">Landmark: {business.landmark}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>
                      {business.openingHours.days}: {business.openingHours.hours}
                      <span className="ml-2 font-semibold text-emerald-700">· Open Now</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Instant Conversion CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                <button
                  onClick={() => handleWhatsApp()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </button>

                <button
                  onClick={handleCall}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {business.phone}</span>
                </button>

                <button
                  onClick={() => onRequestQuote(business)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <span>Request Quote</span>
                </button>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="border-t border-slate-100 pt-6">
            <h3 className="text-base font-bold text-slate-900 mb-2">About the Business</h3>
            <p className="text-sm text-slate-600 leading-relaxed max-w-3xl whitespace-pre-line">
              {business.bio}
            </p>
          </div>

          {/* Services & Rate Card */}
          <div className="border-t border-slate-100 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Services & Upfront Rates</h3>
                <p className="text-xs text-slate-500">Transparent pricing for standard jobs. Custom jobs quoted on WhatsApp.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {business.services.map((service) => (
                <div
                  key={service.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h4 className="text-xs font-bold text-slate-900">{service.name}</h4>
                      <span className="text-xs font-extrabold text-emerald-800 tabular-nums shrink-0">
                        {formatNaira(service.price)}
                      </span>
                    </div>
                    {service.description && (
                      <p className="text-[11px] text-slate-500 leading-relaxed mb-2">
                        {service.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[11px]">
                    <span className="text-slate-500">{service.duration || 'Standard turnaround'}</span>
                    <button
                      onClick={() => handleWhatsApp(service.name)}
                      className="text-emerald-700 font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      Book on WhatsApp →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="border-t border-slate-100 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Neighborhood Reviews & Feedback</h3>
                <p className="text-xs text-slate-500">Real feedback from clients in {business.neighborhood} and across {business.city}</p>
              </div>

              <button
                onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
                className="text-xs font-semibold px-3 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {isReviewFormOpen ? 'Cancel' : 'Write a Review'}
              </button>
            </div>

            {/* Review submission form */}
            {isReviewFormOpen && (
              <form
                onSubmit={handleSubmitReview}
                className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
              >
                <div className="font-semibold text-xs text-slate-900">Your Experience with {business.name}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      placeholder="e.g. Adebayo Ogunlesi"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Your Neighborhood in {business.city}</label>
                    <input
                      type="text"
                      value={reviewNeighborhood}
                      onChange={(e) => setReviewNeighborhood(e.target.value)}
                      placeholder={`e.g. ${business.neighborhood}`}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="cursor-pointer focus:outline-none"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= reviewRating
                              ? 'fill-amber-400 text-amber-500'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-semibold text-slate-700 ml-2">{reviewRating} Stars</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Detailed Review</label>
                  <textarea
                    required
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Describe their timeliness, price honesty, quality of work, and customer service..."
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsReviewFormOpen(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition-colors"
                  >
                    Submit Verified Review
                  </button>
                </div>
              </form>
            )}

            {/* Reviews List */}
            <div className="space-y-3">
              {business.reviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-xl border border-slate-200/80 bg-white space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{rev.authorName}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-slate-500">{rev.neighborhood}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{rev.date}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(rev.rating)
                            ? 'fill-amber-400 text-amber-500'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                    {rev.verifiedHire && (
                      <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded font-medium ml-2">
                        Verified Hire
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600">
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            HireNaija Guarantee: Always verify payment terms directly before work commences
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
