import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { businesses as initialBusinesses } from './mockData';

// Page Imports
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import BusinessProfile from './pages/BusinessProfile';
import AdminDashboard from './pages/AdminDashboard';
import {
  CategoriesPage,
  LocationsPage,
  OffersPage,
  SpotlightsPage,
  EventsPage,
  ProfessionalProfilePage,
  VerifiedBusinessesPage,
  HomeAccessCertifiedPage,
  AdvertisePage,
  ClaimPage,
  JoinPage,
  SafetyPage,
  HelpPage,
  ContactPage
} from './pages/DirectoryPages';

export default function App() {
  const [route, setRoute] = useState('home');
  const [businessesList, setBusinessesList] = useState(initialBusinesses);
  const [claimRequests, setClaimRequests] = useState([
    { id: 'c-req-1', business_id: 'biz-8', requester_name: 'Jane Lopez', requester_email: 'jane@coconutorg.com', proof_notes: 'Uploaded brand tax certificate.', status: 'pending' }
  ]);

  // Global Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [selectedBizId, setSelectedBizId] = useState('biz-1');
  const [selectedProfId, setSelectedProfId] = useState('prof-1');

  // Handle viewing profile
  const handleViewProfile = (bizId) => {
    setSelectedBizId(bizId);
    setRoute('business-profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Claim Request Handler
  const onClaimSubmit = (bizId) => {
    const newClaim = {
      id: `claim-req-${Date.now()}`,
      business_id: bizId,
      requester_name: 'Pending Verification Owner',
      requester_email: 'owner@localbusiness.com',
      proof_notes: 'Manual entry from discovery claim portal.',
      status: 'pending'
    };
    setClaimRequests([newClaim, ...claimRequests]);
  };

  // Member Upgrade triggers (simulates billing modal or redirection)
  const onUpgrade = (biz) => {
    // Elevates listing immediately in state for visual confirmation
    setBusinessesList(businessesList.map(b => {
      if (b.id === biz.id) {
        return {
          ...b,
          profile_type: 'paid',
          membership_status: 'member',
          verification_status: 'verified',
          has_booking: true,
          has_quote_request: true,
          has_offers: true,
          services: ["Premium Service", "Immediate Customer Support"],
          trust_score: 92
        };
      }
      return b;
    }));
    alert(`Congratulations! "${biz.business_name}" has been upgraded to a Paid Beacon Member! You can now see the enhanced profile layout, booking tools, and Verified Badge on the directory.`);
    handleViewProfile(biz.id);
  };

  // Route Dispatcher
  const renderRoute = () => {
    switch (route) {
      case 'home':
        return (
          <Home 
            setRoute={setRoute} 
            setCategoryFilter={setCategoryFilter}
            setLocationFilter={setLocationFilter}
            setSearchQuery={setSearchQuery}
            handleViewProfile={handleViewProfile}
          />
        );
      case 'search':
        return (
          <SearchResults 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            locationFilter={locationFilter}
            setLocationFilter={setLocationFilter}
            handleViewProfile={handleViewProfile}
            onUpgrade={onUpgrade}
          />
        );
      case 'categories':
        return (
          <CategoriesPage 
            setRoute={setRoute}
            setCategoryFilter={setCategoryFilter}
          />
        );
      case 'locations':
        return (
          <LocationsPage 
            setRoute={setRoute}
            setLocationFilter={setLocationFilter}
          />
        );
      case 'offers':
        return (
          <OffersPage 
            setRoute={setRoute}
            handleViewProfile={handleViewProfile}
          />
        );
      case 'spotlights':
        return (
          <SpotlightsPage 
            handleViewProfile={handleViewProfile}
          />
        );
      case 'events':
        return <EventsPage />;
      case 'business-profile':
        return (
          <BusinessProfile 
            bizId={selectedBizId}
            setRoute={setRoute}
            setProfessionalId={setSelectedProfId}
            onUpgrade={onUpgrade}
          />
        );
      case 'professional-profile':
        return (
          <ProfessionalProfilePage 
            profId={selectedProfId}
            setRoute={setRoute}
            handleViewProfile={handleViewProfile}
          />
        );
      case 'verified':
        return (
          <VerifiedBusinessesPage 
            handleViewProfile={handleViewProfile}
            onUpgrade={onUpgrade}
          />
        );
      case 'home-access':
        return (
          <HomeAccessCertifiedPage 
            handleViewProfile={handleViewProfile}
            onUpgrade={onUpgrade}
          />
        );
      case 'advertise':
        return <AdvertisePage />;
      case 'claim':
        return <ClaimPage onClaimSubmit={onClaimSubmit} />;
      case 'join':
        return <JoinPage />;
      case 'safety':
        return <SafetyPage />;
      case 'help':
        return <HelpPage />;
      case 'contact':
        return <ContactPage />;
      case 'admin':
        return (
          <AdminDashboard 
            businessesList={businessesList}
            setBusinessesList={setBusinessesList}
            claimRequests={claimRequests}
            setClaimRequests={setClaimRequests}
          />
        );
      default:
        return <Home setRoute={setRoute} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-offwhite)' }}>
      <Navbar currentRoute={route} setRoute={setRoute} />
      <main style={{ flex: 1 }}>
        {renderRoute()}
      </main>
      <Footer setRoute={setRoute} />
    </div>
  );
}
