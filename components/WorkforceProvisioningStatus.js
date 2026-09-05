'use client';

import { useEffect, useState, useTransition } from 'react';

// Provisioning a tenant takes minutes of real runtime work (container, daemon,
// gateway, two agent installs) and the durable operation is resumable, so a
// single request may legitimately end before it is finished. Rather than
// leaving the customer to keep pressing a button, resume automatically on an
// interval until the workforce reports ready. The action itself is leased, so
// a resume that arrives while one is already running is rejected harmlessly.
const RESUME_INTERVAL_MS = 30_000;

export default function WorkforceProvisioningStatus({ ready, resumeAction }) {
  const [pending, startTransition] = useTransition();
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (ready) return undefined;
    const timer = setInterval(() => {
      startTransition(async () => {
        await resumeAction();
        setAttempts(count => count + 1);
      });
    }, RESUME_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [ready, resumeAction]);

  if (ready) return <p>Initial EA/GM workforce is operational.</p>;

  return (
    <>
      <p>
        Setting up your Executive Assistant and General Manager. This takes a few
        minutes and continues on its own{attempts > 0 ? ` (checked ${attempts} time${attempts === 1 ? '' : 's'})` : ''}.
      </p>
      <form action={resumeAction}>
        <button type="submit" disabled={pending}>
          {pending ? 'Resuming setup...' : 'Resume workforce setup now'}
        </button>
      </form>
    </>
  );
}
