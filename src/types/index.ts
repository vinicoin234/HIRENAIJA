export type BusinessCategory =
  | 'mechanics'
  | 'electricians'
  | 'plumbers'
  | 'tailors'
  | 'barbers'
  | 'hairstylists'
  | 'photographers'
  | 'djs'
  | 'mcs'
  | 'welders'
  | 'freelancers'
  | 'tutors';

export type NigerianState =
  | 'Abia'
  | 'Adamawa'
  | 'Akwa Ibom'
  | 'Anambra'
  | 'Bauchi'
  | 'Bayelsa'
  | 'Benue'
  | 'Borno'
  | 'Cross River'
  | 'Delta'
  | 'Ebonyi'
  | 'Edo'
  | 'Ekiti'
  | 'Enugu'
  | 'FCT - Abuja'
  | 'Gombe'
  | 'Imo'
  | 'Jigawa'
  | 'Kaduna'
  | 'Kano'
  | 'Katsina'
  | 'Kebbi'
  | 'Kogi'
  | 'Kwara'
  | 'Lagos'
  | 'Nasarawa'
  | 'Niger'
  | 'Ogun'
  | 'Ondo'
  | 'Osun'
  | 'Oyo'
  | 'Plateau'
  | 'Rivers'
  | 'Sokoto'
  | 'Taraba'
  | 'Yobe'
  | 'Zamfara';

export type City = NigerianState | string;

export type Neighborhood = string;

export type PlanTier = 'free' | 'starter' | 'growth' | 'vip';

export type VerificationStatus = 'cac_verified' | 'identity_verified' | 'unverified';

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  duration?: string;
  description?: string;
}

export interface Review {
  id: string;
  authorName: string;
  rating: number;
  date: string;
  comment: string;
  neighborhood: string;
  verifiedHire: boolean;
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  ownerName: string;
  category: BusinessCategory;
  categoryLabel: string;
  tagLine: string;
  bio: string;
  city: City;
  neighborhood: Neighborhood;
  fullAddress: string;
  landmark?: string;
  phone: string;
  whatsapp: string;
  email?: string;
  instagram?: string;
  image: string;
  gallery: string[];
  plan: PlanTier;
  verification: VerificationStatus;
  cacNumber?: string;
  yearsInBusiness: number;
  rating: number;
  reviewCount: number;
  startingPrice: number;
  priceTier: '₦' | '₦₦' | '₦₦₦';
  openingHours: {
    days: string;
    hours: string;
    isOpenNow: boolean;
  };
  services: ServiceItem[];
  reviews: Review[];
  badges: string[];
  metrics: {
    views: number;
    phoneClicks: number;
    whatsappClicks: number;
    leadsReceived: number;
  };
  responseTime: string;
  isRegisteredByUser?: boolean;
}

export interface QuoteRequest {
  id: string;
  businessId: string;
  businessName: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  neighborhood: string;
  serviceNeeded: string;
  description: string;
  urgency: 'Immediate (Today)' | 'Within 48 Hours' | 'This Week' | 'Planning Stage';
  budgetEstimate?: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'resolved';
}

export interface JobLead {
  id: string;
  title: string;
  category: BusinessCategory;
  city: City;
  neighborhood: Neighborhood;
  description: string;
  budget: string;
  urgency: 'Emergency' | 'This Week' | 'Flexible';
  clientName: string;
  clientPhone: string;
  datePosted: string;
  status: 'open' | 'awarded' | 'completed';
  bidsCount: number;
}
