import React from 'react';
import { TrendingUp, CheckCircle2 } from 'lucide-react';

export const RevenueModelSection: React.FC = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-700" />
            <span>Business Model & Financial Projections</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Why HireNaija Is Built for Scalable Profitability
          </h2>
        </div>

        {/* 3 Tier Pricing Architecture */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-2xl font-extrabold text-slate-900">Subscription Monetization Structure</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Clear value props for Nigerian mechanics, tailors, electricians, and studios</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold uppercase text-slate-500 tracking-wider">Acquisition</div>
                <h4 className="text-lg font-bold text-slate-900 mt-1">Free Basic Listing</h4>
                <div className="text-2xl font-extrabold text-slate-900 mt-3 mb-4">₦0 <span className="text-xs font-normal text-slate-500">forever</span></div>
                <ul className="text-xs text-slate-600 space-y-2.5">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>Basic profile listing in chosen city</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>Direct phone call button</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>Customer ratings & reviews</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6 border-t border-slate-100 mt-6 text-[11px] text-slate-400">
                Onboards artisan volume to populate the directory.
              </div>
            </div>

            {/* Growth Pro */}
            <div className="bg-white rounded-xl border-2 border-emerald-700 p-6 flex flex-col justify-between shadow-sm relative">
              <span className="absolute -top-3 left-6 bg-emerald-700 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded tracking-wider">
                Target Revenue Driver
              </span>
              <div>
                <div className="text-xs font-bold uppercase text-emerald-800 tracking-wider">Core Plan</div>
                <h4 className="text-lg font-bold text-slate-900 mt-1">Growth Pro</h4>
                <div className="text-2xl font-extrabold text-emerald-800 mt-3 mb-4 tabular-nums">
                  ₦10,000 <span className="text-xs font-normal text-slate-500">/ month</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-2.5">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span><strong>Priority search placement</strong> above free listings</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span><strong>Green CAC Verified Checkmark</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span><strong>Direct 1-Click WhatsApp routing</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>Up to 10 showcase craft photos</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6 border-t border-slate-100 mt-6 text-[11px] text-emerald-800 font-medium">
                100 subscribers = ₦1,000,000/mo net cashflow
              </div>
            </div>

            {/* VIP Featured */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold uppercase text-amber-700 tracking-wider">High Ticket</div>
                <h4 className="text-lg font-bold text-slate-900 mt-1">VIP Featured</h4>
                <div className="text-2xl font-extrabold text-slate-900 mt-3 mb-4 tabular-nums">
                  ₦20,000 <span className="text-xs font-normal text-slate-500">/ month</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-2.5">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>Top category banner placement</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>Top 3 guaranteed ranking in city</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>Immediate WhatsApp SMS lead notifications</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>Dedicated account manager support</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6 border-t border-slate-100 mt-6 text-[11px] text-slate-500">
                Ideal for established workshops, clinics, and couture brands.
              </div>
            </div>
          </div>
        </div>

        {/* 90-Day Execution Roadmap (from prompt) */}
        <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200">
          <h3 className="text-xl font-bold text-slate-900 mb-6">
            The 90-Day Rollout Playbook
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Month 1</div>
              <h4 className="font-bold text-slate-900 text-sm">Foundation & Core Platform</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Build the core directory, launch self-serve business registration, and calibrate search filters for Lekki, Ikeja & Victoria Island.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Month 2</div>
              <h4 className="font-bold text-slate-900 text-sm">Trust & WhatsApp Channels</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Deploy neighborhood customer reviews, integrate direct 1-click WhatsApp lead generators, and activate Paystack card & transfer checkouts.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Month 3</div>
              <h4 className="font-bold text-slate-900 text-sm">Recruit 100 Pros & ₦1M MRR</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Execute boots-on-the-ground onboarding in Lekki Phase 1 and Ikeja GRA workshops. Reach 100 paying pros at ₦10,000/mo = ₦1,000,000/mo cashflow.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
