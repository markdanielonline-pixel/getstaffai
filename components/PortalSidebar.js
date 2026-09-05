"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePortalIdentity, workforceIndicator } from './PortalIdentity';
import OrganizationSwitcher from './OrganizationSwitcher';

export default function PortalSidebar({ organizations = [], activeOrgId = null, canCreateOrganization = false, switchOrganizationAction, createOrganizationAction }) {
  const pathname = usePathname();
  const identity = usePortalIdentity();
  const workforce = workforceIndicator(identity?.workforceStatus);

  const links = [
    { name: 'Overview', href: '/portal/dashboard', icon: '📊' },
    { name: 'Conversations', href: '/portal/dashboard/conversations', icon: '💬' },
    { name: 'AI Workforce', href: '/portal/dashboard/agents', icon: '🤖' },
    { name: 'Settings & Support', href: '/portal/dashboard/settings', icon: '⚙️' },
  ];

  return (
    <aside style={{
      width: '280px',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      background: 'rgba(5, 5, 7, 0.95)',
      borderRight: '1px solid var(--border-light)',
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem 1.5rem',
      zIndex: 100
    }}>
      <div style={{ marginBottom: '3rem', paddingLeft: '0.5rem' }}>
        <Link href="/" style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
          StaffAi
        </Link>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link 
              key={link.name} 
              href={link.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.8rem 1rem',
                borderRadius: '0.5rem',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: isActive ? 'linear-gradient(90deg, rgba(59,130,246,0.15), transparent)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--accent-color)' : '3px solid transparent',
                fontWeight: isActive ? '600' : '400',
                transition: 'all 0.2s ease',
                textDecoration: 'none'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{link.icon}</span>
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div style={{ 
        padding: '1.5rem', 
        background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(59,130,246,0.1))', 
        borderRadius: '1rem',
        border: '1px solid rgba(139,92,246,0.2)',
        marginTop: 'auto'
      }}>
        {switchOrganizationAction && (
          <OrganizationSwitcher
            organizations={organizations}
            activeOrgId={activeOrgId}
            canCreate={canCreateOrganization}
            switchAction={switchOrganizationAction}
            createAction={createOrganizationAction}
          />
        )}
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Current Plan</div>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{identity?.planLabel || 'No active plan'}</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: workforce.colour, boxShadow: `0 0 8px ${workforce.colour}` }}></div>
          {workforce.text}
        </div>
        <Link href="/portal/dashboard/settings" style={{ fontSize: '0.9rem', color: 'var(--accent-color)', fontWeight: 'bold' }}>
          Manage billing →
        </Link>
      </div>
    </aside>
  );
}
