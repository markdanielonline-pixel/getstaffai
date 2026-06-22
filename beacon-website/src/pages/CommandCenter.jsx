import React from 'react';
import Card from '../components/Card';

const workflows = [
  { if: "customers contact you", then: "capture and manage enquiries" },
  { if: "people book your time", then: "appointments and reminders" },
  { if: "customers ask questions online", then: "communication and AI-supported responses" },
  { if: "trust matters before someone chooses you", then: "build visible trust signals" },
  { if: "you need repeat customers", then: "email campaigns, follow-up, and customer communication" },
  { if: "you manage jobs, orders, bookings, visits, consultations, services, deliveries, or customer requests", then: "organize the work" }
];

const businessTypes = [
  "Funeral agencies", "Hairdressers", "Nail technicians", "Barbers", "Beauty professionals",
  "Cleaners", "Lawn care providers", "Contractors", "Plumbers", "Electricians", "Tutors",
  "Consultants", "Guesthouses", "Small restaurants", "Home-based food businesses", "Caterers",
  "Natural product makers", "Coconut oil and skincare brands", "Retail shops", "Delivery businesses",
  "Event service providers", "Repair technicians", "Coaches", "Wellness providers", "Creative professionals",
  "Professional services", "Home service businesses", "And many other Caribbean businesses"
];

const customSetups = [
  {
    type: "Funeral Agency",
    needs: ["Trust verification", "Appointments & calendar", "Customer records", "Sensitive communication", "Follow-up", "Document organization"],
    desc: "A funeral agency may need trust, appointments, customer records, sensitive communication, follow-up, and document organization."
  },
  {
    type: "Hairdresser / Beauty Professional",
    needs: ["Bookings & scheduler", "Reminders", "Customer history", "Reviews", "Promotions", "Repeat customer communication"],
    desc: "A hairdresser may need bookings, reminders, customer history, reviews, promotions, and repeat customer communication."
  },
  {
    type: "Small Restaurant / Food Business",
    needs: ["Customer updates", "Promotions", "Reviews", "Enquiries", "Bookings", "Local visibility"],
    desc: "A small restaurant may need customer updates, promotions, reviews, enquiries, bookings, and local visibility."
  },
  {
    type: "Lawn Care / Home Services",
    needs: ["Quote requests", "Job tracking", "Customer records", "Reminders", "Reviews", "Follow-up"],
    desc: "A lawn care provider may need quote requests, job tracking, customer records, reminders, reviews, and follow-up."
  },
  {
    type: "Natural Product Maker",
    needs: ["Customer lists", "Email campaigns", "Orders", "Reviews", "Product enquiries", "Repeat customer communication"],
    desc: "A natural product maker may need customer lists, email campaigns, orders, reviews, product enquiries, and repeat customer communication."
  }
];

export default function CommandCenter({ setRoute }) {
  const handleNavClick = (path) => {
    setRoute(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const systems = [
    {
      id: "profile",
      title: "BEACON PROFILE™",
      tagline: "Your Public Business Home",
      problem: "Customers cannot choose you if they cannot find you, understand you, or trust what they see.",
      solution: "Create a professional public business profile where customers can quickly understand who you are, what you do, where you operate, how to contact you, and why they should trust you.",
      capabilities: [
        "Business name & description", "Categories & service areas", "Location details & opening hours",
        "Phone, Email, WhatsApp links", "Social media & website links", "Business photo galleries",
        "Services offered list", "Customer reviews board", "Verified trust signals & badges"
      ],
      why: "Your business should not depend on scattered social media posts and forwarded screenshots to look professional. Your Beacon Profile™ gives customers one clear place to find and trust your business.",
      icon: "🌐"
    },
    {
      id: "trust",
      title: "TRUST CENTER™",
      tagline: "Make Trust Visible Before Customers Ask",
      problem: "Customers hesitate when they cannot verify who they are dealing with.",
      solution: "Build, display, and improve the trust signals that help customers feel safer choosing your business.",
      capabilities: [
        "Beacon Verified™ status", "Beacon Trust Score™ display", "Direct review system",
        "Review quality signals", "Profile completeness tracker", "Responsiveness indicators",
        "Complaint resolution portal", "Home Access Certification™ details", "Personalized trust recommendations"
      ],
      why: "Trust is often the difference between being contacted and being ignored. The Trust Center™ helps responsible businesses stand out with visible proof of professionalism.",
      icon: "🛡️"
    },
    {
      id: "lead",
      title: "LEAD DESK™",
      tagline: "Stop Losing Enquiries In WhatsApp, Instagram, And Memory",
      problem: "Businesses lose money when enquiries are scattered, forgotten, or never followed up.",
      solution: "Capture, organize, track, and follow up with opportunities before they disappear.",
      capabilities: [
        "New enquiry tracking", "Quote & service request captures", "Website lead integrations",
        "Manual lead logs", "Lead source & status tracking", "Hot vs. cold lead tagging",
        "Follow-up reminders & logs", "Pipeline stage movements", "Conversion metrics dashboard"
      ],
      why: "Every unanswered enquiry is potential revenue. The Lead Desk™ helps you see who contacted you, what they wanted, where they came from, and what should happen next.",
      icon: "🎯"
    },
    {
      id: "crm",
      title: "CRM DESK™",
      tagline: "Know Every Customer, Conversation, And Opportunity",
      problem: "A serious business cannot manage customers from memory and scattered message threads.",
      solution: "Organize customers, prospects, notes, communication history, opportunities, and follow-up activity in one place.",
      capabilities: [
        "Unified customer records", "Prospect & contact directories", "Communication timelines",
        "Customer notes & tagging", "Audience segmentation", "Service & job histories",
        "Deal pipelines & status", "Team member assignments", "Searchable database query"
      ],
      why: "You should know who contacted your business, what they wanted, what was promised, and what should happen next. The CRM Desk™ helps your business manage relationships professionally.",
      icon: "👥"
    },
    {
      id: "appointment",
      title: "APPOINTMENT DESK™",
      tagline: "Turn Interest Into Scheduled Business",
      problem: "Customers disappear when booking feels slow, messy, or unclear.",
      solution: "Manage appointment requests, availability, booking details, reminders, and schedules from one connected desk.",
      capabilities: [
        "Booking request routing", "Interactive calendar dashboards", "Service option selectors",
        "Availability schedule controls", "Customer intake questionnaires", "Reminders & notifications",
        "Internal coordination notes", "Staff assignment logs", "Booking history tracking"
      ],
      why: "The easier it is to book, the easier it is to become a customer. The Appointment Desk™ helps reduce back-and-forth messaging and missed bookings.",
      icon: "📅"
    },
    {
      id: "marketing",
      title: "MARKETING DESK™",
      tagline: "Send Emails, Announcements, Promotions, And Campaigns",
      problem: "Most businesses only communicate when sales are slow. By then, customers have already forgotten them.",
      solution: "Stay connected with customers through direct business communication, campaigns, newsletters, promotions, updates, and follow-up messages. (Direct customer communication and retention, not social media management).",
      capabilities: [
        "Email newsletters & promotions", "Customer announcements", "Audience list segmentations",
        "Review request workflows", "Customer reactivation sequences", "Pre-made message templates",
        "Campaign sending history", "Open & click logs where applicable"
      ],
      note: "Email Usage Note: Beacon does not use confusing email limits as a pricing trick. Where email sending, SMS, WhatsApp, AI usage, or other external costs apply, they are handled transparently. No hidden padding. No surprise software games.",
      why: "Social media gets attention. Direct customer communication builds repeat business. The Marketing Desk™ helps you stay visible to people who already know you.",
      icon: "✉️"
    },
    {
      id: "ai",
      title: "AI CUSTOMER COMMUNICATION",
      tagline: "Respond Faster Across Website, Social, And Messaging Channels",
      problem: "Customers ask questions at inconvenient times. If they wait too long, they move on.",
      solution: "Use AI-supported communication to help respond to customers, answer common questions, collect information, guide enquiries, and support follow-up across connected channels.",
      capabilities: [
        "Website chat automation", "AI-assisted draft replies", "Lead intake qualification",
        "Frequently asked questions answers", "Service details delivery", "Message routing alerts",
        "Human handoff protocols", "Conversation logs index"
      ],
      note: "AI Access Note: Beacon Membership includes access to AI-supported business communication and workflow assistance. Responsible usage policies apply. Where third-party usage costs apply, Beacon keeps those costs transparent rather than hiding them.",
      why: "A business should not lose customers just because the owner is busy, driving, serving someone else, or asleep. Beacon helps your business stay responsive without forcing manual typing every time.",
      icon: "🤖"
    },
    {
      id: "tasks",
      title: "TASK & JOB DESK™",
      tagline: "Stop Letting Important Work Fall Through The Cracks",
      problem: "Businesses lose money and trust when quotes, calls, jobs, and follow-up tasks are forgotten.",
      solution: "Track the work that needs to be done, who is responsible, when it is due, and what still needs attention.",
      capabilities: [
        "To-do checklists & task cards", "Return call logs", "Quote creation reminders",
        "Internal staff assignments", "Due dates & priorities", "Status progression pipelines",
        "Overdue alarm notifications", "Job log history files"
      ],
      why: "Memory is not a management system. The Task & Job Desk™ helps your business move from 'I hope I remember' to visible accountability.",
      icon: "📋"
    },
    {
      id: "forms",
      title: "FORMS & FEEDBACK DESK™",
      tagline: "Collect The Right Information Before The Work Starts",
      problem: "Bad information creates delays, mistakes, back-and-forth messaging, and poor customer experience.",
      solution: "Collect structured information from customers, prospects, and team members through forms and feedback tools.",
      capabilities: [
        "Quote & service request forms", "Customer intake templates", "Review collection surveys",
        "Client satisfaction questionnaires", "Form field customization", "File upload integrations",
        "Submission alarm pings", "Internal review logging"
      ],
      why: "The better the information, the better the service. Forms help your business ask the right questions from the beginning.",
      icon: "📝"
    },
    {
      id: "money",
      title: "MONEY DESK™",
      tagline: "See What Came In, What Went Out, And What Is Outstanding",
      problem: "Many business owners work hard but still cannot clearly see money activity, unpaid invoices, expenses, or customer payment history.",
      solution: "Organize basic money records, invoices, payments, receipts, expenses, balances, and financial snapshots.",
      capabilities: [
        "Invoice creation & records", "Expense categories tracker", "Unpaid balance monitoring",
        "Payment histories by customer", "Monthly revenue snapshots", "Receipt upload directories",
        "Cash flow visibility monitors", "Financial deadline reminders"
      ],
      note: "Important Clarification: Beacon is not a replacement for an accountant. The core purpose is organization, record keeping, and financial activity visibility.",
      why: "You cannot improve what you cannot see. The Money Desk™ gives your business better visibility into financial activity.",
      icon: "💰"
    },
    {
      id: "database",
      title: "BUSINESS DATABASE™",
      tagline: "Keep Your Business Knowledge In One Place",
      problem: "Important information gets lost when it lives only in one phone, one notebook, one employee’s memory, or one WhatsApp chat.",
      solution: "Store and organize important business information so your business can operate with more consistency.",
      capabilities: [
        "Supplier details registry", "Internal documents storage", "Price list inventories",
        "Policy & procedure guides", "Standard message templates", "Team record directories",
        "Operational workflow assets"
      ],
      why: "Your business should not lose knowledge every time a phone changes, a worker leaves, or a message thread disappears. The Business Database™ helps keep business knowledge inside the business.",
      icon: "🗄️"
    },
    {
      id: "reports",
      title: "BUSINESS HEALTH REPORTS™",
      tagline: "Know What Needs Attention Next",
      problem: "Most business owners know something needs improvement. They just do not always know where to start.",
      solution: "Review business activity, trust signals, responsiveness, visibility, customer engagement, and growth readiness.",
      capabilities: [
        "Visibility score tracking", "Trust performance ratings", "Review volume summaries",
        "Responsiveness indicators", "Follow-up lag calculations", "Customer inquiry metrics",
        "Engagement trend charts"
      ],
      why: "Data is only useful when it gives direction. Business Health Reports™ help turn scattered activity into clear next steps.",
      icon: "📊"
    },
    {
      id: "growth",
      title: "GROWTH RECOMMENDATIONS™",
      tagline: "Get Practical Next Steps For Improvement",
      problem: "Business improvement becomes overwhelming when everything feels important.",
      solution: "Receive clear recommendations that help your business become more visible, more trusted, more responsive, and more organized.",
      capabilities: [
        "Profile completeness actions", "Responsiveness targets", "Trust enhancement alerts",
        "Review campaign reminders", "Follow-up gap highlights", "Content quality prompts"
      ],
      why: "Growth is easier when the next step is clear. Beacon does not just show what is happening. It helps you understand what to improve next.",
      icon: "💡"
    },
    {
      id: "library",
      title: "RESOURCE LIBRARY™",
      tagline: "Use Practical Business Tools Without Starting From Scratch",
      problem: "Business owners waste time recreating scripts, templates, messages, checklists, and policies from nothing.",
      solution: "Access practical business resources designed to help you communicate better, follow up faster, serve customers more professionally, and operate with more structure.",
      capabilities: [
        "Review request scripts", "Follow-up message templates", "Policy guidelines structures",
        "Onboarding checklists", "Customer dispute drafts", "Standard service agreements"
      ],
      why: "Most owners do not need more theory. They need tools they can use. The Resource Library™ helps your business move faster.",
      icon: "📚"
    },
    {
      id: "automation",
      title: "AUTOMATION SUPPORT™",
      tagline: "Reduce Repetitive Work And Improve Consistency",
      problem: "Too much of the business depends on the owner remembering what to do next.",
      solution: "Set up simple workflows that help your business follow up, remind, notify, request, and organize more consistently.",
      capabilities: [
        "Automated booking alerts", "Review solicitation schedules", "Internal team notices",
        "Overdue invoice alerts", "Intake form reminders", "Lead capture triggers"
      ],
      why: "Consistency should not depend on memory. Automation Support™ helps your business respond faster, follow up better, and reduce repeated manual work.",
      icon: "⚙️"
    }
  ];

  return (
    <div style={{ animation: 'fadeInUp var(--transition-medium)' }}>
      {/* Hero Section */}
      <section className="gradient-bg-navy" style={{ padding: '8rem 0 6rem 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: '-15%',
          right: '-15%',
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(0,166,178,0.18) 0%, rgba(10,29,61,0) 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }}></div>
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div>
            <span style={{ color: 'var(--color-teal-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', fontSize: '0.9rem' }}>The Central Operating Hub</span>
            <h1 style={{ fontSize: '3.75rem', marginTop: '0.5rem', marginBottom: '1.5rem', lineHeight: '1.15' }}>
              One Login. Fourteen Business Systems. <span style={{ color: 'var(--color-teal-light)' }}>One Command Center.</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.15rem', marginBottom: '2.5rem', lineHeight: '1.75' }}>
              Most businesses do not need another small tool. They need a serious business system. The Beacon Business Command Center™ gives Caribbean businesses access to the tools they usually have to buy separately, connect manually, learn one by one, and pay for over and over again.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              <button onClick={() => handleNavClick('join')} className="btn btn-gold animate-pulse-gold">
                Become A Beacon Member
              </button>
              <button onClick={() => handleNavClick('freeplan')} className="btn btn-secondary" style={{ borderColor: 'var(--color-teal-light)', color: 'var(--color-teal-light)' }}>
                Start Free
              </button>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', borderLeft: '2px solid var(--color-teal)', paddingLeft: '1rem', fontStyle: 'italic' }}>
              CRM, Lead management, Appointments, Customer messaging, Email marketing, AI support, Forms, Tasks, Money records, Reports, Reviews, Trust signals, Business resources, and Automation, all connected under one membership.
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img 
              src="/assets/beacon app image.png" 
              alt="Beacon Business Command Center Interface" 
              style={{ width: '100%', maxWidth: '550px', height: 'auto', display: 'block' }} 
            />
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-white)' }}>
        <div className="container text-center" style={{ marginBottom: '4rem', maxWidth: '800px' }}>
          <span style={{ color: 'var(--color-teal)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Operational Clarity</span>
          <h2 style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>Your Business Should Not Be Running From Ten Different Places</h2>
          <p style={{ color: 'var(--color-gray)', fontSize: '1.1rem', lineHeight: '1.7' }}>
            Many business owners are already using pieces of a business system. But the problem is not that these tools are useless; the problem is that they are disconnected.
          </p>
        </div>
        <div className="container">
          <div className="grid-3" style={{ gap: '1.5rem', marginBottom: '4rem' }}>
            <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-offwhite)', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>📱</div>
              <strong>WhatsApp</strong> <p style={{ fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>for customer messages</p>
            </div>
            <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-offwhite)', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>📸</div>
              <strong>Instagram / FB</strong> <p style={{ fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>for inquiries & questions</p>
            </div>
            <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-offwhite)', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>📓</div>
              <strong>Notebooks</strong> <p style={{ fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>for appointments</p>
            </div>
            <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-offwhite)', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>📊</div>
              <strong>Spreadsheets</strong> <p style={{ fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>for customer records</p>
            </div>
            <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-offwhite)', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>🧠</div>
              <strong>Memory</strong> <p style={{ fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>for client follow-up</p>
            </div>
            <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-offwhite)', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>💵</div>
              <strong>Payment Apps</strong> <p style={{ fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>for transaction records</p>
            </div>
          </div>
          <div style={{ padding: '2.5rem', backgroundColor: 'var(--color-navy)', color: 'var(--color-white)', borderRadius: '16px', textAlign: 'center', boxShadow: 'var(--shadow-md)' }}>
            <h3 style={{ color: 'var(--color-white)', marginBottom: '1rem' }}>One Membership. One Login. One Business Command Center™.</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0 }}>
              When everything lives in a different place, the business becomes harder to manage, harder to measure, and harder to grow. Beacon brings the major parts together.
            </p>
          </div>
        </div>
      </section>

      {/* Value Positioning Section */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-offwhite)' }}>
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div>
            <span style={{ color: 'var(--color-teal)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Value Positioning</span>
            <h2 style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>This Is Not A Basic Listing</h2>
            <p>Beacon gives your business a public profile, but the Command Center™ goes much deeper. It gives you the back-office structure many small businesses are missing. This is the kind of business infrastructure many companies only get after paying for several different platforms, brought together in one connected membership.</p>
            <button onClick={() => handleNavClick('join')} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Become A Member</button>
          </div>
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'var(--color-white)', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
                <strong>Capture leads</strong>
              </div>
              <div style={{ padding: '1rem', background: 'var(--color-white)', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
                <strong>Manage customers</strong>
              </div>
              <div style={{ padding: '1rem', background: 'var(--color-white)', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
                <strong>Book appointments</strong>
              </div>
              <div style={{ padding: '1rem', background: 'var(--color-white)', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
                <strong>Collect reviews</strong>
              </div>
              <div style={{ padding: '1rem', background: 'var(--color-white)', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
                <strong>Track money activity</strong>
              </div>
              <div style={{ padding: '1rem', background: 'var(--color-white)', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
                <strong>Receive growth guidance</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reassurance Section */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-white)', borderBottom: '1px solid var(--color-light-gray)' }}>
        <div className="container">
          {/* Header */}
          <div className="text-center" style={{ marginBottom: '4rem', maxWidth: '800px', margin: '0 auto 4rem auto' }}>
            <span style={{ color: 'var(--color-teal)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Tailored Growth Blueprint</span>
            <h2 style={{ marginTop: '0.5rem', marginBottom: '1.5rem', fontSize: '2.2rem' }}>Yes, It Is Powerful. No, You Do Not Have To Use Everything At Once.</h2>
            <p style={{ fontSize: '1.15rem', color: 'var(--color-gray)', lineHeight: '1.8' }}>
              The Command Center™ includes a lot. <strong>That is the point.</strong> Your business should not outgrow the system after two months. But you do not have to activate every tool on day one. Beacon is configured around how your business actually works.
            </p>
          </div>

          {/* If/Then Scenarios Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '5rem' }}>
            {workflows.map((wf, idx) => (
              <div 
                key={idx} 
                className="glassmorphism" 
                style={{ 
                  padding: '2rem', 
                  borderRadius: '16px', 
                  borderLeft: '4px solid var(--color-teal)',
                  backgroundColor: 'var(--color-offwhite)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform var(--transition-fast)',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-teal)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Scenario {idx + 1}</div>
                <p style={{ margin: '0 0 1rem 0', fontSize: '1.05rem', color: 'var(--color-navy)', fontWeight: 600 }}>
                  If {wf.if}...
                </p>
                <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--color-gray)', lineHeight: '1.5' }}>
                  Beacon can help you <strong>{wf.then}</strong>.
                </p>
              </div>
            ))}
          </div>

          {/* Who It Supports / Business Tag Cloud */}
          <div className="glassmorphism" style={{ padding: '3.5rem', borderRadius: '24px', backgroundColor: 'var(--color-navy)', color: 'var(--color-white)', marginBottom: '5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,166,178,0.2) 0%, transparent 70%)' }}></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="text-center" style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ color: 'var(--color-gold)', fontSize: '1.8rem', marginBottom: '1rem' }}>Built for the Caribbean Business Landscape</h3>
                <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '700px', margin: '0 auto', fontSize: '1rem' }}>
                  Beacon supports many types of businesses across our region, providing professional-grade tools adapted for your workflow:
                </p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
                {businessTypes.map((biz, idx) => (
                  <span 
                    key={idx} 
                    style={{ 
                      padding: '0.5rem 1rem', 
                      borderRadius: '50px', 
                      backgroundColor: 'rgba(255,255,255,0.08)', 
                      border: '1px solid rgba(255,255,255,0.15)',
                      fontSize: '0.85rem',
                      color: biz.includes('Caribbean') ? 'var(--color-gold)' : 'rgba(255,255,255,0.9)',
                      fontWeight: biz.includes('Caribbean') ? 700 : 500,
                      transition: 'all var(--transition-fast)',
                      cursor: 'default'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'var(--color-teal)';
                      e.target.style.borderColor = 'var(--color-teal)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'rgba(255,255,255,0.08)';
                      e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    {biz}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Tailored Setups */}
          <div style={{ marginBottom: '4rem' }}>
            <div className="text-center" style={{ marginBottom: '3rem' }}>
              <h3 style={{ fontSize: '1.8rem', color: 'var(--color-navy)' }}>Different Businesses. Different Workflows.</h3>
              <p style={{ color: 'var(--color-gray)', maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>
                The setup does not have to look the same for every business. Here is how different members use the same Command Center™:
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {customSetups.map((setup, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                    gap: '2rem', 
                    padding: '2.5rem', 
                    borderRadius: '16px', 
                    backgroundColor: 'var(--color-offwhite)', 
                    border: '1px solid var(--color-light-gray)',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <h4 style={{ color: 'var(--color-teal)', margin: 0, fontSize: '1.3rem', fontWeight: 700 }}>{setup.type}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-gray)', marginTop: '0.5rem', fontStyle: 'italic' }}>Example Blueprint</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 1.25rem 0', fontSize: '1.05rem', color: 'var(--color-navy)', lineHeight: '1.6' }}>
                      {setup.desc}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {setup.needs.map((need, nIdx) => (
                        <span key={nIdx} style={{ fontSize: '0.75rem', backgroundColor: 'var(--color-white)', color: 'var(--color-navy)', padding: '0.25rem 0.75rem', borderRadius: '4px', border: '1px solid var(--color-light-gray)', fontWeight: 500 }}>
                          ✓ {need}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section Footer Callout */}
          <div className="text-center" style={{ background: 'rgba(0,166,178,0.06)', padding: '3rem', borderRadius: '20px', border: '1px dashed var(--color-teal)' }}>
            <h4 style={{ fontSize: '1.5rem', color: 'var(--color-navy)', margin: '0 0 0.5rem 0' }}>One Connected Command Center™.</h4>
            <p style={{ fontSize: '1.1rem', color: 'var(--color-gray)', margin: '0 0 1.5rem 0' }}>
              Use what helps now. Turn on more as your business grows.
            </p>
            <button onClick={() => handleNavClick('join')} className="btn btn-primary">Choose Your Growth Blueprint</button>
          </div>

        </div>
      </section>


      {/* 14 Systems Detailed Grid */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-offwhite)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '4rem' }}>
            <span style={{ color: 'var(--color-teal)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Inside The Command Center</span>
            <h2 style={{ marginTop: '0.5rem' }}>What You Get Inside The Beacon Business Command Center™</h2>
            <p style={{ maxWidth: '750px', margin: '0 auto' }}>Fourteen connected business systems designed to help your business get found, build trust, capture opportunities, serve customers, and grow with more structure.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {systems.map((sys, idx) => (
              <div 
                key={sys.id} 
                className="glassmorphism"
                style={{
                  padding: '3rem',
                  borderRadius: '20px',
                  boxShadow: 'var(--shadow-sm)',
                  backgroundColor: 'var(--color-white)',
                  borderTop: '5px solid var(--color-teal)'
                }}
              >
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '2.5rem' }}>{sys.icon}</span>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-teal)', letterSpacing: '1px' }}>SYSTEM {idx + 1}</span>
                    <h3 style={{ margin: '0.25rem 0 0 0', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '1.6rem' }}>{sys.title}</h3>
                    <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--color-gray)', fontSize: '0.9rem' }}>{sys.tagline}</p>
                  </div>
                </div>

                <div className="grid-2" style={{ gap: '2.5rem', marginTop: '2rem' }}>
                  <div>
                    <h5 style={{ color: '#E53E3E', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>The Problem It Solves</h5>
                    <p style={{ color: 'var(--color-navy)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>{sys.problem}</p>

                    <h5 style={{ color: 'var(--color-teal)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>What It Helps You Do</h5>
                    <p style={{ color: 'var(--color-gray)', fontSize: '0.95rem', margin: 0 }}>{sys.solution}</p>
                  </div>
                  <div>
                    <h5 style={{ color: 'var(--color-navy)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.5px', marginBottom: '0.75rem' }}>Key Capabilities</h5>
                    <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1rem', paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--color-gray)' }}>
                      {sys.capabilities.map((cap, cIdx) => (
                        <li key={cIdx}>{cap}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid var(--color-light-gray)', margin: '2rem 0' }} />

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.25rem' }}>💡</span>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-navy)', fontWeight: 500 }}>{sys.why}</p>
                  </div>
                </div>

                {sys.note && (
                  <div style={{ marginTop: '1.5rem', padding: '1rem 1.5rem', backgroundColor: 'rgba(0,166,178,0.05)', borderRadius: '8px', borderLeft: '4px solid var(--color-teal)' }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-teal)', fontWeight: 600 }}>{sys.note}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* No Per-User Fees */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-white)' }}>
        <div className="container text-center" style={{ maxWidth: '800px' }}>
          <span style={{ color: '#E53E3E', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Growth Friendly</span>
          <h2 style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>No Per-User Fees. No Artificial Growth Penalties.</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-gray)', lineHeight: '1.75' }}>
            Many software companies charge you more the moment your business starts growing. Add a team member, pay more. Need more records, upgrade. Beacon was built with a different philosophy: Your business should not be punished for becoming more organized.
          </p>
          <p style={{ fontSize: '1.05rem', color: 'var(--color-navy)', fontWeight: 600, margin: '2rem 0' }}>
            Beacon Membership includes access for your team without per-user pricing. Add your manager, assistant, admin, or sales person. No per-user software games.
          </p>
          <button onClick={() => handleNavClick('join')} className="btn btn-primary">Join Beacon Today</button>
        </div>
      </section>

      {/* Transparent Usage Section */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-offwhite)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h3 style={{ textCenter: 'true', marginBottom: '1.5rem' }}>Powerful Tools Without Hidden Pricing Tricks</h3>
          <p>Some usage costs are real. Email sending can have a cost. SMS, WhatsApp, and AI usage can have costs. Beacon does not believe in hiding those costs behind confusing pricing ladders. Where external usage costs apply, they are handled transparently. That means:</p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem', paddingLeft: '1.5rem' }}>
            <li>🚫 <strong>No hidden padding</strong></li>
            <li>🚫 <strong>No confusing email tiers</strong></li>
            <li>🚫 <strong>No fake "free" usage buried inside inflated pricing</strong></li>
            <li>🚫 <strong>No punishing businesses for growing</strong></li>
          </ul>
          <p style={{ marginTop: '1.5rem', fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--color-gray)' }}>You get access to the system. Usage costs stay clear where they apply.</p>
        </div>
      </section>

      {/* Cost & Replaces Comparisons */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-white)' }}>
        <div className="container grid-2">
          <div>
            <h3 style={{ marginBottom: '1.5rem' }}>What Businesses Usually Need To Buy Separately</h3>
            <p>To build a similar operating environment on their own, many businesses would need separate tools for: CRM, Lead management, Email marketing, Customer messaging, Booking software, Forms, Task management, Review collection, Trust badges, Reporting, Money tracking, Automation, AI chat, Business resources, and Team access. Then they have to connect, learn, and maintain them.</p>
          </div>
          <div>
            <h3 style={{ marginBottom: '1.5rem' }}>What Beacon Replaces Or Reduces</h3>
            <p>Beacon can reduce the need for separate systems such as: a standalone CRM, a separate email marketing tool, a separate booking tool, a separate forms tool, a separate task manager, a separate customer database, a separate review request tool, a separate AI chat tool, and a separate trust badge framework.</p>
            <p>Beacon is not just another subscription. It is a connected business system.</p>
          </div>
        </div>
      </section>

      {/* Built For The Caribbean */}
      <section className="gradient-bg-teal" style={{ padding: '6rem 0', color: 'var(--color-white)' }}>
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div>
            <h2 style={{ color: 'var(--color-white)' }}>Built For Real Caribbean Businesses</h2>
            <p style={{ color: 'rgba(255,255,255,0.9)' }}>
              Beacon is designed around the way many Caribbean businesses actually operate. WhatsApp communication, social media inquiries, referral-driven trust, customers asking questions after hours, small teams doing big work, and owners carrying too much in their heads. We give you access to serious systems without forcing you into enterprise complexity.
            </p>
          </div>
          <div>
            <img 
              src="/assets/customer journey.png" 
              alt="Caribbean customer journey Map" 
              style={{ width: '100%', maxWidth: '400px', display: 'block', margin: '0 auto' }} 
            />
          </div>
        </div>
      </section>

      {/* Use Case Section */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-offwhite)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '4rem' }}>
            <h2>How Different Businesses Use The Command Center™</h2>
            <p>See the system tailored to different industry workflows.</p>
          </div>
          <div className="grid-3">
            <Card title="Contractors" content="Capture quote requests, build trust, manage records, track jobs, follow up, collect reviews, and qualify for Home Access Certification™." badge="Trades" />
            <Card title="Tutors" content="Manage parent enquiries, appointments, student details, reminders, reviews, and follow-up communication." badge="Education" />
            <Card title="Guesthouses" content="Manage enquiries, guest communication, booking requests, reviews, promotions, customer records, and visibility." badge="Hospitality" />
            <Card title="Consultants" content="Manage leads, prospects, CRM records, follow-up, proposals, email campaigns, customer communication, and growth reports." badge="Professional" />
            <Card title="Beauty Professionals" content="Manage appointments, reviews, customer records, reminders, promotions, and repeat customer communication." badge="Personal Care" />
            <Card title="Home Service Providers" content="Build visible trust, manage quote requests, schedule jobs, track customer communication, and improve follow-up." badge="Local Services" />
          </div>
        </div>
      </section>

      {/* The Real Product Is Structure */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-white)' }}>
        <div className="container text-center" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2>The Real Product Is Structure</h2>
          <p>The tools matter. But the deeper value is structure. Beacon helps your business move from:</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '3rem 0', textAlign: 'left', fontSize: '0.95rem' }}>
            <div style={{ padding: '1rem', borderLeft: '3px solid #DC2626', backgroundColor: '#FFF5F5' }}>
              <strong>From scattered messages</strong> <p style={{ margin: 0, fontSize: '0.85rem' }}>to organized customer records</p>
            </div>
            <div style={{ padding: '1rem', borderLeft: '3px solid var(--color-teal)', backgroundColor: 'rgba(0,166,178,0.05)' }}>
              <strong>To captured opportunities</strong> <p style={{ margin: 0, fontSize: '0.85rem' }}>from missed calls</p>
            </div>
            <div style={{ padding: '1rem', borderLeft: '3px solid #DC2626', backgroundColor: '#FFF5F5' }}>
              <strong>From manual reminders</strong> <p style={{ margin: 0, fontSize: '0.85rem' }}>to automated follow-ups</p>
            </div>
            <div style={{ padding: '1rem', borderLeft: '3px solid var(--color-teal)', backgroundColor: 'rgba(0,166,178,0.05)' }}>
              <strong>To visible trust signals</strong> <p style={{ margin: 0, fontSize: '0.85rem' }}>from invisible trust</p>
            </div>
            <div style={{ padding: '1rem', borderLeft: '3px solid #DC2626', backgroundColor: '#FFF5F5' }}>
              <strong>From random marketing</strong> <p style={{ margin: 0, fontSize: '0.85rem' }}>to customer communication</p>
            </div>
            <div style={{ padding: '1rem', borderLeft: '3px solid var(--color-teal)', backgroundColor: 'rgba(0,166,178,0.05)' }}>
              <strong>To task tracking</strong> <p style={{ margin: 0, fontSize: '0.85rem' }}>from memory operations</p>
            </div>
          </div>
          <p style={{ fontSize: '1.05rem', color: 'var(--color-gray)' }}>
            This is how businesses become easier to manage, how customers get better experiences, and how growth becomes realistic.
          </p>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="gradient-bg-navy" style={{ padding: '6rem 0', color: 'var(--color-white)' }}>
        <div className="container text-center" style={{ maxWidth: '800px' }}>
          <h2>Stop Running A Serious Business From Scattered Tools</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '2.5rem' }}>
            Your business deserves more than disconnected apps, missed follow-ups, and systems held together by memory.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => handleNavClick('join')} className="btn btn-gold">Become A Beacon Member</button>
            <button onClick={() => handleNavClick('freeplan')} className="btn btn-secondary" style={{ borderColor: 'var(--color-teal)', color: 'var(--color-teal)' }}>Start Free</button>
          </div>
        </div>
      </section>
    </div>
  );
}
