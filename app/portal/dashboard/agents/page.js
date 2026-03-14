"use client";
import React, { useState } from 'react';
import PortalHeader from '@/components/PortalHeader';

export default function AIWorkforce() {
  const [agents, setAgents] = useState([
    { 
      id: 'leadgen', 
      name: 'Lead Generation Agent', 
      status: 'Active',
      color: 'var(--accent-color)',
      description: 'Engages inbound leads instantly, qualifies basic intent, and routes to next steps.',
      metrics: { leads: 142, qualified: 89, conversion: '63%' },
      settings: { responseTime: 'Instant (Under 5s)', persistence: 'Normal (3 touches)' }
    },
    { 
      id: 'setter', 
      name: 'Appointment Setter Agent', 
      status: 'Active',
      color: 'var(--accent-secondary)',
      description: 'Asks qualifying questions, offers time slots, and books directly into your calendar.',
      metrics: { conversations: 45, booked: 12, noShowRate: '8%' },
      settings: { calendarProvider: 'Google Calendar (Synced)', reminders: 'SMS + Email (24h/1h)' }
    },
    { 
      id: 'closer', 
      name: 'Closing & Follow-up Agent', 
      status: 'Upgrade Required',
      color: '#10b981',
      description: 'Persistent follow-up beyond "not now", Proposal sending, and human escalation.',
      metrics: { proposals: '-', closedWon: '-', revenue: '-' },
      settings: { escalationThreshold: 'Locked', paymentLink: 'Locked' }
    }
  ]);

  return (
    <>
      <PortalHeader title="Manage AI Workforce" />
      <main style={{ padding: '7rem 2.5rem 2.5rem 2.5rem', minHeight: '100vh', background: 'radial-gradient(circle at top right, rgba(59,130,246,0.05), transparent 50%)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>Your Active Roles</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Configure the behavior and persistence of your autonomous revenue layers.</p>
          </div>
          <button className="btn btn-outline" style={{ padding: '0.8rem 1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span>⟳</span> Sync CRM Knowledge
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
          
          {agents.map((agent) => (
            <div 
              key={agent.id} 
              className="glass-panel" 
              style={{ 
                padding: '2.5rem', 
                borderTop: `4px solid ${agent.color}`,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                opacity: agent.status === 'Upgrade Required' ? 0.7 : 1
              }}
            >
              {agent.status === 'Upgrade Required' && (
                <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, background: 'rgba(5,5,7,0.7)', backdropFilter: 'blur(2px)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ background: agent.color, color: '#000', padding: '0.5rem 1rem', borderRadius: '100px', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '1rem' }}>Accelerator Tier Required</div>
                  <button className="btn btn-primary" style={{ background: `linear-gradient(135deg, ${agent.color}, var(--bg-tertiary))`, border: 'none', padding: '0.8rem 1.5rem' }}>
                    Upgrade to Unlock
                  </button>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', lineHeight: '1.2' }}>{agent.name}</h3>
                <div style={{ 
                  background: agent.status === 'Active' ? 'rgba(16,185,129,0.1)' : 'rgba(0,0,0,0.05)', 
                  color: agent.status === 'Active' ? '#10b981' : 'var(--text-secondary)', 
                  padding: '0.3rem 0.8rem', 
                  borderRadius: '100px', 
                  fontSize: '0.8rem', 
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                  {agent.status === 'Active' && <div style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 5px #10b981' }}></div>}
                  {agent.status}
                </div>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.5', minHeight: '3rem', marginBottom: '2rem' }}>
                {agent.description}
              </p>

              <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '0.5rem', border: '1px solid rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{Object.keys(agent.settings)[0]}</span>
                  <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 'bold' }}>{Object.values(agent.settings)[0]}</span>
                </div>
                <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{Object.keys(agent.settings)[1]}</span>
                  <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 'bold' }}>{Object.values(agent.settings)[1]}</span>
                </div>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', gap: '1rem' }}>
                <button className="btn btn-outline" style={{ flex: 1, padding: '0.8rem', borderColor: `rgba(${agent.color === 'var(--accent-color)' ? '59,130,246' : '139,92,246'}, 0.3)`, color: 'var(--text-primary)' }}>
                  Configure Persona
                </button>
                <button className="btn btn-outline" style={{ flex: 1, padding: '0.8rem' }}>
                  View Metrics
                </button>
              </div>

            </div>
          ))}

        </div>

        <div className="glass-panel" style={{ marginTop: '3rem', padding: '3rem', display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1.5fr', gap: '3rem', background: 'rgba(5,5,7,0.8)' }}>
          <div>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>Global Training Context</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.6' }}>
              Your workforce requires context to sell accurately. Provide your company's core offering, pricing logic, and common objections here. 
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             <textarea 
               rows="5" 
               defaultValue="We are StaffAi. We sell an autonomous AI revenue workforce. We do not sell chatbots. Our core metric of success is booked revenue on the calendar. Common objection is 'Is this just ChatGPT?' Answer: 'No, this is an orchestrated multi-agent system built on text-first sales architecture with native voice escalation and persistent nurture.'"
               className="glass-panel" 
               style={{ width: '100%', padding: '1.5rem', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-light)', color: 'var(--text-secondary)', borderRadius: '0.5rem', resize: 'vertical', lineHeight: '1.6' }}
             ></textarea>
             <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
               <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', alignSelf: 'center' }}>Last synced yesterday</span>
               <button className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>Update Global Brain</button>
             </div>
          </div>
        </div>

      </main>
    </>
  );
}
