import React from 'react';
import {
  Wrench,
  Zap,
  Scissors,
  Droplet,
  Sparkles,
  Camera,
  Disc,
  Mic2,
  Shield,
  Laptop,
  GraduationCap,
  Layers,
  Heart,
} from 'lucide-react';
import { BusinessCategory } from '../types';
import { CATEGORIES } from '../data/categories';

interface CategoryGridProps {
  selectedCategory: BusinessCategory | 'all';
  onSelectCategory: (cat: BusinessCategory | 'all') => void;
  categoryCounts: Record<string, number>;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  const getIcon = (id: BusinessCategory | 'all') => {
    switch (id) {
      case 'mechanics':
        return <Wrench className="w-5 h-5" />;
      case 'electricians':
        return <Zap className="w-5 h-5" />;
      case 'tailors':
        return <Scissors className="w-5 h-5" />;
      case 'plumbers':
        return <Droplet className="w-5 h-5" />;
      case 'barbers':
        return <Sparkles className="w-5 h-5" />;
      case 'hairstylists':
        return <Heart className="w-5 h-5" />;
      case 'photographers':
        return <Camera className="w-5 h-5" />;
      case 'djs':
        return <Disc className="w-5 h-5" />;
      case 'mcs':
        return <Mic2 className="w-5 h-5" />;
      case 'welders':
        return <Shield className="w-5 h-5" />;
      case 'freelancers':
        return <Laptop className="w-5 h-5" />;
      case 'tutors':
        return <GraduationCap className="w-5 h-5" />;
      default:
        return <Layers className="w-5 h-5" />;
    }
  };

  const totalCount = Object.values(categoryCounts).reduce((acc, curr) => acc + curr, 0);

  return (
    <div className="py-8 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Explore by Trade & Specialty</h2>
            <p className="text-xs text-slate-500">Pick a professional category to find vetted artisans near you</p>
          </div>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => onSelectCategory('all')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
            >
              Reset to All Categories ({totalCount})
            </button>
          )}
        </div>

        {/* Scrollable / Responsive grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {/* "All" button */}
          <button
            onClick={() => onSelectCategory('all')}
            className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60'
            }`}
          >
            <div
              className={`p-2 rounded-lg ${
                selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Layers className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold truncate">All Trades</div>
              <div className={`text-[11px] tabular-nums ${selectedCategory === 'all' ? 'text-white/80' : 'text-slate-500'}`}>
                {totalCount} pros
              </div>
            </div>
          </button>

          {/* Categories */}
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer group ${
                  isSelected
                    ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60'
                }`}
              >
                <div
                  className={`p-2 rounded-lg shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-emerald-50 text-emerald-800 group-hover:bg-emerald-100'
                  }`}
                >
                  {getIcon(cat.id)}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">{cat.name}</div>
                  <div className={`text-[11px] tabular-nums ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                    {count} {count === 1 ? 'pro' : 'pros'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
