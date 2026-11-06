import React, { useState } from 'react';
import { X, MessageCircle, Send, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Business, QuoteRequest } from '../types';
import { cleanPhoneForWhatsApp } from '../utils/helpers';

interface RequestQuoteModalProps {
  business: Business | null;
  presetServiceName?: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitQuote: (quote: Omit<QuoteRequest, 'id' | 'createdAt' | 'status'>) => void;
}

export const RequestQuoteModal: React.FC<RequestQuoteModalProps> = ({
  business,
  presetServiceName = '',
  isOpen,
  onClose,
  onSubmitQuote,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [serviceNeeded, setServiceNeeded] = useState(presetServiceName);
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<QuoteRequest['urgency']>('Immediate (Today)');
  const [budgetEstimate, setBudgetEstimate] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  React.useEffect(() => {
    if (presetServiceName) {
      setServiceNeeded(presetServiceName);
    }
    if (business && !neighborhood) {
      setNeighborhood(business.neighborhood);
    }
  }, [presetServiceName, business]);

  if (!isOpen || !business) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !description) return;

    onSubmitQuote({
      businessId: business.id,
      businessName: business.name,
      customerName,
      customerPhone,
      customerEmail,
      neighborhood: neighborhood || business.neighborhood,
      serviceNeeded: serviceNeeded || 'General inquiry',
      description,
      urgency,
      budgetEstimate,
    });

    setIsSubmitted(true);
  };

  const handleOpenWhatsAppChat = () => {
    const cleanNumber = cleanPhoneForWhatsApp(business.whatsapp);
    const msg = `Hello ${business.name}, my name is ${customerName}. I submitted a quote request for "${serviceNeeded || 'Service'}" in ${neighborhood || business.neighborhood}. Details: ${description}. Please let me know your availability!`;
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Request a Free Quote</h3>
            <p className="text-xs text-slate-500">From {business.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Quote Request Sent!</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              Your inquiry has been logged directly with {business.name}. They usually respond within{' '}
              <span className="font-semibold text-slate-900">{business.responseTime}</span>.
            </p>

            <div className="pt-3 flex flex-col gap-2">
              <button
                onClick={handleOpenWhatsAppChat}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Open Instant WhatsApp Chat Now</span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                Service Required
              </label>
              <input
                type="text"
                value={serviceNeeded}
                onChange={(e) => setServiceNeeded(e.target.value)}
                placeholder="e.g. Inverter Installation, Toyota Gearbox fix, 2-Piece Senator"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Babatunde Jinadu"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                  WhatsApp Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="0803 123 4567"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                  Your Neighborhood
                </label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="e.g. Lekki Phase 1, Maitama, Wuse"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                  Urgency
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="Immediate (Today)">Immediate (Today)</option>
                  <option value="Within 48 Hours">Within 48 Hours</option>
                  <option value="This Week">This Week</option>
                  <option value="Planning Stage">Planning Stage</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                Project Details / Specifications *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what needs to be fixed, created or serviced. Include model numbers, fabric type, or square meters if applicable..."
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Quote Request</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
