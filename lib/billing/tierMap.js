// Bridges the customer-facing Plan name (real, already-configured Stripe products)
// to the backend intelligence_level enum (drives the ported Sophia/LLM-routing code).
// No schema change needed — the plan name itself is stored on `subscriptions`/`ceos`
// via Stripe metadata; intelligence_level is looked up from this map at write time only.
// Staff AI sells the Company Office; the five-tier product this map used to
// cover (Launch / Operator / Accelerator / Authority / Dominance) no longer
// exists and its entries were unreachable, since checkout only ever sends
// company_office. They are removed so nothing can resurrect them.
export const PLAN_TO_INTELLIGENCE_LEVEL = {
  CompanyOffice: 'executive',
  company_office: 'executive',
};

// Maps a plan + billing period to the Vercel env var holding its real Stripe Price ID.
export function resolvePriceEnvVar(tierName, billing) {
  const key = `STRIPE_PRICE_${tierName.toUpperCase()}${billing === 'annual' ? '_ANNUAL' : ''}`;
  return key;
}
