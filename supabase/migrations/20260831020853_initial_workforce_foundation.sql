begin;

alter table public.organizations
  add column if not exists workforce_status text not null default 'not_ready',
  add column if not exists workforce_checked_at timestamptz,
  add column if not exists workforce_error text;

create table public.provisioning_operations (
  org_id uuid not null references public.organizations(id),
  operation_key text not null,
  owner uuid,
  lease_until timestamptz,
  state text not null default 'pending',
  data jsonb not null default '{}',
  error text,
  primary key (org_id, operation_key)
);
alter table public.provisioning_operations enable row level security;
revoke all on public.provisioning_operations from public, anon, authenticated;
grant all on public.provisioning_operations to service_role;

create function public.claim_provisioning_operation(p_org uuid, p_key text, p_owner uuid)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare op public.provisioning_operations;
begin
  if p_owner is null or p_key is null or length(p_key) > 250 then raise exception 'Invalid operation'; end if;
  insert into public.provisioning_operations(org_id, operation_key) values(p_org,p_key) on conflict do nothing;
  select * into op from public.provisioning_operations where org_id=p_org and operation_key=p_key for update;
  if op.lease_until > clock_timestamp() then return jsonb_build_object('busy',true); end if;
  update public.provisioning_operations set owner=p_owner, lease_until=clock_timestamp()+interval '90 seconds', state='running', error=null
    where org_id=p_org and operation_key=p_key returning * into op;
  if p_key='initial-workforce:v1' then
    update public.organizations set workforce_status='provisioning', workforce_checked_at=null, workforce_error=null where id=p_org;
  end if;
  return to_jsonb(op);
end $$;

create function public.save_provisioning_operation(p_org uuid, p_key text, p_owner uuid, p_data jsonb, p_state text, p_error text default null)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare op public.provisioning_operations;
begin
  if p_state not in ('running','completed','retryable') then raise exception 'Invalid state'; end if;
  update public.provisioning_operations set data=data || p_data, state=p_state, error=p_error,
    lease_until=case when p_state='running' then clock_timestamp()+interval '90 seconds' else null end
    where org_id=p_org and operation_key=p_key and owner=p_owner and lease_until>clock_timestamp()
    returning * into op;
  if not found then raise exception 'Provisioning lease lost'; end if;
  if p_key='initial-workforce:v1' then
    update public.organizations set workforce_status=case when p_state='completed' then 'ready' when p_state='running' then 'provisioning' else 'retryable' end,
      workforce_checked_at=case when p_state='completed' then (p_data->>'verifiedAt')::timestamptz else null end, workforce_error=p_error where id=p_org;
    if p_state='retryable' then
      update public.employees set status='training',training_progress_pct=0,training_completed_at=null
        where org_id=p_org and id in ((op.data->>'ea')::uuid,(op.data->>'gm')::uuid) and status in ('active','training');
    end if;
  end if;
  return to_jsonb(op);
end $$;

create function public.reserve_provisioning_employee(p_org uuid, p_key text, p_owner uuid, p_employee jsonb, p_existing uuid default null)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare op public.provisioning_operations; emp public.employees; ceo uuid; initial_type text;
begin
  -- Serialize reservations within the tenant, including legacy EA/GM adoption.
  perform 1 from public.organizations where id=p_org for update;
  select * into op from public.provisioning_operations where org_id=p_org and operation_key=p_key and owner=p_owner and lease_until>clock_timestamp() for update;
  if not found then raise exception 'Provisioning lease lost'; end if;
  if op.data ? 'employeeId' then
    select * into strict emp from public.employees where id=(op.data->>'employeeId')::uuid and org_id=p_org;
    if emp.status not in ('training','active') then raise exception 'Employee lifecycle requires explicit authorization'; end if;
    return to_jsonb(emp);
  end if;
  ceo := (p_employee->>'ceo_id')::uuid;
  if ceo is not null and not exists(select 1 from public.ceos where id=ceo and org_id=p_org) then raise exception 'CEO ownership mismatch'; end if;
  if p_existing is not null then
    select * into strict emp from public.employees where id=p_existing and org_id=p_org;
  elsif p_key in ('hire:initial:ea:v1','hire:initial:gm:v1') then
    initial_type := case when p_key='hire:initial:ea:v1' then 'ea' else 'gm' end;
    if (select count(*) from public.employees where org_id=p_org and (employee_type=initial_type::public.employee_type or role=p_employee->>'role')) > 1 then
      raise exception 'Ambiguous existing initial employee; reconciliation required';
    end if;
    select * into emp from public.employees where org_id=p_org and (employee_type=initial_type::public.employee_type or role=p_employee->>'role');
  end if;
  if emp.id is null then
    insert into public.employees(org_id,ceo_id,name,title,role,employee_type,role_template_id,manager_id,department_id,status,tools_authorized,virtual_email,memory)
    values(p_org,ceo,p_employee->>'name',p_employee->>'title',p_employee->>'role',coalesce(p_employee->>'employee_type','staff')::public.employee_type,
      (p_employee->>'role_template_id')::uuid,(p_employee->>'manager_id')::uuid,(p_employee->>'department_id')::uuid,
      'training',coalesce(p_employee->'tools_authorized','[]'),p_employee->>'virtual_email','{}'::jsonb) returning * into emp;
  end if;
  if emp.status not in ('training','active') then raise exception 'Employee lifecycle requires explicit authorization'; end if;
  if p_key='hire:initial:gm:v1' then
    update public.employees set manager_id=(p_employee->>'manager_id')::uuid where id=emp.id returning * into emp;
  end if;
  if emp.manager_id is not null and not exists(select 1 from public.employees where id=emp.manager_id and org_id=p_org) then raise exception 'Manager ownership mismatch'; end if;
  update public.employees set status='training', training_progress_pct=0, training_completed_at=null where id=emp.id and org_id=p_org;
  update public.provisioning_operations set data=data || jsonb_build_object('employeeId',emp.id) where org_id=p_org and operation_key=p_key;
  return to_jsonb(emp);
end $$;

create function public.update_provisioning_employee(p_org uuid, p_key text, p_owner uuid, p_patch jsonb)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare op public.provisioning_operations; emp public.employees;
begin
  select * into op from public.provisioning_operations where org_id=p_org and operation_key=p_key and owner=p_owner and lease_until>clock_timestamp() for update;
  if not found then raise exception 'Provisioning lease lost'; end if;
  select * into strict emp from public.employees where id=(op.data->>'employeeId')::uuid and org_id=p_org for update;
  if emp.status not in ('training','active') then raise exception 'Employee lifecycle requires explicit authorization'; end if;
  update public.employees set status=(p_patch->>'status')::public.employee_status,
    provision_runtime_status=p_patch->>'provision_runtime_status',
    provision_error=p_patch->>'provision_error',
    training_progress_pct=case when p_patch->>'status'='active' then 100 else 0 end,
    training_completed_at=case when p_patch->>'status'='active' then clock_timestamp() else null end
    where id=(op.data->>'employeeId')::uuid and org_id=p_org returning * into emp;
  if not found then raise exception 'Employee ownership mismatch'; end if;
  if p_patch->>'status'='active' and not (op.data ? 'activationEventRecorded') then
    -- Preserve existing factory events, but publish success only after verification.
    -- Events and their once-only marker commit with the employee activation.
    insert into public.staffai_events(event_type,org_id,source,data,status) values
      ('employee.hired',p_org,'staffai_app',jsonb_build_object('employee_id',emp.id,'role',emp.title),'pending'),
      ('employee.onboarding.completed',p_org,'staffai_app',jsonb_build_object('employee_id',emp.id),'pending');
    update public.provisioning_operations set data=data || '{"activationEventRecorded":true}'::jsonb
      where org_id=p_org and operation_key=p_key;
  end if;
  return to_jsonb(emp);
end $$;
revoke all on function public.update_provisioning_employee(uuid,text,uuid,jsonb) from public,anon,authenticated;
grant execute on function public.update_provisioning_employee(uuid,text,uuid,jsonb) to service_role;
revoke all on function public.claim_provisioning_operation(uuid,text,uuid) from public,anon,authenticated;
revoke all on function public.save_provisioning_operation(uuid,text,uuid,jsonb,text,text) from public,anon,authenticated;
revoke all on function public.reserve_provisioning_employee(uuid,text,uuid,jsonb,uuid) from public,anon,authenticated;
grant execute on function public.claim_provisioning_operation(uuid,text,uuid) to service_role;
grant execute on function public.save_provisioning_operation(uuid,text,uuid,jsonb,text,text) to service_role;
grant execute on function public.reserve_provisioning_employee(uuid,text,uuid,jsonb,uuid) to service_role;

-- Compare the observed snapshot under the operation row lock. An old dashboard
-- request must never invalidate a newer successful retry or an in-flight owner.
create function public.invalidate_workforce_readiness(p_org uuid, p_verified_at text)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare op public.provisioning_operations;
begin
  select * into op from public.provisioning_operations where org_id=p_org and operation_key='initial-workforce:v1' for update;
  if not found or op.state<>'completed' or (op.data->>'verifiedAt') is distinct from p_verified_at then return false; end if;
  update public.provisioning_operations set state='retryable',error='Live workforce readiness check failed'
    where org_id=p_org and operation_key='initial-workforce:v1';
  update public.organizations set workforce_status='retryable',workforce_checked_at=null,workforce_error='Live workforce readiness check failed' where id=p_org;
  update public.employees set status='training',training_progress_pct=0,training_completed_at=null
    where org_id=p_org and id in ((op.data->>'ea')::uuid,(op.data->>'gm')::uuid) and status='active';
  return true;
end $$;
revoke all on function public.invalidate_workforce_readiness(uuid,text) from public,anon,authenticated;
grant execute on function public.invalidate_workforce_readiness(uuid,text) to service_role;
commit;
