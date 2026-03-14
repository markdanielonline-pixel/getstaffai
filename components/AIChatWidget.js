'use client';

import { useState, useEffect, useRef } from 'react';

export default function AIChatWidget() {
  const [isOpen, setIsOpen]     = useState(false);
  const [phase, setPhase]       = useState('form'); // 'form' | 'chat'
  const [lead, setLead]         = useState({ name: '', email: '' });
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]       = useState(null);
  const messagesEndRef          = useRef(null);
  const abortRef                = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const streamResponse = async (history) => {
    setIsLoading(true);
    setError(null);

    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    const aiId = Date.now().toString();
    setMessages(prev => [...prev, { id: aiId, role: 'assistant', content: '' }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortRef.current.signal,
        body: JSON.stringify({
          messages: history,
          agentType: 'lead_gen',
          leadName: lead.name,
          leadEmail: lead.email,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server error ${res.status}`);
      }

      const data = await res.json();
      const aiText = data.content || '';

      setMessages(prev =>
        prev.map(m => m.id === aiId ? { ...m, content: aiText } : m)
      );
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error('[StaffAI]', err);
      setError('Something went wrong. Please try again.');
      setMessages(prev => prev.filter(m => m.id !== aiId));
    } finally {
      setIsLoading(false);
    }
  };

  // Submit pre-chat form
  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!lead.name.trim() || !lead.email.trim()) return;

    const context = {
      id: 'ctx',
      role: 'user',
      content: `Hi, my name is ${lead.name.trim()} and my email is ${lead.email.trim()}.`,
      hidden: true,
    };

    setMessages([context]);
    setPhase('chat');
    await streamResponse([{ role: 'user', content: context.content }]);
  };

  // Send chat message
  const sendMessage = async () => {
    const text = inputVal.trim();
    if (!text || isLoading) return;
    setInputVal('');

    const userMsg = { id: Date.now().toString(), role: 'user', content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);

    await streamResponse(
      updated
        .filter(m => !m.hidden)
        .map(m => ({ role: m.role, content: m.content }))
    );
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>

      {/* TOGGLE */}
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} aria-label="Chat with StaffAI"
          style={{ width: '58px', height: '58px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', border: 'none', boxShadow: '0 8px 28px rgba(37,99,235,0.55)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'widgetPulse 2.5s ease-in-out infinite' }}>
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}

      {/* PANEL */}
      {isOpen && (
        <div style={{ width: '360px', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.07)', background: '#0d0d14', animation: 'fadeInUp 0.25s ease-out', display: 'flex', flexDirection: 'column', height: phase === 'form' ? 'auto' : '560px' }}>

          {/* HEADER */}
          <div style={{ padding: '0.9rem 1.1rem', background: '#13131e', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.95rem', color: '#fff' }}>S</div>
                <div style={{ position: 'absolute', bottom: '1px', right: '1px', width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', border: '2px solid #13131e', boxShadow: '0 0 6px rgba(16,185,129,0.7)' }} />
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#f9fafb' }}>StaffAI</div>
                <div style={{ fontSize: '0.7rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '1px' }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                  Online · Replies instantly
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', color: '#9ca3af', cursor: 'pointer', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>&times;</button>
          </div>

          {/* PRE-CHAT FORM */}
          {phase === 'form' && (
            <div style={{ padding: '1.5rem', background: '#0d0d14' }}>
              <p style={{ color: '#9ca3af', fontSize: '0.85rem', margin: '0 0 1.25rem', lineHeight: 1.5 }}>
                Before we start — who are we speaking with?
              </p>
              <form onSubmit={handleLeadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input type="text" placeholder="Your first name" required autoFocus
                  value={lead.name} onChange={e => setLead(p => ({ ...p, name: e.target.value }))}
                  style={{ padding: '0.75rem 1rem', background: '#1c1c2a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', color: '#f9fafb', fontSize: '0.9rem', outline: 'none', width: '100%', boxSizing: 'border-box' }}
                />
                <input type="email" placeholder="Your email address" required
                  value={lead.email} onChange={e => setLead(p => ({ ...p, email: e.target.value }))}
                  style={{ padding: '0.75rem 1rem', background: '#1c1c2a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', color: '#f9fafb', fontSize: '0.9rem', outline: 'none', width: '100%', boxSizing: 'border-box' }}
                />
                <button type="submit" disabled={!lead.name.trim() || !lead.email.trim()}
                  style={{ padding: '0.8rem', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '0.95rem', cursor: (!lead.name.trim() || !lead.email.trim()) ? 'not-allowed' : 'pointer', opacity: (!lead.name.trim() || !lead.email.trim()) ? 0.45 : 1, marginTop: '0.25rem' }}>
                  Start Conversation →
                </button>
              </form>
              <p style={{ textAlign: 'center', fontSize: '0.7rem', color: '#4b5563', margin: '1rem 0 0' }}>
                Your info is kept private. No spam.
              </p>
            </div>
          )}

          {/* CHAT */}
          {phase === 'chat' && (
            <>
              <div style={{ flex: 1, padding: '1rem 0.9rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem', background: '#0d0d14' }}>

                {messages.filter(m => !m.hidden).map(m => (
                  <div key={m.id} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                    {m.role === 'assistant' && <div style={{ fontSize: '0.68rem', color: '#6b7280', marginBottom: '3px', paddingLeft: '3px' }}>StaffAI</div>}
                    <div style={{ background: m.role === 'user' ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : '#1c1c2a', color: '#f9fafb', padding: '0.65rem 0.95rem', borderRadius: m.role === 'user' ? '16px 16px 3px 16px' : '16px 16px 16px 3px', fontSize: '0.88rem', lineHeight: '1.55', border: m.role === 'assistant' ? '1px solid rgba(255,255,255,0.06)' : 'none', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {m.content || <span style={{ opacity: 0.4 }}>...</span>}
                    </div>
                  </div>
                ))}

                {error && (
                  <div style={{ alignSelf: 'flex-start', maxWidth: '85%' }}>
                    <div style={{ background: '#3b1a1a', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '0.65rem 0.95rem', borderRadius: '12px', fontSize: '0.85rem' }}>{error}</div>
                  </div>
                )}

                {isLoading && messages[messages.length - 1]?.content === '' && (
                  <div style={{ alignSelf: 'flex-start' }}>
                    <div style={{ fontSize: '0.68rem', color: '#6b7280', marginBottom: '3px', paddingLeft: '3px' }}>StaffAI</div>
                    <div style={{ background: '#1c1c2a', border: '1px solid rgba(255,255,255,0.06)', padding: '0.65rem 0.9rem', borderRadius: '16px 16px 16px 3px', display: 'flex', gap: '5px', alignItems: 'center' }}>
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#6b7280', display: 'inline-block', animation: 'typingBounce 1.2s infinite 0s' }} />
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#6b7280', display: 'inline-block', animation: 'typingBounce 1.2s infinite 0.2s' }} />
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#6b7280', display: 'inline-block', animation: 'typingBounce 1.2s infinite 0.4s' }} />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <div style={{ padding: '0.8rem 0.9rem', background: '#13131e', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
                <input value={inputVal} onChange={e => setInputVal(e.target.value)} onKeyDown={onKeyDown}
                  placeholder="Send a message..." disabled={isLoading}
                  style={{ flex: 1, padding: '0.65rem 1rem', background: '#252535', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', color: '#f9fafb', fontSize: '0.875rem', outline: 'none', caretColor: '#f9fafb' }}
                />
                <button onClick={sendMessage} disabled={isLoading || !inputVal.trim()}
                  style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', border: 'none', borderRadius: '50%', width: '38px', height: '38px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: (isLoading || !inputVal.trim()) ? 'not-allowed' : 'pointer', opacity: (isLoading || !inputVal.trim()) ? 0.45 : 1 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </>
          )}

          <div style={{ textAlign: 'center', padding: '0.35rem', background: '#13131e', borderTop: '1px solid rgba(255,255,255,0.04)', fontSize: '0.62rem', color: '#374151' }}>
            Powered by StaffAI · getstaffai.com
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
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
