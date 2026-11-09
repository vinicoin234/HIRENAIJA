import React from 'react';
import { X, Bookmark, Phone, MessageCircle, Star, MapPin } from 'lucide-react';
import { Business } from '../types';
import { createWhatsAppUrl } from '../utils/helpers';
import { OptimizedImage } from './OptimizedImage';

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedBusinesses: Business[];
  onRemoveBookmark: (id: string) => void;
  onSelectBusiness: (business: Business) => void;
}

export const BookmarksModal: React.FC<BookmarksModalProps> = ({
  isOpen,
  onClose,
  bookmarkedBusinesses,
  onRemoveBookmark,
  onSelectBusiness,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-emerald-700 fill-emerald-700" />
            <h3 className="text-base font-bold text-slate-900">Saved Artisans ({bookmarkedBusinesses.length})</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-3 flex-1">
          {bookmarkedBusinesses.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <Bookmark className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-semibold text-slate-700">No saved professionals yet</p>
              <p className="text-[11px] text-slate-400">Click the bookmark icon on any artisan card to save them for emergency quick access.</p>
            </div>
          ) : (
            bookmarkedBusinesses.map((biz) => (
              <div
                key={biz.id}
                className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-300 transition-all gap-3"
              >
                <div
                  onClick={() => {
                    onSelectBusiness(biz);
                    onClose();
                  }}
                  className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
                >
                  <OptimizedImage
                    src={biz.image}
                    alt={biz.name}
                    category={biz.category}
                    width={100}
                    className="w-12 h-12 rounded-lg shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-slate-900 truncate hover:text-emerald-700">
                      {biz.name}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {biz.categoryLabel} · {biz.neighborhood}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-800 mt-0.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                      {biz.rating.toFixed(1)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={createWhatsAppUrl(biz.whatsapp, biz.name)}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs"
                    title="WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={`tel:${biz.phone.replace(/\s+/g, '')}`}
                    className="p-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs"
                    title="Call"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => onRemoveBookmark(biz.id)}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-lg text-xs cursor-pointer"
                    title="Remove"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
