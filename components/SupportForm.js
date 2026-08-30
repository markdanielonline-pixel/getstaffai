'use client';

import { useState } from 'react';

const emptyForm = {
  name: '',
  email: '',
  companyName: '',
  category: 'sales',
  priority: 'normal',
  subject: '',
  message: '',
};

export default function SupportForm({ source = 'contact', defaults = {}, compact = false }) {
  const [form, setForm] = useState({ ...emptyForm, ...defaults });
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(false);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setState({});

    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Support request failed.');
      setState({ ok: true, message: `Request received. Ticket ${data.id.slice(0, 8).toUpperCase()} is now in the support queue.` });
      setForm({ ...emptyForm, ...defaults, category: form.category });
    } catch (error) {
      setState({ ok: false, message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className={compact ? 'support-form support-form-compact' : 'support-form'}>
      {state.message && (
        <div className={state.ok ? 'settings-success' : 'settings-error'}>{state.message}</div>
      )}

      <div className="support-form-row">
        <label>
          Name
          <input value={form.name} onChange={(e) => update('name', e.target.value)} required />
        </label>
        <label>
          Work email
          <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required />
        </label>
      </div>

      <label>
        Company
        <input value={form.companyName} onChange={(e) => update('companyName', e.target.value)} />
      </label>

      <div className="support-form-row">
        <label>
          Category
          <select value={form.category} onChange={(e) => update('category', e.target.value)}>
            <option value="sales">Sales</option>
            <option value="billing">Billing</option>
            <option value="technical">Technical</option>
            <option value="account_access">Account access</option>
            <option value="incident">Incident</option>
            <option value="general">General</option>
          </select>
        </label>
        <label>
          Priority
          <select value={form.priority} onChange={(e) => update('priority', e.target.value)}>
            <option value="normal">Normal</option>
            <option value="urgent">Urgent</option>
          </select>
        </label>
      </div>

      <label>
        Subject
        <input value={form.subject} onChange={(e) => update('subject', e.target.value)} minLength={3} maxLength={160} required />
      </label>

      <label>
        Message
        <textarea value={form.message} onChange={(e) => update('message', e.target.value)} minLength={10} maxLength={5000} rows={compact ? 4 : 6} required />
      </label>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit request'}
      </button>
    </form>
  );
}
