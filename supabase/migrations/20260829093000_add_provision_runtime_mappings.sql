begin;

alter table public.organizations
  add column if not exists provision_team_id text,
  add column if not exists provision_connection_status text not null default 'disconnected',
  add column if not exists provision_last_synced_at timestamptz,
  add column if not exists provision_error text;

alter table public.employees
  add column if not exists provision_agent_id text,
  add column if not exists provision_runtime_status text not null default 'unprovisioned',
  add column if not exists provision_last_synced_at timestamptz,
  add column if not exists provision_error text;

alter table public.employee_tasks
  add column if not exists provision_task_id text,
  add column if not exists provision_status text,
  add column if not exists provision_last_synced_at timestamptz;

create unique index if not exists organizations_provision_team_unique
  on public.organizations (provision_team_id) where provision_team_id is not null;
create unique index if not exists employees_provision_agent_unique
  on public.employees (provision_agent_id) where provision_agent_id is not null;
create unique index if not exists employee_tasks_provision_task_unique
  on public.employee_tasks (provision_task_id) where provision_task_id is not null;

commit;
