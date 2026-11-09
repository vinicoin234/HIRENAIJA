import React, { useState } from 'react';
import {
  Eye,
  Phone,
  MessageCircle,
  TrendingUp,
  Award,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  PlusCircle,
  Clock,
  CheckCircle2,
  DollarSign,
} from 'lucide-react';
import { Business, QuoteRequest, PlanTier } from '../types';
import { formatNaira, cleanPhoneForWhatsApp } from '../utils/helpers';
import { Image } from './ui/Image';

interface BusinessDashboardModalProps {
  businesses: Business[];
  quoteRequests: QuoteRequest[];
  onOpenRegister: () => void;
  onUpgradePlan: (business: Business, tier: PlanTier) => void;
}

export const BusinessDashboardModal: React.FC<BusinessDashboardModalProps> = ({
  businesses,
  quoteRequests,
  onOpenRegister,
  onUpgradePlan,
}) => {
  // Pick active business to view dashboard for (defaults to first or user-registered)
  const [selectedBizId, setSelectedBizId] = useState<string>(businesses[0]?.id || '');

  const activeBiz = businesses.find((b) => b.id === selectedBizId) || businesses[0];

  const bizQuotes = quoteRequests.filter(
    (q) => !q.businessId || q.businessId === activeBiz?.id || activeBiz?.isRegisteredByUser
  );

  const handleReplyWhatsApp = (quote: QuoteRequest) => {
    const cleanNumber = cleanPhoneForWhatsApp(quote.customerPhone);
    const msg = `Hello ${quote.customerName}, this is ${activeBiz.name}. Thank you for your inquiry for "${quote.serviceNeeded}" on HireNaija. How can we assist you with your project?`;
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (!activeBiz) {
    return (
      <div className="py-12 text-center max-w-xl mx-auto px-4">
        <h3 className="text-xl font-bold text-slate-900 mb-2">No Registered Business Found</h3>
        <p className="text-sm text-slate-600 mb-4">List your trade business on HireNaija to unlock leads and WhatsApp inquiries.</p>
        <button
          onClick={onOpenRegister}
          className="px-4 py-2 bg-emerald-700 text-white font-bold rounded-lg"
        >
          List Your Business
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header & Business Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
            Merchant & Artisan Command Center
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Business Performance Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Track inquiries, manage customer quotes, and boost your search visibility across Nigeria.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {businesses.length > 1 && (
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-500">Managing:</label>
              <select
                value={activeBiz.id}
                onChange={(e) => setSelectedBizId(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                {businesses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.city})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={onOpenRegister}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>List Another Business</span>
          </button>
        </div>
      </div>

      {/* Active Business Banner & Current Plan Status */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Image
            src={activeBiz.image}
            alt={activeBiz.name}
            category={activeBiz.category}
            width={120}
            className="w-16 h-16 rounded-xl border border-slate-200 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">{activeBiz.name}</h3>
              <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                {activeBiz.plan.toUpperCase()} PLAN
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {activeBiz.categoryLabel} · {activeBiz.neighborhood}, {activeBiz.city} · {activeBiz.phone}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
              {activeBiz.verification === 'cac_verified' && (
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  CAC Registered: {activeBiz.cacNumber || 'Verified Entity'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Upgrade / Boost CTA */}
        {activeBiz.plan !== 'vip' && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div>
              <div className="text-xs font-bold text-emerald-900">
                Unlock 3x Inbound Leads with {activeBiz.plan === 'free' ? 'Growth Pro (₦10,000/mo)' : 'VIP Featured (₦20,000/mo)'}
              </div>
              <div className="text-[11px] text-emerald-700">
                Top category search placement + Paystack verified badge
              </div>
            </div>
            <button
              onClick={() => onUpgradePlan(activeBiz, activeBiz.plan === 'free' ? 'growth' : 'vip')}
              className="w-full sm:w-auto px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs whitespace-nowrap cursor-pointer transition-colors"
            >
              Upgrade Listing Now
            </button>
          </div>
        )}
      </div>

      {/* Analytics KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Profile Impressions</span>
            <Eye className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
            {activeBiz.metrics.views.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            +28% from last week
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>WhatsApp Direct Chats</span>
            <MessageCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 tabular-nums">
            {activeBiz.metrics.whatsappClicks.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Highest conversion channel
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Phone Call Clicks</span>
            <Phone className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
            {activeBiz.metrics.phoneClicks.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Direct telephone inquiries
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Quote Requests</span>
            <TrendingUp className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
            {activeBiz.metrics.leadsReceived.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            Active customer leads
          </div>
        </div>
      </div>

      {/* Inbound Customer Quote Requests Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Inbound Customer Quote Requests</h3>
            <p className="text-xs text-slate-500">Clients who requested price quotes and work estimates directly from your profile</p>
          </div>
          <span className="text-xs font-semibold text-slate-500 tabular-nums">
            {bizQuotes.length} Total Requests
          </span>
        </div>

        {bizQuotes.length === 0 ? (
          <div className="p-10 text-center text-slate-500 text-xs">
            No quote requests logged yet for this business. As customers browse your profile, their inquiries will appear here.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {bizQuotes.map((q) => (
              <div key={q.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50">
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-slate-900">{q.customerName}</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-slate-500">{q.neighborhood}</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200 text-[10px]">
                      {q.urgency}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-slate-800">
                    Service: {q.serviceNeeded}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    "{q.description}"
                  </p>

                  <div className="text-[11px] text-slate-400">
                    Phone: {q.customerPhone} · Submitted {q.createdAt}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleReplyWhatsApp(q)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Reply on WhatsApp</span>
                  </button>
                  <a
                    href={`tel:${q.customerPhone.replace(/\s+/g, '')}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Services Menu Summary */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
        <h3 className="text-base font-bold text-slate-900 mb-1">Your Listed Services & Rates</h3>
        <p className="text-xs text-slate-500 mb-4">Visible to all prospective clients in {activeBiz.city}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {activeBiz.services.map((srv) => (
            <div key={srv.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-xs font-bold text-slate-900">{srv.name}</div>
              <div className="text-xs font-extrabold text-emerald-800 tabular-nums mt-0.5">
                {formatNaira(srv.price)}
              </div>
              {srv.description && (
                <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">{srv.description}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
