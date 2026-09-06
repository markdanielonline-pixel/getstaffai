import { agentToken } from './auth';

/**
 * The block appended to an employee brief at provisioning time, when the
 * employee id - and therefore its credential - finally exists.
 *
 * It lives apart from the playbook so the credential never travels through code
 * that has no reason to hold it, and apart from auth.js so that module stays
 * about verification.
 */
export function toolBriefing(employeeId, allowedTools = []) {
  const endpoint = process.env.AGENT_TOOLS_URL || 'https://app.getstaffai.com/api/agent-tools';

  let token;
  try {
    token = agentToken(employeeId);
  } catch {
    // No secret configured means no tools. Say nothing rather than promise an
    // endpoint the employee cannot authenticate against.
    return '';
  }

  const lines = [
    '',
    'YOUR TOOLS. These act on the outside world on behalf of your company.',
    'Call them with curl:',
    '',
    '  curl -s -X POST ' + endpoint + " \\",
    "    -H 'Authorization: Bearer " + token + "' \\",
    "    -H 'Content-Type: application/json' \\",
    '    -d \'{"tool":"<name>","input":{}}\'',
    '',
    '  GET ' + endpoint + ' with the same header lists exactly the tools you may use.',
  ];

  if (allowedTools.length) {
    lines.push('  Today those are: ' + allowedTools.join(', ') + '.');
  }

  lines.push(
    '',
    'Rules that are not negotiable:',
    '- A tool worked only if the response contains "ok": true. Anything else means',
    '  it did not happen. Say so plainly; never report an action as done on a',
    '  failed call.',
    '- Never print, quote, log or pass on the token above. It is yours alone.',
    '- If you need a tool you were refused, or one that does not exist, call',
    '  request_handoff and say what you needed and why.',
  );

  return lines.join('\n');
}
