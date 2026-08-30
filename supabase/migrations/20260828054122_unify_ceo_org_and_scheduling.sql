begin;

alter table public.ceos
  add column if not exists org_id uuid references public.organizations(id) on delete set null;

create unique index if not exists ceos_org_id_unique
  on public.ceos(org_id)
  where org_id is not null;

alter table public.employee_tasks
  add column if not exists task_type text not null default 'agent_task',
  add column if not exists scheduled_for timestamptz,
  add column if not exists claimed_at timestamptz,
  add column if not exists delivered_at timestamptz,
  add column if not exists retry_count integer not null default 0,
  add column if not exists metadata jsonb not null default '{}'::jsonb;

create index if not exists employee_tasks_due_idx
  on public.employee_tasks(scheduled_for)
  where status = 'scheduled' and scheduled_for is not null;

commit;
