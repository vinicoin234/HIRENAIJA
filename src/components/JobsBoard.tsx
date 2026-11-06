import React, { useState } from 'react';
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  MessageCircle,
  PlusCircle,
  Filter,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { JobLead, BusinessCategory, City } from '../types';
import { CATEGORIES, NIGERIAN_CITIES } from '../data/categories';
import { cleanPhoneForWhatsApp } from '../utils/helpers';

interface JobsBoardProps {
  leads: JobLead[];
  onOpenPostJob: () => void;
  onBidLead?: (leadId: string) => void;
}

export const JobsBoard: React.FC<JobsBoardProps> = ({
  leads,
  onOpenPostJob,
  onBidLead,
}) => {
  const [selectedCity, setSelectedCity] = useState<City | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<BusinessCategory | 'all'>('all');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');
  const [contactedLeads, setContactedLeads] = useState<Record<string, boolean>>({});

  const filteredLeads = leads.filter((lead) => {
    if (selectedCity !== 'all' && lead.city !== selectedCity) return false;
    if (selectedCategory !== 'all' && lead.category !== selectedCategory) return false;
    if (selectedUrgency !== 'all' && lead.urgency !== selectedUrgency) return false;
    return true;
  });

  const handleContactClient = (lead: JobLead) => {
    setContactedLeads((prev) => ({ ...prev, [lead.id]: true }));
    const cleanNumber = cleanPhoneForWhatsApp(lead.clientPhone);
    const msg = `Hello ${lead.clientName}, I am a verified artisan on HireNaija reaching out regarding your job request: "${lead.title}". I am available to assist you!`;
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
            <Briefcase className="w-4 h-4 text-emerald-700" />
            <span>Live Job Requests Board · Verified Client Leads</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Real-Time Artisan Job Leads
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Clients across Lagos, Abuja, and Port Harcourt actively requesting quotes from vetted pros.
          </p>
        </div>

        <button
          onClick={onOpenPostJob}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post a Job Request</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Filter by City
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value as City | 'all')}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="all">All States & Cities (Nigeria)</option>
              {NIGERIAN_CITIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} ({c.state})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Filter by Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as BusinessCategory | 'all')}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="all">All Trade Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Urgency Level
            </label>
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="all">All Timelines</option>
              <option value="Emergency">Emergency (Today)</option>
              <option value="This Week">This Week</option>
              <option value="Flexible">Flexible</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leads List */}
      <div className="space-y-4">
        {filteredLeads.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-500">
            <p className="text-sm font-semibold">No job leads found matching these criteria.</p>
            <button
              onClick={() => {
                setSelectedCity('all');
                setSelectedCategory('all');
                setSelectedUrgency('all');
              }}
              className="mt-2 text-xs font-bold text-emerald-700 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          filteredLeads.map((lead) => {
            const isContacted = contactedLeads[lead.id];
            const isEmergency = lead.urgency === 'Emergency';

            return (
              <div
                key={lead.id}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition-all flex flex-col md:flex-row justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500">
                    <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase text-[10px] tracking-wider">
                      {lead.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {lead.neighborhood}, {lead.city}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Posted {lead.datePosted}
                    </span>
                    {isEmergency && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-red-700 font-bold text-[11px] flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Emergency / Immediate
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {lead.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                    {lead.description}
                  </p>

                  <div className="flex items-center gap-4 pt-1 text-xs text-slate-600 flex-wrap">
                    <div>
                      <span className="text-slate-400">Client: </span>
                      <span className="font-semibold text-slate-800">{lead.clientName}</span>
                    </div>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <div>
                      <span className="text-slate-400">Budget Range: </span>
                      <span className="font-bold text-slate-900 tabular-nums">{lead.budget}</span>
                    </div>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <div>
                      <span className="text-slate-400">Interested Pros: </span>
                      <span className="font-semibold text-emerald-700 tabular-nums">{lead.bidsCount} applied</span>
                    </div>
                  </div>
                </div>

                {/* Right Action Column */}
                <div className="flex md:flex-col justify-end items-stretch gap-2 shrink-0 md:w-48 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button
                    onClick={() => handleContactClient(lead)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{isContacted ? 'Message Again' : 'Claim Lead / Chat'}</span>
                  </button>

                  <div className="text-[11px] text-center text-slate-400">
                    No middlemen fee
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
