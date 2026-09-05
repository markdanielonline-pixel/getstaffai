import { redirect, notFound } from 'next/navigation';
import PortalHeader from '@/components/PortalHeader';
import ConversationsView from '@/components/ConversationsView';
import { getCEO } from '@/app/actions/auth';
import { createClient } from '@/lib/supabase/server';
import { isEntitled } from '@/lib/entitlement';
import { reconcileConversationTasks } from '@/lib/provision';

export default async function ConversationPage({ params }) {
  const ceo = await getCEO();
  if (!ceo) redirect('/portal/login');
  if (!isEntitled(ceo)) redirect('/portal/incorporate');

  const { conversationId } = await params;
  const supabase = await createClient();

  // Any task that finished after the request which started it had gone is
  // written into its conversation here. Without this the employee does the
  // work, the result sits in the runtime, and the customer sees an empty
  // thread. Failures here are never fatal to reading the conversation.
  await reconcileConversationTasks(ceo.org_id).catch(error => {
    console.error('[conversation] task reconcile failed:', error?.message || error);
  });

  // Scoped to the active organization, and to employees who are still here:
  // an inner join on employees also drops threads whose employee was dismissed.
  const { data: conversations } = await supabase
    .from('conversations')
    .select('*, employees!inner(id, name, role, title, employee_type, avatar_initials, avatar_color, status, grade, org_id)')
    .eq('ceo_id', ceo.id)
    .eq('employees.org_id', ceo.org_id)
    .neq('employees.status', 'alumni')
    .order('updated_at', { ascending: false });

  const { data: conversation } = await supabase
    .from('conversations')
    .select('*, employees(*)')
    .eq('id', conversationId)
    .eq('ceo_id', ceo.id)
    .single();

  if (!conversation) notFound();

  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    .limit(100);

  return (
    <>
      <PortalHeader title="Conversations & Transcripts" />
      <main style={{ paddingTop: '80px', height: '100vh', display: 'flex' }}>
        <div style={{ flex: 1, marginLeft: '280px' }}>
          <ConversationsView
            ceo={ceo}
            conversations={conversations ?? []}
            activeConversation={conversation}
            initialMessages={messages ?? []}
          />
        </div>
      </main>
    </>
  );
}
