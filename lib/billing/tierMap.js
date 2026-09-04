// Bridges the customer-facing Plan name (real, already-configured Stripe products)
// to the backend intelligence_level enum (drives the ported Sophia/LLM-routing code).
// No schema change needed — the plan name itself is stored on `subscriptions`/`ceos`
// via Stripe metadata; intelligence_level is looked up from this map at write time only.
export const PLAN_TO_INTELLIGENCE_LEVEL = {
  CompanyOffice: 'executive',
  company_office: 'executive',
  Operator: 'venture',
  Accelerator: 'executive',
  Authority: 'prestige',
  Dominance: 'prestige',
};

// Maps a plan + billing period to the Vercel env var holding its real Stripe Price ID.
export function resolvePriceEnvVar(tierName, billing) {
  const key = `STRIPE_PRICE_${tierName.toUpperCase()}${billing === 'annual' ? '_ANNUAL' : ''}`;
  return key;
}
