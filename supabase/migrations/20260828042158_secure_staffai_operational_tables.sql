-- StaffAI operational data is server-only. The service role retains access and
-- bypasses RLS; browser-facing anon/authenticated roles receive no table grant.
begin;

alter table public.role_templates enable row level security;
alter table public.execution_logs enable row level security;

revoke all privileges on table public.role_templates from anon, authenticated;
revoke all privileges on table public.execution_logs from anon, authenticated;

commit;
