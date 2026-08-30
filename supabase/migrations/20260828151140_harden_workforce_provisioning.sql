begin;

alter table public.employees
  add column if not exists training_duration_seconds integer;

alter table public.messages
  add column if not exists idempotency_key text;

alter table public.notifications
  add column if not exists idempotency_key text;

create unique index if not exists employees_ceo_role_unique
  on public.employees(ceo_id, role);

create unique index if not exists conversations_ceo_employee_channel_unique
  on public.conversations(ceo_id, employee_id, channel);

create unique index if not exists messages_idempotency_key_unique
  on public.messages(idempotency_key)
  where idempotency_key is not null;

create unique index if not exists notifications_idempotency_key_unique
  on public.notifications(idempotency_key)
  where idempotency_key is not null;

commit;
