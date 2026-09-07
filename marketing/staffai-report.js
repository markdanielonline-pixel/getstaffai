/*
 * Staff AI — "Something wrong?" reporter.
 *
 * A deliberate piece of positioning as much as a support channel. Staff AI is
 * early, and a customer who can tell us something is broken in ten seconds is a
 * customer who is helping rather than one drafting a review. The copy says that
 * plainly and promises nothing it cannot keep: a person will see it, and no
 * date is offered.
 *
 * Sits bottom-left, because the sales agent already owns bottom-right and two
 * competing bubbles in one corner is how you get neither used.
 */
(function () {
  'use strict';

  if (window.__staffaiReportLoaded) return;
  window.__staffaiReportLoaded = true;

  var ENDPOINT = (window.__staffaiReportEndpoint) || 'https://app.getstaffai.com/api/report';

  var state = { open: false, sending: false, done: null, error: null, reference: null };
  var el = {};

  function css() {
    var s = document.createElement('style');
    s.textContent = [
      '.sar-root{position:fixed;bottom:1.5rem;left:1.5rem;z-index:2147482900;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}',
      '.sar-open{display:flex;align-items:center;gap:.5rem;background:#fff;color:#e11d48;border:1px solid rgba(225,29,72,.28);border-radius:10px;padding:.6rem .95rem;font-size:.86rem;font-weight:600;cursor:pointer;box-shadow:0 6px 20px rgba(15,23,42,.12);font-family:inherit}',
      '.sar-open:hover{background:#fff5f6}',
      '.sar-panel{width:340px;max-width:calc(100vw - 2rem);background:#fff;border:1px solid rgba(15,23,42,.1);border-radius:14px;box-shadow:0 24px 60px rgba(15,23,42,.22);overflow:hidden;animation:sarUp .2s ease-out}',
      '.sar-head{padding:.9rem 1.05rem;border-bottom:1px solid rgba(15,23,42,.08);display:flex;justify-content:space-between;align-items:flex-start;gap:.5rem}',
      '.sar-title{font-weight:700;font-size:.95rem;color:#0f172a;margin:0}',
      '.sar-sub{font-size:.78rem;color:#64748b;margin:.25rem 0 0;line-height:1.45}',
      '.sar-x{background:none;border:none;color:#94a3b8;font-size:1.25rem;line-height:1;cursor:pointer;padding:0 .15rem}',
      '.sar-body{padding:1.05rem}',
      '.sar-label{display:block;font-size:.75rem;color:#475569;margin-bottom:.3rem;font-weight:600}',
      '.sar-input,.sar-text{width:100%;box-sizing:border-box;border:1px solid rgba(15,23,42,.16);border-radius:9px;padding:.6rem .7rem;font-size:.87rem;font-family:inherit;color:#0f172a;outline:none;background:#fff}',
      '.sar-input:focus,.sar-text:focus{border-color:#e11d48}',
      '.sar-text{min-height:96px;resize:vertical;margin-bottom:.7rem}',
      '.sar-hint{font-size:.72rem;color:#94a3b8;margin:.35rem 0 .9rem}',
      '.sar-send{width:100%;background:#e11d48;color:#fff;border:none;border-radius:9px;padding:.7rem;font-size:.9rem;font-weight:700;cursor:pointer;font-family:inherit}',
      '.sar-send:disabled{opacity:.55;cursor:default}',
      '.sar-err{background:#fef2f2;border:1px solid rgba(225,29,72,.25);color:#9f1239;padding:.55rem .7rem;border-radius:8px;font-size:.8rem;margin-bottom:.7rem}',
      '.sar-ok{padding:1.4rem 1.15rem;text-align:center}',
      '.sar-tick{width:42px;height:42px;border-radius:50%;background:#dcfce7;color:#15803d;display:flex;align-items:center;justify-content:center;margin:0 auto .7rem;font-size:1.3rem}',
      '.sar-ok h4{margin:0 0 .4rem;font-size:1rem;color:#0f172a}',
      '.sar-ok p{margin:0 0 .5rem;font-size:.82rem;color:#475569;line-height:1.5}',
      '.sar-ref{display:inline-block;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.78rem;background:#f1f5f9;color:#0f172a;padding:.25rem .5rem;border-radius:6px}',
      '.sar-foot{padding:.55rem;text-align:center;font-size:.68rem;color:#94a3b8;border-top:1px solid rgba(15,23,42,.06)}',
      '@keyframes sarUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}',
      '@media (max-width:520px){.sar-root{left:1rem;right:1rem;bottom:1rem}.sar-panel{width:auto}}',
    ].join('');
    document.head.appendChild(s);
  }

  function h(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function renderButton() {
    var b = h('button', 'sar-open');
    b.innerHTML = '<span aria-hidden="true">🐞</span><span>Report a problem</span>';
    b.setAttribute('aria-label', 'Report a problem');
    b.addEventListener('click', function () { state.open = true; render(); });
    return b;
  }

  function renderHead() {
    var head = h('div', 'sar-head');
    var left = h('div');
    left.appendChild(h('p', 'sar-title', 'Found something wrong?'));
    left.appendChild(h('p', 'sar-sub', 'We are early, and the people who tell us what is broken are the reason this gets better. Takes ten seconds.'));
    var x = h('button', 'sar-x', '×');
    x.setAttribute('aria-label', 'Close');
    x.addEventListener('click', function () { state.open = false; state.done = null; state.error = null; render(); });
    head.appendChild(left);
    head.appendChild(x);
    return head;
  }

  function renderForm() {
    var body = h('div', 'sar-body');
    if (state.error) body.appendChild(h('div', 'sar-err', state.error));

    body.appendChild(h('label', 'sar-label', 'What happened?'));
    var text = h('textarea', 'sar-text');
    text.placeholder = 'What you were doing, and what went wrong.';
    text.maxLength = 4000;

    body.appendChild(text);

    body.appendChild(h('label', 'sar-label', 'Your email (optional)'));
    var email = h('input', 'sar-input');
    email.type = 'email';
    email.placeholder = 'you@company.com';
    body.appendChild(email);
    body.appendChild(h('p', 'sar-hint', 'Only so we can thank you. We will not add you to anything.'));

    var send = h('button', 'sar-send', state.sending ? 'Sending…' : 'Send report');
    send.disabled = state.sending;
    send.addEventListener('click', function () {
      var message = text.value.trim();
      if (!message) { state.error = 'Tell us what went wrong first.'; render(); return; }
      submit(message, email.value.trim());
    });
    body.appendChild(send);
    el.focusTarget = text;
    return body;
  }

  function renderDone() {
    var ok = h('div', 'sar-ok');
    ok.appendChild(h('div', 'sar-tick', '✓'));
    ok.appendChild(h('h4', null, 'Got it. Thank you.'));
    ok.appendChild(h('p', null, state.done.acknowledged
      ? 'Your report is with the team and with the system that watches the product. We will send you a note shortly.'
      : 'Your report is with the team and with the system that watches the product.'));
    if (state.done.reference) {
      var ref = h('p', null, '');
      ref.appendChild(h('span', 'sar-ref', state.done.reference));
      ok.appendChild(ref);
    }
    return ok;
  }

  function render() {
    el.root.innerHTML = '';
    if (!state.open) { el.root.appendChild(renderButton()); return; }
    var panel = h('div', 'sar-panel');
    panel.appendChild(renderHead());
    panel.appendChild(state.done ? renderDone() : renderForm());
    panel.appendChild(h('div', 'sar-foot', 'Part of how Staff AI is built. Thank you for helping.'));
    el.root.appendChild(panel);
    if (el.focusTarget && !state.done) el.focusTarget.focus();
  }

  function submit(message, email) {
    state.sending = true;
    state.error = null;
    render();

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: message, email: email, pageUrl: location.href }),
    })
      .then(function (res) {
        return res.json().then(function (data) {
          if (!res.ok) throw new Error(data.error || 'That did not send.');
          return data;
        });
      })
      .then(function (data) { state.done = data; })
      .catch(function (err) { state.error = err.message || 'That did not send. Please try again.'; })
      .then(function () { state.sending = false; render(); });
  }

  function mount() {
    css();
    el.root = h('div', 'sar-root');
    document.body.appendChild(el.root);
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
