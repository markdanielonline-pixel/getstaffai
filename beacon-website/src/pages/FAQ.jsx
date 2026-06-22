import React from 'react';
import FAQAccordion from '../components/FAQAccordion';

export default function FAQ({ setRoute }) {
  const handleNavClick = (path) => {
    setRoute(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const faqItems = [
    {
      question: "What is Beacon?",
      answer: "Beacon (Business Excellence & Caribbean Opportunity Network) is a business growth membership designed to help Caribbean businesses become more visible, more trusted, more organized, and more prepared for growth."
    },
    {
      question: "Is Beacon a directory?",
      answer: "No. Directories simply display contact listings. Beacon helps businesses get found, build trust, manage customer relationships, coordinate schedules, collect reviews, access growth reporting, and streamline operations."
    },
    {
      question: "Is the Free Member Plan really free?",
      answer: "Yes. There is no monthly cost for the Free Member Plan. Qualified businesses receive a Beacon Profile page to show services, hours, social links, collect reviews, and appear in relevant service category searches."
    },
    {
      question: "What is included in Beacon Membership?",
      answer: "Beacon Membership unlocks the full Beacon Business Command Center™, including the CRM Desk, Appointment Desk, Money Desk, Task & Job Desk, verification services (Beacon Verified™), and detailed business reports."
    },
    {
      question: "How much does membership cost?",
      answer: "Beacon Membership is $150/month. The standard setup fee is $199, which is currently waived until further notice as a promotional launch."
    },
    {
      question: "What are Beacon Verified™ and Beacon Trust Score™?",
      answer: "Beacon Verified™ is a badge awarded to businesses that have completed identity, registry, and contact checks. The Beacon Trust Score™ is a 100-point metric representing responsiveness, review quality, activity, and completeness."
    },
    {
      question: "Can Beacon build my website or app?",
      answer: "Yes, through our Growth Add-Ons. Members receive preferred subscription pricing on managed business websites ($25-$75/mo) and ecommerce stores ($79-$149/mo) rather than paying traditional design fees."
    },
    {
      question: "Are there long-term contracts?",
      answer: "No. There are no long-term contracts for the monthly membership. You can cancel or manage your plan inside your dashboard at any time."
    }
  ];

  return (
    <div style={{ animation: 'fadeInUp var(--transition-medium)' }}>
      {/* Hero */}
      <section className="gradient-bg-navy" style={{ padding: '6rem 0' }}>
        <div className="container text-center" style={{ maxWidth: '800px' }}>
          <span style={{ color: 'var(--color-teal-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Help Desk</span>
          <h1 style={{ fontSize: '3rem', marginTop: '0.5rem', marginBottom: '1.5rem' }}>Frequently Asked Questions</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>
            Everything you need to know about the plans, verification, Trust Score, and Command Center.
          </p>
        </div>
      </section>

      {/* Accordion list */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-offwhite)' }}>
        <div className="container">
          <FAQAccordion items={faqItems} />
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-white)' }}>
        <div className="container text-center" style={{ maxWidth: '800px' }}>
          <h2>Still Have Questions?</h2>
          <p style={{ color: 'var(--color-gray)', marginBottom: '2rem' }}>The best way to understand Beacon is to experience it. Create a free profile today.</p>
          <button onClick={() => handleNavClick('freeplan')} className="btn btn-primary" style={{ marginRight: '1rem' }}>Start Free Profile</button>
          <button onClick={() => handleNavClick('contact')} className="btn btn-secondary">Contact Support</button>
        </div>
      </section>
    </div>
  );
}
