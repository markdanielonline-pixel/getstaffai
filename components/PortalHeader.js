"use client";
import React from 'react';

export default function PortalHeader({ title = "Dashboard" }) {
  return (
    <header style={{
      height: '80px',
      position: 'fixed',
      top: 0,
      left: '280px',
      right: 0,
      background: 'rgba(5, 5, 7, 0.8)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-light)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      zIndex: 90
    }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
        {title}
      </h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button style={{ 
          background: 'none', 
          border: 'none', 
          color: 'var(--text-secondary)', 
          cursor: 'pointer',
          position: 'relative'
        }}>
          <span style={{ fontSize: '1.4rem' }}>🔔</span>
          <span style={{ 
            position: 'absolute', 
            top: '2px', 
            right: '-2px', 
            width: '10px', 
            height: '10px', 
            background: 'var(--accent-color)', 
            borderRadius: '50%',
            border: '2px solid var(--bg-primary)'
          }}></span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--accent-color), var(--accent-secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)',
            fontWeight: 'bold',
            fontSize: '1.1rem'
          }}>
            A
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '600' }}>Alex Smith</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Launch Tier Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
}
