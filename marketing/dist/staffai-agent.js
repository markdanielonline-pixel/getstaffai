/*
 * Staff AI — public AI Sales Agent, marketing-site build.
 *
 * The product application at app.getstaffai.com mounts this agent as a React
 * component in its root layout. This site is a separate static Vercel project,
 * so it needs a dependency-free build of the same widget. Behaviour, copy and
 * the API contract are deliberately identical to components/AIChatWidget.js in
 * the getstaffai repository; if one changes, change both.
 *
 * It talks to https://app.getstaffai.com/api/chat, which allows exactly this
 * origin and www. It sends no cookies and reads no storage.
 */
(function () {
  'use strict';

  if (window.__staffaiAgentLoaded) return;
  window.__staffaiAgentLoaded = true;

  var ENDPOINT = 'https://app.getstaffai.com/api/chat';
  var SIGNUP = 'https://app.getstaffai.com/portal/signup';

  var state = {
    open: false,
    phase: 'form',
    name: '',
    email: '',
    messages: [],
    loading: false,
    error: null,
  };

  var el = {};

  function css() {
    var style = document.createElement('style');
    style.textContent = [
      '.sai-root{position:fixed;bottom:1.5rem;right:1.5rem;z-index:2147483000;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}',
      '.sai-toggle{width:58px;height:58px;border-radius:50%;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;border:none;box-shadow:0 8px 28px rgba(37,99,235,.55);cursor:pointer;display:flex;align-items:center;justify-content:center;animation:saiPulse 2.5s ease-in-out infinite}',
      '.sai-panel{width:360px;max-width:calc(100vw - 2rem);border-radius:18px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,.55);border:1px solid rgba(255,255,255,.07);background:#0d0d14;animation:saiUp .25s ease-out;display:flex;flex-direction:column}',
      '.sai-panel.sai-chat{height:560px;max-height:calc(100vh - 3rem)}',
      '.sai-head{padding:.9rem 1.1rem;background:#13131e;border-bottom:1px solid rgba(255,255,255,.06);display:flex;justify-content:space-between;align-items:center;flex-shrink:0}',
      '.sai-id{display:flex;align-items:center;gap:.65rem}',
      '.sai-av{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#2563eb,#7c3aed);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:.95rem;color:#fff;position:relative}',
      '.sai-dot{position:absolute;bottom:1px;right:1px;width:10px;height:10px;border-radius:50%;background:#10b981;border:2px solid #13131e}',
      '.sai-name{font-weight:700;font-size:.92rem;color:#f9fafb}',
      '.sai-status{font-size:.7rem;color:#10b981;margin-top:1px}',
      '.sai-x{background:rgba(255,255,255,.07);border:none;color:#9ca3af;cursor:pointer;width:28px;height:28px;border-radius:50%;font-size:1.1rem;line-height:1}',
      '.sai-form{padding:1.5rem;background:#0d0d14}',
      '.sai-form p{color:#9ca3af;font-size:.85rem;margin:0 0 1.25rem;line-height:1.5}',
      '.sai-form form{display:flex;flex-direction:column;gap:.75rem}',
      '.sai-input{padding:.75rem 1rem;background:#1c1c2a;border:1px solid rgba(255,255,255,.12);border-radius:10px;color:#f9fafb;font-size:.9rem;outline:none;width:100%;box-sizing:border-box;font-family:inherit}',
      '.sai-go{padding:.8rem;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;border:none;border-radius:10px;font-weight:700;font-size:.95rem;cursor:pointer;margin-top:.25rem;font-family:inherit}',
      '.sai-go:disabled{opacity:.45;cursor:not-allowed}',
      '.sai-fine{text-align:center;font-size:.7rem;color:#4b5563;margin:1rem 0 0}',
      '.sai-log{flex:1;padding:1rem .9rem;overflow-y:auto;display:flex;flex-direction:column;gap:.65rem;background:#0d0d14}',
      '.sai-row{max-width:85%}',
      '.sai-row.user{align-self:flex-end}',
      '.sai-row.assistant{align-self:flex-start}',
      '.sai-who{font-size:.68rem;color:#6b7280;margin-bottom:3px;padding-left:3px}',
      '.sai-bub{padding:.65rem .95rem;font-size:.88rem;line-height:1.55;white-space:pre-wrap;word-break:break-word;color:#f9fafb}',
      '.sai-row.user .sai-bub{background:linear-gradient(135deg,#2563eb,#1d4ed8);border-radius:16px 16px 3px 16px}',
      '.sai-row.assistant .sai-bub{background:#1c1c2a;border:1px solid rgba(255,255,255,.06);border-radius:16px 16px 16px 3px}',
      '.sai-err{background:#3b1a1a;border:1px solid rgba(239,68,68,.3);color:#fca5a5;padding:.65rem .95rem;border-radius:12px;font-size:.85rem;align-self:flex-start;max-width:85%}',
      '.sai-type{display:flex;gap:5px;align-items:center;background:#1c1c2a;border:1px solid rgba(255,255,255,.06);padding:.65rem .9rem;border-radius:16px 16px 16px 3px}',
      '.sai-type span{width:7px;height:7px;border-radius:50%;background:#6b7280;display:inline-block;animation:saiBounce 1.2s infinite}',
      '.sai-type span:nth-child(2){animation-delay:.2s}.sai-type span:nth-child(3){animation-delay:.4s}',
      '.sai-bar{padding:.8rem .9rem;background:#13131e;border-top:1px solid rgba(255,255,255,.06);display:flex;gap:.5rem;align-items:center;flex-shrink:0}',
      '.sai-msg{flex:1;padding:.65rem 1rem;background:#252535;border:1px solid rgba(255,255,255,.1);border-radius:24px;color:#f9fafb;font-size:.875rem;outline:none;font-family:inherit}',
      '.sai-send{background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;border:none;border-radius:50%;width:38px;height:38px;flex-shrink:0;display:flex;align-items:center;justify-content:center;cursor:pointer}',
      '.sai-send:disabled{opacity:.45;cursor:not-allowed}',
      '.sai-foot{text-align:center;padding:.35rem;background:#13131e;border-top:1px solid rgba(255,255,255,.04);font-size:.62rem;color:#374151}',
      '@keyframes saiUp{from{opacity:0;transform:translateY(16px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}',
      '@keyframes saiPulse{0%,100%{box-shadow:0 8px 28px rgba(37,99,235,.55)}50%{box-shadow:0 8px 40px rgba(37,99,235,.85)}}',
      '@keyframes saiBounce{0%,60%,100%{opacity:.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-4px)}}',
      '@media (max-width:480px){.sai-root{bottom:1rem;right:1rem;left:1rem}.sai-panel{width:auto}}',
    ].join('');
    document.head.appendChild(style);
  }

  function h(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function renderToggle() {
    var b = h('button', 'sai-toggle');
    b.setAttribute('aria-label', 'Chat with StaffAI');
    b.innerHTML = '<svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
    b.addEventListener('click', function () { state.open = true; render(); });
    return b;
  }

  function renderHead() {
    var head = h('div', 'sai-head');
    var id = h('div', 'sai-id');
    var av = h('div', 'sai-av', 'S');
    av.appendChild(h('div', 'sai-dot'));
    var meta = h('div');
    meta.appendChild(h('div', 'sai-name', 'StaffAI'));
    meta.appendChild(h('div', 'sai-status', 'Online · Replies instantly'));
    id.appendChild(av);
    id.appendChild(meta);
    var x = h('button', 'sai-x', '×');
    x.setAttribute('aria-label', 'Close chat');
    x.addEventListener('click', function () { state.open = false; render(); });
    head.appendChild(id);
    head.appendChild(x);
    return head;
  }

  function renderForm() {
    var wrap = h('div', 'sai-form');
    wrap.appendChild(h('p', null, 'Before we start, who are we speaking with?'));
    var form = document.createElement('form');

    var name = h('input', 'sai-input');
    name.type = 'text'; name.placeholder = 'Your first name'; name.required = true; name.autofocus = true;
    var email = h('input', 'sai-input');
    email.type = 'email'; email.placeholder = 'Your email address'; email.required = true;
    var go = h('button', 'sai-go', 'Start Conversation →');
    go.type = 'submit';

    form.appendChild(name);
    form.appendChild(email);
    form.appendChild(go);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!name.value.trim() || !email.value.trim()) return;
      state.name = name.value.trim();
      state.email = email.value.trim();
      state.phase = 'chat';
      var opener = 'Hi, my name is ' + state.name + ' and my email is ' + state.email + '.';
      state.messages = [{ role: 'user', content: opener, hidden: true }];
      render();
      send([{ role: 'user', content: opener }]);
    });

    wrap.appendChild(form);
    wrap.appendChild(h('p', 'sai-fine', 'Your info is kept private. No spam.'));
    return wrap;
  }

  function renderChat() {
    var log = h('div', 'sai-log');
    state.messages.forEach(function (m) {
      if (m.hidden) return;
      var row = h('div', 'sai-row ' + m.role);
      if (m.role === 'assistant') row.appendChild(h('div', 'sai-who', 'StaffAI'));
      row.appendChild(h('div', 'sai-bub', m.content));
      log.appendChild(row);
    });
    if (state.error) log.appendChild(h('div', 'sai-err', state.error));
    if (state.loading) {
      var t = h('div', 'sai-row assistant');
      t.appendChild(h('div', 'sai-who', 'StaffAI'));
      var dots = h('div', 'sai-type');
      dots.appendChild(h('span')); dots.appendChild(h('span')); dots.appendChild(h('span'));
      t.appendChild(dots);
      log.appendChild(t);
    }

    var bar = h('div', 'sai-bar');
    var input = h('input', 'sai-msg');
    input.type = 'text'; input.placeholder = 'Send a message...'; input.disabled = state.loading;
    var btn = h('button', 'sai-send');
    btn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
    btn.disabled = state.loading;

    function submit() {
      var text = input.value.trim();
      if (!text || state.loading) return;
      input.value = '';
      state.messages.push({ role: 'user', content: text });
      render();
      send(state.messages.filter(function (m) { return !m.hidden; })
        .map(function (m) { return { role: m.role, content: m.content }; }));
    }
    btn.addEventListener('click', submit);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
    });

    bar.appendChild(input);
    bar.appendChild(btn);

    var frag = document.createDocumentFragment();
    frag.appendChild(log);
    frag.appendChild(bar);
    el.log = log;
    el.input = input;
    return frag;
  }

  function render() {
    el.root.innerHTML = '';
    if (!state.open) {
      el.root.appendChild(renderToggle());
      return;
    }
    var panel = h('div', 'sai-panel' + (state.phase === 'chat' ? ' sai-chat' : ''));
    panel.appendChild(renderHead());
    panel.appendChild(state.phase === 'form' ? renderForm() : renderChat());
    panel.appendChild(h('div', 'sai-foot', 'Powered by StaffAI · getstaffai.com'));
    el.root.appendChild(panel);
    if (el.log) el.log.scrollTop = el.log.scrollHeight;
    if (el.input && !state.loading) el.input.focus();
  }

  function send(history) {
    state.loading = true;
    state.error = null;
    render();

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: history,
        agentType: 'lead_gen',
        leadName: state.name,
        leadEmail: state.email,
      }),
    })
      .then(function (res) {
        return res.json().then(function (data) {
          if (!res.ok) throw new Error(data.error || 'Server error ' + res.status);
          return data;
        });
      })
      .then(function (data) {
        state.messages.push({ role: 'assistant', content: data.text || data.content || '' });
      })
      .catch(function (err) {
        // Never show the visitor a transport or provider error. Give them a
        // way forward instead.
        if (window.console && console.error) console.error('[StaffAI]', err);
        state.error = 'I could not reach my systems just then. Try again, or start directly at ' + SIGNUP;
      })
      .then(function () {
        state.loading = false;
        render();
      });
  }

  function mount() {
    css();
    el.root = h('div', 'sai-root');
    document.body.appendChild(el.root);
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
