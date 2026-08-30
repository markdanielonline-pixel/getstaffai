drop index if exists public.messages_idempotency_key_unique;
drop index if exists public.notifications_idempotency_key_unique;

create unique index messages_idempotency_key_unique
  on public.messages (idempotency_key);

create unique index notifications_idempotency_key_unique
  on public.notifications (idempotency_key);
