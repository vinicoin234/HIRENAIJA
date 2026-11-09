import { Business, JobLead, QuoteRequest } from '../types';
import { INITIAL_BUSINESSES, INITIAL_JOB_LEADS } from '../data/seedBusinesses';

export function formatNaira(amount: number): string {
  return '₦' + amount.toLocaleString('en-NG');
}

export function cleanPhoneForWhatsApp(phone: string): string {
  // Removes spaces, plus, hyphens
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '234' + cleaned.substring(1);
  } else if (!cleaned.startsWith('234')) {
    cleaned = '234' + cleaned;
  }
  return cleaned;
}

export function createWhatsAppUrl(phone: string, businessName: string, serviceName?: string): string {
  const cleanNumber = cleanPhoneForWhatsApp(phone);
  let message = `Hello ${businessName}, I found your listing on HireNaija.`;
  if (serviceName) {
    message += ` I would like to inquire about your "${serviceName}" service. Are you available?`;
  } else {
    message += ` I would like to inquire about your services and get a price estimate.`;
  }
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

import { resolveImageUrl } from './imageAssets';

export function getInitialBusinesses(): Business[] {
  try {
    const stored = localStorage.getItem('hirenaija_businesses_v1');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((b: Business) => ({
          ...b,
          image: resolveImageUrl(b.image, b.category),
          gallery: (b.gallery || []).map((img) => resolveImageUrl(img, b.category)),
        }));
      }
    }
  } catch (e) {
    console.error('Failed to read from localStorage', e);
  }
  return INITIAL_BUSINESSES.map((b) => ({
    ...b,
    image: resolveImageUrl(b.image, b.category),
    gallery: (b.gallery || []).map((img) => resolveImageUrl(img, b.category)),
  }));
}

export function persistBusinesses(businesses: Business[]): void {
  try {
    localStorage.setItem('hirenaija_businesses_v1', JSON.stringify(businesses));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

export function getInitialJobLeads(): JobLead[] {
  try {
    const stored = localStorage.getItem('hirenaija_leads_v1');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to read job leads from localStorage', e);
  }
  return INITIAL_JOB_LEADS;
}

export function persistJobLeads(leads: JobLead[]): void {
  try {
    localStorage.setItem('hirenaija_leads_v1', JSON.stringify(leads));
  } catch (e) {
    console.error('Failed to save job leads to localStorage', e);
  }
}

export function getInitialBookmarks(): string[] {
  try {
    const stored = localStorage.getItem('hirenaija_bookmarks_v1');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to read bookmarks', e);
  }
  return [];
}

export function persistBookmarks(bookmarks: string[]): void {
  try {
    localStorage.setItem('hirenaija_bookmarks_v1', JSON.stringify(bookmarks));
  } catch (e) {
    console.error('Failed to save bookmarks', e);
  }
}

export function getInitialQuoteRequests(): QuoteRequest[] {
  try {
    const stored = localStorage.getItem('hirenaija_quotes_v1');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to read quote requests', e);
  }
  return [
    {
      id: 'quote-sample-1',
      businessId: 'biz-1',
      businessName: 'Kazeem Precision Auto Diagnostics',
      customerName: 'Bolanle Jinadu',
      customerPhone: '+234 803 222 1999',
      customerEmail: 'bolanle.j@gmail.com',
      neighborhood: 'Ikeja',
      serviceNeeded: 'Lexus RX350 Check Engine Light Diagnostic',
      description: 'The check engine light came on after driving from Ibadan. Vehicle starts shaking at idle.',
      urgency: 'Immediate (Today)',
      createdAt: 'Today, 9:30 AM',
      status: 'new',
    },
  ];
}

export function persistQuoteRequests(quotes: QuoteRequest[]): void {
  try {
    localStorage.setItem('hirenaija_quotes_v1', JSON.stringify(quotes));
  } catch (e) {
    console.error('Failed to save quote requests', e);
  }
}
