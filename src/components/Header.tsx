import React, { useState } from 'react';
import { Bookmark, PlusCircle, User, LogOut, ChevronDown, Wrench, Shield } from 'lucide-react';
import { AuthUser } from '../types';

interface HeaderProps {
  activeTab: 'browse' | 'jobs' | 'dashboard' | 'revenue';
  setActiveTab: (tab: 'browse' | 'jobs' | 'dashboard' | 'revenue') => void;
  onOpenRegister: () => void;
  onOpenBookmarks: () => void;
  bookmarkCount: number;
  currentUser: AuthUser | null;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenRegister,
  onOpenBookmarks,
  bookmarkCount,
  currentUser,
  onOpenAuth,
  onSignOut,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
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

          {/* Zone 3: Bookmarks, Auth status / Sign In, and Register Business */}
          <div className="flex items-center gap-2.5 shrink-0">
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

            {/* User Profile or Sign In Button */}
            {currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white shadow-xs cursor-pointer focus:outline-none"
                >
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.fullName}
                      className="w-7 h-7 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                      {currentUser.fullName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="hidden sm:block text-left text-xs">
                    <div className="font-bold text-slate-800 truncate max-w-[100px]">
                      {currentUser.fullName.split(' ')[0]}
                    </div>
                    <div className="text-[10px] text-emerald-700 font-semibold capitalize">
                      {currentUser.role}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <div className="px-3.5 py-2 border-b border-slate-100">
                      <div className="font-bold text-xs text-slate-900 truncate">
                        {currentUser.fullName}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {currentUser.email}
                      </div>
                      <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 capitalize">
                        {currentUser.role === 'artisan' ? '🛠️ Artisan Pro' : '👤 Customer'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('dashboard')}
                      className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Wrench className="w-3.5 h-3.5 text-emerald-700" />
                      <span>My Business Hub</span>
                    </button>

                    <button
                      type="button"
                      onClick={onOpenBookmarks}
                      className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Saved Artisans ({bookmarkCount})</span>
                    </button>

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      type="button"
                      onClick={onSignOut}
                      className="w-full text-left px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-600" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onOpenAuth('signin')}
                  className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-emerald-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAuth('signup')}
                  className="hidden sm:inline-flex items-center gap-1 px-3 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Join Free</span>
                </button>
              </div>
            )}

            <button
              onClick={onOpenRegister}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-all whitespace-nowrap cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Business</span>
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
