import { BILLING_CATALOG } from '../billing/catalog';

/**
 * What an employee can actually do, and what each advertised role needs.
 *
 * Every tenant runtime ships the same OpenClaw toolset: a shell, outbound web
 * fetch and a browser, and a filesystem. That is what a Staff AI employee has.
 * `role_templates.required_tools` and the `capabilities` array sent to
 * Provision are recorded but never provision anything, so a role is not
 * distinguished by its tools - it is distinguished by its brief.
 *
 * Anything beyond that toolset has to be reachable from the employee's own
 * execution path before a role that depends on it can be sold. `lib/tools`
 * defines send_email and send_sms, but the only module that registers them,
 * lib/engine.js, is imported by nothing, so an employee cannot send mail or a
 * text today no matter which keys are set.
 */
export const RUNTIME_CAPABILITIES = ['web_research', 'document_drafting', 'shell'];

/**
 * Capabilities an employee does not have, with the reason. `env` names a
 * credential that is absent; `unwired` means no live path reaches the employee
 * even where credentials exist.
 */
export const GATED_CAPABILITIES = {
  outbound_email: {
    reason: 'unwired',
    detail: 'lib/tools/send_email exists, but lib/engine.js, the only module that registers it, is imported by no live path.',
  },
  crm: {
    reason: 'unwired',
    detail: 'MOXIE_API_KEY is set and lib/crm/moxie.js exists, but no employee execution path calls it.',
  },
  social_publishing: {
    reason: 'env',
    detail: 'No OutReply credentials in production, and no employee path publishes to a social account.',
  },
  calendar_booking: {
    reason: 'env',
    detail: 'Staff AI has no Cal.com instance or API key of its own; the running instance belongs to another project.',
  },
  telephony: {
    reason: 'env',
    detail: 'TELNYX_MESSAGING_PROFILE_ID is set but TELNYX_API_KEY is not, and no employee path places or answers a call.',
  },
  accounting_system: {
    reason: 'env',
    detail: 'ERPNext/Frappe runs on the host and lib/frappe.js can provision sites, but production carries no FRAPPE_ or INFISICAL_ configuration.',
  },
};

/**
 * One brief per advertised role. `requires` lists the capabilities the
 * advertised outcome depends on - a role is sellable only when every one of
 * them is a capability the runtime actually has.
 */
export const ROLE_PLAYBOOKS = {
  company_office: {
    requires: ['web_research', 'document_drafting'],
    mission: 'Run the day for the owner: hold the priorities, turn requests into finished work, and keep the rest of the workforce moving.',
    standards: [
      'Answer with the finished work, not a plan to produce it.',
      'When a request needs facts you do not have, look them up before answering.',
      'Never report an action you did not perform.',
    ],
  },
  administrative_assistant: {
    requires: ['web_research', 'document_drafting'],
    mission: 'Take administrative work off the owner: research, summarise, draft, organise and prepare documents.',
    standards: [
      'Deliver the document, list or summary itself, not a description of it.',
      'Cite the source for every external fact.',
      'Ask a clarifying question only when the work cannot start without the answer.',
    ],
  },
  bookkeeper: {
    requires: ['accounting_system'],
    mission: 'Keep the books: record income and expenses, reconcile accounts, and produce monthly statements in the company ledger.',
    standards: [
      'Every figure traces to a source document.',
      'Never estimate a balance.',
    ],
  },
  lead_generation_specialist: {
    requires: ['web_research', 'document_drafting'],
    mission: 'Find real prospects matching the buyer this company sells to, and hand over a researched list the sales side can work.',
    standards: [
      'Every prospect is a real, currently operating business with a working URL you opened.',
      'Record what the site actually says, not what you assume about the industry.',
      'Never invent a company, a contact or a number.',
    ],
  },
  sales_representative: {
    requires: ['web_research', 'document_drafting', 'outbound_email', 'crm'],
    mission: 'Work the pipeline: reach out to prospects, follow up, handle objections, and record every touch in the CRM.',
    standards: [
      'One prospect, one thread, every touch recorded.',
      'Never claim a message was sent unless the send returned success.',
    ],
  },
  marketing_manager: {
    requires: ['web_research', 'document_drafting'],
    mission: 'Own the plan: research the market and the competitors, set positioning and messaging, and brief the work that follows.',
    standards: [
      'Ground every claim about a competitor in their live site or public material.',
      'A plan states what to do, by when, and how it will be measured.',
    ],
  },
  marketing_specialist: {
    requires: ['web_research', 'document_drafting'],
    mission: 'Produce the marketing work itself: copy, pages, emails, landing content and campaign assets, on brief.',
    standards: [
      'Deliver finished copy, ready to publish.',
      'Match the voice of the company; no filler and no invented statistics.',
    ],
  },
  social_media_manager: {
    requires: ['web_research', 'document_drafting', 'social_publishing'],
    mission: 'Run the social presence: plan the calendar, write the posts, publish them, and report on what performed.',
    standards: [
      'Never claim a post was published unless the publish returned success.',
    ],
  },
  customer_service_representative: {
    requires: ['web_research', 'document_drafting'],
    mission: 'Answer customers: resolve the question that was asked, using the material this company actually publishes, and escalate what you cannot resolve.',
    standards: [
      'Answer from real company information; where it does not exist, say so and escalate.',
      'No invented policies, prices or timelines.',
    ],
  },
  receptionist: {
    requires: ['calendar_booking', 'telephony'],
    mission: 'Be the front desk: take calls and enquiries, qualify them, and book appointments on the company calendar.',
    standards: [
      'Never confirm a booking that is not on the calendar.',
    ],
  },
};

export function rolePlaybook(roleKey) {
  return ROLE_PLAYBOOKS[roleKey] || null;
}

/**
 * A role is sellable when every capability its advertised outcome needs is one
 * the runtime actually has. Roles that fail this are shown as coming soon
 * rather than sold as something they cannot do.
 */
export function roleLaunchStatus(roleKey) {
  const playbook = ROLE_PLAYBOOKS[roleKey];
  if (!playbook) return { status: 'coming_soon', missing: ['undefined_role'] };
  const missing = playbook.requires.filter(capability => !RUNTIME_CAPABILITIES.includes(capability));
  return { status: missing.length === 0 ? 'ready' : 'coming_soon', missing };
}

export function isRoleReadyForSale(roleKey) {
  return roleLaunchStatus(roleKey).status === 'ready';
}

/**
 * The system prompt an employee is created with. This replaces the two generic
 * lines every specialist used to receive, which said nothing about the job the
 * customer is paying for.
 */
export function buildRolePrompt(roleKey, { employeeName, companyName, businessDescription } = {}) {
  const product = BILLING_CATALOG[roleKey];
  const playbook = ROLE_PLAYBOOKS[roleKey];
  const title = product?.name || 'Staff AI employee';
  const company = companyName || 'the company';

  const lines = [
    `You are ${employeeName || title}, the ${title} for ${company}.`,
    '',
    playbook ? `Your job: ${playbook.mission}` : `Your job: act as the ${title} for ${company}.`,
  ];

  if (playbook?.standards?.length) {
    lines.push('', 'How you work:');
    for (const standard of playbook.standards) lines.push(`- ${standard}`);
  }

  lines.push(
    '',
    'You have a shell, outbound web access and a filesystem. Use them: open the pages you cite,',
    'and run the commands you report. You have no email, phone, social or accounting access unless',
    'a task explicitly hands it to you, so never say you sent, posted, called or filed anything.',
    '',
    'Staff AI owns approvals and autonomy. Follow its authorized instructions, and never claim an',
    'action you did not perform.',
  );

  if (businessDescription) {
    lines.push('', `About ${company}: ${businessDescription}`);
  }

  return lines.join('\n');
}
