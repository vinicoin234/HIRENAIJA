/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CategoryGrid } from './components/CategoryGrid';
import { DirectoryListing } from './components/DirectoryListing';
import { BusinessDetailModal } from './components/BusinessDetailModal';
import { RequestQuoteModal } from './components/RequestQuoteModal';
import { PostJobModal } from './components/PostJobModal';
import { JobsBoard } from './components/JobsBoard';
import { BusinessDashboardModal } from './components/BusinessDashboardModal';
import { PaystackCheckoutModal } from './components/PaystackCheckoutModal';
import { BookmarksModal } from './components/BookmarksModal';
import { RegisterBusinessModal } from './components/RegisterBusinessModal';
import { RevenueModelSection } from './components/RevenueModelSection';
import { Footer } from './components/Footer';

import {
  Business,
  BusinessCategory,
  City,
  Neighborhood,
  JobLead,
  QuoteRequest,
  PlanTier,
  Review,
} from './types';

import {
  getInitialBusinesses,
  persistBusinesses,
  getInitialJobLeads,
  persistJobLeads,
  getInitialBookmarks,
  persistBookmarks,
  getInitialQuoteRequests,
  persistQuoteRequests,
} from './utils/helpers';

export default function App() {
  // Navigation tab
  const [activeTab, setActiveTab] = useState<'browse' | 'jobs' | 'dashboard' | 'revenue'>('browse');

  // Core Data Collections
  const [businesses, setBusinesses] = useState<Business[]>(getInitialBusinesses);
  const [jobLeads, setJobLeads] = useState<JobLead[]>(getInitialJobLeads);
  const [bookmarks, setBookmarks] = useState<string[]>(getInitialBookmarks);
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>(getInitialQuoteRequests);

  // Search & Filtering State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<City | 'all'>('all');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<BusinessCategory | 'all'>('all');

  // Modals State
  const [activeBusiness, setActiveBusiness] = useState<Business | null>(null);
  const [quoteModalBiz, setQuoteModalBiz] = useState<Business | null>(null);
  const [quotePresetService, setQuotePresetService] = useState<string>('');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);

  // Paystack checkout modal state
  const [paystackCheckout, setPaystackCheckout] = useState<{
    isOpen: boolean;
    business: Business | null;
    planTier: PlanTier;
  }>({
    isOpen: false,
    business: null,
    planTier: 'growth',
  });

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync state to local storage
  useEffect(() => {
    persistBusinesses(businesses);
  }, [businesses]);

  useEffect(() => {
    persistJobLeads(jobLeads);
  }, [jobLeads]);

  useEffect(() => {
    persistBookmarks(bookmarks);
  }, [bookmarks]);

  useEffect(() => {
    persistQuoteRequests(quoteRequests);
  }, [quoteRequests]);

  // Category counts
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    for (const b of businesses) {
      counts[b.category] = (counts[b.category] || 0) + 1;
    }
    return counts;
  }, [businesses]);

  // Metrics handlers
  const handleRecordView = (business: Business) => {
    setBusinesses((prev) =>
      prev.map((b) =>
        b.id === business.id
          ? { ...b, metrics: { ...b.metrics, views: b.metrics.views + 1 } }
          : b
      )
    );
    setActiveBusiness(business);
  };

  const handleWhatsAppClick = (business: Business) => {
    setBusinesses((prev) =>
      prev.map((b) =>
        b.id === business.id
          ? { ...b, metrics: { ...b.metrics, whatsappClicks: b.metrics.whatsappClicks + 1 } }
          : b
      )
    );
  };

  const handleCallClick = (business: Business) => {
    setBusinesses((prev) =>
      prev.map((b) =>
        b.id === business.id
          ? { ...b, metrics: { ...b.metrics, phoneClicks: b.metrics.phoneClicks + 1 } }
          : b
      )
    );
  };

  // Bookmark Toggle
  const handleToggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Removed from saved artisans');
        return prev.filter((item) => item !== id);
      } else {
        showToast('Artisan saved to bookmarks!');
        return [...prev, id];
      }
    });
  };

  // Add Review
  const handleAddReview = (
    businessId: string,
    reviewData: Omit<Review, 'id' | 'date' | 'verifiedHire'>
  ) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      authorName: reviewData.authorName,
      rating: reviewData.rating,
      comment: reviewData.comment,
      neighborhood: reviewData.neighborhood,
      date: 'Today',
      verifiedHire: true,
    };

    setBusinesses((prev) =>
      prev.map((b) => {
        if (b.id === businessId) {
          const newReviews = [newRev, ...b.reviews];
          const newAvg =
            newReviews.reduce((sum, r) => sum + r.rating, 0) / newReviews.length;
          return {
            ...b,
            reviews: newReviews,
            reviewCount: newReviews.length,
            rating: Number(newAvg.toFixed(1)),
          };
        }
        return b;
      })
    );

    // If modal is open, update activeBusiness
    if (activeBusiness && activeBusiness.id === businessId) {
      setActiveBusiness((prev) => {
        if (!prev) return null;
        const newReviews = [newRev, ...prev.reviews];
        const newAvg =
          newReviews.reduce((sum, r) => sum + r.rating, 0) / newReviews.length;
        return {
          ...prev,
          reviews: newReviews,
          reviewCount: newReviews.length,
          rating: Number(newAvg.toFixed(1)),
        };
      });
    }

    showToast('Review submitted successfully!');
  };

  // Submit Quote Request
  const handleSubmitQuote = (quoteData: Omit<QuoteRequest, 'id' | 'createdAt' | 'status'>) => {
    const newQuote: QuoteRequest = {
      ...quoteData,
      id: `quote-${Date.now()}`,
      createdAt: 'Just now',
      status: 'new',
    };

    setQuoteRequests((prev) => [newQuote, ...prev]);

    // Increment lead count on business
    setBusinesses((prev) =>
      prev.map((b) =>
        b.id === quoteData.businessId
          ? { ...b, metrics: { ...b.metrics, leadsReceived: b.metrics.leadsReceived + 1 } }
          : b
      )
    );

    showToast('Quote request logged with pro!');
  };

  // Create Business
  const handleRegisterComplete = (newBusiness: Business) => {
    setBusinesses((prev) => [newBusiness, ...prev]);
    setIsRegisterOpen(false);
    showToast(`"${newBusiness.name}" is now live on HireNaija!`);
  };

  // Post Job
  const handlePostJobComplete = (
    jobData: Omit<JobLead, 'id' | 'datePosted' | 'status' | 'bidsCount'>
  ) => {
    const newJob: JobLead = {
      ...jobData,
      id: `lead-${Date.now()}`,
      datePosted: 'Just now',
      status: 'open',
      bidsCount: 0,
    };
    setJobLeads((prev) => [newJob, ...prev]);
    showToast('Job request published to neighborhood board!');
    setActiveTab('jobs');
  };

  // Upgrade Plan with Paystack
  const handleUpgradePlan = (business: Business, tier: PlanTier) => {
    setPaystackCheckout({
      isOpen: true,
      business,
      planTier: tier,
    });
  };

  const handlePaymentSuccess = (tier: PlanTier) => {
    if (paystackCheckout.business) {
      const bizId = paystackCheckout.business.id;
      setBusinesses((prev) =>
        prev.map((b) =>
          b.id === bizId
            ? {
                ...b,
                plan: tier,
                verification: 'cac_verified',
                badges: Array.from(new Set([...b.badges, 'CAC Registered', 'Verified Pro'])),
              }
            : b
        )
      );
      showToast(`Subscription activated! Your business is now a ${tier.toUpperCase()} Pro.`);
    }
  };

  // Filter bookmarked businesses
  const bookmarkedBusinesses = React.useMemo(() => {
    return businesses.filter((b) => bookmarks.includes(b.id));
  }, [businesses, bookmarks]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-emerald-700 selection:text-white">
      {/* Toast banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}

      {/* Header conforming to Top Bar Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        bookmarkCount={bookmarks.length}
      />

      {/* Main Content Area based on Active Tab */}
      <main className="flex-1">
        {activeTab === 'browse' && (
          <>
            <HeroSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              selectedNeighborhood={selectedNeighborhood}
              setSelectedNeighborhood={setSelectedNeighborhood}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              onSearchSubmit={() => {
                const el = document.getElementById('artisans-list');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onPostJobClick={() => setIsPostJobOpen(true)}
            />

            <CategoryGrid
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                const el = document.getElementById('artisans-list');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              categoryCounts={categoryCounts}
            />

            <DirectoryListing
              businesses={businesses}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              selectedNeighborhood={selectedNeighborhood}
              setSelectedNeighborhood={setSelectedNeighborhood}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              onSelectBusiness={handleRecordView}
              onRequestQuote={(biz) => {
                setQuoteModalBiz(biz);
                setQuotePresetService('');
              }}
              onCallClick={handleCallClick}
              onWhatsAppClick={handleWhatsAppClick}
            />
          </>
        )}

        {activeTab === 'jobs' && (
          <JobsBoard
            leads={jobLeads}
            onOpenPostJob={() => setIsPostJobOpen(true)}
            onBidLead={(leadId) => {
              showToast('Lead claimed! You can now message the client directly.');
            }}
          />
        )}

        {activeTab === 'dashboard' && (
          <BusinessDashboardModal
            businesses={businesses}
            quoteRequests={quoteRequests}
            onOpenRegister={() => setIsRegisterOpen(true)}
            onUpgradePlan={handleUpgradePlan}
          />
        )}

        {activeTab === 'revenue' && <RevenueModelSection />}
      </main>

      {/* Modals */}
      {activeBusiness && (
        <BusinessDetailModal
          business={activeBusiness}
          isOpen={!!activeBusiness}
          onClose={() => setActiveBusiness(null)}
          isBookmarked={bookmarks.includes(activeBusiness.id)}
          onToggleBookmark={handleToggleBookmark}
          onRequestQuote={(biz, srvName) => {
            setQuoteModalBiz(biz);
            setQuotePresetService(srvName || '');
          }}
          onAddReview={handleAddReview}
          onWhatsAppClick={handleWhatsAppClick}
          onCallClick={handleCallClick}
        />
      )}

      <RequestQuoteModal
        business={quoteModalBiz}
        presetServiceName={quotePresetService}
        isOpen={!!quoteModalBiz}
        onClose={() => {
          setQuoteModalBiz(null);
          setQuotePresetService('');
        }}
        onSubmitQuote={handleSubmitQuote}
      />

      <PostJobModal
        isOpen={isPostJobOpen}
        onClose={() => setIsPostJobOpen(false)}
        onSubmitJob={handlePostJobComplete}
      />

      <RegisterBusinessModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegisterComplete={handleRegisterComplete}
        onTriggerPayment={handleUpgradePlan}
      />

      <PaystackCheckoutModal
        isOpen={paystackCheckout.isOpen}
        onClose={() =>
          setPaystackCheckout((prev) => ({ ...prev, isOpen: false, business: null }))
        }
        planTier={paystackCheckout.planTier}
        businessName={paystackCheckout.business?.name || 'HireNaija Pro Listing'}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <BookmarksModal
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarkedBusinesses={bookmarkedBusinesses}
        onRemoveBookmark={handleToggleBookmark}
        onSelectBusiness={handleRecordView}
      />

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenPostJob={() => setIsPostJobOpen(true)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />
    </div>
  );
}
