"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PortalHeader from '@/components/PortalHeader';
import PortalSidebar from '@/components/PortalSidebar';

export default function Dashboard() {
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);
  const [tier, setTier] = useState('Operator');
  const router = useRouter();

  const activeConversations = leads.filter(l => l.stage !== 'Closed Won' && l.stage !== 'Closed Lost').length;
  const meetingsBooked = leads.filter(l => l.stage === 'Meeting Booked').length;

  useEffect(() => {
    const checkAuth = async () => {
      // Check for Moxie API Key instead of Supabase session
      const moxieKey = localStorage.getItem('moxie_api_key');
      const email = localStorage.getItem('moxie_user_email');
      
      if (!moxieKey) {
        router.push('/portal/login');
      } else {
        setUserEmail(email || 'Connected to Workspace');
        
        // Mocking Live Leads from Database for the Demo
        setLeads([
          { id: 1, name: 'Sarah Jenkins', stage: 'Meeting Booked', email: 'sarah@example.com', phone: '555-0102', source: 'Website Widget' },
          { id: 2, name: 'Michael Chen', stage: 'In Conversation', email: 'mchen@example.com', phone: '555-9921', source: 'Cold Email Campaign' },
          { id: 3, name: 'David Rodriguez', stage: 'Proposal Sent', email: 'david@example.com', phone: '555-3344', source: 'Inbound Call' }
        ]);
        
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  return (
    <>
      <PortalHeader title="Overview" />
      <main style={{ padding: '7rem 2.5rem 2.5rem 2.5rem', minHeight: '100vh', display: 'flex' }}>
        <PortalSidebar />
        
        <div style={{ flex: 1, marginLeft: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', margin: 0 }}>Command Center</h1>
              <p style={{ color: 'var(--text-secondary)' }}>Monitor your AI Revenue Workforce in real-time. Connected to: <span style={{color: 'var(--accent-color)'}}>{userEmail}</span></p>
            </div>
            {tier && (
              <div style={{ padding: '0.6rem 1.2rem', background: 'rgba(59,130,246,0.15)', border: '1px solid var(--accent-color)', borderRadius: '100px', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 'bold' }}>
                Current Plan: <span style={{ color: 'var(--accent-color)', textTransform: 'uppercase' }}>{tier} TIER</span>
              </div>
            )}
          </div>

          {/* Metric Cards Section */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
            <div className="glass-panel" style={{ padding: '2rem', borderTop: '3px solid var(--accent-color)' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Active Conversations</div>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-primary)' }}>{activeConversations}</div>
            </div>
            <div className="glass-panel" style={{ padding: '2rem', borderTop: '3px solid var(--accent-secondary)' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Appointments Set</div>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-primary)' }}>{meetingsBooked}</div>
            </div>
            
            <div className="glass-panel" style={{ padding: '2rem', borderTop: '3px solid #10b981', position: 'relative', overflow: 'hidden' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Voice Mins Used</div>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-primary)' }}>12<span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>/60</span></div>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', borderTop: '3px solid #f59e0b' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 'bold', textTransform: 'uppercase' }}>AI Health</div>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 Online <div className="pulse-dot success" style={{ width: '12px', height: '12px' }}></div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
            {/* Main Pipeline Area (Live Data) */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)', letterSpacing: '-0.02em', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
                Workforce Pipeline {loading && <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginLeft: '1rem' }}>Loading live data...</span>}
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {leads.map((lead) => {
                  let borderColor = 'var(--accent-color)';
                  let badgeBg = 'rgba(59,130,246,0.2)';
                  let badgeColor = 'var(--accent-color)';
                  let displayAgent = 'Lead Gen Agent';

                  if (lead.stage === 'Meeting Booked') {
                    borderColor = 'var(--accent-secondary)';
                    badgeBg = 'rgba(139,92,246,0.2)';
                    badgeColor = 'var(--accent-secondary)';
                    displayAgent = 'Appt Setter Agent';
                  } else if (lead.stage === 'Proposal Sent' || lead.stage.includes('Closed')) {
                    borderColor = '#10b981';
                    badgeBg = 'rgba(16,185,129,0.2)';
                    badgeColor = '#10b981';
                    displayAgent = 'Closing Agent';
                  }

                  return (
                    <div key={lead.id} className="animate-fade-in-up" style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '0.5rem', borderLeft: `3px solid ${borderColor}`, border: '1px solid var(--border-light)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{lead.name} • {lead.stage}</span>
                        <span style={{ fontSize: '0.8rem', color: badgeColor, background: badgeBg, padding: '0.2rem 0.6rem', borderRadius: '100px' }}>{displayAgent}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <span>{lead.email || 'No email'}</span>
                        <span>{lead.phone || 'No phone'}</span>
                        <span>Source: {lead.source}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Activity Feed */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)', letterSpacing: '-0.02em', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
                Live Execution
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '11px', top: '10px', bottom: '10px', width: '2px', background: 'var(--border-light)' }}></div>
                
                <div style={{ display: 'flex', gap: '1rem', position: 'relative', zIndex: 1 }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--bg-tertiary)', border: '2px solid var(--accent-color)', marginTop: '2px' }}></div>
                  <div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>SMS Reply Received</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>From Sarah Jenkins (2m ago)</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', position: 'relative', zIndex: 1 }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--bg-tertiary)', border: '2px solid var(--accent-secondary)', marginTop: '2px' }}></div>
                  <div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>Agent Sent Calendar Link</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Appt Setter (12m ago)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
