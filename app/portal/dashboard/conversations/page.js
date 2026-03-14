"use client";
import React, { useEffect, useState } from 'react';
import PortalHeader from '@/components/PortalHeader';

export default function Conversations() {
  const [activeChat, setActiveChat] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConversations() {
      // Dynamic import to prevent SSR crashes on window objects
      const { supabase } = await import('@/lib/supabase');
      
      // Fetch Live Leads that have been engaged
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .neq('stage', 'New')
        .order('updated_at', { ascending: false });
      
      if (!error && data) {
        setLeads(data);
        if (data.length > 0) setActiveChat(data[0].id);
      }
      setLoading(false);
    }
    
    fetchConversations();
  }, []);

  return (
    <>
      <PortalHeader title="Conversations & Transcripts" />
      <main style={{ paddingTop: '80px', height: '100vh', display: 'flex' }}>
        
        {/* Thread List Sidebar */}
        <div style={{ width: '350px', borderRight: '1px solid var(--border-light)', background: 'rgba(5, 5, 7, 0.4)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-light)' }}>
            <input 
              type="text" 
              placeholder="Search transcripts..." 
              style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-light)', borderRadius: '0.5rem', color: 'var(--text-primary)', outline: 'none' }}
            />
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            
            {loading && <div style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>Loading threads...</div>}
            
            {!loading && leads.length === 0 && (
              <div style={{ padding: '1.5rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                No active conversations yet.
              </div>
            )}

            {leads.map(lead => {
                let displayAgent = 'Lead Gen';
                if (lead.stage === 'Meeting Booked' || lead.stage === 'Qualified') displayAgent = 'Appt Setter';
                if (lead.stage === 'Proposal Sent' || lead.stage.includes('Closed')) displayAgent = 'Closer';

                const displayTime = lead.updated_at ? new Date(lead.updated_at).toLocaleDateString() : 'Active';

              return (
              <div 
                key={lead.id}
                onClick={() => setActiveChat(lead.id)}
                style={{ 
                  padding: '1.5rem', 
                  borderBottom: '1px solid var(--border-light)', 
                  cursor: 'pointer',
                  background: activeChat === lead.id ? 'rgba(59,130,246,0.1)' : 'transparent',
                  borderLeft: activeChat === lead.id ? '3px solid var(--accent-color)' : '3px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{lead.name}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{displayTime}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Status: <span style={{ color: 'var(--text-primary)' }}>{lead.stage}</span></span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-color)' }}>{displayAgent}</span>
                </div>
              </div>
            )})}
          </div>
        </div>

        {/* Chat Transcript Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.02\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Cg/%3E%3C/svg%3E")' }}>
          
          {/* Active Chat Header */}
          <div style={{ padding: '1.5rem 2.5rem', borderBottom: '1px solid var(--border-light)', background: 'rgba(15,23,42,0.4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                {leads.find(l => l.id === activeChat)?.name || 'Select a thread'}
              </h3>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent-color)', background: 'rgba(59,130,246,0.2)', padding: '0.1rem 0.5rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Lead Gen Agent Active</span>
                • SMS Channel
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-outline" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>Take Over Comm</button>
              <button className="btn" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', background: 'rgba(16,185,129,0.2)', color: '#10b981', border: '1px solid #10b981', borderRadius: '0.5rem' }}>Push to Appt Setter</button>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '2.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* AI Message */}
            <div style={{ alignSelf: 'flex-start', maxWidth: '75%' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', marginLeft: '1rem' }}>AI Workforce (Yesterday 4:02 PM)</div>
              <div style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid var(--border-light)', padding: '1.2rem', borderRadius: '1.5rem', borderTopLeftRadius: '0.2rem', color: 'var(--text-primary)', fontSize: '1.05rem', lineHeight: '1.5' }}>
                Hi Sarah! Thanks for requesting the StaffAi demo video on our site. Did you have any specific questions about how the AI workforce integrates with your current CRM?
              </div>
            </div>

            {/* User Message */}
            <div style={{ alignSelf: 'flex-end', maxWidth: '75%' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', marginRight: '1rem', textAlign: 'right' }}>Sarah Jenkins (Yesterday 5:15 PM)</div>
              <div style={{ background: 'linear-gradient(135deg, var(--accent-color), var(--accent-secondary))', padding: '1.2rem', borderRadius: '1.5rem', borderTopRightRadius: '0.2rem', color: 'var(--text-primary)', fontSize: '1.05rem', lineHeight: '1.5' }}>
                Yeah, we use HubSpot mostly. Just wondering if the appointment setting agent can write directly to our reps' existing calendars?
              </div>
            </div>

            {/* AI Message */}
            <div style={{ alignSelf: 'flex-start', maxWidth: '75%' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', marginLeft: '1rem' }}>AI Workforce (Yesterday 5:16 PM)</div>
              <div style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid var(--border-light)', padding: '1.2rem', borderRadius: '1.5rem', borderTopLeftRadius: '0.2rem', color: 'var(--text-primary)', fontSize: '1.05rem', lineHeight: '1.5' }}>
                Absolutely. It syncs bidirectionally with HubSpot and reads live calendar availability in real-time, preventing double-booking. It can also assign the meeting round-robin style to your reps.
              </div>
            </div>
            
            <div style={{ alignSelf: 'flex-start', maxWidth: '75%', marginTop: '-0.5rem' }}>
               <div style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid var(--border-light)', padding: '1.2rem', borderRadius: '1.5rem', borderTopLeftRadius: '0.2rem', color: 'var(--text-primary)', fontSize: '1.05rem', lineHeight: '1.5' }}>
                Would you like me to book a quick 10-minute setup call so our integration specialist can verify your HubSpot setup?
              </div>
            </div>

            {/* AI Nurture Event */}
            <div style={{ alignSelf: 'center', margin: '2rem 0', background: 'rgba(0,0,0,0.05)', padding: '0.5rem 1.5rem', borderRadius: '100px', fontSize: '0.85rem', color: 'var(--text-secondary)', border: '1px solid var(--border-light)' }}>
              Sequence: Unresponsive for 24 hours. Automated Nurture triggered.
            </div>

             {/* AI Message */}
             <div style={{ alignSelf: 'flex-start', maxWidth: '75%' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', marginLeft: '1rem' }}>AI Workforce (Today 2m ago)</div>
              <div style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(59,130,246,0.3)', padding: '1.2rem', borderRadius: '1.5rem', borderTopLeftRadius: '0.2rem', color: 'var(--text-primary)', fontSize: '1.05rem', lineHeight: '1.5', boxShadow: '0 0 15px rgba(59,130,246,0.1)' }}>
                Hi Sarah, thought of you since we were just discussing HubSpot. Here's a 2-page brief on how another client increased their booked demos by 40% after activating our sync. Let me know if you want to grab that 10-min call this week.
              </div>
            </div>

          </div>

          {/* Input Area (Disabled because AI is handling it) */}
          <div style={{ padding: '1.5rem 2.5rem', borderTop: '1px solid var(--border-light)', background: 'rgba(5,5,7,0.8)' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input 
                type="text" 
                placeholder="AI is currently managing this conversation. Click 'Take Over Comm' to reply manually..." 
                disabled
                style={{ flex: 1, padding: '1.2rem', background: 'rgba(0,0,0,0.02)', border: '1px dashed var(--border-light)', borderRadius: '0.5rem', color: 'var(--text-secondary)', outline: 'none', cursor: 'not-allowed' }}
              />
              <button disabled style={{ padding: '1.2rem 2rem', background: 'rgba(0,0,0,0.05)', border: '1px solid var(--border-light)', borderRadius: '0.5rem', color: 'var(--text-secondary)', cursor: 'not-allowed', fontWeight: 'bold' }}>
                Send
              </button>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
