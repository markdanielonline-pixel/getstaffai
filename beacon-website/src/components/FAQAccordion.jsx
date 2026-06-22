import React, { useState } from 'react';

export default function FAQAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (index) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem 0' }}>
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div 
            key={idx} 
            className="faq-item" 
            style={{ 
              borderColor: isOpen ? 'var(--color-teal)' : 'var(--color-light-gray)',
              boxShadow: isOpen ? 'var(--shadow-md)' : 'var(--shadow-sm)'
            }}
          >
            <div 
              className="faq-header" 
              onClick={() => toggleIndex(idx)}
              style={{
                color: isOpen ? 'var(--color-teal)' : 'var(--color-navy)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem'
              }}
            >
              <span>{item.question}</span>
              <span style={{ 
                fontSize: '1.25rem', 
                transition: 'transform var(--transition-fast)',
                transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                color: isOpen ? 'var(--color-teal)' : 'var(--color-gray)'
              }}>
                +
              </span>
            </div>
            {isOpen && (
              <div className="faq-content" style={{ animation: 'fadeInUp 0.3s ease-out' }}>
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
