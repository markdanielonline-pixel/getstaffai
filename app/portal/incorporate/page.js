import { redirect } from 'next/navigation';
import { getCEO } from '@/app/actions/auth';
import IncorporateForm from '@/components/IncorporateForm';

export default async function Incorporate({ searchParams }) {
  const ceo = await getCEO();
  if (!ceo) redirect('/portal/login');
  if (ceo.status === 'active') redirect('/portal/dashboard');

  const params = await searchParams;
  const product = params?.product || 'company_office';
  const billing = params?.billing === 'annual' ? 'annual' : 'monthly';

  return <IncorporateForm ceo={ceo} product={product} billing={billing} />;
}
