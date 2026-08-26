import { redirect } from 'next/navigation';
import Link from 'next/link';
import PortalHeader from '@/components/PortalHeader';
import PortalSidebar from '@/components/PortalSidebar';
import { getCEO } from '@/app/actions/auth';
import { createClient } from '@/lib/supabase/server';

export default async function AIWorkforce() {
  const ceo = await getCEO();
  if (!ceo) redirect('/portal/login');

  const supabase = await createClient();
  const orgId = ceo.org_id || '00000000-0000-0000-0000-000000000000';

  const [{ data: employeesData }, { data: departmentsData }] = await Promise.all([
    supabase.from('employees').select('*').eq('org_id', orgId).order('created_at'),
    supabase.from('departments').select('*').eq('org_id', orgId),
  ]);

  const employees = employeesData || [];
  const departments = departmentsData || [];

  return (
    <>
      <PortalHeader title="Org Chart" />
      <main style={{ padding: '7rem 2.5rem 2.5rem 2.5rem', minHeight: '100vh', display: 'flex', background: 'var(--bg-primary)' }}>
        <PortalSidebar />

        <div style={{ flex: 1, marginLeft: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>Organizational Chart</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Manage your AI workforce, departments, and employee lifecycles.</p>
            </div>
            <button className="btn btn-primary" style={{ padding: '0.7rem 1.5rem', background: 'var(--accent-color)', color: '#fff', borderRadius: '0.5rem', border: 'none' }}>
              + Hire Employee
            </button>
          </div>

          {departments.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)', padding: '3rem', textAlign: 'center', fontStyle: 'italic' }}>
              Your company has no departments yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              {departments.map((dept) => {
                const deptEmployees = employees.filter(e => e.department_id === dept.id);
                const manager = employees.find(e => e.id === dept.manager_id);
                
                return (
                  <div key={dept.id} style={{ padding: '2rem', background: 'var(--bg-secondary)', borderRadius: '0.5rem', border: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                      <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0 }}>{dept.name}</h3>
                      <div style={{ color: 'var(--text-secondary)' }}>Manager: {manager ? manager.name : 'None'}</div>
                    </div>

                    {deptEmployees.length === 0 ? (
                      <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No employees in this department.</div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {deptEmployees.map((emp) => (
                          <div key={emp.id} style={{ background: 'var(--bg-primary)', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-light)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                              <div>
                                <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--text-primary)' }}>{emp.name}</div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{emp.title}</div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.2rem' }}>Level {emp.employment_level}</div>
                              </div>
                              <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', borderRadius: '100px', background: 'rgba(16,185,129,0.1)', color: '#10b981', textTransform: 'capitalize' }}>
                                {emp.status}
                              </span>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                              <button style={{ flex: 1, padding: '0.5rem', background: 'transparent', border: '1px solid var(--border-light)', color: 'var(--text-primary)', borderRadius: '0.3rem', cursor: 'pointer' }}>Profile</button>
                              <button style={{ flex: 1, padding: '0.5rem', background: 'transparent', border: '1px solid var(--border-light)', color: 'var(--text-primary)', borderRadius: '0.3rem', cursor: 'pointer' }}>Promote</button>
                              <button style={{ flex: 1, padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '0.3rem', cursor: 'pointer' }}>Fire</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
