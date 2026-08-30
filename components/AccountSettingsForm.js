'use client';

import { useState, useTransition } from 'react';
import { updateEmail, updatePassword, updateProfile } from '@/app/actions/account';

function StatusMessage({ state }) {
  if (!state.message) return null;
  return (
    <div className={state.ok ? 'settings-success' : 'settings-error'}>
      {state.message}
    </div>
  );
}

export default function AccountSettingsForm({ user, ceo, subscription }) {
  const [profileState, setProfileState] = useState({});
  const [emailState, setEmailState] = useState({});
  const [passwordState, setPasswordState] = useState({});
  const [billingState, setBillingState] = useState({});
  const [pending, startTransition] = useTransition();

  const openBillingPortal = async () => {
    setBillingState({});
    try {
      const response = await fetch('/api/billing/portal', { method: 'POST' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Billing portal unavailable.');
      window.location.href = data.url;
    } catch (error) {
      setBillingState({ ok: false, message: error.message });
    }
  };

  return (
    <div className="settings-grid">
      <section className="settings-panel">
        <div>
          <span className="settings-kicker">Account</span>
          <h2>Profile</h2>
          <p>Keep the business identity and notification channel current.</p>
        </div>
        <form action={(formData) => startTransition(async () => setProfileState(await updateProfile(formData)))} className="settings-form">
          <label>
            Name
            <input name="name" defaultValue={ceo?.name || user?.user_metadata?.name || ''} required />
          </label>
          <label>
            Company
            <input name="companyName" defaultValue={ceo?.company_name || ''} required />
          </label>
          <label>
            Reminder channel
            <select name="preferredChannel" defaultValue={ceo?.preferred_channel || 'app'}>
              <option value="app">In-app</option>
              <option value="email">Email</option>
            </select>
          </label>
          <StatusMessage state={profileState} />
          <button type="submit" className="btn btn-navy" disabled={pending}>Save profile</button>
        </form>
      </section>

      <section className="settings-panel">
        <div>
          <span className="settings-kicker">Billing</span>
          <h2>Plan and invoices</h2>
          <p>Manage plan changes, cancellation, payment method, invoices, and billing address through Stripe.</p>
        </div>
        <div className="settings-summary">
          <div>
            <span>Current level</span>
            <strong>{subscription?.intelligence_level || ceo?.intelligence_level || 'Launch'}</strong>
          </div>
          <div>
            <span>Status</span>
            <strong>{subscription?.status || ceo?.status || 'active'}</strong>
          </div>
        </div>
        <StatusMessage state={billingState} />
        <button type="button" className="btn btn-primary" onClick={openBillingPortal} disabled={pending}>
          Open billing portal
        </button>
      </section>

      <section className="settings-panel">
        <div>
          <span className="settings-kicker">Security</span>
          <h2>Email</h2>
          <p>Changing your email requires confirmation before it becomes active.</p>
        </div>
        <form action={(formData) => startTransition(async () => setEmailState(await updateEmail(formData)))} className="settings-form">
          <label>
            New email
            <input name="email" type="email" defaultValue={user?.email || ceo?.email || ''} required />
          </label>
          <StatusMessage state={emailState} />
          <button type="submit" className="btn btn-outline-navy" disabled={pending}>Send confirmation</button>
        </form>
      </section>

      <section className="settings-panel">
        <div>
          <span className="settings-kicker">Security</span>
          <h2>Password</h2>
          <p>Use at least eight characters. Password updates apply immediately.</p>
        </div>
        <form action={(formData) => startTransition(async () => setPasswordState(await updatePassword(formData)))} className="settings-form">
          <label>
            New password
            <input name="password" type="password" minLength={8} required />
          </label>
          <label>
            Confirm password
            <input name="confirmPassword" type="password" minLength={8} required />
          </label>
          <StatusMessage state={passwordState} />
          <button type="submit" className="btn btn-navy" disabled={pending}>Update password</button>
        </form>
      </section>
    </div>
  );
}
