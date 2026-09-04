import { redirect } from 'next/navigation';
import PortalHeader from '@/components/PortalHeader';
import PortalSidebar from '@/components/PortalSidebar';
import { getCEO } from '@/app/actions/auth';
import { retryInitialWorkforce } from '@/app/actions/workforce';
import { inspectInitialWorkforce } from '@/lib/workforce';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export default async function Dashboard() {
  const ceo = await getCEO();
  if (!ceo) redirect('/portal/login');
  if (!ceo.org_id) redirect('/portal/incorporate?product=company_office&billing=monthly'); // Redirect to company setup if no org is attached

  const supabase = await createClient();
  
  const orgId = ceo.org_id;
  const workforce = await inspectInitialWorkforce(orgId);

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
            <section role="status">
              <p>{workforce.ready ? 'Initial EA/GM workforce is operational.' : 'Initial EA/GM workforce is not ready. Provisioning may still be running or need a retry.'}</p>
              {!workforce.ready && <form action={retryInitialWorkforce}><button type="submit">Resume workforce setup</button></form>}
            </section>
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
              
              {/* Real state only. This panel must never display fabricated
                  assistant activity: an empty workspace shows as empty. */}
              <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                  {workforce.ready
                    ? 'Your Executive Assistant is operational. You have no conversations yet.'
                    : 'Your Executive Assistant is not operational yet, so there is nothing to show here.'}
                </p>
              </div>

              <a href="/portal/dashboard/conversations" className="btn btn-primary" style={{ display: 'block', textAlign: 'center', padding: '1rem', background: 'linear-gradient(135deg, var(--accent-color), var(--accent-secondary))', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', textDecoration: 'none' }}>
                Open Conversations
              </a>
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
              {/* Real state only: no invented priorities. */}
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>No priorities yet.</p>
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
