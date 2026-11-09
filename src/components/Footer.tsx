import React from 'react';
import { ShieldCheck, MessageCircle, Phone, MapPin, Smartphone, Download } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { BusinessCategory } from '../types';

interface FooterProps {
  onSelectCategory: (cat: BusinessCategory) => void;
  onOpenRegister: () => void;
  onOpenPostJob: () => void;
  onOpenDownloadModal: () => void;
  onNavigateTab: (tab: 'browse' | 'jobs' | 'dashboard' | 'revenue') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenRegister,
  onOpenPostJob,
  onOpenDownloadModal,
  onNavigateTab,
}) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                HN
              </span>
              <span className="text-xl font-extrabold tracking-tight text-white">HireNaija</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Find trusted Nigerian professionals near you. The leading verified artisan directory connecting residents and businesses with qualified mechanics, electricians, tailors, plumbers, and craft specialists in Lagos, Abuja, and Port Harcourt.
            </p>
            <div className="text-xs text-slate-400 space-y-1 pt-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Herbert Macaulay Way, Yaba, Lagos · Maitama, Abuja</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Corporate Affairs Commission (CAC) Verification Partner</span>
              </div>
            </div>

            {/* Android APK Download Card in Footer */}
            <div className="pt-2">
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 max-w-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Android App (APK)</span>
                      <span className="text-[9px] bg-emerald-600 text-white font-bold px-1 rounded">v1.2.0</span>
                    </div>
                    <div className="text-[11px] text-slate-400">19.1 MB · Offline search</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onOpenDownloadModal}
                  className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Navigation</h4>
            <ul className="text-xs space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => onNavigateTab('browse')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Browse All Artisans
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('jobs')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Artisan Job Requests
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPostJob}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Post a Job (Free)
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenRegister}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  List Your Business
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('revenue')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Revenue Blueprint
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenDownloadModal}
                  className="hover:text-emerald-400 text-emerald-400 font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Download Android App (APK)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Top Categories</h4>
            <ul className="text-xs space-y-2 text-slate-400">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat.id);
                      onNavigateTab('browse');
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Target Hubs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">36 States & FCT</h4>
            <ul className="text-xs space-y-2 text-slate-400">
              <li>Lagos, Ogun, Oyo & South West</li>
              <li>FCT Abuja, Niger & North Central</li>
              <li>Rivers, Delta & South South</li>
              <li>Enugu, Anambra & South East</li>
              <li>Kano, Kaduna & North West</li>
              <li>Borno, Bauchi & North East</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} HireNaija Technologies Ltd. Built for Nigerian local enterprise.
          </div>
          <div className="flex items-center gap-6 text-xs">
            <span>Verified Artisan Directory</span>
            <span>·</span>
            <span>Direct WhatsApp Connectivity</span>
            <span>·</span>
            <span>Paystack Secured</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
