const roles = [
  ['Administration', 'Administrative Assistant', 'Routine administration, scheduling, records, and follow-up coordination.'],
  ['Sales', 'Lead Generation Specialist', 'Researches markets, identifies ideal prospects, and keeps your pipeline filled.'],
  ['Sales', 'Sales Representative', 'Outreach, qualification, conversations, pipeline progression, and CRM updates.'],
  ['Marketing', 'Marketing Manager', 'Strategy, campaign planning, audience positioning, and performance direction.'],
  ['Marketing', 'Marketing Specialist', 'Email campaigns, marketing copy, segmentation, and verified campaign execution.'],
  ['Marketing', 'Social Media Manager', 'Plans, creates, schedules, and coordinates your continuous brand presence.'],
  ['Customer Operations', 'Customer Service Representative', 'Questions, support requests, follow-ups, and escalation in your voice.'],
  ['Customer Operations', 'Receptionist', 'Incoming calls, greetings, messages, scheduling, and professional routing.'],
  ['Finance', 'Bookkeeper', 'Invoices, expenses, reconciliations, financial summaries, and clean records.']
];

const cards = roles.map((r, i) => `
  <article class="role-card">
    <small>0${i + 1} &middot; ${r[0]}</small>
    <h3>${r[1]}</h3>
    <p>${r[2]}</p>
    <footer>
      <span class="role-dept-tag">${r[0]}</span>
      <a href="/employees.html" class="role-card-link">View role profile &rarr;</a>
    </footer>
  </article>
`).join('');

document.querySelector('#app').innerHTML = `
<div class="announcement">Company Office launch offer: professional setup fee waived <a href="/pricing.html">Learn more &rarr;</a></div>
<header>
  <a class="logo" href="#top"><img src="/staffai-logo.png" alt="StaffAi"></a>
  <nav>
    <a href="/how-it-works.html">How It Works</a>
    <a href="/employees.html">AI Employees</a>
    <a href="/teams.html">Teams</a>
    <a href="/pricing.html">Pricing</a>
    <a href="/about.html">About</a>
    <a href="/roadmap.html">Roadmap</a>
    <a class="button gold mobile-menu-cta" href="/pricing.html">Establish Your Company Office &rarr;</a>
  </nav>
  <a class="signin" href="https://app.getstaffai.com/portal/login">Sign In</a>
  <a class="button gold desktop-header-btn" href="/pricing.html">Establish Your Company Office &rarr;</a>
  <button class="menu" aria-label="Toggle navigation" aria-expanded="false">&#9776;</button>
</header>

<main id="top">
  <!-- HERO -->
  <section class="hero">
    <div class="hero-copy">
      <small class="kicker">The AI staffing agency for ambitious businesses</small>
      <h1>You didn't start a company<br>to <em>manage software.</em></h1>
      <p class="hero-lead">No configuring tools. No stacking SaaS. No managing AI.<br><br>Just talk to your Executive Assistant from your phone. Behind the scenes, your dedicated AI staff handles sales, marketing, customer support, bookkeeping, and the day-to-day work of running your business.</p>
      <div class="hero-power-statement">
        <strong>Real employees trained to increase your impact, influence, and income.</strong>
      </div>
      <div class="actions">
        <a class="button gold" href="/pricing.html">Establish Your Company Office &rarr;</a>
        <a class="link" href="#workflow">See how it works &darr;</a>
      </div>
      <div class="proof">&check; 7-day free trial &nbsp;&middot;&nbsp; &check; Month-to-month &nbsp;&middot;&nbsp; &check; 30-day guarantee</div>
    </div>
  </section>

  <!-- TICKER -->
  <div class="ticker">
    <span>One company. One conversation.</span>
    <span>Real roles. Real work.</span>
    <span>Controlled delegation.</span>
    <span>Human teams welcome.</span>
  </div>

  <!-- WORKFLOW SHOWCASE -->
  <section class="workflow-showcase-section" id="workflow">
    <div class="showcase-container">
      <div class="showcase-header">
        <small class="kicker">One Conversation Architecture</small>
        <h2>You run the company.<br><em>Your AI staff runs the rest.</em></h2>
        <p class="showcase-sub">One conversation is all it takes to move your entire company forward.</p>
        
        <div class="showcase-tabs">
          <div class="showcase-tab active">
            <span class="tab-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            </span>
            <span>Talk to your Executive Assistant</span>
          </div>
          <div class="showcase-tab">
            <span class="tab-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            </span>
            <span>Get real answers instantly</span>
          </div>
          <div class="showcase-tab">
            <span class="tab-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </span>
            <span>Watch your team execute</span>
          </div>
        </div>
      </div>

      <div class="native-workflow-canvas">
        <div class="flow-step step-ceo-person">
          <div class="ceo-frame">
            <img src="/public/avatars/ceo-clean.jpg" alt="CEO managing operations from smartphone" class="ceo-img" />
            <div class="ceo-initial-msg">
              <span class="msg-sender-tag">CEO</span>
              <p>Hey, how's sales going this week?</p>
            </div>
          </div>
        </div>

        <div class="flow-arrow-divider">
          <svg viewBox="0 0 24 24" class="arrow-svg"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>

        <div class="flow-step step-mara-dash">
          <div class="dialogue-card">
            <div class="card-sender-row">
              <img src="/public/avatars/mara.jpg" alt="Mara" class="card-avatar" />
              <div class="card-sender-meta">
                <strong>Mara</strong>
                <span>Executive Assistant</span>
              </div>
            </div>
            <p class="card-intro-text">Here's this week's sales update.</p>
            
            <div class="mini-kpi-dashboard">
              <div class="kpi-dash-title">Sales Performance : This Week</div>
              <div class="kpi-grid">
                <div class="kpi-box">
                  <span class="kpi-lbl">Revenue</span>
                  <strong class="kpi-val">$248,500</strong>
                  <span class="kpi-trend up">&nearr; 8.2% <small>vs last week</small></span>
                </div>
                <div class="kpi-box">
                  <span class="kpi-lbl">New Deals</span>
                  <strong class="kpi-val">23</strong>
                  <span class="kpi-trend up">&nearr; 15% <small>vs last week</small></span>
                </div>
                <div class="kpi-box">
                  <span class="kpi-lbl">Pipeline</span>
                  <strong class="kpi-val">$1.46M</strong>
                  <span class="kpi-trend up">&nearr; 5.1% <small>vs last week</small></span>
                </div>
                <div class="kpi-box">
                  <span class="kpi-lbl">Closed Deals</span>
                  <strong class="kpi-val">12</strong>
                  <span class="kpi-trend up">&nearr; 9% <small>vs last week</small></span>
                </div>
              </div>

              <div class="dash-chart-wrapper">
                <svg viewBox="0 0 320 75" class="native-svg-chart" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.25"/>
                      <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.0"/>
                    </linearGradient>
                  </defs>
                  <line x1="20" y1="15" x2="310" y2="15" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="2 2" />
                  <line x1="20" y1="40" x2="310" y2="40" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="2 2" />
                  <line x1="20" y1="65" x2="310" y2="65" stroke="#e2e8f0" stroke-width="1" />
                  <path d="M20 58 C 50 55, 75 52, 100 44 C 130 36, 160 42, 190 30 C 220 20, 250 24, 280 18 L 310 12 L 310 65 L 20 65 Z" fill="url(#chartGrad)" />
                  <path d="M20 58 C 50 55, 75 52, 100 44 C 130 36, 160 42, 190 30 C 220 20, 250 24, 280 18 L 310 12" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" />
                  <circle cx="310" cy="12" r="3.5" fill="#2563eb" />
                </svg>
                <div class="chart-x-labels">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flow-arrow-divider">
          <svg viewBox="0 0 24 24" class="arrow-svg"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>

        <div class="flow-step step-exchange">
          <div class="ceo-directive-bubble">
            <div class="directive-author">
              <img src="/public/avatars/ceo-avatar.jpg" alt="CEO" class="directive-thumb" />
              <span>CEO</span>
            </div>
            <p>We need to get this up. I want stronger results.</p>
            <div class="typing-pill">
              <span class="dot"></span><span class="dot"></span><span class="dot"></span>
            </div>
          </div>

          <div class="mara-reply-card">
            <div class="card-sender-row">
              <img src="/public/avatars/mara.jpg" alt="Mara" class="card-avatar" />
              <div class="card-sender-meta">
                <strong>Mara</strong>
                <span>Executive Assistant</span>
              </div>
            </div>
            <p class="reply-text">Understood. I'll speak with the GM and the team. I'll have a strategy ready for you by end of day today.</p>
            <div class="reply-foot">
              <span class="time-stamp">10:24 AM</span>
              <span class="read-receipt">&check;</span>
            </div>
          </div>
        </div>

        <div class="flow-arrow-divider with-badge">
          <span class="later-badge">Later Today</span>
          <svg viewBox="0 0 24 24" class="arrow-svg"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>

        <div class="flow-step step-gm-execution">
          <div class="gm-execution-card">
            <div class="card-sender-row">
              <img src="/public/avatars/alex.jpg" alt="Alex" class="card-avatar" />
              <div class="card-sender-meta">
                <strong>Alex</strong>
                <span>General Manager</span>
              </div>
            </div>
            <p class="card-intro-text">Here's the plan.</p>

            <ul class="execution-checklist">
              <li>
                <span class="check-box">&check;</span>
                <span>Refocus outreach on high-converting segments</span>
              </li>
              <li>
                <span class="check-box">&check;</span>
                <span>Increase follow-ups on warm leads</span>
              </li>
              <li>
                <span class="check-box">&check;</span>
                <span>Launch targeted campaign to re-engage prospects</span>
              </li>
              <li>
                <span class="check-box">&check;</span>
                <span>Daily tracking and optimization</span>
              </li>
            </ul>

            <div class="execution-footer-note">
              <p>We'll implement this strategy Monday morning. You should see measurable results within 3 days.</p>
              <div class="reply-foot">
                <span class="time-stamp">4:35 PM</span>
                <span class="read-receipt">&check;</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- 5 VALUE PILLARS (CLEAN NATIVE SVG ICONS) -->
      <div class="pillars-strip">
        <div class="pillar-item">
          <div class="pillar-icon">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
          </div>
          <div class="pillar-content">
            <strong>No configuring tools.</strong>
            <span>We handle the tech.</span>
          </div>
        </div>
        <div class="pillar-item">
          <div class="pillar-icon">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
          </div>
          <div class="pillar-content">
            <strong>No stacking SaaS.</strong>
            <span>We replace the bloat.</span>
          </div>
        </div>
        <div class="pillar-item">
          <div class="pillar-icon">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div class="pillar-content">
            <strong>No managing AI.</strong>
            <span>Just talk and we execute.</span>
          </div>
        </div>
        <div class="pillar-item">
          <div class="pillar-icon">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
          </div>
          <div class="pillar-content">
            <strong>Real results.</strong>
            <span>Track. Measure. Grow.</span>
          </div>
        </div>
        <div class="pillar-item">
          <div class="pillar-icon">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div class="pillar-content">
            <strong>Secure &amp; reliable.</strong>
            <span>Your data. Your rules.</span>
          </div>
        </div>
      </div>

      <!-- COMPLETE WORKFORCE ROSTER BAR -->
      <div class="workforce-roster-bar">
        <div class="roster-header">
          <div>
            <span class="roster-subtag">ORGANIZATIONAL WORKFORCE</span>
            <h3>Your complete AI team. Working together for you.</h3>
          </div>
          <a href="/employees.html" class="roster-link">Explore all departments &rarr;</a>
        </div>
        <div class="roster-grid">
          <a href="/employees.html" class="roster-card">
            <img src="/public/avatars/roster-mara.jpg" alt="Mara" class="roster-avatar" />
            <span class="roster-role">Executive Assistant</span>
            <h4>Mara</h4>
            <p>Your direct line to your company. Delegate, ask, follow up, approve and stay in control.</p>
            <div class="roster-footer">
              <span class="roster-badge">Included with Office</span>
            </div>
          </a>
          <a href="/employees.html" class="roster-card">
            <img src="/public/avatars/roster-kellan.jpg" alt="Kellan" class="roster-avatar" />
            <span class="roster-role">Executive Assistant</span>
            <h4>Kellan</h4>
            <p>Same role. Same power. Choose the voice and presence you prefer to work with.</p>
            <div class="roster-footer">
              <span class="roster-badge">Included with Office</span>
            </div>
          </a>
          <a href="/employees.html" class="roster-card">
            <img src="/public/avatars/roster-alex.jpg" alt="Alex" class="roster-avatar" />
            <span class="roster-role">Operations</span>
            <h4>General Manager</h4>
            <p>Coordinates your team, manages execution and keeps everything moving forward.</p>
            <div class="roster-footer">
              <span class="roster-badge">Included with Office</span>
            </div>
          </a>
          <a href="/employees.html" class="roster-card">
            <img src="/public/avatars/roster-marketing.jpg" alt="Marketing Team" class="roster-avatar" />
            <span class="roster-role">Marketing</span>
            <h4>Marketing Team</h4>
            <p>Strategy, campaigns, content, email verification, social media and performance.</p>
            <div class="roster-footer">
              <span class="roster-highlight">Email verification included</span>
            </div>
          </a>
          <a href="/employees.html" class="roster-card">
            <img src="/public/avatars/roster-sales.jpg" alt="Sales Team" class="roster-avatar" />
            <span class="roster-role">Sales</span>
            <h4>Sales Team</h4>
            <p>Finds, qualifies and closes more deals. Pipeline growth on autopilot.</p>
            <div class="roster-footer">
              <span class="roster-dept-status">Pipeline Engine</span>
            </div>
          </a>
          <a href="/employees.html" class="roster-card">
            <img src="/public/avatars/roster-cs.jpg" alt="Customer Service" class="roster-avatar" />
            <span class="roster-role">Customer Operations</span>
            <h4>Customer Service</h4>
            <p>Happy customers, faster responses, call handling, and smooth resolutions.</p>
            <div class="roster-footer">
              <span class="roster-dept-status">24/7 Frontline</span>
            </div>
          </a>
          <a href="/employees.html" class="roster-card">
            <img src="/public/avatars/roster-admin.jpg" alt="Admin &amp; Finance" class="roster-avatar" />
            <span class="roster-role">Administration &amp; Finance</span>
            <h4>Admin &amp; Finance</h4>
            <p>Admin support and bookkeeping to keep your operations and records organized.</p>
            <div class="roster-footer">
              <span class="roster-dept-status">Clean Ledgers</span>
            </div>
          </a>
        </div>
      </div>

    </div>
  </section>

  <!-- PROBLEM SECTION -->
  <section class="section problem">
    <small class="kicker">The problem with modern business software</small>
    <div class="two">
      <div>
        <h2>Stop managing software.<br><em>Start leading</em> your company.</h2>
        <p class="large">Every new system promises to save you time. Somehow, everything still comes back to you.</p>
      </div>
      <div class="copy">
        <p><b>CRM.</b> Email marketing. Calendars. Social media. Accounting. Automation. Analytics. AI tools.</p>
        <p>You still decide what needs doing. You move information between systems, chase follow-ups, check dashboards and notice what everyone else missed.</p>
        <strong>There is another way to run a business.</strong>
      </div>
    </div>
  </section>

  <!-- COMPARE SECTION -->
  <section class="compare section">
    <article>
      <small class="kicker">The old way</small>
      <h3>You have an outcome you want.<br>Then you:</h3>
      <ol>
        <li>Find, compare and buy software</li>
        <li>Configure and connect software</li>
        <li>Build workflows and automations</li>
        <li>Monitor dashboards and results</li>
        <li>Remain responsible for everything</li>
      </ol>
    </article>
    <b class="vs">vs.</b>
    <article class="new">
      <small class="kicker">The StaffAi way</small>
      <h3>You tell your Executive Assistant<br>what you want.</h3>
      <ol>
        <li>Your General Manager coordinates the work</li>
        <li>The right employees get involved</li>
        <li>They operate the systems</li>
        <li>They report results</li>
        <li>Important decisions come back to you</li>
      </ol>
    </article>
  </section>

  <!-- ABOUT SECTION -->
  <section class="dark section" id="about">
    <small class="kicker">Meet StaffAi</small>
    <h2>An AI staffing agency built<br><em>around your company.</em></h2>
    <p class="dark-copy">StaffAi isn't another chatbot, CRM or automation platform. You establish a Company Office and hire AI employees to perform real business work. They work individually, together and alongside your human team.</p>
    <div class="principles">
      <div>
        <b>01</b>
        <h3>Built around roles</h3>
        <p>Every employee has a real job, manager, responsibility and permission.</p>
      </div>
      <div>
        <b>02</b>
        <h3>Built around context</h3>
        <p>Your staff understand the information relevant to your business.</p>
      </div>
      <div>
        <b>03</b>
        <h3>Built around authority</h3>
        <p>Routine work moves forward. High-risk decisions come back to you.</p>
      </div>
    </div>
  </section>

  <!-- OFFICE SECTION -->
  <section class="section office" id="how">
    <small class="kicker">Your Company Office</small>
    <div class="two">
      <div>
        <h2>Every company<br>starts <em>here.</em></h2>
        <p class="large">Your operating center connecting you to the rest of your workforce. One company. One conversation.</p>
      </div>
      <div class="feature-list">
        <div>
          <b>EA</b>
          <h3>Executive Assistant</h3>
          <p>Your primary point of contact. Talk or text naturally about what you need.</p>
        </div>
        <div>
          <b>GM</b>
          <h3>General Manager</h3>
          <p>Routes work, delegates to employees, monitors execution and brings important matters back.</p>
        </div>
        <div>
          <b>CI</b>
          <h3>Company Intelligence</h3>
          <p>Working knowledge of your business, policies, priorities and ongoing work.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- TRANSFORMED STAFF & ECONOMICS SHOWCASE -->
  <section class="section staff" id="staff">
    <div class="head staff-editorial-head">
      <div class="staff-head-left">
        <small class="kicker">The Modern Workforce Equation</small>
        <h2>Build the company<br>you <em>actually need.</em></h2>
      </div>
      <div class="staff-head-right">
        <p class="staff-head-lead">Traditional hiring forces you to trade hundreds of thousands of dollars in payroll, recruiting fees, and management friction for uncertain output. StaffAi gives you a fully staffed company built to execute from day one.</p>
      </div>
    </div>

    <!-- SAVINGS & ECONOMICS COMPARISON STRIP -->
    <div class="economics-comparison-board">
      <div class="econ-col human-workforce">
        <div class="econ-badge human">Traditional Human Workforce</div>
        <div class="econ-cost-callout">$450,000+ / year</div>
        <span class="econ-sub-label">Typical overhead for a 7 to 9 person cross-functional department</span>
        <ul class="econ-friction-list">
          <li>Recruiting fees, payroll taxes, benefits, and paid time off</li>
          <li>Weeks of onboarding, training lag, and knowledge loss</li>
          <li>Sick days, personal leave, burnout, and turnover risk</li>
          <li>Paying for hours logged and effort rather than completed outcomes</li>
        </ul>
      </div>

      <div class="econ-vs-divider">VS</div>

      <div class="econ-col staffai-workforce">
        <div class="econ-badge staffai">Your StaffAi Workforce</div>
        <div class="econ-cost-callout">Fraction of Single Salary</div>
        <span class="econ-sub-label">Complete company coverage across sales, marketing, service, and finance</span>
        <ul class="econ-advantage-list">
          <li>Zero recruiting costs, zero payroll taxes, and zero benefits overhead</li>
          <li>Operational on day one with unified company context and memory</li>
          <li>Continuous 24/7 coverage with zero sick days, zero downtime, and zero turnover</li>
          <li>Trained strictly to execute measurable business results, not billable hours</li>
        </ul>
      </div>
    </div>

    <!-- DUAL-TIER TRAINING & PHILOSOPHY BANNER -->
    <div class="training-philosophy-banner">
      <div class="training-banner-content">
        <div class="training-badge">DUAL-TIER TRAINING STANDARD</div>
        <h3>Trained for your roles. Specialized for your company.</h3>
        <p>Every StaffAi agent is trained at the highest professional standards for their specific discipline, then receives specialist training tailored to your exact company knowledge, policies, voice, and operating procedures.</p>
        <div class="training-results-quote">
          <strong>Our agents are not trained to deliver effort. They are trained to deliver RESULTS.</strong>
        </div>
      </div>
      <div class="training-banner-pillars">
        <div class="pillar-box">
          <span class="p-num">01</span>
          <strong>Role Foundations</strong>
          <p>Mastery of industry best practices across sales, marketing, customer support, and accounting.</p>
        </div>
        <div class="pillar-box">
          <span class="p-num">02</span>
          <strong>Company Alignment</strong>
          <p>Bespoke training on your products, customer profiles, brand tone, and escalation rules.</p>
        </div>
        <div class="pillar-box">
          <span class="p-num">03</span>
          <strong>24/7 Continuity</strong>
          <p>No sick days. No time off. No turnover. Constant top tier execution around the clock.</p>
        </div>
      </div>
    </div>

    <!-- THE 9 ROLES GRID (ZERO PRICING) -->
    <div class="role-grid-header">
      <h3>Complete Operational Coverage</h3>
      <p>Every role your company needs to operate smoothly and grow systematically.</p>
    </div>
    <div class="role-grid">${cards}</div>

    <div class="center staff-cta-row">
      <a class="button gold" href="/employees.html">Walk through all departments &rarr;</a>
    </div>
  </section>

  <!-- TEAMS SECTION (ZERO PRICING) -->
  <section class="dark section teams" id="teams">
    <small class="kicker">When roles work better together</small>
    <div class="head">
      <h2>Some jobs work<br><em>better together.</em></h2>
      <p>Where businesses need distinct roles collaborating in real time, coordinated teams eliminate handoff delays and multiply output.</p>
    </div>
    <div class="team-grid">
      <article>
        <span>SALES TEAM</span>
        <strong>Unified Revenue Engine</strong>
        <h3>Lead Generation Specialist + Sales Representative</h3>
        <p>From finding the right prospects to starting conversations, qualification, and moving opportunities through to closing.</p>
        <footer>Coordinated prospecting and sales pipeline execution <a href="/teams.html" class="team-card-link">Explore team &rarr;</a></footer>
      </article>
      <article>
        <span>MARKETING TEAM</span>
        <strong>Full Marketing Department</strong>
        <h3>Marketing Manager + Marketing Specialist + Social Media Manager</h3>
        <p>Strategy, campaigns, email execution, social media, and verified deliverability as one coordinated function.</p>
        <footer>Email verification included for regular campaign usage <a href="/teams.html" class="team-card-link">Explore team &rarr;</a></footer>
      </article>
    </div>
    <div class="center" style="margin-top: 40px;">
      <a class="button gold" href="/teams.html">View all team configurations &rarr;</a>
    </div>
  </section>

  <!-- FINAL HERO -->
  <section class="final dark section" id="contact">
    <small class="kicker">Your company shouldn't need you to push every button</small>
    <h2>Stop managing software.<br><em>Start leading your company.</em></h2>
    <p>There will always be decisions only you should make. That's where your time belongs. Let your staff handle the rest.</p>
    <a class="button gold" href="/pricing.html">Establish Your Company Office &rarr;</a>
  </section>
</main>

<footer>
  <div>
    <img src="/staffai-logo.png" alt="StaffAi">
    <p>The AI staffing agency for businesses that would rather lead than operate software.</p>
  </div>
  <div>
    <b>Company</b>
    <a href="/about.html">About</a>
    <a href="/roadmap.html">Roadmap</a>
    <a href="/how-it-works.html">How It Works</a>
    <a href="/pricing.html">Pricing</a>
  </div>
  <div>
    <b>Workforce</b>
    <a href="/employees.html">AI Employees</a>
    <a href="/teams.html">Sales Team</a>
    <a href="/teams.html">Marketing Team</a>
  </div>
  <div>
    <b>Account</b>
    <a href="mailto:support@getstaffai.com">Contact</a>
    <a href="https://app.getstaffai.com/portal/login">Sign In</a>
  </div>
</footer>
`;

const pageLinks = {
  'How It Works': '/how-it-works.html',
  'AI Employees': '/employees.html',
  'Teams': '/teams.html',
  'Pricing': '/pricing.html',
  'About': '/about.html'
};

document.querySelectorAll('header nav a').forEach(a => {
  if (pageLinks[a.textContent]) a.href = pageLinks[a.textContent];
});

document.querySelector('#app > footer').insertAdjacentHTML('beforeend', `
<div>
  <b>Legal & Trust</b>
  <a href="/faq.html">FAQ</a>
  <a href="/terms.html">Terms of Service</a>
  <a href="/privacy.html">Privacy Policy</a>
  <a href="/acceptable-use.html">Acceptable Use</a>
  <a href="/ai-disclosure.html">AI Disclosure</a>
  <a href="/refund.html">Refund & Cancellation</a>
  <a href="/cookies.html">Cookie Policy</a>
  <a href="/security.html">Security</a>
  <a href="/dpa.html">Data Processing Addendum</a>
  <a href="/communications.html">Communications & Telephony</a>
  <a href="mailto:compliance@getstaffai.com">compliance@getstaffai.com</a>
</div>
`);

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