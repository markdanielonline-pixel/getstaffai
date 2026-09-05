'use client';

import { useState, useTransition } from 'react';

// Sized for the phone first: the founder's normal way of reaching Staff AI is a
// PWA on a handset, so the control is a full-width tap target rather than a
// hover menu.
export default function OrganizationSwitcher({ organizations, activeOrgId, canCreate, switchAction, createAction }) {
  const [pending, startTransition] = useTransition();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [notice, setNotice] = useState(null);

  // A founder with no company yet still needs the create control; only a
  // customer with nothing to switch between has nothing to show.
  const list = organizations || [];
  if (list.length === 0 && !canCreate) return null;

  const active = list.find(o => o.id === activeOrgId) || list[0];

  function switchTo(orgId) {
    if (orgId === activeOrgId) return;
    setNotice(null);
    const formData = new FormData();
    formData.set('orgId', orgId);
    startTransition(async () => {
      const result = await switchAction(formData);
      if (result?.error) setNotice({ kind: 'error', text: result.error });
    });
  }

  function create() {
    if (!name.trim()) { setNotice({ kind: 'error', text: 'Company name is required.' }); return; }
    setNotice(null);
    const formData = new FormData();
    formData.set('companyName', name.trim());
    formData.set('industry', industry.trim());
    startTransition(async () => {
      const result = await createAction(formData);
      if (result?.error) { setNotice({ kind: 'error', text: result.error }); return; }
      setName(''); setIndustry(''); setCreating(false);
      setNotice({ kind: 'ok', text: `${result.name} created and now active. Its workforce is being set up.` });
    });
  }

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 'bold' }}>
        Company
      </div>

      {list.length > 0 && (
      <select
        value={active?.id || ''}
        onChange={event => switchTo(event.target.value)}
        disabled={pending}
        aria-label="Active company"
        style={{
          width: '100%', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.95rem',
          border: '1px solid var(--border-light)', background: 'var(--bg-primary)', color: 'var(--text-primary)',
        }}
      >
        {list.map(org => (
          <option key={org.id} value={org.id}>
            {org.name}{org.workforce_status === 'ready' ? '' : ' (setting up)'}
          </option>
        ))}
      </select>
      )}

      {canCreate && !creating && (
        <button
          type="button"
          onClick={() => { setCreating(true); setNotice(null); }}
          style={{ marginTop: '0.6rem', width: '100%', padding: '0.6rem', background: 'transparent', border: '1px dashed var(--border-light)', color: 'var(--accent-color)', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}
        >
          {list.length === 0 ? '+ Create your first company' : '+ Add another company'}
        </button>
      )}

      {canCreate && creating && (
        <div style={{ marginTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Company name"
            style={{ padding: '0.65rem', borderRadius: '0.4rem', border: '1px solid var(--border-light)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
          />
          <input
            value={industry}
            onChange={e => setIndustry(e.target.value)}
            placeholder="Industry (optional)"
            style={{ padding: '0.65rem', borderRadius: '0.4rem', border: '1px solid var(--border-light)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" onClick={create} disabled={pending}
              style={{ flex: 1, padding: '0.6rem', background: 'var(--accent-color)', color: '#fff', border: 'none', borderRadius: '0.4rem', cursor: 'pointer', fontSize: '0.85rem' }}>
              {pending ? 'Creating…' : 'Create'}
            </button>
            <button type="button" onClick={() => { setCreating(false); setNotice(null); }} disabled={pending}
              style={{ padding: '0.6rem 0.9rem', background: 'transparent', border: '1px solid var(--border-light)', color: 'var(--text-primary)', borderRadius: '0.4rem', cursor: 'pointer', fontSize: '0.85rem' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {notice && (
        <p style={{
          marginTop: '0.5rem', marginBottom: 0, fontSize: '0.8rem', color: 'var(--text-primary)',
          padding: '0.5rem 0.65rem', borderRadius: '0.4rem',
          background: notice.kind === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
          border: `1px solid ${notice.kind === 'error' ? '#ef4444' : '#10b981'}`,
        }}>
          {notice.text}
        </p>
      )}
    </div>
  );
}
