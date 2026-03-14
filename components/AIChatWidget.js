'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadFormData, setLeadFormData] = useState({ name: '', email: '' });
  const [leadCaptured, setLeadCaptured] = useState(false);
  const messagesEndRef = useRef(null);

  const [errorMsg, setErrorMsg] = useState(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
    api: '/api/chat',
    body: { agentType: 'lead_gen' },
    id: 'staffai-agent',
    initialMessages: [
      {
        id: 'welcome-msg',
        role: 'assistant',
        content: "What's your current biggest bottleneck — finding leads, following up, or closing them?"
      }
    ],
    onError: (err) => {
      console.error('[StaffAI Widget]', err);
      setErrorMsg('Something went wrong. Please try again in a moment.');
      setTimeout(() => setErrorMsg(null), 5000);
    }
  });

  // Detect when AI asks for name/email and show structured form
  useEffect(() => {
    if (!leadCaptured && messages.length > 0) {
      const last = messages[messages.length - 1];
      if (last.role === 'assistant') {
        const c = last.content.toLowerCase();
        if (
          (c.includes('name') && c.includes('email')) ||
          c.includes('best email') ||
          c.includes('your email') ||
          c.includes('grab your email') ||
          c.includes('get your email')
        ) {
          setShowLeadForm(true);
        }
      }
    }
  }, [messages, leadCaptured]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, showLeadForm, isLoading]);

  const handleLeadFormSubmit = async (e) => {
    e.preventDefault();
    if (!leadFormData.name.trim() || !leadFormData.email.trim()) return;
    setShowLeadForm(false);
    setLeadCaptured(true);
    await append({
      role: 'user',
      content: `My name is ${leadFormData.name.trim()} and my email is ${leadFormData.email.trim()}`
    });
  };

  return (
    <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>

      {/* TOGGLE BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '58px', height: '58px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            color: '#fff', border: 'none',
            boxShadow: '0 8px 28px rgba(37,99,235,0.55)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'widgetPulse 2.5s ease-in-out infinite'
          }}
          aria-label="Chat with StaffAI"
        >
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}

      {/* WIDGET PANEL */}
      {isOpen && (
        <div style={{
          width: '370px', height: '560px', display: 'flex', flexDirection: 'column',
          borderRadius: '18px', overflow: 'hidden',
          boxShadow: '0 24px 64px rgba(0,0,0,0.55)',
          border: '1px solid rgba(255,255,255,0.07)',
          background: '#0d0d14',
          animation: 'fadeInUp 0.25s ease-out'
        }}>

          {/* HEADER */}
          <div style={{
            padding: '0.9rem 1.1rem',
            background: '#13131e',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexShrink: 0
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              {/* Avatar with green online dot */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: '800', fontSize: '0.95rem', color: '#fff', letterSpacing: '-0.5px'
                }}>S</div>
                <div style={{
                  position: 'absolute', bottom: '1px', right: '1px',
                  width: '10px', height: '10px', borderRadius: '50%',
                  background: '#10b981', border: '2px solid #13131e',
                  boxShadow: '0 0 6px rgba(16,185,129,0.7)'
                }} />
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#f9fafb', lineHeight: 1.2 }}>StaffAI</div>
                <div style={{ fontSize: '0.7rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '1px' }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                  Online · Replies instantly
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.07)', border: 'none', color: '#9ca3af',
                cursor: 'pointer', width: '28px', height: '28px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.1rem', lineHeight: 1, transition: 'background 0.15s'
              }}
            >&times;</button>
          </div>

          {/* MESSAGES AREA */}
          <div style={{
            flex: 1, padding: '1rem 0.9rem', overflowY: 'auto',
            display: 'flex', flexDirection: 'column', gap: '0.65rem',
            background: '#0d0d14'
          }}>
            {messages.map(m => (
              <div key={m.id} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '83%' }}>
                {m.role === 'assistant' && (
                  <div style={{ fontSize: '0.68rem', color: '#6b7280', marginBottom: '3px', paddingLeft: '3px' }}>StaffAI</div>
                )}
                <div style={{
                  background: m.role === 'user'
                    ? 'linear-gradient(135deg, #2563eb, #1d4ed8)'
                    : '#1c1c2a',
                  color: '#f9fafb',
                  padding: '0.65rem 0.95rem',
                  borderRadius: m.role === 'user' ? '16px 16px 3px 16px' : '16px 16px 16px 3px',
                  fontSize: '0.88rem',
                  lineHeight: '1.55',
                  border: m.role === 'assistant' ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {m.content}
                </div>
              </div>
            ))}

            {/* INLINE LEAD CAPTURE FORM */}
            {showLeadForm && !leadCaptured && (
              <div style={{ alignSelf: 'flex-start', width: '90%' }}>
                <form onSubmit={handleLeadFormSubmit} style={{
                  background: '#1c1c2a',
                  border: '1px solid rgba(37,99,235,0.35)',
                  borderRadius: '14px', padding: '0.9rem',
                  display: 'flex', flexDirection: 'column', gap: '0.55rem'
                }}>
                  <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginBottom: '0.1rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your details</div>
                  <input
                    type="text"
                    placeholder="First name"
                    value={leadFormData.name}
                    onChange={e => setLeadFormData(p => ({ ...p, name: e.target.value }))}
                    autoFocus
                    style={{
                      padding: '0.6rem 0.8rem',
                      background: '#252535',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#f9fafb',
                      fontSize: '0.875rem',
                      outline: 'none',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={leadFormData.email}
                    onChange={e => setLeadFormData(p => ({ ...p, email: e.target.value }))}
                    style={{
                      padding: '0.6rem 0.8rem',
                      background: '#252535',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#f9fafb',
                      fontSize: '0.875rem',
                      outline: 'none',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!leadFormData.name.trim() || !leadFormData.email.trim()}
                    style={{
                      padding: '0.6rem',
                      background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                      color: '#fff', border: 'none', borderRadius: '8px',
                      fontWeight: '600', fontSize: '0.875rem',
                      cursor: (!leadFormData.name.trim() || !leadFormData.email.trim()) ? 'not-allowed' : 'pointer',
                      opacity: (!leadFormData.name.trim() || !leadFormData.email.trim()) ? 0.45 : 1,
                      transition: 'opacity 0.15s'
                    }}
                  >
                    Continue →
                  </button>
                </form>
              </div>
            )}

            {/* ERROR MESSAGE */}
            {errorMsg && (
              <div style={{ alignSelf: 'flex-start', maxWidth: '83%' }}>
                <div style={{ background: '#3b1a1a', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '0.65rem 0.95rem', borderRadius: '16px 16px 16px 3px', fontSize: '0.85rem' }}>
                  {errorMsg}
                </div>
              </div>
            )}

            {/* TYPING INDICATOR */}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start' }}>
                <div style={{ fontSize: '0.68rem', color: '#6b7280', marginBottom: '3px', paddingLeft: '3px' }}>StaffAI</div>
                <div style={{
                  background: '#1c1c2a', border: '1px solid rgba(255,255,255,0.06)',
                  padding: '0.65rem 0.9rem', borderRadius: '16px 16px 16px 3px',
                  display: 'flex', gap: '5px', alignItems: 'center'
                }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#6b7280', display: 'inline-block', animation: 'typingBounce 1.2s infinite 0s' }} />
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#6b7280', display: 'inline-block', animation: 'typingBounce 1.2s infinite 0.2s' }} />
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#6b7280', display: 'inline-block', animation: 'typingBounce 1.2s infinite 0.4s' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT FORM */}
          <form
            onSubmit={handleSubmit}
            style={{
              padding: '0.8rem 0.9rem',
              background: '#13131e',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', gap: '0.5rem', alignItems: 'center',
              flexShrink: 0
            }}
          >
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Send a message..."
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '0.65rem 1rem',
                background: '#252535',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '24px',
                color: '#f9fafb',
                fontSize: '0.875rem',
                outline: 'none',
                caretColor: '#f9fafb'
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !input?.trim()}
              style={{
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: '#fff', border: 'none', borderRadius: '50%',
                width: '38px', height: '38px', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: (isLoading || !input?.trim()) ? 'not-allowed' : 'pointer',
                opacity: (isLoading || !input?.trim()) ? 0.45 : 1,
                transition: 'opacity 0.15s'
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>

          {/* FOOTER */}
          <div style={{
            textAlign: 'center', padding: '0.35rem',
            background: '#13131e',
            borderTop: '1px solid rgba(255,255,255,0.04)',
            fontSize: '0.62rem', color: '#374151'
          }}>
            Powered by StaffAI · getstaffai.com
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        @keyframes widgetPulse {
          0%,100% { box-shadow: 0 8px 28px rgba(37,99,235,0.55); }
          50%      { box-shadow: 0 8px 40px rgba(37,99,235,0.85); }
        }
        @keyframes typingBounce {
          0%,60%,100% { opacity: 0.3; transform: translateY(0); }
          30%          { opacity: 1;   transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
