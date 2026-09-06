const path=location.pathname.split('/').pop()||'index.html';document.head.insertAdjacentHTML('beforeend','<link rel="stylesheet" href="/src/inner.css"><link rel="stylesheet" href="/src/premium-pages.css"><link rel="stylesheet" href="/src/page-compositions.css"><link rel="stylesheet" href="/src/content-layout.css"><link rel="stylesheet" href="/src/rich-copy.css"><link rel="stylesheet" href="/src/audit-fixes.css"><style>.source-sections article:has(h3:empty){display:none}</style>');
const esc=s=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const md=s=>esc(s).replace(/^#{1,6}\s*/,'').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
const block=b=>b.trim().split(/\n\s*\n/).filter(p=>p.trim()!=='---').map(p=>{const l=p.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);return l.map(x=>/^\[.*\]$/.test(x)?`<a class="button gold panel-cta" href="/pricing.html">${md(x.slice(1,-1))} &rarr;</a>`:md(x)).join('<br>')}).join('');
const secs=(t,h)=>{const p=t.split(new RegExp(`^# ${h}\\s*$`,'m'))[1]||'';return p.split(/^# /m)[0].split(/^#{2,3} /m).filter(Boolean).map(x=>{const a=x.split(/\r?\n/);return{title:a.shift().trim(),body:a.join('\n')}})};const siteSecs=(t,h)=>{const p=t.split(new RegExp(`^# ${h}\\s*$`,'m'))[1]||'';return p.split(/^# /m)[0].split(/^## /m).filter(Boolean).map(x=>{const a=x.split(/\r?\n/);return{title:a.shift().trim(),body:a.join('\n')}})};
const nav=`<header><a class="logo" href="/index.html"><img src="/staffai-logo.png" alt="StaffAi"></a><nav><a href="/how-it-works.html">How It Works</a><a href="/employees.html">AI Employees</a><a href="/teams.html">Teams</a><a href="/pricing.html">Pricing</a><a href="/about.html">About</a><a href="/roadmap.html">Roadmap</a><a class="button gold mobile-menu-cta" href="/pricing.html">Establish Your Company Office ↗</a></nav><a class="button gold" href="https://app.getstaffai.com/portal/signup?billing=monthly">Establish Your Company Office &rarr;</a><button class="menu" aria-label="Toggle navigation" aria-expanded="false">&#9776;</button></header>`;
const foot=`<footer><div><img src="/staffai-logo.png" alt="StaffAi"><p>The AI staffing agency for businesses that would rather lead than operate software.</p><p>StaffAi is a service of Studio9 LLC.<br>1012 Marquez Place, Santa Fe, NM 87505, USA<br><a href="mailto:compliance@getstaffai.com">compliance@getstaffai.com</a></p></div><div><b>Explore</b><a href="/how-it-works.html">How It Works</a><a href="/employees.html">AI Employees</a><a href="/teams.html">Teams</a><a href="/pricing.html">Pricing</a><a href="/about.html">About</a><a href="/roadmap.html">Roadmap</a><a href="/faq.html">FAQ</a></div><div><b>Legal & Trust</b><a href="/terms.html">Terms of Service</a><a href="/privacy.html">Privacy Policy</a><a href="/acceptable-use.html">Acceptable Use</a><a href="/ai-disclosure.html">AI Disclosure</a><a href="/refund.html">Refund & Cancellation</a><a href="/cookies.html">Cookie Policy</a><a href="/security.html">Security</a><a href="/dpa.html">Data Processing Addendum</a><a href="/communications.html">Communications & Telephony</a></div></footer>`;
const shell=(t,l,c)=>`<div class="announcement">Company Office launch offer: professional setup fee waived</div>${nav}<main class="page-${path.replace('.html','')}"><section class="inner-hero dark"><div class="hero-orbit"></div><small class="kicker">StaffAi</small><h1>${md(t)}</h1><p>${md(l)}</p></section>${c}<section class="final dark section"><small class="kicker">The next move</small><h2>Stop managing software.<br><em>Start leading your company.</em></h2><a class="button gold" href="https://app.getstaffai.com/portal/signup?billing=monthly">Establish Your Company Office &rarr;</a></section></main>${foot}`;
const names=['EXECUTIVE ASSISTANT','GENERAL MANAGER','ADMINISTRATIVE ASSISTANT','BOOKKEEPER','LEAD GENERATION SPECIALIST','SALES REPRESENTATIVE','MARKETING MANAGER','MARKETING SPECIALIST','SOCIAL MEDIA MANAGER','CUSTOMER SERVICE REPRESENTATIVE','RECEPTIONIST'];
if(path==='employees.html')fetch('/copy/ai-employees.txt').then(r=>r.text()).then(t=>{const cards=names.map((n,i)=>{const s=secs(t,n),p=s.find(x=>/^Role Purpose/i.test(x.title));return `<article class="full-role"><div class="role-index">${String(i+1).padStart(2,'0')}</div><h2>${n.replace(/\b\w/g,c=>c.toUpperCase())}</h2><p class="role-summary">${md((p?.body||'Defined responsibility. Consistent execution.').trim().split(/\r?\n/)[0])}</p><div class="role-meta"><span>Complete supplied role profile</span><span>${n==='EXECUTIVE ASSISTANT'?'Mara + Kellan included':''}</span></div><details><summary>Read the complete role profile <span>ï¼‹</span></summary><div class="role-detail-full">${s.map(x=>`<section><h3>${md(x.title)}</h3>${block(x.body)}</section>`).join('')}</div></details></article>`}).join('');document.querySelector('#app').innerHTML=shell('AI Employees','Hire people. Not more software.',`<section class="inner-content"><div class="inner-head"><h2>Real roles.<br><em>Real responsibility.</em></h2><p>Every role below uses the complete supplied employee specification. Opening one profile closes the previous profile.</p></div><div class="role-stack">${cards}</div></section>`);document.querySelectorAll('details').forEach(d=>d.addEventListener('toggle',()=>{if(d.open)document.querySelectorAll('details').forEach(o=>{if(o!==d)o.open=false})}))});
else{const map={'faq.html':['Frequently Asked Questions','StaffAi, explained clearly.','FREQUENTLY ASKED QUESTIONS'],'how-it-works.html':['How StaffAi Works','You say what needs to happen. Your company gets to work.','HOW IT WORKS PAGE'],'teams.html':['Teams that work together','Build the workforce your company actually needs.','TEAMS PAGE'],'pricing.html':['Pricing for your Company Office','Start with the office every company needs.','PRICING PAGE'],'about.html':['About StaffAi','An AI staffing agency built around your company.','ABOUT PAGE']};const m=map[path]||['StaffAi','Your company. Fully staffed. Fully running.','ABOUT PAGE'];fetch('/copy/site-positioning.txt').then(r=>r.text()).then(t=>document.querySelector('#app').innerHTML=shell(m[0],m[1],`<section class="inner-content"><div class="source-sections">${secs(t,m[2]).map(x=>`<article><h3>${md(x.title)}</h3>${block(x.body)}</article>`).join('')}</div></section>`))}

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