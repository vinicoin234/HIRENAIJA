import { createClient } from '@supabase/supabase-js';
import { Business, JobLead, QuoteRequest, Review, PlanTier } from '../types';

// Fallback to the project credentials provided
const DEFAULT_SUPABASE_URL = 'https://xujjwfodyvamvhezclfu.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1amp3Zm9keXZhbXZoZXpjbGZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQyMDU5NjMsImV4cCI6MjEwOTc4MTk2M30.pgJlce6cD3izQKKllkNAYJe_qFfMm1MJbmZaqqJN8GQ';

const supabaseUrl =
  (import.meta as any).env?.VITE_SUPABASE_URL ||
  (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_URL ||
  DEFAULT_SUPABASE_URL;

const supabaseAnonKey =
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ||
  (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  DEFAULT_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// ==============================================================================
// BUSINESSES API
// ==============================================================================

export async function fetchBusinessesFromSupabase(): Promise<Business[] | null> {
  try {
    const { data: bizData, error: bizError } = await supabase
      .from('businesses')
      .select('*, services(*), reviews(*)')
      .eq('is_published', true)
      .order('rating', { ascending: false });

    if (bizError) {
      console.warn('Supabase fetch businesses note:', bizError.message);
      return null;
    }

    if (!bizData || bizData.length === 0) {
      return null;
    }

    return bizData.map((b: any) => ({
      id: b.id,
      name: b.name,
      slug: b.slug,
      ownerName: b.owner_name,
      category: b.category,
      categoryLabel: b.category_label,
      tagLine: b.tag_line || '',
      bio: b.bio || '',
      city: b.city,
      neighborhood: b.neighborhood,
      fullAddress: b.full_address,
      landmark: b.landmark,
      phone: b.phone,
      whatsapp: b.whatsapp,
      email: b.email,
      instagram: b.instagram,
      image: b.image_url || '/src/assets/images/hero_artisan_lagos_1793884432708.jpg',
      gallery: b.gallery || [],
      plan: b.plan_tier || 'free',
      verification: b.verification_status || 'unverified',
      cacNumber: b.cac_number,
      yearsInBusiness: b.years_in_business || 1,
      rating: Number(b.rating) || 5.0,
      reviewCount: b.review_count || 0,
      startingPrice: Number(b.starting_price) || 0,
      priceTier: b.price_tier || '₦',
      openingHours: {
        days: b.opening_days || 'Mon - Sat',
        hours: b.opening_hours || '8:00 AM - 6:00 PM',
        isOpenNow: b.is_open_now ?? true,
      },
      services: (b.services || []).map((s: any) => ({
        id: s.id,
        name: s.name,
        price: Number(s.price),
        duration: s.duration,
        description: s.description,
      })),
      reviews: (b.reviews || []).map((r: any) => ({
        id: r.id,
        authorName: r.author_name,
        rating: r.rating,
        date: new Date(r.created_at).toLocaleDateString(),
        comment: r.comment,
        neighborhood: r.neighborhood || '',
        verifiedHire: r.verified_hire || false,
      })),
      badges: b.badges || [],
      metrics: {
        views: b.views_count || 0,
        phoneClicks: b.phone_clicks || 0,
        whatsappClicks: b.whatsapp_clicks || 0,
        leadsReceived: b.leads_received || 0,
      },
      responseTime: b.response_time || 'Within 30 mins',
      isRegisteredByUser: false,
    }));
  } catch (err) {
    console.warn('Supabase fetch businesses exception:', err);
    return null;
  }
}

export async function insertBusinessToSupabase(business: Business): Promise<boolean> {
  try {
    const { data: insertedBiz, error: bizError } = await supabase
      .from('businesses')
      .insert({
        name: business.name,
        slug: business.slug,
        owner_name: business.ownerName,
        category: business.category,
        category_label: business.categoryLabel,
        tag_line: business.tagLine,
        bio: business.bio,
        city: business.city,
        neighborhood: business.neighborhood,
        full_address: business.fullAddress,
        landmark: business.landmark,
        phone: business.phone,
        whatsapp: business.whatsapp,
        email: business.email,
        instagram: business.instagram,
        image_url: business.image,
        gallery: business.gallery,
        plan_tier: business.plan,
        verification_status: business.verification,
        cac_number: business.cacNumber,
        years_in_business: business.yearsInBusiness,
        starting_price: business.startingPrice,
        price_tier: business.priceTier,
        opening_days: business.openingHours.days,
        opening_hours: business.openingHours.hours,
        badges: business.badges,
        response_time: business.responseTime,
      })
      .select()
      .single();

    if (bizError) {
      console.warn('Supabase insert business error:', bizError.message);
      return false;
    }

    if (insertedBiz && business.services.length > 0) {
      const servicesToInsert = business.services.map((s) => ({
        business_id: insertedBiz.id,
        name: s.name,
        price: s.price,
        duration: s.duration,
        description: s.description,
      }));
      await supabase.from('services').insert(servicesToInsert);
    }

    return true;
  } catch (err) {
    console.warn('Failed to insert business to Supabase:', err);
    return false;
  }
}

// ==============================================================================
// REVIEWS API
// ==============================================================================

export async function insertReviewToSupabase(businessId: string, review: Review): Promise<boolean> {
  try {
    const { error } = await supabase.from('reviews').insert({
      business_id: businessId,
      author_name: review.authorName,
      rating: review.rating,
      comment: review.comment,
      neighborhood: review.neighborhood,
      verified_hire: review.verifiedHire,
    });
    if (error) {
      console.warn('Supabase review insert error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to insert review:', err);
    return false;
  }
}

// ==============================================================================
// QUOTE REQUESTS API
// ==============================================================================

export async function insertQuoteRequestToSupabase(quote: QuoteRequest): Promise<boolean> {
  try {
    const { error } = await supabase.from('quote_requests').insert({
      business_id: quote.businessId,
      customer_name: quote.customerName,
      customer_phone: quote.customerPhone,
      customer_email: quote.customerEmail,
      neighborhood: quote.neighborhood,
      service_needed: quote.serviceNeeded,
      description: quote.description,
      urgency: quote.urgency,
      budget_estimate: quote.budgetEstimate,
      status: quote.status,
    });
    if (error) {
      console.warn('Supabase quote request insert error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to submit quote request:', err);
    return false;
  }
}

// ==============================================================================
// JOB LEADS API
// ==============================================================================

export async function fetchJobLeadsFromSupabase(): Promise<JobLead[] | null> {
  try {
    const { data, error } = await supabase
      .from('job_leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch job leads note:', error.message);
      return null;
    }

    if (!data || data.length === 0) return null;

    return data.map((j: any) => ({
      id: j.id,
      title: j.title,
      category: j.category,
      city: j.city,
      neighborhood: j.neighborhood,
      description: j.description,
      budget: j.budget,
      urgency: j.urgency,
      clientName: j.client_name,
      clientPhone: j.client_phone,
      datePosted: new Date(j.created_at).toLocaleDateString(),
      status: j.status,
      bidsCount: j.bids_count || 0,
    }));
  } catch (err) {
    console.warn('Supabase fetch jobs exception:', err);
    return null;
  }
}

export async function insertJobLeadToSupabase(lead: JobLead): Promise<boolean> {
  try {
    const { error } = await supabase.from('job_leads').insert({
      title: lead.title,
      category: lead.category,
      city: lead.city,
      neighborhood: lead.neighborhood,
      description: lead.description,
      budget: lead.budget,
      urgency: lead.urgency,
      client_name: lead.clientName,
      client_phone: lead.clientPhone,
      status: lead.status,
    });
    if (error) {
      console.warn('Supabase job lead insert error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to insert job lead:', err);
    return false;
  }
}

// ==============================================================================
// PLAN UPGRADE / PAYSTACK RECORD
// ==============================================================================

export async function recordPaymentToSupabase(
  businessId: string | undefined,
  plan: PlanTier,
  amountNaira: number,
  paystackRef: string,
  email: string
): Promise<boolean> {
  try {
    const { error } = await supabase.from('payments').insert({
      business_id: businessId || null,
      plan_tier: plan,
      amount_kobo: amountNaira * 100,
      currency: 'NGN',
      paystack_reference: paystackRef,
      payment_channel: 'paystack',
      status: 'successful',
      customer_email: email,
      paid_at: new Date().toISOString(),
    });

    if (error) {
      console.warn('Supabase payment log error:', error.message);
      return false;
    }

    if (businessId) {
      await supabase
        .from('businesses')
        .update({ plan_tier: plan })
        .eq('id', businessId);
    }

    return true;
  } catch (err) {
    console.warn('Failed to record payment in Supabase:', err);
    return false;
  }
}
