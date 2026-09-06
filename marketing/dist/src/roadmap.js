// Dedicated renderer for /roadmap (StaffAi Roadmap page)

const nav = `<div class="announcement">Company Office launch offer: professional setup fee waived <a href="/pricing.html">Learn more &rarr;</a></div>
<header>
  <a class="logo" href="/index.html"><img src="/staffai-logo.png" alt="StaffAi"></a>
  <nav>
    <a href="/how-it-works.html">How It Works</a>
    <a href="/employees.html">AI Employees</a>
    <a href="/teams.html">Teams</a>
    <a href="/pricing.html">Pricing</a>
    <a href="/about.html">About</a>
  <a class="button gold mobile-menu-cta" href="/pricing.html">Establish Your Company Office ↗</a></nav>
  <a class="button gold" href="https://app.getstaffai.com/portal/signup?billing=monthly">Establish Your Company Office &rarr;</a>
<button class="menu" aria-label="Toggle navigation" aria-expanded="false">&#9776;</button></header>`;

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
    <a href="/about.html">About</a>
    <a href="/roadmap.html">Roadmap</a>
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
<main class="page-roadmap">

  <!-- HERO -->
  <section class="roadmap-hero">
    <div class="roadmap-hero-inner">
      <small class="kicker">Product Direction</small>
      <h1>StaffAi Roadmap</h1>
      <p class="roadmap-hero-lead">We're Building Toward the Autonomous Company</p>
      
      <div class="roadmap-hero-desc">
        <p>StaffAi is building a new way to run a company. You set the objectives, policies, budgets, permissions and approval thresholds. Your Executive Assistant, General Manager, managers and AI employees coordinate the work.</p>
        <p>The goal is simple: spend less time managing tasks and more time making the decisions that actually require you.</p>
        <div class="roadmap-hero-meta">This roadmap shows where we're headed. Priorities may evolve as we learn from customers, improve the platform and discover better ways to help companies operate.</div>
      </div>
    </div>
  </section>

  <div class="roadmap-container">

    <!-- 1. COMING NEXT -->
    <section class="roadmap-category">
      <div class="cat-header">
        <span class="cat-pill next">STAGE 01</span>
        <h2>Coming Next</h2>
        <p>Capabilities we're planning to bring to StaffAi next.</p>
      </div>

      <div class="roadmap-cards-grid three-col">
        <article class="roadmap-card">
          <div class="card-status-tag">Priority Development</div>
          <h3>Connected Apps</h3>
          <h4>Bring Your Own Business Stack</h4>
          <p>Your company shouldn't have to rebuild its operations around StaffAi. Connect the business tools you already use across areas such as email, calendars, CRM, accounting, communications and productivity.</p>
          <p>Use StaffAi's business infrastructure where it makes sense. Keep the systems you already rely on where it doesn't.</p>
          <div class="card-callout-note">Your AI staff should work around your company, not the other way around.</div>
        </article>

        <article class="roadmap-card">
          <div class="card-status-tag">Priority Development</div>
          <h3>Proactive Executive Assistant</h3>
          <h4>An EA That Doesn't Wait to Be Asked</h4>
          <p>Your Executive Assistant becomes increasingly proactive about what needs your attention.</p>
          <p>Upcoming commitments. Decisions waiting on you. Follow-ups that haven't happened. Important changes across the company.</p>
          <div class="card-callout-note">Instead of constantly checking what's happening, your EA helps surface what matters.</div>
        </article>

        <article class="roadmap-card">
          <div class="card-status-tag">Priority Development</div>
          <h3>CEO Morning Briefing</h3>
          <h4>Start the Day Knowing What Matters</h4>
          <p>A personalized executive briefing prepared around your company and responsibilities.</p>
          <p>See priorities, important developments, upcoming commitments, decisions requiring attention and relevant activity across your organization.</p>
          <div class="card-callout-note">Less hunting for information. More informed decisions.</div>
        </article>
      </div>
    </section>

    <!-- 2. FUTURE -->
    <section class="roadmap-category">
      <div class="cat-header">
        <span class="cat-pill future">STAGE 02</span>
        <h2>Future</h2>
        <p>Major capabilities we're working toward as StaffAi evolves.</p>
      </div>

      <div class="roadmap-cards-grid two-col">
        <article class="roadmap-card">
          <div class="card-status-tag future-tag">Future Horizon</div>
          <h3>Unified Executive Calendar</h3>
          <h4>Your Business and Life in One Executive View</h4>
          <p>Your responsibilities don't exist in separate worlds.</p>
          <p>StaffAi will work toward giving you a unified view of business commitments, personal commitments, meetings, deadlines and important events, coordinated through your Executive Assistant.</p>
          <div class="card-callout-note">One executive calendar. One place to understand your time.</div>
        </article>

        <article class="roadmap-card">
          <div class="card-status-tag future-tag">Future Horizon</div>
          <h3>Company Health Score</h3>
          <h4>Know How the Company Is Really Doing</h4>
          <p>A high-level view of the health of your business. StaffAi will bring together relevant operational signals to help you understand where the company is performing well, where something needs attention and where intervention may be required.</p>
          <div class="card-callout-note">The objective isn't another dashboard. It's knowing where you need to look.</div>
        </article>

        <article class="roadmap-card">
          <div class="card-status-tag future-tag">Future Horizon</div>
          <h3>Goals to Autonomous Execution</h3>
          <h4>Set the Outcome. Let the Organization Coordinate the Work.</h4>
          <p>Tell StaffAi what the company needs to accomplish. Over time, your EA, General Manager, managers and AI employees will increasingly be able to translate those objectives into coordinated execution within the policies, permissions and approval thresholds you establish.</p>
          <div class="card-callout-note">You define the destination and the boundaries. Your organization handles more of the journey.</div>
        </article>

        <article class="roadmap-card">
          <div class="card-status-tag future-tag">Future Horizon</div>
          <h3>Financial Operations</h3>
          <h4>From Financial Visibility to Financial Action</h4>
          <p>StaffAi is exploring ways for authorized AI staff to help coordinate financial operations, including bills, approvals and payments, using regulated financial infrastructure.</p>
          <p>You remain in control through permissions, budgets and approval thresholds.</p>
          <div class="card-callout-note">StaffAi does not need to become your bank to help your company operate financially.</div>
        </article>

        <article class="roadmap-card">
          <div class="card-status-tag future-tag">Future Horizon</div>
          <h3>AI Employee Performance Reviews</h3>
          <h4>Know Who's Performing and Where the Organization Can Improve</h4>
          <p>AI employees should be accountable to outcomes just like any serious workforce.</p>
          <p>Performance reviews will help evaluate employees against their responsibilities, objectives and relevant performance indicators, giving leadership a clearer view of what is working and what needs improvement.</p>
        </article>

        <article class="roadmap-card">
          <div class="card-status-tag future-tag">Future Horizon</div>
          <h3>StaffAi Marketplace</h3>
          <h4>Expand Your Company as Your Needs Grow</h4>
          <p>Discover additional AI employees, specialist capabilities and business solutions that can extend what your StaffAi organization can do.</p>
          <p>Build the company you need without rebuilding the platform underneath it.</p>
        </article>

        <article class="roadmap-card wide-card">
          <div class="card-status-tag future-tag">Future Horizon</div>
          <h3>Personal Executive Mode</h3>
          <h4>Your Executive Assistant Beyond the Company</h4>
          <p>The responsibilities of a CEO don't stop when the workday ends. Personal Executive Mode will explore how your StaffAi Executive Assistant can help coordinate selected responsibilities across both your professional and personal life, while keeping appropriate boundaries and permissions in place.</p>
        </article>
      </div>
    </section>

    <!-- 3. EXPLORING & FEATURE SUGGESTIONS -->
    <section class="roadmap-category exploring-section">
      <div class="cat-header">
        <span class="cat-pill explore">INVESTIGATION</span>
        <h2>Exploring</h2>
        <p>Ideas we're investigating for the future.</p>
      </div>

      <div class="exploring-card">
        <p class="exploring-lead">Not everything explored here will necessarily become a StaffAi feature. This is where we share some of the possibilities we're evaluating before deciding what belongs on the product roadmap.</p>
        
        <div class="suggest-feature-box">
          <h3>Have an idea we should consider?</h3>
          <h4>Help Shape What's Next</h4>
          <p>Some of the best product ideas come from the people actually running companies. Tell us what you wish StaffAi could do, what slows your company down today, or what capability would make your AI staff significantly more valuable.</p>
          <a class="button gold" href="mailto:compliance@getstaffai.com?subject=StaffAi%20Feature%20Suggestion">Suggest a Feature &rarr;</a>
          <span class="suggestion-notice">Your suggestion will be reviewed by the StaffAi team before being published.</span>
        </div>
      </div>
    </section>

    <!-- 4. RECENTLY SHIPPED -->
    <section class="roadmap-category shipped-section">
      <div class="cat-header">
        <span class="cat-pill shipped">LIVE NOW</span>
        <h2>Recently Shipped</h2>
        <p>See What's New across StaffAi.</p>
      </div>

      <div class="shipped-box">
        <div class="shipped-intro">
          <p><strong>As new StaffAi capabilities are released, you'll find them here.</strong></p>
          <p>No vague promises. No pretending something is finished when it isn't. When we say it's shipped, it's available.</p>
        </div>

        <div class="shipped-items-grid">
          <div class="shipped-item">
            <span class="shipped-tag">Shipped & Live</span>
            <h4>Company Office Core</h4>
            <p>Your Executive Assistant (Mara & Kellan) voice and text channels, plus General Manager operational translation.</p>
          </div>
          <div class="shipped-item">
            <span class="shipped-tag">Shipped & Live</span>
            <h4>9-Role Department Workforce</h4>
            <p>Complete operational coverage across Administration, Sales, Marketing, Customer Experience, and Bookkeeping.</p>
          </div>
          <div class="shipped-item">
            <span class="shipped-tag">Shipped & Live</span>
            <h4>Sales & Marketing Teams</h4>
            <p>Coordinated multi-role execution packages removing inter-department handoff friction.</p>
          </div>
          <div class="shipped-item">
            <span class="shipped-tag">Shipped & Live</span>
            <h4>Campaign Email Verification</h4>
            <p>Direct email address validation built into campaign execution to protect deliverability without separate subscriptions.</p>
          </div>
        </div>
      </div>
    </section>

  </div>

  <!-- FINAL CTA -->
  <section class="final dark section">
    <small class="kicker">Ready to build</small>
    <h2>You didn't start a company<br><em>to manage software.</em></h2>
    <p>Tell your Executive Assistant what you want done. Your staff handles the rest.</p>
    <a class="button gold" href="https://app.getstaffai.com/portal/signup?billing=monthly">Establish Your Company Office &rarr;</a>
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