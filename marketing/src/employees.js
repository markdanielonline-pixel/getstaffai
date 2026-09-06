// Dedicated renderer for /employees (AI Employees page)

const nav = `<div class="announcement">Company Office launch offer: professional setup fee waived <a href="/pricing.html">Learn more &rarr;</a></div>
<header>
  <a class="logo" href="/index.html"><img src="/staffai-logo.png" alt="StaffAi"></a>
  <nav>
    <a href="/how-it-works.html">How It Works</a>
    <a href="/employees.html" class="active">AI Employees</a>
    <a href="/teams.html">Teams</a>
    <a href="/pricing.html">Pricing</a>
    <a href="/about.html">About</a><a href="/roadmap.html">Roadmap</a>
  <a class="button gold mobile-menu-cta" href="/pricing.html">Establish Your Company Office ↗</a></nav>
  <a class="button gold" href="https://app.getstaffai.com/portal/signup?billing=monthly">Establish Your Company Office &rarr;</a>
</header>`;

const foot = `<footer>
  <div>
    <img src="/staffai-logo.png" alt="StaffAi">
    <p>The AI staffing agency for businesses that would rather lead than operate software.</p>
    <p>StaffAi is a service of Studio9 LLC.<br>1012 Marquez Place, Santa Fe, NM 87505, USA<br><a href="mailto:compliance@getstaffai.com">compliance@getstaffai.com</a></p>
  </div>
  <div>
    <b>Explore</b>
    <a href="/how-it-works.html">How It Works</a>
    <a href="/employees.html">AI Employees</a>
    <a href="/teams.html">Teams</a>
    <a href="/pricing.html">Pricing</a>
    <a href="/about.html">About</a><a href="/roadmap.html">Roadmap</a>
    <a href="/faq.html">FAQ</a>
  </div>
  <div>
    <b>Legal & Trust</b>
    <a href="/terms.html">Terms of Service</a>
    <a href="/privacy.html">Privacy Policy</a>
    <a href="/acceptable-use.html">Acceptable Use</a>
    <a href="/ai-disclosure.html">AI Disclosure</a>
    <a href="/refund.html">Refund & Cancellation</a>
    <a href="/cookies.html">Cookie Policy</a>
    <a href="/security.html">Security</a>
    <a href="/dpa.html">Data Processing Addendum</a>
    <a href="/communications.html">Communications & Telephony</a>
  </div>
</footer>`;

const content = `
<main class="page-employees-v2">

  <!-- HERO SECTION -->
  <section class="emp-hero">
    <div class="emp-hero-inner">
      <small class="kicker">Meet Your Staff</small>
      <h1>Real roles. Real responsibilities.<br><em>One company working for you.</em></h1>
      <p class="emp-hero-lead">StaffAi isn't another collection of AI tools. You build an actual staff.</p>
      <div class="emp-hero-manifesto">
        <p>Your Executive Assistant becomes your primary point of contact. Behind your EA, your General Manager and specialized AI employees handle the everyday work of sales, marketing, customer service, administration, bookkeeping and more.</p>
        <div class="emp-hero-punchline">You run the company. Your staff does the work.</div>
      </div>
    </div>
  </section>

  <!-- DEPARTMENT 1: COMPANY OFFICE -->
  <section class="emp-dept dept-office">
    <div class="dept-intro">
      <span class="dept-badge">DEPARTMENT 01</span>
      <h2>Your Company Office</h2>
      <p>Every StaffAi company begins with its own Company Office, including your Executive Assistant and General Manager.</p>
    </div>

    <div class="office-grid">
      <!-- Mara Card -->
      <article class="office-card-feature">
        <div class="card-top">
          <span class="card-role-tag">Executive Assistant</span>
          <span class="included-tag">Included with Company Office</span>
        </div>
        <h3>Mara</h3>
        <p class="card-headline">Your company, one conversation away.</p>
        <p class="card-desc">Mara is your primary connection to your StaffAi workforce. Talk to her from your phone just as you would a trusted executive assistant. Ask questions. Give instructions. Follow up on work. Delegate something to another department. Check what's happening across the company.</p>
        <p class="card-note">Mara coordinates the right people behind the scenes so you don't have to jump between software, dashboards and AI tools.</p>
        
        <div class="capabilities-block">
          <strong>Mara can help you:</strong>
          <ul class="task-pills">
            <li>Delegate work across your company</li>
            <li>Coordinate your AI employees</li>
            <li>Follow up on assignments</li>
            <li>Keep priorities moving</li>
            <li>Surface decisions that require your approval</li>
            <li>Retrieve company information</li>
            <li>Communicate instructions across departments</li>
            <li>Keep you informed without making you manage every detail</li>
          </ul>
        </div>
      </article>

      <!-- Kellan Card -->
      <article class="office-card-compact">
        <div class="card-top">
          <span class="card-role-tag">Executive Assistant</span>
          <span class="included-tag">Included with Company Office</span>
        </div>
        <h3>Kellan</h3>
        <p class="card-headline">The same powerful Executive Assistant, with a male voice and presence.</p>
        <p class="card-desc">Kellan performs the same Executive Assistant role as Mara. You simply choose the EA you'd prefer to work with.</p>
        <p class="card-desc">Talk naturally from your phone, delegate work and let Kellan coordinate your StaffAi workforce behind the scenes.</p>
        <div class="card-accent-pill">Same role. Same capabilities. Your choice of Executive Assistant.</div>
      </article>

      <!-- General Manager Card -->
      <article class="office-card-feature gm-card">
        <div class="card-top">
          <span class="card-role-tag">Operations Leadership</span>
          <span class="included-tag">Included with Company Office</span>
        </div>
        <h3>General Manager</h3>
        <p class="card-headline">The person making sure the company actually gets things done.</p>
        <p class="card-desc">Your General Manager works behind the scenes to coordinate operations and keep your AI workforce aligned with your priorities. While your Executive Assistant is your primary point of contact, your GM helps translate your direction into execution across the organization.</p>
        
        <div class="capabilities-block">
          <strong>Your General Manager can:</strong>
          <ul class="task-pills">
            <li>Coordinate employees and departments</li>
            <li>Assign and follow up on work</li>
            <li>Track priorities and outcomes</li>
            <li>Keep employees aligned with company goals</li>
            <li>Escalate decisions requiring CEO approval</li>
            <li>Help maintain operating standards</li>
            <li>Coordinate work across sales, marketing, service and administration</li>
          </ul>
        </div>
      </article>
    </div>
  </section>

  <!-- BUILD YOUR TEAM SECTION HEADER -->
  <section class="build-team-break">
    <div class="break-content">
      <small class="kicker">Specialized Workforce</small>
      <h2>Build Your Team</h2>
      <p>Add the specialized employees your company needs. Each employee joins the same organization, understands your company context and works within the permissions and approval rules you establish.</p>
    </div>
  </section>

  <!-- DEPARTMENT 2: SALES -->
  <section class="emp-dept dept-sales">
    <div class="dept-intro">
      <span class="dept-badge">DEPARTMENT 02</span>
      <h2>Sales Department</h2>
      <p>From finding qualified targets to closing deals and re-engaging stalled opportunities.</p>
    </div>

    <div class="employees-grid two-col">
      <!-- Lead Generation Specialist -->
      <article class="emp-card">
        <div class="emp-card-header">
          <div>
            <span class="emp-dept-label">Sales</span>
            <h3>Lead Generation Specialist</h3>
          </div>
          <div class="emp-price">$149<span>/month</span></div>
        </div>
        <p class="emp-subtitle">Keep your sales pipeline supplied with people worth talking to.</p>
        <p class="emp-summary">Your Lead Generation Specialist researches, identifies, qualifies and organizes potential customers based on your ideal customer profile.</p>
        
        <div class="emp-tasks">
          <strong>Put them to work on:</strong>
          <ul>
            <li>Prospect research</li>
            <li>Lead sourcing</li>
            <li>ICP-based qualification</li>
            <li>Contact discovery</li>
            <li>Prospect list building</li>
            <li>Lead enrichment</li>
            <li>Segmentation</li>
            <li>Preparing qualified prospects for outreach</li>
            <li>Keeping prospect data organized and current</li>
          </ul>
        </div>
        <div class="emp-footer-note">Your salesperson shouldn't spend the day searching for people to sell to.</div>
      </article>

      <!-- Sales Representative -->
      <article class="emp-card">
        <div class="emp-card-header">
          <div>
            <span class="emp-dept-label">Sales</span>
            <h3>Sales Representative</h3>
          </div>
          <div class="emp-price">$249<span>/month</span></div>
        </div>
        <p class="emp-subtitle">Turn qualified opportunities into conversations and customers.</p>
        <p class="emp-summary">Your Sales Representative handles the everyday work required to move prospects through your sales process.</p>
        
        <div class="emp-tasks">
          <strong>Put them to work on:</strong>
          <ul>
            <li>Personalized outreach</li>
            <li>Follow-up</li>
            <li>Lead nurturing</li>
            <li>Sales conversations</li>
            <li>Qualification</li>
            <li>Objection handling</li>
            <li>Pipeline management</li>
            <li>CRM updates</li>
            <li>Re-engaging stalled opportunities</li>
            <li>Moving prospects toward the next step</li>
          </ul>
        </div>
        <div class="emp-footer-note">Pair with your Lead Generation Specialist for a complete Sales Team.</div>
      </article>
    </div>

    <!-- Sales Team Bundle -->
    <div class="team-bundle-banner">
      <div class="bundle-left">
        <span class="bundle-badge">COORDINATED DEPARTMENT BUNDLE</span>
        <h3>Sales Team</h3>
        <p class="bundle-sub">Prospecting and selling, working together.</p>
        <p class="bundle-desc">Get your Lead Generation Specialist + Sales Representative as one coordinated sales operation. One finds and qualifies the opportunities. The other works those opportunities through your sales process.</p>
      </div>
      <div class="bundle-right">
        <div class="bundle-price-box">
          <div class="bundle-price">$349<span>/month</span></div>
          <span class="bundle-savings">Individual price: $398/mo &middot; Save $49/month</span>
          <a class="button gold" href="/pricing.html">Hire Sales Team &rarr;</a>
        </div>
      </div>
    </div>
  </section>

  <!-- DEPARTMENT 3: MARKETING -->
  <section class="emp-dept dept-marketing">
    <div class="dept-intro">
      <span class="dept-badge">DEPARTMENT 03</span>
      <h2>Marketing Department</h2>
      <p>Strategy, campaigns, copy, content, and multi-channel audience growth.</p>
    </div>

    <div class="employees-grid three-col">
      <!-- Marketing Manager -->
      <article class="emp-card">
        <div class="emp-card-header">
          <div>
            <span class="emp-dept-label">Marketing</span>
            <h3>Marketing Manager</h3>
          </div>
          <div class="emp-price">$199<span>/month</span></div>
        </div>
        <p class="emp-subtitle">Give your marketing an owner.</p>
        <p class="emp-summary">Your Marketing Manager takes your company's goals, audience, positioning and brand voice and turns them into coordinated marketing activity.</p>
        
        <div class="emp-tasks">
          <strong>Put them to work on:</strong>
          <ul>
            <li>Marketing strategy</li>
            <li>Campaign planning</li>
            <li>Content direction</li>
            <li>Audience segmentation</li>
            <li>Messaging</li>
            <li>Campaign coordination</li>
            <li>Performance analysis</li>
            <li>Marketing priorities</li>
            <li>Coordinating your marketing staff</li>
          </ul>
        </div>
      </article>

      <!-- Marketing Specialist -->
      <article class="emp-card featured-specialist">
        <div class="emp-card-header">
          <div>
            <span class="emp-dept-label">Marketing</span>
            <h3>Marketing Specialist</h3>
          </div>
          <div class="emp-price">$149<span>/month</span></div>
        </div>
        <p class="emp-subtitle">The hands-on execution behind your campaigns.</p>
        <p class="emp-summary">Your Marketing Specialist handles the practical campaign work that turns marketing plans into activity.</p>
        
        <div class="emp-tasks">
          <strong>Put them to work on:</strong>
          <ul>
            <li>Email campaigns</li>
            <li>Campaign execution</li>
            <li>Email list preparation</li>
            <li>Audience segmentation</li>
            <li>Marketing copy</li>
            <li>Lead nurturing campaigns</li>
            <li>Campaign research</li>
            <li>Performance tracking</li>
            <li>Routine marketing operations</li>
          </ul>
        </div>

        <!-- HIGHLIGHTED CALLOUT BOX -->
        <div class="saas-elimination-callout">
          <div class="callout-head">
            <span class="callout-dot">&check;</span>
            <strong>Email verification included</strong>
          </div>
          <p>Before sending campaigns, your marketing operation can verify email addresses as part of normal campaign preparation, helping reduce invalid addresses and protect deliverability.</p>
          <div class="callout-punch">No separate email-verification SaaS subscription for ordinary StaffAi campaign usage.</div>
        </div>
      </article>

      <!-- Social Media Manager -->
      <article class="emp-card">
        <div class="emp-card-header">
          <div>
            <span class="emp-dept-label">Marketing</span>
            <h3>Social Media Manager</h3>
          </div>
          <div class="emp-price">$249<span>/month</span></div>
        </div>
        <p class="emp-subtitle">Keep your brand active without spending your day posting.</p>
        <p class="emp-summary">Your Social Media Manager plans, prepares and coordinates your company's ongoing social presence.</p>
        
        <div class="emp-tasks">
          <strong>Put them to work on:</strong>
          <ul>
            <li>Social strategy</li>
            <li>Content calendars</li>
            <li>Post creation</li>
            <li>Caption writing</li>
            <li>Scheduling</li>
            <li>Campaign coordination</li>
            <li>Content repurposing</li>
            <li>Brand consistency</li>
            <li>Performance monitoring</li>
            <li>Ongoing social activity</li>
          </ul>
        </div>
        <div class="emp-footer-note">You set the direction. Your Social Media Manager keeps the machine moving.</div>
      </article>
    </div>

    <!-- Marketing Team Bundle -->
    <div class="team-bundle-banner">
      <div class="bundle-left">
        <span class="bundle-badge">COORDINATED DEPARTMENT BUNDLE</span>
        <h3>Marketing Team</h3>
        <p class="bundle-sub">A marketing department, not another marketing tool.</p>
        <p class="bundle-desc">Get your Marketing Manager + Marketing Specialist + Social Media Manager working together. Strategy, campaigns, email and social execution operate as one coordinated department.</p>
        <div class="bundle-highlight-pill">&check; Includes normal campaign email verification without requiring a standalone subscription.</div>
      </div>
      <div class="bundle-right">
        <div class="bundle-price-box">
          <div class="bundle-price">$499<span>/month</span></div>
          <span class="bundle-savings">Individual price: $597/mo &middot; Save $98/month</span>
          <a class="button gold" href="/pricing.html">Hire Marketing Team &rarr;</a>
        </div>
      </div>
    </div>
  </section>

  <!-- DEPARTMENT 4: CUSTOMER EXPERIENCE -->
  <section class="emp-dept dept-cx">
    <div class="dept-intro">
      <span class="dept-badge">DEPARTMENT 04</span>
      <h2>Customer Experience</h2>
      <p>Professional front-line communication, support handling, and call management.</p>
    </div>

    <div class="employees-grid two-col">
      <!-- Customer Service Representative -->
      <article class="emp-card">
        <div class="emp-card-header">
          <div>
            <span class="emp-dept-label">Customer Operations</span>
            <h3>Customer Service Representative</h3>
          </div>
          <div class="emp-price">$149<span>/month</span></div>
        </div>
        <p class="emp-subtitle">Give customers help without making every question your problem.</p>
        <p class="emp-summary">Your Customer Service Representative handles routine customer conversations using your company's knowledge, policies and escalation rules.</p>
        
        <div class="emp-tasks">
          <strong>Put them to work on:</strong>
          <ul>
            <li>Answering customer questions</li>
            <li>Handling routine support requests</li>
            <li>Providing product/service information</li>
            <li>Following up with customers</li>
            <li>Organizing support conversations</li>
            <li>Escalating exceptions</li>
            <li>Maintaining consistent service standards</li>
            <li>Keeping customer interactions moving</li>
          </ul>
        </div>
        <div class="emp-footer-note">When something requires human judgment or approval, it gets escalated rather than guessed.</div>
      </article>

      <!-- Receptionist -->
      <article class="emp-card">
        <div class="emp-card-header">
          <div>
            <span class="emp-dept-label">Customer Operations</span>
            <h3>Receptionist</h3>
          </div>
          <div class="emp-price">$199<span>/month</span></div>
        </div>
        <p class="emp-subtitle">Make sure your company is ready when customers call.</p>
        <p class="emp-summary">Your Receptionist becomes a professional front door for your business.</p>
        
        <div class="emp-tasks">
          <strong>Put them to work on:</strong>
          <ul>
            <li>Answering incoming calls</li>
            <li>Greeting callers</li>
            <li>Understanding why they're calling</li>
            <li>Answering routine questions</li>
            <li>Capturing messages and information</li>
            <li>Routing requests</li>
            <li>Scheduling where configured</li>
            <li>Escalating important calls</li>
            <li>Providing consistent front-line service</li>
          </ul>
        </div>
        <div class="emp-footer-note">Your business can answer professionally without requiring you to personally answer every call.</div>
      </article>
    </div>
  </section>

  <!-- DEPARTMENT 5: ADMINISTRATION & FINANCE -->
  <section class="emp-dept dept-admin-fin">
    <div class="dept-intro">
      <span class="dept-badge">DEPARTMENT 05</span>
      <h2>Administration & Finance</h2>
      <p>Clean operational execution, schedule coordination, and organized financial books.</p>
    </div>

    <div class="employees-grid two-col">
      <!-- Administrative Assistant -->
      <article class="emp-card">
        <div class="emp-card-header">
          <div>
            <span class="emp-dept-label">Administration</span>
            <h3>Administrative Assistant</h3>
          </div>
          <div class="emp-price">$99<span>/month</span></div>
        </div>
        <p class="emp-subtitle">Take routine administrative work off your plate.</p>
        <p class="emp-summary">Your Administrative Assistant handles the recurring coordination and organizational work that consumes valuable time.</p>
        
        <div class="emp-tasks">
          <strong>Put them to work on:</strong>
          <ul>
            <li>Scheduling and coordination</li>
            <li>Email and correspondence support</li>
            <li>Document preparation</li>
            <li>Research and information gathering</li>
            <li>Data entry and organization</li>
            <li>Follow-ups and reminders</li>
            <li>Routine administrative workflows</li>
            <li>Internal record keeping</li>
          </ul>
        </div>
      </article>

      <!-- Bookkeeper -->
      <article class="emp-card">
        <div class="emp-card-header">
          <div>
            <span class="emp-dept-label">Finance</span>
            <h3>Bookkeeper</h3>
          </div>
          <div class="emp-price">$149<span>/month</span></div>
        </div>
        <p class="emp-subtitle">Keep your financial records organized without living inside accounting software.</p>
        <p class="emp-summary">Your Bookkeeper helps maintain the day-to-day financial administration of your business and keeps important information organized for review.</p>
        
        <div class="emp-tasks">
          <strong>Put them to work on:</strong>
          <ul>
            <li>Transaction categorization</li>
            <li>Expense tracking</li>
            <li>Invoice and payment records</li>
            <li>Accounts receivable follow-up</li>
            <li>Financial record organization</li>
            <li>Routine reconciliations</li>
            <li>Financial summaries</li>
            <li>Preparing clean info for your accountant or management</li>
          </ul>
        </div>
        <div class="emp-footer-note">Important financial actions remain subject to your company's approval rules.</div>
      </article>
    </div>
  </section>

  <!-- SECTION 6: THEY DON'T WORK ALONE (THE PHILOSOPHY) -->
  <section class="emp-philosophy">
    <div class="philosophy-container">
      <small class="kicker">The StaffAi Architecture</small>
      <h2>They Don't Work Alone</h2>
      <p class="philosophy-lead">This is what makes StaffAi different.</p>
      
      <div class="philosophy-quote-card">
        <div class="quote-sign">&ldquo;</div>
        <blockquote class="quote-text">
          Mara, have marketing prepare next week's campaign and ask sales to follow up with everyone who responded to the last one.
        </blockquote>
        <div class="quote-source">And your staff handles the coordination behind the scenes.</div>
      </div>

      <div class="philosophy-points">
        <div class="point-col">
          <h4>Not Isolated Agents</h4>
          <p>These aren't isolated AI agents that you have to prompt, configure and manage separately. <strong>They work inside your company.</strong></p>
        </div>
        <div class="point-col">
          <h4>Unified Leadership</h4>
          <p>Your Executive Assistant is your primary point of contact. Your General Manager coordinates execution. Your specialized employees handle the work they're responsible for.</p>
        </div>
        <div class="point-col">
          <h4>Shared Context & Rules</h4>
          <p>They operate with your company knowledge, goals, policies, permissions and approval requirements.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 7: FINAL CTA -->
  <section class="emp-final-cta">
    <div class="final-cta-inner">
      <small class="kicker">The Bottom Line</small>
      <h2>No More Building a Business Out of Software Subscriptions</h2>
      <p class="cta-statement">No configuring tools. No stacking SaaS. No managing AI.</p>
      <p class="cta-desc">Talk to your Executive Assistant from your phone. Your dedicated AI staff handles sales, marketing, customer support, bookkeeping, administration and the everyday work behind the scenes.</p>
      <div class="cta-punchline">You run the company. StaffAi helps run the work.</div>
      <a class="button gold cta-btn" href="https://app.getstaffai.com/portal/signup?billing=monthly">Establish Your Company Office &rarr;</a>
    </div>
  </section>

</main>
`;

document.querySelector('#app').innerHTML = nav + content + foot;

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