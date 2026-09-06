import { listPages, schedulePost, publishPost, listScheduled, cancelScheduled, isConfigured } from './outreply';

/**
 * The tools an employee may call, and which roles may call them.
 *
 * Role gating is real here, unlike `role_templates.required_tools` and the
 * `capabilities` array sent to Provision, which are recorded and provision
 * nothing. A Marketing Specialist cannot publish to a social account by asking
 * nicely; the bridge refuses it.
 */
const ANY = null; // available to every employee

/**
 * Nothing an employee schedules reaches an audience without a window in which
 * a human can stop it.
 *
 * This is not theoretical. On the first certification run the Social Media
 * Manager was asked to schedule one post and scheduled two, one of them due on
 * a real Facebook page in 28 minutes, because the tool defaulted a missing
 * time to "half an hour from now". Both were cancelled. An autonomous employee
 * with a publishing credential needs the lead time to be a floor, not a
 * default.
 */
const MIN_SCHEDULE_LEAD_MS = 2 * 60 * 60 * 1000;

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
   * gets, and the lead time below is a floor. It is visible to the customer and
   * cancellable before an audience ever sees it.
   */
  social_schedule: {
    roles: ['Social Media Manager', 'Marketing Manager'],
    available: isConfigured,
    async run(input, { employee, db }) {
      const { page_id: pageId, message, scheduled_at: scheduledAt } = input;
      if (!pageId) throw new Error('page_id is required - call social_pages first');
      if (!message?.trim()) throw new Error('message is required');
      if (!scheduledAt) {
        throw new Error('scheduled_at is required, as an ISO 8601 timestamp at least two hours from now. There is no default: a post reaching an audience is not something to guess at.');
      }
      const when = Date.parse(scheduledAt);
      if (Number.isNaN(when)) throw new Error('scheduled_at must be an ISO 8601 timestamp');
      if (when < Date.now() + MIN_SCHEDULE_LEAD_MS) {
        throw new Error('scheduled_at must be at least two hours from now, so the company has time to review or cancel it');
      }

      // One employee, one page, one pending post. The same run that prompted
      // this guard scheduled the same announcement twice.
      const pending = await listScheduled().catch(() => []);
      const clash = (Array.isArray(pending) ? pending : pending?.posts || [])
        .find(post => post.page_id === pageId && String(post.message || '').trim() === message.trim());
      if (clash) {
        return {
          scheduled: false,
          already_scheduled: true,
          scheduled_post_id: clash.scheduled_post_id,
          scheduled_at: clash.scheduled_at,
          note: 'This exact post is already scheduled on this page. Nothing was duplicated.',
        };
      }

      const post = await schedulePost({ pageId, message: message.trim(), scheduledAt });
      // Recorded on the Staff AI side too, so the customer can see and cancel a
      // pending post without holding an OutReply login.
      await db.from('staffai_events').insert({
        org_id: employee.org_id,
        event_type: 'social.scheduled',
        source: 'agent-tools',
        status: 'pending',
        data: { employee_id: employee.id, page_id: pageId, scheduled_at: scheduledAt, message: message.trim(), post },
      }).select('id').maybeSingle();
      return { scheduled: true, scheduled_at: scheduledAt, raw: post };
    },
  },

  /**
   * Publishing immediately is deliberately not available to an employee. There
   * is no window to intervene, and the failure mode is a post on a customer's
   * real audience that nobody approved. It stays in the codebase because the
   * product will want it behind an explicit human approval, which does not
   * exist yet.
   */
  social_publish: {
    roles: [],
    available: () => false,
    async run(input) {
      const { page_id: pageId, message } = input;
      if (!pageId) throw new Error('page_id is required - call social_pages first');
      if (!message?.trim()) throw new Error('message is required');
      const post = await publishPost({ pageId, message: message.trim() });
      return { published: true, post_id: post.id || post.post_id || null, raw: post };
    },
  },

  /** An employee that scheduled something wrong must be able to undo it. */
  social_cancel: {
    roles: ['Social Media Manager', 'Marketing Manager'],
    available: isConfigured,
    async run(input) {
      const id = input.scheduled_post_id || input.post_id;
      if (!id) throw new Error('scheduled_post_id is required - call social_scheduled to find it');
      await cancelScheduled(id);
      return { cancelled: true, scheduled_post_id: id };
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
