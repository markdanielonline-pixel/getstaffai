import React from 'react';

export default function Card({ title, subtitle, content, icon, badge, className = '', style = {}, onClick }) {
  return (
    <div 
      className={`glassmorphism ${className}`}
      onClick={onClick}
      style={{
        padding: '2.5rem',
        borderRadius: '16px',
        boxShadow: 'var(--shadow-md)',
        transition: 'all var(--transition-medium)',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        ...style
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
    >
      {badge && (
        <span style={{
          position: 'absolute',
          top: '1.25rem',
          right: '1.25rem',
          backgroundColor: 'var(--color-teal)',
          color: 'var(--color-white)',
          padding: '0.25rem 0.75rem',
          borderRadius: '50px',
          fontSize: '0.75rem',
          fontWeight: 700
        }}>
          {badge}
        </span>
      )}
      {icon && (
        <div style={{
          fontSize: '2.5rem',
          color: 'var(--color-teal)',
          marginBottom: '1.5rem',
          display: 'inline-block'
        }}>
          {icon}
        </div>
      )}
      {title && (
        <h3 style={{
          fontSize: '1.35rem',
          fontWeight: 600,
          color: 'var(--color-navy)',
          marginBottom: '0.75rem'
        }}>
          {title}
        </h3>
      )}
      {subtitle && (
        <h4 style={{
          fontSize: '0.9rem',
          color: 'var(--color-teal)',
          fontWeight: 600,
          marginBottom: '1rem',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {subtitle}
        </h4>
      )}
      {content && (
        <div style={{
          fontSize: '0.95rem',
          color: 'var(--color-gray)',
          lineHeight: '1.6'
        }}>
          {content}
        </div>
      )}
    </div>
  );
}
