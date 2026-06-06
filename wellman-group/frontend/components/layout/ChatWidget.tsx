'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';

const API = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/v1') + '/chat';

type Message = { role: 'user' | 'bot'; text: string };

const WELCOME: Message = {
  role: 'bot',
  text: "Hi! I'm Wellman's AI assistant. Ask me anything about our services, projects, or certifications.",
};

function BotIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <line x1="8" y1="16" x2="8" y2="16" strokeWidth="3" strokeLinecap="round" />
      <line x1="12" y1="16" x2="12" y2="16" strokeWidth="3" strokeLinecap="round" />
      <line x1="16" y1="16" x2="16" y2="16" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function ChatWidget() {
  const [open, setOpen]           = useState(false);
  const [messages, setMessages]   = useState<Message[]>([WELCOME]);
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setLoading(true);
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, session_id: sessionId }),
      });
      const data = await res.json();
      // Store session_id from first response so follow-ups use same context
      if (data.session_id && !sessionId) setSessionId(data.session_id);
      setMessages((prev) => [...prev, { role: 'bot', text: data.reply ?? 'No response received.' }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'bot', text: 'Sorry, I could not reach the server. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div
          className="fixed z-50 flex flex-col shadow-2xl"
          style={{
            bottom: '148px',
            right: '20px',
            width: '340px',
            maxHeight: '520px',
            borderRadius: '20px',
            background: '#fff',
            border: '1px solid rgba(26,58,107,0.12)',
            boxShadow: '0 20px 60px rgba(26,58,107,0.18), 0 4px 16px rgba(0,0,0,0.08)',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1A3A6B 0%, #2060B0 100%)',
              borderRadius: '20px 20px 0 0',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', flexShrink: 0,
              }}
            >
              <BotIcon size={18} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>Wellman Assistant</p>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11 }}>Ask about our services</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                color: 'rgba(255,255,255,0.7)', background: 'none', border: 'none',
                cursor: 'pointer', padding: 4, borderRadius: 6,
                display: 'flex', alignItems: 'center',
              }}
            >
              <CloseIcon />
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1, overflowY: 'auto',
              padding: '14px 14px 8px',
              display: 'flex', flexDirection: 'column', gap: 10,
              minHeight: 0, maxHeight: 350,
            }}
          >
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div
                  style={{
                    maxWidth: '82%',
                    padding: '9px 13px',
                    borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: msg.role === 'user'
                      ? 'linear-gradient(135deg, #1A3A6B 0%, #2060B0 100%)'
                      : '#F0F4FA',
                    color: msg.role === 'user' ? '#fff' : '#1A3A6B',
                    fontSize: 13, lineHeight: 1.55, wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div
                  style={{
                    padding: '9px 14px', background: '#F0F4FA',
                    borderRadius: '16px 16px 16px 4px',
                    display: 'flex', gap: 4, alignItems: 'center',
                  }}
                >
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: '#3A8FD4', display: 'inline-block',
                        animation: 'chatBounce 1.2s ease-in-out infinite',
                        animationDelay: `${d * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: '10px 12px 14px',
              borderTop: '1px solid rgba(26,58,107,0.08)',
              display: 'flex', gap: 8, alignItems: 'flex-end',
            }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type a message…"
              rows={1}
              style={{
                flex: 1, resize: 'none',
                border: '1.5px solid rgba(26,58,107,0.18)',
                borderRadius: 12, padding: '9px 12px',
                fontSize: 13, lineHeight: 1.4, outline: 'none',
                fontFamily: 'inherit', color: '#1A3A6B',
                background: '#F8FAFC', maxHeight: 80, overflowY: 'auto',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#2060B0'; }}
              onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(26,58,107,0.18)'; }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              style={{
                width: 38, height: 38, borderRadius: 12,
                background: input.trim() && !loading
                  ? 'linear-gradient(135deg, #1A3A6B 0%, #2060B0 100%)'
                  : 'rgba(26,58,107,0.12)',
                border: 'none',
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                color: input.trim() && !loading ? '#fff' : 'rgba(26,58,107,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'all 0.2s',
              }}
            >
              <SendIcon />
            </button>
          </div>
        </div>
      )}

      {/* Floating trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed z-50"
        style={{
          bottom: '88px', right: '20px',
          width: 52, height: 52, borderRadius: '50%',
          background: open
            ? 'linear-gradient(135deg, #2060B0 0%, #3A8FD4 100%)'
            : 'linear-gradient(135deg, #1A3A6B 0%, #2060B0 100%)',
          border: 'none', cursor: 'pointer', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(26,58,107,0.4)',
          transition: 'all 0.2s',
          transform: open ? 'scale(1.05)' : 'scale(1)',
        }}
        title="Ask our AI assistant"
      >
        {open ? <CloseIcon /> : <BotIcon size={22} />}
      </button>

      <style>{`
        @keyframes chatBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </>
  );
}
