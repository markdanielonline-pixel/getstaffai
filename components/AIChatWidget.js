'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [agentType, setAgentType] = useState('lead_gen'); // lead_gen, setter, closer
  const messagesEndRef = useRef(null);
  
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: '/api/chat',
    body: { agentType },
    id: agentType, // keeps separate conversation histories for each tab
    initialMessages: [
      {
        id: 'welcome-msg',
        role: 'assistant',
        content: agentType === 'lead_gen' ? "Hey there! I'm the Lead Gen agent. What brings you to StaffAi today?" :
                 agentType === 'setter' ? "Hi! I'm the Setter agent. Looking to book a demo call with our team?" :
                 "I'm the Closer agent. Ready to deploy your AI Revenue Workforce, or do you have final questions before we process payment?"
      }
    ]
  });

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle switching tabs
  const handleTabSwitch = (type) => {
    setAgentType(type);
  };

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999 }}>
      
      {/* WIDGET TOGGLE BUTTON */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="btn-pulse"
          style={{ 
            width: '60px', height: '60px', borderRadius: '50%', 
            background: 'var(--accent-color)', color: 'var(--text-primary)', 
            border: 'none', boxShadow: '0 10px 25px rgba(0, 102, 255, 0.5)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' 
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      )}

      {/* WIDGET PANEL */}
      {isOpen && (
        <div className="glass-panel-vip" style={{ 
          width: '380px', height: '600px', display: 'flex', flexDirection: 'column', 
          overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          animation: 'fadeInUp 0.3s ease-out'
        }}>
          
          {/* HEADER */}
          <div style={{ padding: '1.2rem', background: 'rgba(0,0,0,0.8)', borderBottom: '1px solid rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></div>
              Test Our Agents
            </h3>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.5rem', lineHeight: '1' }}>&times;</button>
          </div>

          {/* AGENT TABS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'rgba(0,0,0,0.4)' }}>
            <button 
              onClick={() => handleTabSwitch('lead_gen')} 
              style={{ padding: '0.8rem 0', background: agentType === 'lead_gen' ? 'rgba(59,130,246,0.1)' : 'transparent', border: 'none', borderBottom: agentType === 'lead_gen' ? '2px solid var(--accent-color)' : '2px solid transparent', color: agentType === 'lead_gen' ? 'var(--text-primary)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
            >Lead Gen</button>
            <button 
              onClick={() => handleTabSwitch('setter')} 
              style={{ padding: '0.8rem 0', background: agentType === 'setter' ? 'rgba(139,92,246,0.1)' : 'transparent', border: 'none', borderBottom: agentType === 'setter' ? '2px solid var(--accent-secondary)' : '2px solid transparent', color: agentType === 'setter' ? 'var(--text-primary)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
            >Setter</button>
            <button 
              onClick={() => handleTabSwitch('closer')} 
              style={{ padding: '0.8rem 0', background: agentType === 'closer' ? 'rgba(16,185,129,0.1)' : 'transparent', border: 'none', borderBottom: agentType === 'closer' ? '2px solid #10b981' : '2px solid transparent', color: agentType === 'closer' ? 'var(--text-primary)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
            >Closer</button>
          </div>

          {/* CHAT MESSAGES AREA */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(5,5,7,0.6)' }}>
             {messages.map(m => (
              <div key={m.id} style={{ 
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                background: m.role === 'user' ? 'var(--accent-color)' : 'rgba(0,0,0,0.05)',
                color: 'var(--text-primary)',
                padding: '0.8rem 1.2rem',
                borderRadius: m.role === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                maxWidth: '85%',
                fontSize: '0.95rem',
                lineHeight: '1.4',
                border: m.role === 'assistant' ? '1px solid rgba(0,0,0,0.1)' : 'none'
              }}>
                {m.content}
              </div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', background: 'rgba(0,0,0,0.05)', padding: '0.8rem 1.2rem', borderRadius: '18px 18px 18px 2px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-secondary)', animation: 'pulse 1s infinite' }}></div>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-secondary)', animation: 'pulse 1s infinite 0.2s' }}></div>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-secondary)', animation: 'pulse 1s infinite 0.4s' }}></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT FORM */}
          <form onSubmit={handleSubmit} style={{ padding: '1rem', background: 'rgba(0,0,0,0.8)', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', gap: '0.5rem' }}>
            <input 
              value={input} 
              onChange={handleInputChange} 
              placeholder="Send a message..." 
              style={{ flex: 1, padding: '0.8rem 1rem', background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '20px', color: 'var(--text-primary)', outline: 'none' }}
            />
            <button type="submit" disabled={isLoading || !input?.trim()} style={{ background: 'var(--accent-color)', color: 'var(--text-primary)', border: 'none', borderRadius: '50%', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: (isLoading || !input?.trim()) ? 'not-allowed' : 'pointer', opacity: (isLoading || !input?.trim()) ? 0.5 : 1 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>

        </div>
      )}
    </div>
  );
}
