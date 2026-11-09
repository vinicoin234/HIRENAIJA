import React, { useState } from 'react';
import {
  X,
  Building,
  MapPin,
  CheckCircle2,
  DollarSign,
  Plus,
  Trash2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Award,
} from 'lucide-react';
import { Business, BusinessCategory, City, Neighborhood, PlanTier, ServiceItem } from '../types';
import { CATEGORIES, NIGERIAN_CITIES } from '../data/categories';
import { formatNaira } from '../utils/helpers';
import { getCategoryDefaultImage, ASSET_IMAGES } from '../utils/imageAssets';

interface RegisterBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterComplete: (business: Business) => void;
  onTriggerPayment?: (business: Business, plan: PlanTier) => void;
}

export const RegisterBusinessModal: React.FC<RegisterBusinessModalProps> = ({
  isOpen,
  onClose,
  onRegisterComplete,
  onTriggerPayment,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Info
  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [category, setCategory] = useState<BusinessCategory>('mechanics');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [tagLine, setTagLine] = useState('');
  const [bio, setBio] = useState('');

  // Step 2: Location
  const [city, setCity] = useState<City>('Lagos');
  const [neighborhood, setNeighborhood] = useState<Neighborhood>('Ikeja');
  const [fullAddress, setFullAddress] = useState('');
  const [landmark, setLandmark] = useState('');

  // Step 3: Services
  const [services, setServices] = useState<Array<{ name: string; price: number; description: string }>>([
    { name: 'Standard Inspection / Consultation', price: 10000, description: 'Initial site check or diagnostic review' },
    { name: 'Full Service Package', price: 35000, description: 'Complete workmanship with quality guarantee' },
  ]);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');

  // Step 4: Verification & Plan
  const [cacNumber, setCacNumber] = useState('');
  const [yearsInBusiness, setYearsInBusiness] = useState(5);
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>('growth');

  const neighborhoods = React.useMemo(() => {
    const found = NIGERIAN_CITIES.find((c) => c.name === city);
    return found ? found.neighborhoods : [];
  }, [city]);

  if (!isOpen) return null;

  const handleAddService = () => {
    if (!newServiceName.trim()) return;
    const price = parseInt(newServicePrice.replace(/[^0-9]/g, '')) || 15000;
    setServices((prev) => [
      ...prev,
      { name: newServiceName.trim(), price, description: newServiceDesc.trim() },
    ]);
    setNewServiceName('');
    setNewServicePrice('');
    setNewServiceDesc('');
  };

  const handleRemoveService = (index: number) => {
    setServices((prev) => prev.filter((_, i) => i !== index));
  };

  const handleComplete = () => {
    if (!name.trim() || !phone.trim() || !fullAddress.trim()) return;

    const catObj = CATEGORIES.find((c) => c.id === category);
    const startingPrice = services.length > 0 ? Math.min(...services.map((s) => s.price)) : 15000;

    // Pick appropriate photo placeholder based on category
    const image = getCategoryDefaultImage(category);

    const newBusiness: Business = {
      id: `biz-user-${Date.now()}`,
      name: name.trim(),
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      ownerName: ownerName.trim() || 'Managing Director',
      category,
      categoryLabel: catObj ? catObj.name : 'Professional',
      tagLine: tagLine.trim() || `${catObj?.name || 'Artisan'} specialist serving ${neighborhood}, ${city}`,
      bio: bio.trim() || `Certified ${catObj?.name} professional based in ${neighborhood}, ${city}. Quality workmanship with upfront pricing and prompt customer response.`,
      city,
      neighborhood,
      fullAddress: fullAddress.trim(),
      landmark: landmark.trim(),
      phone: phone.trim(),
      whatsapp: whatsapp.trim() || phone.trim(),
      email: email.trim(),
      image,
      gallery: [image, ASSET_IMAGES.hero],
      plan: selectedPlan,
      verification: cacNumber.trim() ? 'cac_verified' : 'identity_verified',
      cacNumber: cacNumber.trim() || undefined,
      yearsInBusiness: Number(yearsInBusiness) || 3,
      rating: 5.0,
      reviewCount: 1,
      startingPrice,
      priceTier: startingPrice > 50000 ? '₦₦₦' : startingPrice > 20000 ? '₦₦' : '₦',
      openingHours: {
        days: 'Mon - Sat',
        hours: '8:30 AM - 6:30 PM',
        isOpenNow: true,
      },
      services: services.map((s, idx) => ({
        id: `srv-${idx}-${Date.now()}`,
        name: s.name,
        price: s.price,
        description: s.description,
        duration: 'Standard turnaround',
      })),
      reviews: [
        {
          id: `rev-initial-${Date.now()}`,
          authorName: 'Verified Neighbor',
          rating: 5,
          date: 'Just now',
          comment: 'Welcome to HireNaija! Verified local business profile created.',
          neighborhood,
          verifiedHire: true,
        },
      ],
      badges: [
        cacNumber.trim() ? 'CAC Registered' : 'Identity Verified',
        selectedPlan === 'vip' ? 'VIP Featured' : selectedPlan === 'growth' ? 'Priority Pro' : 'New Listing',
      ],
      metrics: {
        views: 12,
        phoneClicks: 2,
        whatsappClicks: 5,
        leadsReceived: 1,
      },
      responseTime: 'Responds within 15 mins',
      isRegisteredByUser: true,
    };

    onRegisterComplete(newBusiness);

    if (selectedPlan !== 'free' && onTriggerPayment) {
      onTriggerPayment(newBusiness, selectedPlan);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div
        className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div>
            <h3 className="text-base font-bold text-slate-900">List Your Nigerian Business</h3>
            <p className="text-xs text-slate-500">Step {step} of 4: {step === 1 ? 'Business Info' : step === 2 ? 'Location' : step === 3 ? 'Services & Pricing' : 'Verification & Plan'}</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicator */}
        <div className="grid grid-cols-4 bg-slate-100 h-1">
          <div className={`h-full ${step >= 1 ? 'bg-emerald-700' : 'bg-transparent'}`} />
          <div className={`h-full ${step >= 2 ? 'bg-emerald-700' : 'bg-transparent'}`} />
          <div className={`h-full ${step >= 3 ? 'bg-emerald-700' : 'bg-transparent'}`} />
          <div className={`h-full ${step >= 4 ? 'bg-emerald-700' : 'bg-transparent'}`} />
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto p-6 space-y-5 flex-1">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Business / Trading Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Lekki Precision Mechanics & Electricals"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary Trade Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as BusinessCategory)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Owner / Lead Artisan Name
                  </label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g. Master Segun Olawale"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0803 123 4567"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    WhatsApp Number (for direct customer inquiries) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="2348031234567"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tagline / 1-Sentence Pitch
                </label>
                <input
                  type="text"
                  value={tagLine}
                  onChange={(e) => setTagLine(e.target.value)}
                  placeholder="e.g. German car diagnostic specialists with mobile scanner unit"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  About Your Experience & Craft
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell clients about your tools, qualifications, past jobs, and why customers in your area trust you..."
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City / State *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => {
                      const c = e.target.value as City;
                      setCity(c);
                      const f = NIGERIAN_CITIES.find((x) => x.name === c);
                      if (f && f.neighborhoods[0]) setNeighborhood(f.neighborhoods[0] as Neighborhood);
                    }}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    {NIGERIAN_CITIES.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name} ({c.state})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Neighborhood / District *
                  </label>
                  <select
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value as Neighborhood)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    {neighborhoods.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Workshop / Office Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  placeholder="e.g. 18 Admiralty Way, Lekki Phase 1, Lagos"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nearest Landmark (Essential for Nigerian Clients)
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Opposite Ebeano Supermarket / Beside FCMB"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  High-converting tip: 82% of customers in Lagos & Abuja filter listings by exact neighborhood before initiating a WhatsApp chat.
                </span>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <h4 className="text-xs font-bold text-slate-900">List Your Core Services & Prices</h4>
                <p className="text-[11px] text-slate-500">Upfront transparent pricing builds instant trust with customers.</p>
              </div>

              {/* Service list preview */}
              <div className="space-y-2">
                {services.map((srv, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{srv.name}</div>
                      {srv.description && <div className="text-[11px] text-slate-500">{srv.description}</div>}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-900 tabular-nums">{formatNaira(srv.price)}</span>
                      <button
                        onClick={() => handleRemoveService(idx)}
                        className="text-slate-400 hover:text-red-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add new service form */}
              <div className="p-3 border border-dashed border-slate-300 rounded-xl bg-white space-y-2">
                <div className="text-xs font-semibold text-slate-700">Add Another Service Item</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    placeholder="Service Name (e.g. 5kVA Inverter setup)"
                    className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                  <input
                    type="text"
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(e.target.value)}
                    placeholder="Price in Naira (e.g. 25000)"
                    className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
                <input
                  type="text"
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  placeholder="Brief note (e.g. Includes diagnostic report & testing)"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
                <button
                  type="button"
                  onClick={handleAddService}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Service</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>CAC & Trust Verification</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      CAC Registration Number (Optional)
                    </label>
                    <input
                      type="text"
                      value={cacNumber}
                      onChange={(e) => setCacNumber(e.target.value)}
                      placeholder="e.g. RC-1849204 or BN-394821"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Years in Trade / Business
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={yearsInBusiness}
                      onChange={(e) => setYearsInBusiness(Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-2">
                  Select Your Listing Subscription Plan
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Free */}
                  <div
                    onClick={() => setSelectedPlan('free')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedPlan === 'free'
                        ? 'border-emerald-700 bg-emerald-50/50 ring-1 ring-emerald-700'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900">Free Basic</div>
                    <div className="text-base font-extrabold text-slate-900 my-1">₦0</div>
                    <ul className="text-[11px] text-slate-600 space-y-1">
                      <li>· Standard listing</li>
                      <li>· Direct WhatsApp link</li>
                      <li>· Basic reviews</li>
                    </ul>
                  </div>

                  {/* Growth Premium */}
                  <div
                    onClick={() => setSelectedPlan('growth')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all relative ${
                      selectedPlan === 'growth'
                        ? 'border-emerald-700 bg-emerald-50/50 ring-1 ring-emerald-700 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <span className="absolute -top-2 right-2 text-[9px] font-bold uppercase bg-emerald-700 text-white px-1.5 py-0.5 rounded">
                      Most Popular
                    </span>
                    <div className="text-xs font-bold text-slate-900">Growth Pro</div>
                    <div className="text-base font-extrabold text-emerald-800 my-1 tabular-nums">₦10,000<span className="text-xs font-normal text-slate-500">/mo</span></div>
                    <ul className="text-[11px] text-slate-600 space-y-1">
                      <li>· Priority search results</li>
                      <li>· CAC Verified Badge</li>
                      <li>· 3x customer leads</li>
                      <li>· Inbound Quote manager</li>
                    </ul>
                  </div>

                  {/* VIP Featured */}
                  <div
                    onClick={() => setSelectedPlan('vip')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedPlan === 'vip'
                        ? 'border-amber-600 bg-amber-50/50 ring-1 ring-amber-600 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900">VIP Featured</div>
                    <div className="text-base font-extrabold text-amber-700 my-1 tabular-nums">₦20,000<span className="text-xs font-normal text-slate-500">/mo</span></div>
                    <ul className="text-[11px] text-slate-600 space-y-1">
                      <li>· Top homepage banner</li>
                      <li>· Top 3 ranking in city</li>
                      <li>· Maximum WhatsApp clicks</li>
                      <li>· Dedicated phone boost</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => (s - 1) as any)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <button onClick={onClose} className="text-xs font-semibold text-slate-500 hover:text-slate-800">
              Cancel
            </button>
          )}

          {step < 4 ? (
            <button
              onClick={() => {
                if (step === 1 && (!name || !phone)) {
                  alert('Please enter your business name and phone number.');
                  return;
                }
                if (step === 2 && !fullAddress) {
                  alert('Please enter your workshop or office address.');
                  return;
                }
                setStep((s) => (s + 1) as any);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold cursor-pointer shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {selectedPlan === 'free' ? 'Publish Free Listing' : `Proceed to Paystack (${formatNaira(selectedPlan === 'growth' ? 10000 : 20000)})`}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
