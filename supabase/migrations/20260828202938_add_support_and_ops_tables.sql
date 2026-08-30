create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  ceo_id uuid references public.ceos(id) on delete set null,
  org_id uuid references public.organizations(id) on delete set null,
  name text not null,
  email text not null,
  company_name text,
  category text not null default 'general',
  priority text not null default 'normal',
  subject text not null,
  message text not null,
  source text not null default 'portal',
  status text not null default 'open',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  resolved_at timestamptz,
  constraint support_tickets_category_check check (category in ('general', 'sales', 'billing', 'technical', 'account_access', 'incident')),
  constraint support_tickets_priority_check check (priority in ('normal', 'urgent')),
  constraint support_tickets_status_check check (status in ('open', 'in_progress', 'waiting_on_customer', 'resolved', 'closed')),
  constraint support_tickets_email_check check (position('@' in email) > 1),
  constraint support_tickets_subject_length_check check (char_length(trim(subject)) between 3 and 160),
  constraint support_tickets_message_length_check check (char_length(trim(message)) between 10 and 5000)
);

create index if not exists support_tickets_ceo_id_idx on public.support_tickets(ceo_id);
create index if not exists support_tickets_org_id_idx on public.support_tickets(org_id);
create index if not exists support_tickets_status_created_idx on public.support_tickets(status, created_at desc);

alter table public.support_tickets enable row level security;

drop policy if exists "support tickets owner select" on public.support_tickets;
create policy "support tickets owner select"
on public.support_tickets
for select
to authenticated
using ((select auth.uid()) = ceo_id);

drop policy if exists "support tickets owner insert" on public.support_tickets;
create policy "support tickets owner insert"
on public.support_tickets
for insert
to authenticated
with check ((select auth.uid()) = ceo_id);

create table if not exists public.operational_heartbeats (
  service_name text primary key,
  status text not null default 'ok',
  checked_at timestamptz not null default now(),
  details jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint operational_heartbeats_status_check check (status in ('ok', 'degraded', 'failed'))
);

alter table public.operational_heartbeats enable row level security;
