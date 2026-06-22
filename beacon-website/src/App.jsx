import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Membership from './pages/Membership';
import Pricing from './pages/Pricing';
import Trust from './pages/Trust';
import Addons from './pages/Addons';
import CommandCenter from './pages/CommandCenter';
import FreePlan from './pages/FreePlan';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';
import WhoItsfor from './pages/WhoItsfor';
import FAQ from './pages/FAQ';
import Join from './pages/Join';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Disclaimer from './pages/Disclaimer';
import EmailPolicy from './pages/EmailPolicy';

export default function App() {
  const [route, setRoute] = useState('home');

  // Handle browser back/forward buttons or hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setRoute(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Set initial route based on hash if present
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when route state changes (keeps URL in sync)
  const navigateTo = (newRoute) => {
    window.location.hash = newRoute;
    setRoute(newRoute);
  };

  const renderPage = () => {
    switch (route) {
      case 'home':
        return <Home setRoute={navigateTo} />;
      case 'membership':
        return <Membership setRoute={navigateTo} />;
      case 'pricing':
        return <Pricing setRoute={navigateTo} />;
      case 'trust':
        return <Trust setRoute={navigateTo} />;
      case 'addons':
        return <Addons setRoute={navigateTo} />;
      case 'commandcenter':
        return <CommandCenter setRoute={navigateTo} />;
      case 'freeplan':
        return <FreePlan setRoute={navigateTo} />;
      case 'howitworks':
        return <HowItWorks setRoute={navigateTo} />;
      case 'about':
        return <About setRoute={navigateTo} />;
      case 'whoitsfor':
        return <WhoItsfor setRoute={navigateTo} />;
      case 'faq':
        return <FAQ setRoute={navigateTo} />;
      case 'join':
        return <Join setRoute={navigateTo} />;
      case 'contact':
        return <Contact setRoute={navigateTo} />;
      case 'terms':
        return <Terms />;
      case 'privacy':
        return <Privacy />;
      case 'disclaimer':
        return <Disclaimer />;
      case 'emailpolicy':
        return <EmailPolicy />;
      default:
        return <Home setRoute={navigateTo} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-offwhite)' }}>
      <Navbar currentPath={route} setRoute={navigateTo} />
      <main style={{ flex: 1 }}>
        {renderPage()}
      </main>
      <Footer setRoute={navigateTo} />
    </div>
  );
}
