"use client";
import PortalSidebar from '@/components/PortalSidebar';

export default function DashboardLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <PortalSidebar />
      <div style={{ 
        flex: 1, 
        marginLeft: '280px', 
        paddingRight: '0', 
        background: 'radial-gradient(circle at top right, rgba(139,92,246,0.05), transparent 40%)' 
      }}>
        {children}
      </div>
    </div>
  );
}
