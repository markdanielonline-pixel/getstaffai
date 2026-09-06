# Staff AI Onboarding, Guardrails, and Customer Notifications

## Product principle

Company onboarding should feel like briefing a capable new executive,
not configuring software. Staff AI should inspect the company website
first, prefill anything it can reasonably infer, and ask the owner to
confirm or correct it. Questions should focus on judgment, priorities,
boundaries, and operating rules that cannot safely be inferred.

**Website-inferred** means Staff AI should prefill the answer from the
company website and present it for quick confirmation rather than asking
the owner to type it from scratch.

------------------------------------------------------------------------

# Part 1: Company Onboarding

## Step 1: Your Company

### 1. What should your team call your company?

-   **Why it matters / who uses it:** Establishes the company identity
    used by every employee in documents, email, reports, and
    conversations.
-   **Input:** Short text
-   **Required:** Yes
-   **Example:** `Harbor & Pine Property Management`
-   **If skipped:** Cannot be skipped.
-   **Website-inferred:** Yes. Prefill from the website and ask for
    confirmation.

### 2. In one sentence, what does your company do?

-   **Why it matters / who uses it:** Gives every employee a shared
    description of the business and prevents employees from guessing
    what the company sells.
-   **Input:** One-sentence text
-   **Required:** Yes
-   **Example:**
    `We manage residential rental properties for owners who do not want to handle tenants themselves.`
-   **If skipped:** Use the clearest description inferred from the
    website.
-   **Website-inferred:** Yes.

### 3. Who are your main customers?

-   **Why it matters / who uses it:** Used especially by the GM, Lead
    Generation Specialist, Sales Representative, Marketing team, and
    Customer Service Representative.
-   **Input:** Short text with suggested answer
-   **Required:** Yes
-   **Example:**
    `Property owners in South Florida with 2 to 50 residential units.`
-   **If skipped:** Use the primary customer segment inferred from the
    website and mark it as an assumption.
-   **Website-inferred:** Yes.

### 4. What are the main products or services you want your team to focus on?

-   **Why it matters / who uses it:** Keeps sales, marketing, support,
    and management focused on what matters commercially.
-   **Input:** Multi-select or short list
-   **Required:** Yes
-   **Example:** `Full-service property management; tenant placement`
-   **If skipped:** Use the primary offerings shown on the website.
-   **Website-inferred:** Yes.

## Step 2: How You Operate

### 5. What are the three most important things your company is trying to accomplish right now?

-   **Why it matters / who uses it:** Gives the EA and GM a priority
    hierarchy and helps every specialist connect work to company
    outcomes.
-   **Input:** Up to three short text fields
-   **Required:** Yes
-   **Example:**
    `Sign 10 new property owners; reduce tenant response time; increase referral business`
-   **If skipped:** Assume the immediate priority is serving existing
    customers well. Do not invent growth targets.

### 6. What makes someone choose you instead of an alternative?

-   **Why it matters / who uses it:** Gives Sales, Marketing, Lead Gen,
    Customer Service, and the EA the company's real differentiators.
-   **Input:** Short text with suggested answer
-   **Required:** No
-   **Example:**
    `Owners deal directly with an experienced property manager, not a call center.`
-   **If skipped:** Use clearly supported differentiators from the
    website. If none are clear, do not invent one.
-   **Website-inferred:** Yes.

### 7. What should your team know about your prices?

-   **Why it matters / who uses it:** Prevents Sales, Customer Service,
    Marketing, and the EA from inventing prices, discounts, or terms.
-   **Input:** Short text or `Use prices on my website`
-   **Required:** Yes
-   **Example:**
    `Use the published pricing. Never offer a discount without asking me.`
-   **If skipped:** Employees may quote only prices explicitly published
    by the company and may not offer discounts.
-   **Website-inferred:** Yes, when public pricing exists.

### 8. Who should your team treat as a competitor or alternative?

-   **Why it matters / who uses it:** Helps the GM, Sales, Lead Gen, and
    Marketing position the company accurately without making unsupported
    comparisons.
-   **Input:** Short list
-   **Required:** No
-   **Example:**
    `Local property managers, self-management, Buildium partner firms`
-   **If skipped:** Infer obvious market alternatives, but do not make
    comparative claims about them without evidence.
-   **Website-inferred:** Yes, where reasonably clear from the market.

## Step 3: Voice and Boundaries

### 9. How should your company sound when speaking to customers?

-   **Why it matters / who uses it:** Sets the baseline voice for every
    customer-facing employee.
-   **Input:** Choose up to three: `Warm`, `Direct`, `Professional`,
    `Casual`, `Concise`, `Detailed`, plus optional note
-   **Required:** Yes
-   **Example:** `Warm, direct, concise`
-   **If skipped:** Use professional, warm, and concise.

### 10. Are there words, claims, topics, or promises your team should never use?

-   **Why it matters / who uses it:** Creates a company-wide
    communication boundary for every employee.
-   **Input:** Short text
-   **Required:** No
-   **Example:**
    `Never say guaranteed returns. Never discuss a tenant's personal situation publicly.`
-   **If skipped:** Employees must avoid guarantees, unsupported claims,
    confidential information, and commitments outside confirmed company
    policy.

### 11. What must always come to you or another human for approval?

-   **Why it matters / who uses it:** Establishes company-wide
    escalation boundaries.
-   **Input:** Multi-select plus optional text: `Money or discounts`,
    `Contracts`, `Public statements`, `Sensitive customer issues`,
    `Legal matters`, `Security or account access`, `Other`
-   **Required:** Yes
-   **Example:** `Discounts, contracts, legal issues, refunds over $100`
-   **If skipped:** Require human approval for spending money, changing
    prices, contracts, legal or regulatory matters, sensitive public
    statements, security changes, and irreversible actions.

## Step 4: People and Connections

### 12. Who should your AI team go to when it needs a human decision?

-   **Why it matters / who uses it:** Gives every employee a clear
    escalation path.
-   **Input:** Name + role + email
-   **Required:** Yes
-   **Example:** `Jordan Lee, Owner, jordan@harborpine.com`
-   **If skipped:** Default to the company owner who created the
    account.

### 13. What hours does your company normally operate?

-   **Why it matters / who uses it:** Helps the EA, GM, Customer
    Service, Sales, and future Receptionist understand normal response
    expectations.
-   **Input:** Days + hours + timezone
-   **Required:** No
-   **Example:** `Monday to Friday, 8:30 AM to 5:30 PM, Eastern`
-   **If skipped:** Assume Monday to Friday, 9:00 AM to 5:00 PM in the
    owner's timezone, but do not present this externally as confirmed.

### 14. Which connected accounts should your team be allowed to use?

-   **Why it matters / who uses it:** Establishes the systems available
    to employees without assuming access.
-   **Input:** Connection cards for available integrations
-   **Required:** No
-   **Example:** `Company email, CRM, Facebook, Instagram, LinkedIn`
-   **If skipped:** Employees work only with tools already connected and
    authorized. They must not claim to have access to anything else.

------------------------------------------------------------------------

# Part 2: Per-Role Onboarding

## Executive Assistant

### 1. What are the three things you most want me to take off your plate?

-   **Why / who uses it:** Gives the EA an immediate personal priority
    list.
-   **Input:** Up to three short answers
-   **Required:** Yes
-   **Example:**
    `Inbox triage, research before decisions, follow-up emails`
-   **If skipped:** Start with research, drafting, and organizing
    requests given directly by the owner.

### 2. Which email account may I use on your behalf?

-   **Why / who uses it:** Defines the EA's authorized sending identity.
-   **Input:** Connected account selector
-   **Required:** No
-   **Example:** `mark@company.com`
-   **If skipped:** Do not send email.

### 3. Which emails may I send without asking you first?

-   **Why / who uses it:** Defines email autonomy.
-   **Input:** Multi-select: `Routine replies`, `Follow-ups`,
    `Internal messages`, `None`, plus note
-   **Required:** Yes
-   **Example:** `Routine follow-ups and internal messages`
-   **If skipped:** Draft only. Ask before sending.

### 4. What kinds of decisions should I bring to you immediately?

-   **Why / who uses it:** Establishes the owner's personal escalation
    threshold.
-   **Input:** Short text
-   **Required:** Yes
-   **Example:**
    `Anything involving money, legal commitments, an angry key customer, or a public statement`
-   **If skipped:** Apply company-wide approval rules.

### 5. How do you want me to communicate with you?

-   **Why / who uses it:** Shapes the EA's working relationship with the
    owner.
-   **Input:** Choose: `Brief and direct`, `Give me context`,
    `Recommend then explain`, `Ask before acting`
-   **Required:** No
-   **Example:** `Recommend first, then give me the key reasoning`
-   **If skipped:** Brief, direct, with a recommendation when
    appropriate.

### 6. When should I challenge you instead of simply carrying out an instruction?

-   **Why / who uses it:** Defines healthy executive pushback.
-   **Input:** Multi-select: `When I may be missing a risk`,
    `When it conflicts with a stated goal`,
    `When there is a cheaper/easier option`, `Only when necessary`
-   **Required:** No
-   **Example:**
    `If I'm missing a risk or contradicting one of our priorities`
-   **If skipped:** Flag material risks and conflicts with stated
    company priorities.

------------------------------------------------------------------------

## General Manager

### 1. What outcomes should the company be judged on this month?

-   **Why / who uses it:** Gives the GM concrete management priorities.
-   **Input:** Up to three short outcomes
-   **Required:** Yes
-   **Example:**
    `Add 10 clients, respond to customer issues within one business day, publish three posts weekly`
-   **If skipped:** Use the company priorities from onboarding without
    inventing targets.

### 2. Which employees should the GM coordinate?

-   **Why / who uses it:** Defines management scope.
-   **Input:** Employee multi-select
-   **Required:** Yes
-   **Example:** `Lead Gen, Marketing Manager, Customer Service`
-   **If skipped:** Coordinate all currently hired specialists.

### 3. What should the GM bring to you instead of deciding?

-   **Why / who uses it:** Defines management authority.
-   **Input:** Multi-select plus note
-   **Required:** Yes
-   **Example:**
    `Spending, changes to offers, sensitive customer issues`
-   **If skipped:** Apply company-wide approval rules.

### 4. What should the GM pay closest attention to?

-   **Why / who uses it:** Focuses reporting and management attention.
-   **Input:** Choose up to three: `Sales`, `Leads`, `Marketing`,
    `Customer issues`, `Work completion`, `Costs`, `Other`
-   **Required:** No
-   **Example:** `Sales, leads, customer issues`
-   **If skipped:** Focus on company priorities and incomplete or
    blocked employee work.

### 5. What do you want in your morning brief?

-   **Why / who uses it:** Controls what the GM summarizes.
-   **Input:** Multi-select
-   **Required:** No
-   **Example:**
    `What finished, what is blocked, decisions I need to make, today's priorities`
-   **If skipped:** Include completed work, blocked work, decisions
    needed, and current priorities.

------------------------------------------------------------------------

## Administrative Assistant

### 1. What kinds of documents do you expect this employee to create most often?

-   **Why / who uses it:** Focuses document work.
-   **Input:** Multi-select plus other
-   **Required:** No
-   **Example:** `Meeting notes, research summaries, internal documents`
-   **If skipped:** Handle documents requested in assigned tasks.

### 2. Are there company templates or formats it should follow?

-   **Why / who uses it:** Keeps documents consistent.
-   **Input:** File/template selector or short text
-   **Required:** No
-   **Example:** `Use our proposal format for client-facing documents`
-   **If skipped:** Use a clean professional format.

### 3. What information is confidential and should never appear outside internal work?

-   **Why / who uses it:** Defines information boundaries.
-   **Input:** Short text
-   **Required:** Yes
-   **Example:**
    `Customer financial information and internal pricing calculations`
-   **If skipped:** Treat non-public customer, employee, financial,
    credential, and internal operational information as confidential.

### 4. When research is uncertain, what should it do?

-   **Why / who uses it:** Controls evidence quality.
-   **Input:** Choice: `Flag uncertainty`, `Ask me`,
    `Use only verified sources`
-   **Required:** No
-   **Example:** `Flag uncertainty and show me the source`
-   **If skipped:** Flag uncertainty and provide sources.

### 5. What must it never send or publish without approval?

-   **Why / who uses it:** Prevents drafts becoming unauthorized
    external communications.
-   **Input:** Short text
-   **Required:** No
-   **Example:** `Anything client-facing`
-   **If skipped:** Treat external distribution as requiring human
    approval unless explicitly authorized.

------------------------------------------------------------------------

## Lead Generation Specialist

### 1. Describe your ideal lead in one sentence.

-   **Why / who uses it:** Defines who the specialist should look for.
-   **Input:** Short text
-   **Required:** Yes
-   **Example:**
    `Independent dental practices in Texas with 5 to 30 employees`
-   **If skipped:** Use the company's confirmed main customer profile.

### 2. What makes a lead worth recording in your CRM?

-   **Why / who uses it:** Defines qualification before CRM entry.
-   **Input:** Short text
-   **Required:** Yes
-   **Example:**
    `Fits our industry and size, operates in our service area, and has a working business website`
-   **If skipped:** Require a reasonable match to the confirmed customer
    profile and enough public information to identify the business.

### 3. Which locations should it target or avoid?

-   **Why / who uses it:** Prevents irrelevant prospecting.
-   **Input:** Short text
-   **Required:** No
-   **Example:** `United States only. Exclude Alaska and Hawaii.`
-   **If skipped:** Use the geographic market clearly stated by the
    company. If unclear, do not assume a geographic restriction.

### 4. Which types of businesses or people should it never target?

-   **Why / who uses it:** Creates exclusions.
-   **Input:** Short text
-   **Required:** No
-   **Example:**
    `Existing customers, franchises, and businesses with fewer than five employees`
-   **If skipped:** Exclude known existing customers and obvious poor
    matches.

### 5. Which CRM should receive qualified leads?

-   **Why / who uses it:** Defines the authorized destination.
-   **Input:** Connected CRM selector
-   **Required:** No
-   **Example:** `Staff AI CRM`
-   **If skipped:** Research leads but do not write them to a CRM.

### 6. What information matters most for each lead?

-   **Why / who uses it:** Focuses research.
-   **Input:** Choose up to five fields
-   **Required:** No
-   **Example:**
    `Company, decision-maker, role, website, reason they fit`
-   **If skipped:** Record company, website, relevant contact when
    publicly available, and reason for fit.

------------------------------------------------------------------------

## Sales Representative

### 1. What does a qualified lead look like?

-   **Why / who uses it:** Defines who Sales should spend time on.
-   **Input:** Short text
-   **Required:** Yes
-   **Example:**
    `A business owner with at least five employees who has confirmed they need help with sales or administration`
-   **If skipped:** Use the confirmed company customer profile and
    qualification rules.

### 2. Which email account may this employee send from?

-   **Why / who uses it:** Establishes authorized sales identity.
-   **Input:** Connected email selector
-   **Required:** No
-   **Example:** `sales@company.com`
-   **If skipped:** Do not send email.

### 3. What should happen when a prospect replies positively?

-   **Why / who uses it:** Defines the handoff after interest.
-   **Input:** Choice plus short note: `Hand to me`,
    `Hand to another person`, `Continue by email`
-   **Required:** Yes
-   **Example:** `Notify me and hand the conversation to me`
-   **If skipped:** Escalate the reply to the company owner.

### 4. What may the Sales Representative offer without asking?

-   **Why / who uses it:** Defines commercial authority.
-   **Input:** Multi-select: `Published pricing`, `Approved offers`,
    `Approved trial`, `Nothing beyond information`
-   **Required:** Yes
-   **Example:** `Published pricing and the standard trial only`
-   **If skipped:** Quote confirmed published terms only. No discounts
    or custom commitments.

### 5. What must it never promise?

-   **Why / who uses it:** Prevents unauthorized or misleading
    commitments.
-   **Input:** Short text
-   **Required:** Yes
-   **Example:**
    `Guaranteed results, custom features, delivery dates, discounts, or contract terms`
-   **If skipped:** Never guarantee outcomes or promise discounts,
    custom work, deadlines, refunds, contractual terms, or unavailable
    capabilities.

### 6. Which CRM should it update?

-   **Why / who uses it:** Establishes where sales contacts are
    recorded.
-   **Input:** Connected CRM selector
-   **Required:** No
-   **Example:** `Staff AI CRM`
-   **If skipped:** Do not write contacts to a CRM.

------------------------------------------------------------------------

## Marketing Manager

### 1. What is marketing responsible for achieving right now?

-   **Why / who uses it:** Gives the manager an outcome instead of vague
    activity.
-   **Input:** Up to three short goals
-   **Required:** Yes
-   **Example:**
    `Generate qualified leads and make the brand more visible to property owners`
-   **If skipped:** Use confirmed company priorities without inventing
    numeric targets.

### 2. Who is the primary audience?

-   **Why / who uses it:** Focuses strategy, research, CRM contacts, and
    social scheduling.
-   **Input:** Suggested short text
-   **Required:** Yes
-   **Example:** `Residential property owners with 2 to 50 units`
-   **If skipped:** Use the confirmed company customer profile.
-   **Website-inferred:** Yes.

### 3. Which social accounts may the marketing team use?

-   **Why / who uses it:** Defines authorized publishing destinations.
-   **Input:** Connected account multi-select
-   **Required:** No
-   **Example:** `LinkedIn and Facebook`
-   **If skipped:** Do not schedule social posts.

### 4. What themes should marketing emphasize?

-   **Why / who uses it:** Gives the manager strategic content pillars.
-   **Input:** Up to four short topics
-   **Required:** No
-   **Example:**
    `Owner peace of mind, tenant quality, maintenance, local expertise`
-   **If skipped:** Infer themes from confirmed offerings and website
    content, clearly treating them as suggestions.

### 5. What topics or claims are off limits?

-   **Why / who uses it:** Prevents risky campaigns and content.
-   **Input:** Short text
-   **Required:** Yes
-   **Example:** `Politics, competitor attacks, guaranteed returns`
-   **If skipped:** Avoid politics, sensitive social issues, unsupported
    comparisons, guarantees, and confidential information.

### 6. What requires your approval before it goes out?

-   **Why / who uses it:** Defines campaign and publishing autonomy.
-   **Input:** Multi-select: `Every post`, `New campaigns`, `Pricing`,
    `Offers`, `Sensitive topics`, `Nothing beyond company rules`
-   **Required:** Yes
-   **Example:** `New campaigns, offers, pricing, sensitive topics`
-   **If skipped:** Require approval for new offers, pricing, paid
    commitments, sensitive claims, and material changes in positioning.

------------------------------------------------------------------------

## Marketing Specialist

### 1. What type of marketing work should this employee focus on?

-   **Why / who uses it:** Defines the specialist's practical workload.
-   **Input:** Choose up to three: `Research`, `Content drafts`,
    `Campaign materials`, `Competitive research`, `Website copy`,
    `Other`
-   **Required:** Yes
-   **Example:**
    `Content drafts, campaign materials, competitive research`
-   **If skipped:** Support tasks assigned by the Marketing Manager or
    owner.

### 2. Who is the main audience?

-   **Why / who uses it:** Keeps copy and research relevant.
-   **Input:** Suggested short text
-   **Required:** No
-   **Example:**
    `Small property investors who are tired of managing tenants themselves`
-   **If skipped:** Use the confirmed company customer profile.
-   **Website-inferred:** Yes.

### 3. Which offers or services should it prioritize?

-   **Why / who uses it:** Focuses marketing production.
-   **Input:** Offering multi-select
-   **Required:** No
-   **Example:** `Full-service property management`
-   **If skipped:** Use company-level priority offerings.

### 4. What should the brand never sound like?

-   **Why / who uses it:** Adds practical negative guidance to the
    company voice.
-   **Input:** Short text
-   **Required:** No
-   **Example:** `Pushy, corporate, or exaggerated`
-   **If skipped:** Avoid aggressive, exaggerated, or unsupported
    language.

### 5. What must be approved before it is used publicly?

-   **Why / who uses it:** Keeps drafts from becoming unauthorized
    claims.
-   **Input:** Short text or multi-select
-   **Required:** Yes
-   **Example:** `New claims, offers, pricing, testimonials`
-   **If skipped:** Require approval for new claims, offers, prices,
    testimonials, and externally published material.

------------------------------------------------------------------------

## Social Media Manager

### 1. Which social accounts may this employee manage?

-   **Why / who uses it:** Defines exactly where it may schedule posts.
-   **Input:** Connected Facebook, Instagram, LinkedIn account
    multi-select
-   **Required:** Yes
-   **Example:** `Company Facebook, Instagram, and LinkedIn`
-   **If skipped:** Do not schedule posts.

### 2. How often should it post?

-   **Why / who uses it:** Establishes cadence.
-   **Input:** Simple frequency selector by platform
-   **Required:** Yes
-   **Example:**
    `Facebook 3 times weekly, Instagram 3 times weekly, LinkedIn twice weekly`
-   **If skipped:** Draft recommendations only. Do not establish a
    publishing cadence on the owner's behalf.

### 3. What should it talk about most?

-   **Why / who uses it:** Establishes content pillars.
-   **Input:** Up to four short topics
-   **Required:** Yes
-   **Example:**
    `Property-owner tips, maintenance, tenant screening, local market education`
-   **If skipped:** Use confirmed products, customer needs, and existing
    website themes.

### 4. What topics are off limits?

-   **Why / who uses it:** Creates explicit editorial boundaries.
-   **Input:** Short text
-   **Required:** Yes
-   **Example:**
    `Politics, religion, individual tenant disputes, competitor criticism`
-   **If skipped:** Avoid politics, religion, sensitive personal
    matters, competitor attacks, and confidential information.

### 5. What must this employee never say about your company?

-   **Why / who uses it:** Prevents dangerous brand claims.
-   **Input:** Short text
-   **Required:** Yes
-   **Example:**
    `Never guarantee rental income or claim we are the cheapest`
-   **If skipped:** Never make guarantees, unverifiable superiority
    claims, fabricated testimonials, or claims unsupported by company
    information.

### 6. Which posts need approval before scheduling?

-   **Why / who uses it:** Establishes publishing autonomy. Scheduled
    posts must be at least two hours ahead.
-   **Input:** Multi-select: `All posts`, `Offers`, `Pricing`,
    `Sensitive topics`, `New campaigns`, `Only exceptions`
-   **Required:** Yes
-   **Example:** `Offers, pricing, new campaigns, sensitive topics`
-   **If skipped:** Require approval before scheduling any post.

------------------------------------------------------------------------

## Customer Service Representative

### 1. Which email account may this employee use for customer support?

-   **Why / who uses it:** Establishes authorized support identity.
-   **Input:** Connected email selector
-   **Required:** No
-   **Example:** `support@company.com`
-   **If skipped:** Do not send email.

### 2. What issues may it resolve without asking?

-   **Why / who uses it:** Defines support autonomy.
-   **Input:** Short text or category multi-select
-   **Required:** Yes
-   **Example:**
    `General questions, status updates, published policy questions`
-   **If skipped:** Answer factual questions using confirmed company
    information. Escalate anything requiring a decision or exception.

### 3. Which issues should be escalated immediately?

-   **Why / who uses it:** Defines high-priority human handoffs.
-   **Input:** Multi-select plus note
-   **Required:** Yes
-   **Example:**
    `Refund requests, legal threats, security issues, angry key customers`
-   **If skipped:** Escalate money disputes, legal threats, safety or
    security issues, privacy concerns, and requests for policy
    exceptions.

### 4. What may it offer to resolve a complaint?

-   **Why / who uses it:** Prevents unauthorized compensation.
-   **Input:** Choice: `Nothing without approval`, `Approved remedies`,
    plus text
-   **Required:** Yes
-   **Example:** `Nothing involving money without approval`
-   **If skipped:** No refunds, credits, discounts, or financial
    promises without human approval.

### 5. What should it never say to a customer?

-   **Why / who uses it:** Establishes communication boundaries.
-   **Input:** Short text
-   **Required:** No
-   **Example:**
    `Never blame another employee or promise an exact resolution time unless confirmed`
-   **If skipped:** Never blame, speculate, disclose confidential
    information, admit legal liability, or promise an unconfirmed
    outcome or deadline.

### 6. When should it stop replying and hand the conversation to a human?

-   **Why / who uses it:** Prevents the AI from prolonging sensitive
    conversations.
-   **Input:** Short text
-   **Required:** No
-   **Example:**
    `After two unsuccessful attempts to resolve the issue, or immediately if the customer asks for a person`
-   **If skipped:** Hand off when requested, when facts are
    insufficient, or when the issue crosses an approval boundary.

------------------------------------------------------------------------

## Bookkeeper

> **Not yet available to hire.** This onboarding is for the future
> accounting integration and must not be exposed as a live hiring flow
> until the accounting ledger capability exists.

### 1. Which company books should this employee work with?

-   **Why / who uses it:** Defines the authorized accounting entity and
    ledger.
-   **Input:** Connected accounting company selector
-   **Required:** Yes
-   **Example:** `Harbor & Pine Property Management LLC`
-   **If skipped:** Do not access or change accounting records.

### 2. What bookkeeping work may it do without approval?

-   **Why / who uses it:** Defines accounting autonomy.
-   **Input:** Multi-select
-   **Required:** Yes
-   **Example:**
    `Categorize routine transactions and prepare reconciliation suggestions`
-   **If skipped:** Read and prepare suggestions only. Make no ledger
    changes.

### 3. Which transactions or categories always require review?

-   **Why / who uses it:** Protects sensitive accounting activity.
-   **Input:** Short text
-   **Required:** Yes
-   **Example:** `Owner draws, payroll, taxes, transactions over $1,000`
-   **If skipped:** Require review for payroll, taxes, owner
    transactions, unusual entries, and material corrections.

### 4. What amount should trigger human approval?

-   **Why / who uses it:** Establishes a monetary threshold.
-   **Input:** Currency amount
-   **Required:** Yes
-   **Example:** `$500`
-   **If skipped:** All ledger-changing actions require approval.

### 5. Who should receive accounting questions or exceptions?

-   **Why / who uses it:** Establishes escalation.
-   **Input:** Person selector
-   **Required:** Yes
-   **Example:** `Owner`
-   **If skipped:** Escalate to the company owner.

### 6. What must it never change without approval?

-   **Why / who uses it:** Protects books from destructive or
    consequential changes.
-   **Input:** Short text
-   **Required:** No
-   **Example:**
    `Closed periods, tax entries, payroll, chart of accounts`
-   **If skipped:** Never alter closed periods, tax treatment, payroll,
    bank details, chart of accounts, or previously reconciled material
    entries without approval.

------------------------------------------------------------------------

## Receptionist

> **Not yet available to hire.** This onboarding is for the future phone
> and calendar systems and must not be exposed as a live hiring flow
> until phone calls and calendar booking exist.

### 1. Which phone number should this employee answer?

-   **Why / who uses it:** Defines the authorized business line.
-   **Input:** Connected phone-number selector
-   **Required:** Yes
-   **Example:** `Main office: +1 305 555 0184`
-   **If skipped:** Do not answer calls.

### 2. What should it say when answering?

-   **Why / who uses it:** Defines the company's greeting.
-   **Input:** Short text with suggested greeting
-   **Required:** Yes
-   **Example:**
    `Thank you for calling Harbor & Pine. How can I help you today?`
-   **If skipped:** Use a simple greeting with the confirmed company
    name.

### 3. What kinds of calls should be transferred to a human immediately?

-   **Why / who uses it:** Establishes escalation.
-   **Input:** Multi-select plus note
-   **Required:** Yes
-   **Example:**
    `Emergencies, legal matters, angry customers, existing owner cancellations`
-   **If skipped:** Transfer emergencies, legal or safety matters,
    sensitive complaints, and any caller who asks for a person.

### 4. What appointments may it book?

-   **Why / who uses it:** Defines calendar authority.
-   **Input:** Connected appointment-type multi-select
-   **Required:** Yes
-   **Example:** `15-minute owner consultation`
-   **If skipped:** Do not book appointments.

### 5. What information should it collect before a handoff or booking?

-   **Why / who uses it:** Ensures useful call context.
-   **Input:** Up to five fields
-   **Required:** No
-   **Example:** `Name, phone, email, reason for call, property count`
-   **If skipped:** Collect name, callback information, and reason for
    contact.

### 6. What must it never promise or discuss?

-   **Why / who uses it:** Prevents unauthorized verbal commitments.
-   **Input:** Short text
-   **Required:** Yes
-   **Example:**
    `Never quote custom prices, promise availability, discuss legal disputes, or guarantee results`
-   **If skipped:** Never make financial, legal, contractual,
    availability, or outcome guarantees.

------------------------------------------------------------------------

# Part 3: Guardrail Questions

These are the minimum role-specific boundaries that should be stored as
structured operating rules. Where a company-wide rule is stricter, the
stricter rule wins.

## Executive Assistant

1.  **Which emails, if any, may I send without your approval?**
2.  **What information should I never share outside the company?**
3.  **Which decisions must always come back to you before I act?**
4.  **Are there people or organizations I should never contact without
    asking first?**
5.  **What kinds of commitments must I never make on your behalf?**

**Safe default:** Draft rather than send when authority is unclear.
Never commit money, contractual terms, confidential information, policy
exceptions, or unconfirmed outcomes.

## General Manager

1.  **Which decisions may the GM make without you?**
2.  **What changes to employee priorities require your approval?**
3.  **What company information must never leave the company?**
4.  **Which problems must be escalated immediately?**
5.  **What may the GM never promise to a customer or employee?**

**Safe default:** Coordinate and recommend, but require human approval
for financial, contractual, legal, security, sensitive personnel, or
irreversible decisions.

## Administrative Assistant

1.  **Which documents are strictly internal?**
2.  **What information must never be included in externally shared
    documents?**
3.  **May this employee send or publish anything, or only prepare
    drafts?**
4.  **Which sources or types of information should it never rely on
    without verification?**
5.  **What should it do when instructions or facts conflict?**

**Safe default:** Prepare drafts only for external use, protect
non-public information, cite sources for research, and escalate
conflicting or uncertain instructions.

## Lead Generation Specialist

1.  **Which people or companies must never be prospected?**
2.  **What information may be collected about a prospect?**
3.  **What information must never be recorded in the CRM?**
4.  **What minimum criteria must a lead meet before being added?**
5.  **When should a questionable lead be sent to a human instead?**

**Safe default:** Use business-relevant public information, exclude
existing customers, avoid unnecessary sensitive personal information,
and do not fabricate missing contact data.

## Sales Representative

1.  **What prices and offers may it quote without approval?**
2.  **What must it never promise?**
3.  **When must a prospect conversation be handed to a human?**
4.  **Which claims about your company or competitors are prohibited?**
5.  **May it send email without approval, and from which account?**
6.  **What customer information must never be disclosed or recorded?**

**Safe default:** Use confirmed pricing and product facts only. No
discounts, guarantees, custom commitments, legal promises, fabricated
claims, or disclosure of confidential information.

## Marketing Manager

1.  **Which claims require approval before use?**
2.  **Which topics are completely off limits?**
3.  **Which offers, prices, or campaigns require approval?**
4.  **Which social accounts may it schedule content to?**
5.  **What competitor comparisons are prohibited?**
6.  **What confidential information must never become marketing
    content?**

**Safe default:** No unsupported claims, new commercial offers,
sensitive topics, confidential information, or unverified competitor
claims without approval.

## Marketing Specialist

1.  **Which claims may never appear in a draft?**
2.  **Which topics should it avoid?**
3.  **What customer or internal information is confidential?**
4.  **Which sources must be verified before use?**
5.  **What material requires approval before external use?**

**Safe default:** Create evidence-based drafts, never fabricate facts or
testimonials, and treat external publication as requiring approval
unless explicitly authorized.

## Social Media Manager

1.  **Which accounts may it post to?**
2.  **Which topics must it never discuss?**
3.  **What must it never say about the company, customers, or
    competitors?**
4.  **Which posts require approval before scheduling?**
5.  **What information must never appear in a post?**
6.  **When should it stop and ask a human rather than responding or
    posting?**

**Safe default:** No posting without an authorized account and cadence.
No guarantees, confidential information, fabricated testimonials,
unsupported competitor claims, or sensitive content. If approval rules
are not set, require approval for every post.

## Customer Service Representative

1.  **Which issues may it resolve without approval?**
2.  **What compensation, if any, may it offer?**
3.  **Which complaints require immediate human escalation?**
4.  **What must it never admit, promise, or speculate about?**
5.  **What customer information must never be disclosed?**
6.  **When must it stop replying and hand off?**

**Safe default:** No refunds, credits, discounts, admissions of
liability, unconfirmed deadlines, policy exceptions, or disclosure of
private information. Escalate legal, security, privacy, safety, and
high-conflict cases.

## Bookkeeper

> Not yet available to hire.

1.  **Which accounting changes may it make without approval?**
2.  **What dollar amount always requires human review?**
3.  **Which accounts, categories, or periods must it never alter without
    approval?**
4.  **What should happen when records do not reconcile?**
5.  **Which financial information may never be shared outside authorized
    people?**
6.  **Which tax, payroll, banking, or owner transactions must always be
    escalated?**

**Safe default:** Read and prepare recommendations only. No money
movement. No changes to closed periods, payroll, tax treatment, bank
details, owner transactions, or material reconciled entries without
approval.

## Receptionist

> Not yet available to hire.

1.  **Which calls must immediately go to a human?**
2.  **What information may it give callers without approval?**
3.  **What must it never promise over the phone?**
4.  **Which appointment types may it book?**
5.  **What information must never be repeated to a caller?**
6.  **What should it do if it cannot verify who the caller is or what
    they are asking for?**

**Safe default:** No financial, legal, contractual, availability, or
outcome promises. Protect private information, transfer sensitive
matters, and do not book outside explicitly authorized appointment
types.

------------------------------------------------------------------------

# Part 4: Notification and Email Copy

## Welcome After Signup

**Email subject:** Your Staff AI company is being set up

**Email body:**

Hi {{first_name}},

Your company is now being set up in Staff AI.

Your Company Office includes your Executive Assistant and General
Manager. They will use the company information you provide to understand
your priorities, how you work, and where they need your approval.

Once your workforce is ready, we will let you know.

For now, finish your company briefing so your team starts with the right
context.

Staff AI

**Push notification:** `Your Staff AI company is being set up.`

------------------------------------------------------------------------

## Workforce Is Ready

**Email subject:** Your Staff AI workforce is ready

**Email body:**

Hi {{first_name}},

Your Company Office is ready.

Your Executive Assistant and General Manager now have the company
context and operating rules you provided. You can start by giving your
Executive Assistant a real piece of work.

A good first task is something you would normally research, organize,
draft, or follow up on yourself.

Your team will report its work back to you in Staff AI.

Staff AI

**Push notification:**
`Your workforce is ready. Give your EA the first task.`

------------------------------------------------------------------------

## Employee Finished a Task

**Email subject:** {{employee_name}} finished: {{task_name}}

**Email body:**

Hi {{first_name}},

{{employee_name}}, your {{employee_role}}, has finished:

{{task_name}}

The result is waiting in your Staff AI conversation.

Open the task to review the work, continue the conversation, or give the
next instruction.

Staff AI

**Push notification:** `{{employee_name}} finished {{task_name}}.`

------------------------------------------------------------------------

## Something Needs Your Approval

**Email subject:** {{employee_name}} needs your approval

**Email body:**

Hi {{first_name}},

{{employee_name}} has reached a point that requires your decision before
continuing.

**Task:** {{task_name}}

**Approval needed:** {{approval_summary}}

No action has been taken on this item yet.

Review the request in Staff AI and choose whether to approve it, decline
it, or give different instructions.

Staff AI

**Push notification:**
`{{employee_name}} needs your approval before continuing.`

------------------------------------------------------------------------

## Daily Morning Brief From the General Manager

**Email subject:** Your morning brief for {{date}}

**Email body:**

Good morning, {{first_name}}.

Here is where the company stands.

**Completed:** {{completed_summary}}

**In progress:** {{in_progress_summary}}

**Needs your attention:** {{attention_summary}}

**Today's priorities:** {{priority_summary}}

I have kept the brief to the decisions and work that matter most. The
full details are available in Staff AI.

{{gm_name}} General Manager

**Push notification:** `Your GM morning brief is ready.`

------------------------------------------------------------------------

## Trial Ending in Two Days

**Email subject:** Your Staff AI trial ends in two days

**Email body:**

Hi {{first_name}},

Your Staff AI trial ends on {{trial_end_date}}.

You have two days remaining to work with your Company Office and
evaluate whether Staff AI belongs in your company.

If you continue, your subscription will be charged according to the plan
you selected.

You can review your subscription and billing details in Staff AI before
the trial ends.

Staff AI

**Push notification:** `Your Staff AI trial ends in two days.`

------------------------------------------------------------------------

## Payment Failed

**Email subject:** We could not process your Staff AI payment

**Email body:**

Hi {{first_name}},

We could not process the latest payment for your Staff AI subscription.

Please review your billing information to avoid an interruption to your
company's workforce.

Your employees and company information have not been deleted.

Open Staff AI to review your billing details and update your payment
method.

Staff AI

**Push notification:**
`Your Staff AI payment failed. Please check your billing details.`

------------------------------------------------------------------------

## Employee Could Not Finish and Escalated

**Email subject:** {{employee_name}} needs help with {{task_name}}

**Email body:**

Hi {{first_name}},

{{employee_name}} could not safely complete this task without human
input:

{{task_name}}

**What stopped the work:** {{reason}}

The employee has stopped rather than guessing or taking an action
outside its authority.

Open the conversation to answer the question, change the instruction, or
take over the task.

Staff AI

**Push notification:** `{{employee_name}} stopped and needs your input.`

------------------------------------------------------------------------

# Implementation Notes

1.  **Prefill before questioning.** Website-derived company name,
    description, offerings, audience, positioning, public pricing, and
    obvious market context should be extracted first and shown as
    editable confirmation cards.

2.  **Separate facts from assumptions.** Every inferred value should
    retain provenance and confidence. An employee should be able to
    distinguish `owner confirmed` from `website inferred` from
    `system default`.

3.  **Company rules override role defaults.** A stricter company-wide
    approval or communication rule always wins over a role-level
    setting.

4.  **Role onboarding should be progressive.** Ask only questions
    relevant to the tools currently connected. For example, do not ask
    the Sales Representative to choose an email sender if no email
    account is connected. Instead offer connection as the next step.

5.  **Safe defaults should reduce authority, not invent it.** Missing
    information should generally cause the employee to draft, research,
    recommend, or escalate rather than send, publish, commit, or change
    external systems.

6.  **Do not expose unavailable roles as hireable.** Bookkeeper and
    Receptionist onboarding may be implemented behind feature controls,
    but customers must see them as unavailable until their required
    accounting, phone, and calendar systems are production-ready.

7.  **Do not confuse capability with permission.** An employee being
    technically able to send email, schedule a post, or update CRM does
    not mean it has permission to do so for a particular company.
    Connection, authorization, and role guardrails must all be
    satisfied.

8.  **Keep onboarding fast.** Use defaults, multi-selects, inferred
    answers, and short editable suggestions. Longer policy documents can
    be added later, but should not be required to get a company
    operational.
