'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function Avatar({ initials, color, size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: color || 'var(--accent-color)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.33, fontWeight: 700, color: '#ffffff', flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '10px 14px' }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-color)', opacity: 0.6, animation: `typing-bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
      ))}
      <style>{`@keyframes typing-bounce { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-6px); opacity: 1; } }`}</style>
    </div>
  );
}

function formatTime(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function ConversationsView({ ceo, conversations, activeConversation, initialMessages }) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const router = useRouter();

  const employee = activeConversation.employees;
  const avatarColor = employee?.avatar_color ?? 'var(--accent-color)';
  const avatarInitials = employee?.avatar_initials ?? employee?.name?.split(' ').map(n => n[0]).join('') ?? '?';

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || sending) return;

    setInput('');
    setSending(true);

    const optimisticMsg = {
      id: `optimistic-${Date.now()}`,
      conversation_id: activeConversation.id,
      ceo_id: ceo.id,
      role: 'ceo',
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimisticMsg]);

    try {
      const res = await fetch('/api/employees/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: activeConversation.id, message: text }),
      });

      if (!res.ok) throw new Error('Request failed');
      const data = await res.json();

      setMessages(prev => {
        const withoutOptimistic = prev.filter(m => m.id !== optimisticMsg.id);
        return [
          ...withoutOptimistic,
          { ...optimisticMsg, id: `ceo-${Date.now()}` },
          {
            id: data.messageId ?? `emp-${Date.now()}`,
            conversation_id: activeConversation.id,
            ceo_id: ceo.id,
            role: 'employee',
            content: data.message,
            created_at: new Date().toISOString(),
          },
        ];
      });

      router.refresh();
    } catch {
      setMessages(prev => prev.filter(m => m.id !== optimisticMsg.id));
      setInput(text);
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 80px)', background: 'var(--bg-primary)' }}>
      {/* Thread List */}
      <div style={{ width: '300px', borderRight: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {conversations.map(conv => {
            const emp = conv.employees;
            const isActive = conv.id === activeConversation.id;
            const initials = emp?.avatar_initials ?? emp?.name?.split(' ').map(n => n[0]).join('') ?? '?';
            return (
              <Link
                key={conv.id}
                href={`/portal/dashboard/conversations/${conv.id}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem 1.5rem',
                  textDecoration: 'none', borderBottom: '1px solid var(--border-light)',
                  background: isActive ? 'rgba(59,130,246,0.1)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--accent-color)' : '3px solid transparent',
                }}
              >
                <Avatar initials={initials} color={emp?.avatar_color} size={36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: isActive ? 'bold' : '500', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {emp?.name ?? 'Unknown'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{formatTime(conv.updated_at)}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.2rem 2rem', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Avatar initials={avatarInitials} color={avatarColor} size={40} />
          <div>
            <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{employee?.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: employee?.status === 'active' ? '#10b981' : '#f59e0b' }} />
              {employee?.status === 'active' ? employee?.role : 'In training — available shortly'}
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.length === 0 && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              No messages yet.
            </div>
          )}

          {messages.map(msg => {
            const isCEO = msg.role === 'ceo';
            const isSystem = msg.role === 'system';
            if (isSystem) {
              return (
                <div key={msg.id} style={{ textAlign: 'center', margin: '0.5rem 0' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '0.3rem 1rem', borderRadius: '100px' }}>{msg.content}</span>
                </div>
              );
            }
            return (
              <div key={msg.id} style={{ display: 'flex', justifyContent: isCEO ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '70%', padding: '1rem 1.2rem', borderRadius: isCEO ? '1rem 1rem 0.2rem 1rem' : '1rem 1rem 1rem 0.2rem',
                  background: isCEO ? 'linear-gradient(135deg, var(--accent-color), var(--accent-secondary))' : 'var(--bg-secondary)',
                  border: isCEO ? 'none' : '1px solid var(--border-light)',
                  color: 'var(--text-primary)', fontSize: '1rem', lineHeight: '1.5', whiteSpace: 'pre-wrap',
                }}>
                  {msg.content}
                </div>
              </div>
            );
          })}

          {sending && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '1rem 1rem 1rem 0.2rem' }}>
                <TypingIndicator />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ padding: '1.2rem 2rem', borderTop: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${employee?.name ?? ''}…`}
              rows={1}
              style={{ flex: 1, padding: '1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', borderRadius: '0.5rem', outline: 'none', resize: 'none' }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || sending}
              className="btn btn-primary"
              style={{ padding: '1rem 1.5rem', background: input.trim() && !sending ? 'linear-gradient(135deg, var(--accent-color), var(--accent-secondary))' : 'var(--bg-secondary)', color: '#ffffff', border: 'none', borderRadius: '0.5rem', cursor: input.trim() && !sending ? 'pointer' : 'not-allowed', fontWeight: 'bold' }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
