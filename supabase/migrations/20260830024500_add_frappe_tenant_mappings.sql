begin;

alter table public.organizations
  add column if not exists frappe_site_domain text,
  add column if not exists frappe_connection_status text not null default 'disconnected',
  add column if not exists frappe_last_synced_at timestamptz,
  add column if not exists frappe_error text;

alter table public.employees
  add column if not exists frappe_user_id text;

create unique index if not exists organizations_frappe_site_unique
  on public.organizations (frappe_site_domain) where frappe_site_domain is not null;

commit;
