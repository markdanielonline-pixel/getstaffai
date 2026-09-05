export const BILLING_CATALOG = {
  company_office: { name: 'Company Office', monthly: 19900, annual: 199000, includes: ['Executive Assistant', 'General Manager'] },
  administrative_assistant: { name: 'Administrative Assistant', monthly: 9900, annual: 99000 },
  bookkeeper: { name: 'Bookkeeper', monthly: 14900, annual: 149000 },
  lead_generation_specialist: { name: 'Lead Generation Specialist', monthly: 14900, annual: 149000 },
  sales_representative: { name: 'Sales Representative', monthly: 24900, annual: 249000 },
  marketing_manager: { name: 'Marketing Manager', monthly: 19900, annual: 199000 },
  marketing_specialist: { name: 'Marketing Specialist', monthly: 14900, annual: 149000 },
  social_media_manager: { name: 'Social Media Manager', monthly: 24900, annual: 249000 },
  customer_service_representative: { name: 'Customer Service Representative', monthly: 14900, annual: 149000 },
  receptionist: { name: 'Receptionist', monthly: 19900, annual: 199000 },
  sales_team: { name: 'Sales Team', monthly: 34900, annual: 349000, includes: ['Lead Generation Specialist', 'Sales Representative'] },
  marketing_team: { name: 'Marketing Team', monthly: 49900, annual: 499000, includes: ['Marketing Manager', 'Marketing Specialist', 'Social Media Manager'] },
};

export const COMPANY_OFFICE_KEY = 'company_office';

export function getCatalogProduct(key) {
  return BILLING_CATALOG[key] || null;
}

export function priceEnvVar(key, billing) {
  const suffix = billing === 'annual' ? '_ANNUAL' : '';
  return `STRIPE_PRICE_${key.toUpperCase()}${suffix}`;
}
