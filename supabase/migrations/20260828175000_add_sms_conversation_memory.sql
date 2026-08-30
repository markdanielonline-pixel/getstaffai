create table if not exists public.sms_conversation_memory (
  phone_number text primary key,
  messages jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.sms_conversation_memory enable row level security;
revoke all on table public.sms_conversation_memory from anon, authenticated;
