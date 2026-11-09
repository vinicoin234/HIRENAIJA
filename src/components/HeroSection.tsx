import React from 'react';
import { Search, MapPin, ShieldCheck, PhoneCall, CheckCircle2 } from 'lucide-react';
import { BusinessCategory, City, Neighborhood } from '../types';
import { CATEGORIES, NIGERIAN_CITIES } from '../data/categories';
import { ASSET_IMAGES } from '../utils/imageAssets';
import { Image } from './ui/Image';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCity: City | 'all';
  setSelectedCity: (city: City | 'all') => void;
  selectedNeighborhood: Neighborhood | 'all';
  setSelectedNeighborhood: (n: Neighborhood | 'all') => void;
  selectedCategory: BusinessCategory | 'all';
  setSelectedCategory: (cat: BusinessCategory | 'all') => void;
  onSearchSubmit: () => void;
  onPostJobClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCity,
  setSelectedCity,
  selectedNeighborhood,
  setSelectedNeighborhood,
  selectedCategory,
  setSelectedCategory,
  onSearchSubmit,
  onPostJobClick,
}) => {
  // Available neighborhoods based on selected city
  const availableNeighborhoods = React.useMemo(() => {
    if (selectedCity === 'all') {
      return NIGERIAN_CITIES.flatMap((c) => c.neighborhoods);
    }
    const found = NIGERIAN_CITIES.find((c) => c.name === selectedCity);
    return found ? found.neighborhoods : [];
  }, [selectedCity]);

  const handleCityChange = (city: City | 'all') => {
    setSelectedCity(city);
    setSelectedNeighborhood('all');
  };

  return (
    <section className="relative bg-white border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14">
        {/* Main 2-column split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Left Column: Proposition & Search Controller */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Verified Local Artisans & Specialists · Nigeria</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-4 text-balance">
              Find trusted Nigerian professionals near you.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 mb-8 max-w-2xl leading-relaxed">
              Connect directly with vetted mechanics, electricians, tailors, plumbers, photographers, and artisans in Lagos, Abuja, and Port Harcourt. Direct WhatsApp chat, upfront pricing, and real neighborhood reviews.
            </p>

            {/* Structured Search Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4 shadow-sm mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-3">
                {/* Search Term */}
                <div className="sm:col-span-6 relative">
                  <label htmlFor="search-service" className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    What service do you need?
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="search-service"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
                      placeholder="e.g. Inverter repair, Bespoke Senator, Toyota scan"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* City */}
                <div className="sm:col-span-3">
                  <label htmlFor="select-city" className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    City
                  </label>
                  <select
                    id="select-city"
                    value={selectedCity}
                    onChange={(e) => handleCityChange(e.target.value as City | 'all')}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="all">All States (Nigeria)</option>
                    {NIGERIAN_CITIES.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name} ({c.state})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Neighborhood / Area */}
                <div className="sm:col-span-3">
                  <label htmlFor="select-neighborhood" className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Neighborhood
                  </label>
                  <select
                    id="select-neighborhood"
                    value={selectedNeighborhood}
                    onChange={(e) => setSelectedNeighborhood(e.target.value as Neighborhood | 'all')}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="all">All Districts</option>
                    {availableNeighborhoods.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Bottom Search Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-200/60">
                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto py-1 text-xs text-slate-500">
                  <span className="font-medium text-slate-700 whitespace-nowrap">Popular:</span>
                  <button
                    onClick={() => {
                      setSelectedCategory('electricians');
                      onSearchSubmit();
                    }}
                    className="hover:text-emerald-700 underline decoration-slate-300 underline-offset-2 whitespace-nowrap cursor-pointer"
                  >
                    Solar Inverter
                  </button>
                  <span>·</span>
                  <button
                    onClick={() => {
                      setSelectedCategory('tailors');
                      onSearchSubmit();
                    }}
                    className="hover:text-emerald-700 underline decoration-slate-300 underline-offset-2 whitespace-nowrap cursor-pointer"
                  >
                    Senator Suit
                  </button>
                  <span>·</span>
                  <button
                    onClick={() => {
                      setSelectedCategory('mechanics');
                      onSearchSubmit();
                    }}
                    className="hover:text-emerald-700 underline decoration-slate-300 underline-offset-2 whitespace-nowrap cursor-pointer"
                  >
                    Car Diagnostics
                  </button>
                  <span>·</span>
                  <button
                    onClick={() => {
                      setSelectedCategory('barbers');
                      onSearchSubmit();
                    }}
                    className="hover:text-emerald-700 underline decoration-slate-300 underline-offset-2 whitespace-nowrap cursor-pointer"
                  >
                    Home Barber
                  </button>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={onSearchSubmit}
                    className="w-full sm:w-auto px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer text-center"
                  >
                    Find Professionals
                  </button>
                </div>
              </div>
            </div>

            {/* Quick action / Post Request */}
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="text-slate-700 font-medium">In a hurry?</span>
              <button
                onClick={onPostJobClick}
                className="text-emerald-700 font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                Post an artisan job request in 60 seconds →
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Container */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full h-[320px] sm:h-[400px] lg:h-[440px] rounded-2xl overflow-hidden shadow-md border border-slate-200">
              <Image
                src={ASSET_IMAGES.hero}
                alt="Skilled Nigerian artisans at work in a modern workshop"
                priority={true}
                width={800}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

              {/* Floating verified badge proof overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-3 border border-white/20 text-slate-900 shadow-lg">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-900">Direct WhatsApp Verified</p>
                      <p className="text-slate-500 text-[11px]">No agency commission · Speak to pros directly</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    All 36 States & FCT
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Proof & Market Strip */}
        <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">12 Categories</div>
            <div className="text-xs text-slate-500 mt-0.5">Mechanics to Bespoke Tailors</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">1-Click WhatsApp</div>
            <div className="text-xs text-slate-500 mt-0.5">Immediate quotes & chat</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">CAC Verification</div>
            <div className="text-xs text-slate-500 mt-0.5">Corporate Affairs registered</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-700 tabular-nums">₦0 Middleman Fee</div>
            <div className="text-xs text-slate-500 mt-0.5">100% free for customers</div>
          </div>
        </div>
      </div>
    </section>
  );
};
