import { listPages, schedulePost, publishPost, listScheduled, isConfigured } from './outreply';

/**
 * The tools an employee may call, and which roles may call them.
 *
 * Role gating is real here, unlike `role_templates.required_tools` and the
 * `capabilities` array sent to Provision, which are recorded and provision
 * nothing. A Marketing Specialist cannot publish to a social account by asking
 * nicely; the bridge refuses it.
 */
const ANY = null; // available to every employee

export const TOOLS = {
  /** What can I post to? Always safe, and the Social Media Manager needs it before anything else. */
  social_pages: {
    roles: ['Social Media Manager', 'Marketing Manager'],
    available: isConfigured,
    async run() {
      const pages = await listPages();
      return { pages, note: 'Use the id field as page_id when scheduling.' };
    },
  },

  /**
   * Scheduling rather than publishing is the default an autonomous employee
   * gets. It is visible to the customer and cancellable before an audience
   * ever sees it.
   */
  social_schedule: {
    roles: ['Social Media Manager', 'Marketing Manager'],
    available: isConfigured,
    async run(input) {
      const { page_id: pageId, message, scheduled_at: scheduledAt } = input;
      if (!pageId) throw new Error('page_id is required - call social_pages first');
      if (!message?.trim()) throw new Error('message is required');
      const when = scheduledAt || new Date(Date.now() + 30 * 60_000).toISOString();
      if (Number.isNaN(Date.parse(when))) throw new Error('scheduled_at must be an ISO 8601 timestamp');
      if (Date.parse(when) < Date.now()) throw new Error('scheduled_at is in the past');
      const post = await schedulePost({ pageId, message: message.trim(), scheduledAt: when });
      return { scheduled: true, post_id: post.id || post.post_id || null, scheduled_at: when, raw: post };
    },
  },

  /** Publishing immediately is deliberately narrower: only the role that owns the channel. */
  social_publish: {
    roles: ['Social Media Manager'],
    available: isConfigured,
    async run(input) {
      const { page_id: pageId, message } = input;
      if (!pageId) throw new Error('page_id is required - call social_pages first');
      if (!message?.trim()) throw new Error('message is required');
      const post = await publishPost({ pageId, message: message.trim() });
      return { published: true, post_id: post.id || post.post_id || null, raw: post };
    },
  },

  social_scheduled: {
    roles: ['Social Media Manager', 'Marketing Manager'],
    available: isConfigured,
    async run() {
      return { scheduled: await listScheduled() };
    },
  },

  /**
   * Outbound email. Restricted to the roles whose advertised outcome needs it,
   * and every send is recorded, because "I emailed them" is exactly the claim
   * an employee must never be able to make without a record.
   */
  send_email: {
    roles: ['Sales Representative', 'Customer Service Representative', 'Executive Assistant'],
    available: () => Boolean(process.env.RESEND_API_KEY),
    async run(input, { employee, organization }) {
      const { to, subject, body } = input;
      if (!to || !subject || !body) throw new Error('to, subject and body are all required');
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'content-type': 'application/json' },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || 'StaffAI <ai@getstaffai.com>',
          to,
          subject,
          text: body,
          // The recipient must be able to tell who is writing and on whose behalf.
          reply_to: process.env.STAFFAI_SUPPORT_EMAIL || undefined,
          headers: { 'X-StaffAI-Employee': employee.name, 'X-StaffAI-Organization': organization?.name || employee.org_id },
        }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(`Resend rejected the send: ${payload?.message || res.status}`);
      return { sent: true, id: payload.id, to };
    },
  },

  /**
   * The CRM an employee writes to is Staff AI's own, per tenant. Pointing every
   * customer at one shared third-party CRM instance would put one customer's
   * pipeline where another customer's employee could reach it.
   */
  crm_record: {
    roles: ['Sales Representative', 'Lead Generation Specialist', 'Marketing Manager'],
    available: () => true,
    async run(input, { employee, db }) {
      const { name, email, company_name: companyName, notes, stage } = input;
      if (!email && !name && !companyName) throw new Error('at least one of name, email or company_name is required');
      const { data, error } = await db.from('sales_leads').insert({
        org_id: employee.org_id,
        name: name || null,
        email: email || null,
        company_name: companyName || null,
        conversation_summary: notes || null,
        stage: stage || 'new',
        source: `employee:${employee.role}`,
      }).select('id').single();
      if (error) throw new Error(`Could not record the contact: ${error.message}`);
      return { recorded: true, id: data.id };
    },
  },

  /**
   * The honest escape hatch. Any employee that has reached the edge of what it
   * can do says so here rather than improvising, and a human sees it.
   */
  request_handoff: {
    roles: ANY,
    available: () => true,
    async run(input, { employee, organization, db }) {
      const { reason, summary, contact } = input;
      if (!reason) throw new Error('reason is required');
      const { data, error } = await db.from('support_tickets').insert({
        ceo_id: employee.ceo_id,
        subject: `Handoff from ${employee.name} (${employee.role})`,
        body: [
          `Organization: ${organization?.name || employee.org_id}`,
          `Reason: ${reason}`,
          summary ? `Summary: ${summary}` : null,
          contact ? `Contact: ${contact}` : null,
        ].filter(Boolean).join('\n'),
        status: 'open',
        priority: 'normal',
      }).select('id').single();
      if (error) throw new Error(`Could not raise the handoff: ${error.message}`);

      if (process.env.RESEND_API_KEY && process.env.STAFFAI_SUPPORT_EMAIL) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'content-type': 'application/json' },
          body: JSON.stringify({
            from: process.env.RESEND_FROM_EMAIL || 'StaffAI <ai@getstaffai.com>',
            to: process.env.STAFFAI_SUPPORT_EMAIL,
            subject: `Handoff: ${employee.role} at ${organization?.name || employee.org_id}`,
            text: `${reason}\n\n${summary || ''}\n\n${contact || ''}`,
          }),
        }).catch(() => { /* the ticket is the durable record; mail is the nudge */ });
      }

      return { handed_off: true, ticket_id: data.id };
    },
  },
};

export function toolsForRole(role) {
  return Object.entries(TOOLS)
    .filter(([, tool]) => (tool.roles === ANY || tool.roles.includes(role)) && tool.available())
    .map(([name]) => name);
}

export function canUse(role, name) {
  const tool = TOOLS[name];
  if (!tool) return { ok: false, reason: `Unknown tool "${name}"` };
  if (!tool.available()) return { ok: false, reason: `The ${name} tool is not configured on this deployment` };
  if (tool.roles !== ANY && !tool.roles.includes(role)) {
    return { ok: false, reason: `A ${role} is not authorised to use ${name}` };
  }
  return { ok: true, tool };
}
