import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  ShieldCheck,
  Star,
  MapPin,
  Sparkles,
  Grid,
  List,
  RotateCcw,
} from 'lucide-react';
import { Business, BusinessCategory, City, Neighborhood } from '../types';
import { CATEGORIES, NIGERIAN_CITIES } from '../data/categories';
import { BusinessCard } from './BusinessCard';

interface DirectoryListingProps {
  businesses: Business[];
  selectedCategory: BusinessCategory | 'all';
  setSelectedCategory: (cat: BusinessCategory | 'all') => void;
  selectedCity: City | 'all';
  setSelectedCity: (city: City | 'all') => void;
  selectedNeighborhood: Neighborhood | 'all';
  setSelectedNeighborhood: (n: Neighborhood | 'all') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  bookmarks: string[];
  onToggleBookmark: (id: string) => void;
  onSelectBusiness: (business: Business) => void;
  onRequestQuote: (business: Business) => void;
  onCallClick: (business: Business) => void;
  onWhatsAppClick: (business: Business) => void;
}

export const DirectoryListing: React.FC<DirectoryListingProps> = ({
  businesses,
  selectedCategory,
  setSelectedCategory,
  selectedCity,
  setSelectedCity,
  selectedNeighborhood,
  setSelectedNeighborhood,
  searchQuery,
  setSearchQuery,
  bookmarks,
  onToggleBookmark,
  onSelectBusiness,
  onRequestQuote,
  onCallClick,
  onWhatsAppClick,
}) => {
  const [cacOnly, setCacOnly] = useState(false);
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'featured' | 'rating' | 'reviews' | 'price_low'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');

  // Filter available neighborhoods based on selected city
  const availableNeighborhoods = useMemo(() => {
    if (selectedCity === 'all') {
      return NIGERIAN_CITIES.flatMap((c) => c.neighborhoods);
    }
    const found = NIGERIAN_CITIES.find((c) => c.name === selectedCity);
    return found ? found.neighborhoods : [];
  }, [selectedCity]);

  // Filter & sort logic
  const filteredBusinesses = useMemo(() => {
    return businesses
      .filter((biz) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = biz.name.toLowerCase().includes(q);
          const matchTagline = biz.tagLine.toLowerCase().includes(q);
          const matchCategory = biz.categoryLabel.toLowerCase().includes(q);
          const matchNeighborhood = biz.neighborhood.toLowerCase().includes(q);
          const matchCity = biz.city.toLowerCase().includes(q);
          const matchServices = biz.services.some((s) => s.name.toLowerCase().includes(q));
          if (!matchName && !matchTagline && !matchCategory && !matchNeighborhood && !matchCity && !matchServices) {
            return false;
          }
        }

        // Category
        if (selectedCategory !== 'all' && biz.category !== selectedCategory) {
          return false;
        }

        // City
        if (selectedCity !== 'all' && biz.city !== selectedCity) {
          return false;
        }

        // Neighborhood
        if (selectedNeighborhood !== 'all' && biz.neighborhood !== selectedNeighborhood) {
          return false;
        }

        // CAC Verified only
        if (cacOnly && biz.verification !== 'cac_verified') {
          return false;
        }

        // Open now only
        if (openNowOnly && !biz.openingHours.isOpenNow) {
          return false;
        }

        // Min rating
        if (minRating > 0 && biz.rating < minRating) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'featured') {
          const planOrder = { vip: 3, growth: 2, starter: 1, free: 0 };
          const planDiff = planOrder[b.plan] - planOrder[a.plan];
          if (planDiff !== 0) return planDiff;
          return b.rating - a.rating;
        }
        if (sortBy === 'rating') {
          return b.rating - a.rating;
        }
        if (sortBy === 'reviews') {
          return b.reviewCount - a.reviewCount;
        }
        if (sortBy === 'price_low') {
          return a.startingPrice - b.startingPrice;
        }
        return 0;
      });
  }, [
    businesses,
    searchQuery,
    selectedCategory,
    selectedCity,
    selectedNeighborhood,
    cacOnly,
    openNowOnly,
    minRating,
    sortBy,
  ]);

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedCity !== 'all' ? 1 : 0) +
    (selectedNeighborhood !== 'all' ? 1 : 0) +
    (cacOnly ? 1 : 0) +
    (openNowOnly ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (searchQuery ? 1 : 0);

  const resetAllFilters = () => {
    setSelectedCategory('all');
    setSelectedCity('all');
    setSelectedNeighborhood('all');
    setCacOnly(false);
    setOpenNowOnly(false);
    setMinRating(0);
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="artisans-list">
      {/* Filtering Toolbar Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 mb-8 shadow-xs space-y-4">
        {/* Top Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search trade, service, or pro name..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          {/* City */}
          <div>
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value as City | 'all');
                setSelectedNeighborhood('all');
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
            >
              <option value="all">All 36 States & FCT</option>
              {NIGERIAN_CITIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} ({c.state})
                </option>
              ))}
            </select>
          </div>

          {/* District / Neighborhood */}
          <div>
            <select
              value={selectedNeighborhood}
              onChange={(e) => setSelectedNeighborhood(e.target.value as Neighborhood | 'all')}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="all">All Districts / Neighborhoods</option>
              {availableNeighborhoods.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="featured">Featured & Priority Pros</option>
              <option value="rating">Highest Rated (5.0★)</option>
              <option value="reviews">Most Customer Reviews</option>
              <option value="price_low">Lowest Starting Price</option>
            </select>
          </div>
        </div>

        {/* Bottom Toggles & Quick Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* CAC toggle */}
            <button
              onClick={() => setCacOnly(!cacOnly)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
                cacOnly
                  ? 'bg-emerald-800 text-white border-emerald-800'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>CAC Verified Only</span>
            </button>

            {/* 4.8+ Rating toggle */}
            <button
              onClick={() => setMinRating(minRating === 4.8 ? 0 : 4.8)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
                minRating === 4.8
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>4.8★ & Above</span>
            </button>

            {/* Open Now toggle */}
            <button
              onClick={() => setOpenNowOnly(!openNowOnly)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                openNowOnly
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <span>Open Right Now</span>
            </button>

            {activeFiltersCount > 0 && (
              <button
                onClick={resetAllFilters}
                className="text-xs text-red-600 hover:text-red-700 font-semibold underline inline-flex items-center gap-1 ml-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset ({activeFiltersCount})</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-500 text-xs tabular-nums">
              Showing <span className="font-bold text-slate-900">{filteredBusinesses.length}</span> verified pros
            </span>

            <div className="hidden sm:flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`p-1 rounded cursor-pointer ${
                  viewMode === 'compact' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Directory Content Results */}
      {filteredBusinesses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Verified Professionals Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            We couldn't find any artisans matching your active search filters in this location. Try broadening your criteria or reset filters.
          </p>
          <button
            onClick={resetAllFilters}
            className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div
          className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1'
          }`}
        >
          {filteredBusinesses.map((biz) => (
            <BusinessCard
              key={biz.id}
              business={biz}
              isBookmarked={bookmarks.includes(biz.id)}
              onToggleBookmark={onToggleBookmark}
              onSelectBusiness={onSelectBusiness}
              onRequestQuote={onRequestQuote}
              onCallClick={onCallClick}
              onWhatsAppClick={onWhatsAppClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};
