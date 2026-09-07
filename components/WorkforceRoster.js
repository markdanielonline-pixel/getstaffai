'use client';

import { useState, useTransition } from 'react';

// Runtime state is shown as it actually is. An employee whose Provision agent
// is still installing is not "active" yet, and saying so is the whole point of
// this panel: the previous version rendered employees only inside departments,
// so a tenant with no departments saw an empty org chart while paying for two.
const RUNTIME_LABELS = {
  active: { text: 'Runtime active', colour: '#10b981' },
  provisioning: { text: 'Runtime installing', colour: '#f59e0b' },
  error: { text: 'Runtime error', colour: '#ef4444' },
  unprovisioned: { text: 'No runtime', colour: 'var(--text-secondary)' },
};

function runtimeLabel(status) {
  return RUNTIME_LABELS[status] || { text: status, colour: 'var(--text-secondary)' };
}

function money(cents) {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}/mo`;
}

export default function WorkforceRoster({ employees, roles, canHire, hireAction, dismissAction }) {
  const [pending, startTransition] = useTransition();
  const [notice, setNotice] = useState(null);
  // A role is offered only when Staff AI can actually deliver its advertised
  // outcome. The rest are named as coming soon rather than hidden, so the
  // catalogue stays honest without pretending the role does not exist.
  const sellable = roles.filter(role => role.status !== 'coming_soon');
  const comingSoon = roles.filter(role => role.status === 'coming_soon');
  const [roleKey, setRoleKey] = useState(sellable[0]?.key || '');
  // Which employee the CEO is being asked to confirm dismissing, plus the
  // reason they typed. Dismissal used to fire on a single click: the runtime
  // was torn down and the employee marked alumni with nothing in between, and
  // it cannot be undone. Re-hiring the same role builds a new employee with a
  // new identity, not the one that was removed.
  const [confirming, setConfirming] = useState(null);
  const [reason, setReason] = useState('');

  const current = employees.filter(e => e.status !== 'alumni');
  const alumni = employees.filter(e => e.status === 'alumni');

  function run(action, formData, successText) {
    setNotice(null);
    startTransition(async () => {
      const result = await action(formData);
      setNotice(result?.error
        ? { kind: 'error', text: result.error }
        : { kind: 'ok', text: successText });
    });
  }

  function hire() {
    const formData = new FormData();
    formData.set('roleKey', roleKey);
    // One key per submission, so a retry after a network failure resumes the
    // same durable hiring operation instead of starting a second one.
    formData.set('idempotencyKey', crypto.randomUUID());
    run(hireAction, formData, 'Hired. Their runtime is installing now.');
  }

  function dismiss(employee) {
    const formData = new FormData();
    formData.set('employeeId', employee.id);
    if (reason.trim()) formData.set('reason', reason.trim());
    run(dismissAction, formData, `${employee.name} has been dismissed and their runtime removed.`);
    setConfirming(null);
    setReason('');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {notice && (
        <div style={{
          padding: '1rem', borderRadius: '0.5rem', fontSize: '0.95rem', color: 'var(--text-primary)',
          background: notice.kind === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
          border: `1px solid ${notice.kind === 'error' ? '#ef4444' : '#10b981'}`,
        }}>
          {notice.text}
        </div>
      )}

      <section style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '0.5rem', border: '1px solid var(--border-light)' }}>
        <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', margin: '0 0 1rem 0' }}>Hire an employee</h3>
        {canHire ? (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              value={roleKey}
              onChange={event => setRoleKey(event.target.value)}
              style={{ padding: '0.7rem', minWidth: '20rem', borderRadius: '0.4rem', border: '1px solid var(--border-light)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
            >
              {sellable.map(role => (
                <option key={role.key} value={role.key}>{role.name} - {money(role.monthly)}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={hire}
              disabled={pending || !roleKey}
              style={{ padding: '0.7rem 1.5rem', background: 'var(--accent-color)', color: '#fff', borderRadius: '0.5rem', border: 'none', cursor: pending ? 'default' : 'pointer' }}
            >
              {pending ? 'Working...' : 'Hire'}
            </button>
          </div>
        ) : (
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
            Complete your Company Office subscription to hire additional employees.
          </p>
        )}
        {comingSoon.length > 0 && (
          <p style={{ marginTop: '1rem', marginBottom: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Coming soon: {comingSoon.map(role => role.name).join(', ')}.
          </p>
        )}
      </section>

      <section>
        <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', margin: '0 0 1rem 0' }}>
          Current employees ({current.length})
        </h3>
        {current.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>You have no employees yet.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {current.map(employee => {
              const runtime = runtimeLabel(employee.provision_runtime_status);
              const isFounding = ['ea', 'gm'].includes(employee.employee_type);
              return (
                <div key={employee.id} style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-light)' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--text-primary)' }}>{employee.name}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{employee.title || employee.role}</div>
                  <div style={{ marginTop: '0.9rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.78rem', padding: '0.2rem 0.6rem', borderRadius: '100px', border: '1px solid var(--border-light)', color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                      {employee.status}
                    </span>
                    <span style={{ fontSize: '0.78rem', padding: '0.2rem 0.6rem', borderRadius: '100px', border: `1px solid ${runtime.colour}`, color: 'var(--text-primary)' }}>
                      {runtime.text}
                    </span>
                  </div>
                  {employee.provision_error && (
                    <p style={{ marginTop: '0.75rem', marginBottom: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {employee.provision_error}
                    </p>
                  )}
                  <div style={{ marginTop: '1.5rem' }}>
                    {isFounding ? (
                      <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        Included in your Company Office and cannot be dismissed.
                      </p>
                    ) : confirming === employee.id ? (
                      <div style={{ border: '1px solid #ef4444', borderRadius: '0.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.06)' }}>
                        <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                          Dismiss {employee.name}?
                        </p>
                        <p style={{ margin: '0 0 0.9rem', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                          This deletes their runtime and cannot be undone. Their past work and
                          conversations are kept, but hiring the role again creates a new
                          employee rather than bringing this one back.
                        </p>
                        <label htmlFor={`reason-${employee.id}`} style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                          Reason (optional, kept on their record)
                        </label>
                        <input
                          id={`reason-${employee.id}`}
                          type="text"
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          placeholder="No longer needed"
                          style={{ width: '100%', boxSizing: 'border-box', padding: '0.6rem', marginBottom: '0.9rem', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', borderRadius: '0.35rem', fontSize: '0.9rem' }}
                        />
                        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            onClick={() => dismiss(employee)}
                            disabled={pending}
                            style={{ padding: '0.55rem 1rem', background: '#ef4444', border: '1px solid #ef4444', color: '#ffffff', borderRadius: '0.3rem', fontWeight: 'bold', cursor: pending ? 'default' : 'pointer' }}
                          >
                            {pending ? 'Dismissing...' : `Yes, dismiss ${employee.name}`}
                          </button>
                          <button
                            type="button"
                            onClick={() => { setConfirming(null); setReason(''); }}
                            disabled={pending}
                            style={{ padding: '0.55rem 1rem', background: 'transparent', border: '1px solid var(--border-light)', color: 'var(--text-primary)', borderRadius: '0.3rem', cursor: pending ? 'default' : 'pointer' }}
                          >
                            Keep them
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => { setConfirming(employee.id); setReason(''); }}
                        disabled={pending}
                        style={{ padding: '0.5rem 1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: 'var(--text-primary)', borderRadius: '0.3rem', cursor: pending ? 'default' : 'pointer' }}
                      >
                        Dismiss
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {alumni.length > 0 && (
        <section>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', margin: '0 0 1rem 0' }}>Alumni ({alumni.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {alumni.map(employee => (
              <div key={employee.id} style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                {employee.name} - {employee.title || employee.role} - {employee.departure_reason || 'Departed'}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
