const names = {
  'terms.html': 'Terms of Service', 'privacy.html': 'Privacy Policy',
  'acceptable-use.html': 'Acceptable Use Policy', 'ai-disclosure.html': 'AI Disclosure',
  'refund.html': 'Refund & Cancellation Policy', 'cookies.html': 'Cookie Policy',
  'security.html': 'Security', 'dpa.html': 'Data Processing Addendum',
  'communications.html': 'Communications & Telephony Policy'
};
let path = location.pathname.split('/').pop() || 'index.html';
if (path && !path.endsWith('.html') && !path.includes('.')) path += '.html';
const title = names[path] || 'Legal & Trust';
const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const footer = `<footer><div><img src="/staffai-logo.png" alt="StaffAi"><p>The AI staffing agency for businesses that would rather lead than operate software.</p><p>StaffAi is a service of Studio9 LLC.<br>1012 Marquez Place, Santa Fe, NM 87505, USA<br><a href="mailto:compliance@getstaffai.com">compliance@getstaffai.com</a></p></div><div><b>Explore</b><a href="/how-it-works.html">How It Works</a><a href="/employees.html">AI Employees</a><a href="/teams.html">Teams</a><a href="/pricing.html">Pricing</a><a href="/about.html">About</a><a href="/roadmap.html">Roadmap</a><a href="/faq.html">FAQ</a></div><div><b>Legal & Trust</b><a href="/terms.html">Terms of Service</a><a href="/privacy.html">Privacy Policy</a><a href="/acceptable-use.html">Acceptable Use Policy</a><a href="/ai-disclosure.html">AI Disclosure</a><a href="/refund.html">Refund & Cancellation Policy</a><a href="/cookies.html">Cookie Policy</a><a href="/security.html">Security</a><a href="/dpa.html">Data Processing Addendum</a><a href="/communications.html">Communications & Telephony Policy</a></div></footer>`;
fetch('/copy/legal-compliance.txt').then(r => r.text()).then(t => {
  document.querySelector('#app').innerHTML = `<div class="announcement">StaffAi &middot; A service of Studio9 LLC</div><header><a class="logo" href="/index.html"><img src="/staffai-logo.png" alt="StaffAi"></a><nav><a href="/how-it-works.html">How It Works</a><a href="/employees.html">AI Employees</a><a href="/teams.html">Teams</a><a href="/pricing.html">Pricing</a><a href="/about.html">About</a><a href="/roadmap.html">Roadmap</a><a class="button gold mobile-menu-cta" href="/pricing.html">Establish Your Company Office ↗</a></nav><a class="button gold" href="https://app.getstaffai.com/portal/signup?billing=monthly">Establish Your Company Office &rarr;</a><button class="menu" aria-label="Toggle navigation" aria-expanded="false">&#9776;</button></header><main><section class="inner-hero dark"><small class="kicker">StaffAi &middot; Legal & Trust</small><h1>${title}</h1><p>Clear terms, responsibilities and safeguards for using StaffAi.</p></section><section class="legal-content"><div class="source-document"><p>${esc(t).replace(/\r?\n/g, '<br>')}</p></div></section></main>${footer}`;
});

// Mobile Navigation Toggle Logic
document.addEventListener('click', (e) => {
  const menuBtn = e.target.closest('.menu');
  const header = document.querySelector('header');
  if (!header) return;

  if (menuBtn) {
    e.preventDefault();
    e.stopPropagation();
    const isOpen = header.classList.toggle('menu-open');
    menuBtn.innerHTML = isOpen ? '&#10005;' : '&#9776;';
    menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    return;
  }

  if (e.target.closest('header.menu-open nav a')) {
    header.classList.remove('menu-open');
    const btn = header.querySelector('.menu');
    if (btn) btn.innerHTML = '&#9776;';
    return;
  }

  if (header.classList.contains('menu-open') && !e.target.closest('header')) {
    header.classList.remove('menu-open');
    const btn = header.querySelector('.menu');
    if (btn) btn.innerHTML = '&#9776;';
  }
});