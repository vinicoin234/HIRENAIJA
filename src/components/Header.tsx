import React from 'react';
import { Bookmark, PlusCircle } from 'lucide-react';

interface HeaderProps {
  activeTab: 'browse' | 'jobs' | 'dashboard' | 'revenue';
  setActiveTab: (tab: 'browse' | 'jobs' | 'dashboard' | 'revenue') => void;
  onOpenRegister: () => void;
  onOpenBookmarks: () => void;
  bookmarkCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenRegister,
  onOpenBookmarks,
  bookmarkCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand Wordmark (Single text element) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('browse')}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-700 text-white font-bold flex items-center justify-center text-base tracking-tight shadow-sm">
                  HN
                </span>
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  HireNaija
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: 4 concise single-line text links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            <button
              onClick={() => setActiveTab('browse')}
              className={`whitespace-nowrap transition-colors py-1 cursor-pointer focus:outline-none border-b-2 ${
                activeTab === 'browse'
                  ? 'border-emerald-700 text-emerald-800 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Explore Artisans
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`whitespace-nowrap transition-colors py-1 cursor-pointer focus:outline-none border-b-2 ${
                activeTab === 'jobs'
                  ? 'border-emerald-700 text-emerald-800 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Artisan Job Board
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`whitespace-nowrap transition-colors py-1 cursor-pointer focus:outline-none border-b-2 ${
                activeTab === 'dashboard'
                  ? 'border-emerald-700 text-emerald-800 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Business Owner Hub
            </button>
            <button
              onClick={() => setActiveTab('revenue')}
              className={`whitespace-nowrap transition-colors py-1 cursor-pointer focus:outline-none border-b-2 ${
                activeTab === 'revenue'
                  ? 'border-emerald-700 text-emerald-800 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Revenue Blueprint
            </button>
          </nav>

          {/* Zone 3: 1 primary action button + bookmark icon */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenBookmarks}
              title="Saved Artisans"
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              aria-label="View saved bookmarks"
            >
              <Bookmark className="w-5 h-5" />
              {bookmarkCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-700 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {bookmarkCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenRegister}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-all whitespace-nowrap cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Your Business</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary navigation strip */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 text-xs font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('browse')}
            className={`py-1 ${activeTab === 'browse' ? 'text-emerald-700 font-bold' : ''}`}
          >
            Explore
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`py-1 ${activeTab === 'jobs' ? 'text-emerald-700 font-bold' : ''}`}
          >
            Job Board
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-1 ${activeTab === 'dashboard' ? 'text-emerald-700 font-bold' : ''}`}
          >
            Owner Hub
          </button>
          <button
            onClick={() => setActiveTab('revenue')}
            className={`py-1 ${activeTab === 'revenue' ? 'text-emerald-700 font-bold' : ''}`}
          >
            Revenue Plan
          </button>
        </div>
      </div>
    </header>
  );
};
