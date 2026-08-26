import { redirect } from 'next/navigation';
import PortalHeader from '@/components/PortalHeader';
import PortalSidebar from '@/components/PortalSidebar';
import { getCEO } from '@/app/actions/auth';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export default async function Dashboard() {
  const ceo = await getCEO();
  if (!ceo) redirect('/portal/login');

  const supabase = await createClient();
  
  // We assume ceo.org_id exists for v2 tenancy, fallback for now
  const orgId = ceo.org_id || '00000000-0000-0000-0000-000000000000';

  // Fetch v2 stats
  const { data: employeesData } = await supabase.from('employees').select('*').eq('org_id', orgId);
  const { data: eventsData } = await supabase.from('staffai_events').select('*').eq('org_id', orgId).order('created_at', { ascending: false }).limit(5);
  
  const employees = employeesData || [];
  const events = eventsData || [];
  
  const approvalsPending = events.filter(e => e.event_type === 'approval.requested' && e.status === 'pending').length;

  return (
    <>
      <PortalHeader title="Command Center" />
      <main style={{ padding: '7rem 2.5rem 2.5rem 2.5rem', minHeight: '100vh', display: 'flex', background: 'var(--bg-primary)' }}>
        <PortalSidebar />

        <div style={{ flex: 1, marginLeft: '2rem', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          
          {/* Main Column: Pulse & EA Thread */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Top Bar: Pulse */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '0.5rem', borderLeft: '4px solid var(--accent-color)' }}>
              <div>
                <h1 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0 }}>Company Pulse</h1>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                  {ceo.company_name || 'Acme Corp'}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{employees.length}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>AI Staff</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: approvalsPending > 0 ? '#ef4444' : 'var(--text-primary)' }}>{approvalsPending}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Urgent Approvals</div>
                </div>
              </div>
            </div>

            {/* EA Conversation Area */}
            <div className="glass-panel" style={{ flex: 1, padding: '2rem', background: 'var(--bg-secondary)', borderRadius: '0.5rem', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
                Executive Assistant
              </h3>
              
              <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border-light)', alignSelf: 'flex-start', maxWidth: '80%' }}>
                  <p style={{ margin: 0, color: 'var(--text-primary)' }}>Good morning. I've prepared your daily briefing. We have 3 new qualified leads from the SDR team, and Finance requires your approval for a $50 refund.</p>
                </div>
                <div style={{ background: 'rgba(201,168,76,0.1)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--accent-color)', alignSelf: 'flex-end', maxWidth: '80%' }}>
                  <p style={{ margin: 0, color: 'var(--text-primary)' }}>Thanks. Approve the refund and draft follow-ups for the leads.</p>
                </div>
              </div>

              {/* Chat Input Placeholder */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="text" placeholder="Command your team..." style={{ flex: 1, padding: '1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', borderRadius: '0.5rem', outline: 'none' }} />
                <button className="btn btn-primary" style={{ padding: '0 2rem', background: 'linear-gradient(135deg, var(--accent-color), var(--accent-secondary))', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold' }}>Send</button>
              </div>
            </div>
          </div>

          {/* Right Column: Widgets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Urgent Approvals Widget */}
            <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '0.5rem', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '1rem', textTransform: 'uppercase' }}>Approval Inbox</h3>
              {approvalsPending === 0 ? (
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No pending approvals.</div>
              ) : (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#fca5a5', padding: '1rem', borderRadius: '0.5rem', fontSize: '0.9rem' }}>
                  <strong>Action Required:</strong> 1 high-risk operation paused pending CEO review.
                </div>
              )}
            </div>

            {/* Priorities Today */}
            <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '0.5rem', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '1rem', textTransform: 'uppercase' }}>Priorities Today</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <li>â—‹ Review Q3 SDR performance</li>
                <li>â—‹ Finalize brand tone settings</li>
              </ul>
            </div>

            {/* Event Stream */}
            <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '0.5rem', border: '1px solid var(--border-light)', flex: 1 }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '1rem', textTransform: 'uppercase' }}>Key Updates</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {events.length === 0 ? (
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No recent events.</div>
                ) : (
                  events.map(ev => (
                    <div key={ev.id} style={{ fontSize: '0.85rem', borderLeft: '2px solid var(--accent-color)', paddingLeft: '0.5rem' }}>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{ev.event_type}</span>
                      <div style={{ color: 'var(--text-secondary)' }}>{new Date(ev.created_at).toLocaleTimeString()}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
