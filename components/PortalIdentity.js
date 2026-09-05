'use client';

import { createContext, useContext } from 'react';

// The portal header and sidebar used to render a hardcoded "Alex Smith",
// "Launch Tier" and a permanently green "Workforce Active" dot to every
// customer, including tenants whose workforce was not running. This carries the
// real values from the dashboard layout, which loads them once per request, so
// the chrome states what is actually true.
const PortalIdentityContext = createContext(null);

export function PortalIdentityProvider({ value, children }) {
  return <PortalIdentityContext.Provider value={value}>{children}</PortalIdentityContext.Provider>;
}

export function usePortalIdentity() {
  return useContext(PortalIdentityContext);
}

export function initials(name) {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}

const WORKFORCE_LABELS = {
  ready: { text: 'Workforce active', colour: '#10b981' },
  provisioning: { text: 'Workforce setting up', colour: '#f59e0b' },
  retryable: { text: 'Workforce needs attention', colour: '#ef4444' },
};

export function workforceIndicator(status) {
  return WORKFORCE_LABELS[status] || { text: 'Workforce not set up', colour: 'var(--text-secondary)' };
}
