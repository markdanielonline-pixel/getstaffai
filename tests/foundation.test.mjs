import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import pg from 'pg';
import { runInitialWorkforce } from '../lib/initial-workforce.js';
import { runEmployeeFactory } from '../lib/factory-core.js';

// Refuse accidental production use. Runner supplies an isolated, empty Postgres DB.
const url = process.env.P1_TEST_DATABASE_URL;
if (!url || new URL(url).hostname !== '127.0.0.1' || new URL(url).port !== '55439') throw new Error('Dedicated loopback test database required');
const pool = new pg.Pool({ connectionString: url });
const functions = {
  claim_provisioning_operation: ['p_org','p_key','p_owner'],
  save_provisioning_operation: ['p_org','p_key','p_owner','p_data','p_state','p_error'],
  reserve_provisioning_employee: ['p_org','p_key','p_owner','p_employee','p_existing'],
  update_provisioning_employee: ['p_org','p_key','p_owner','p_patch'],
  invalidate_workforce_readiness: ['p_org','p_verified_at'],
};
const db = { async rpc(name, args) {
  const client = await pool.connect();
  try {
    await client.query('begin');
    await client.query('set local role service_role');
    const keys = functions[name];
    if (!keys) throw new Error('Unknown fixture RPC');
    const result = await client.query(`select public.${name}(${keys.map((_,i)=>'$'+(i+1)).join(',')}) as result`, keys.map(k=>args[k] ?? null));
    await client.query('commit');
    return { data: result.rows[0].result, error: null };
  } catch(error) { await client.query('rollback'); return { data: null, error }; }
  finally { client.release(); }
} };
before(async () => {
  assert.equal((await pool.query("select count(*)::int as n from pg_tables where schemaname='public'")).rows[0].n, 0, 'Fixture must be empty');
  await pool.query(`
    create role anon; create role authenticated; create role service_role bypassrls;
    create table organizations(id uuid primary key, name text);
    create table ceos(id uuid primary key, org_id uuid references organizations(id));
    create type employee_type as enum ('ea','gm','staff');
    create type employee_status as enum ('training','active','suspended','alumni','on_leave');
    create table employees(id uuid primary key default gen_random_uuid(), org_id uuid references organizations(id),
      ceo_id uuid references ceos(id), name text not null, memory jsonb not null, title text, role text, employee_type employee_type, role_template_id uuid,
      manager_id uuid, department_id uuid, status employee_status, tools_authorized jsonb, virtual_email text,
      provision_runtime_status text, provision_error text, training_progress_pct integer, training_completed_at timestamptz);
    create unique index employees_ceo_role_unique on employees(ceo_id,role);
    create table staffai_events(id uuid primary key default gen_random_uuid(), event_type text not null, org_id uuid not null references organizations(id),
      source text not null, data jsonb not null, status text default 'pending');
    grant all on organizations,ceos,employees,staffai_events to service_role;
  `);
  await pool.query(await readFile(new URL('../supabase/migrations/20260831020853_initial_workforce_foundation.sql', import.meta.url), 'utf8'));
});
after(async()=>pool.end());

async function fixture() {
  const orgId=randomUUID(), ceo={id:randomUUID(),org_id:orgId};
  await pool.query('insert into organizations values($1,$2)',[orgId,'Fixture']);
  await pool.query('insert into ceos values($1,$2)',[ceo.id,orgId]);
  const resources=new Map(), counters={team:0,dispatcher:0,agents:0,prepare:0}, health={team:true,agents:true,failGM:false};
  const readiness=ok=>({operational:ok,checked_at:new Date().toISOString()});
  const team={id:randomUUID(),external_id:orgId,server_id:randomUUID()};
  const inspect=async id=>({...resources.get(id),readiness:readiness(health.agents)});
  const deps={db,ceo,inspect,
    ensureTeam:async()=>{if(!counters.team)counters.team++;return {...team,readiness:readiness(health.team)};},
    dispatcher:async()=>{if(!counters.dispatcher)counters.dispatcher++;return {id:'dispatcher',team_id:team.id,status:'active'};},
    hire:async(role,managerId)=>runEmployeeFactory({db,orgId,key:`initial:${role.type}:v1`,
      employeeInput:{ceo_id:ceo.id,name:role.name,title:role.title,role:role.title,employee_type:role.type,manager_id:role.type==='gm'?managerId:null},
      prepare:async()=>{counters.prepare++;},
      provision:async emp=>{
        if(!resources.has(emp.id)){counters.agents++;resources.set(emp.id,{id:randomUUID(),external_id:emp.id,team_id:team.id,server_id:team.server_id});}
        if(health.failGM && role.type==='gm')throw new Error('Provision response lost after creation');
      },inspect:emp=>inspect(emp.id),
    }), firstContact:async()=>{},
  };
  const state=async()=> (await pool.query('select workforce_status from organizations where id=$1',[orgId])).rows[0].workforce_status;
  return {orgId,ceo,deps,resources,counters,health,state,run:()=>runInitialWorkforce(deps)};
}

test('A: successful EA/GM provisioning requires runtime verification and sets readiness',async()=>{
  const f=await fixture(); assert.equal((await f.run()).ready,true);assert.equal(await f.state(),'ready');
  assert.equal(f.counters.agents,2);
  const rows=(await pool.query('select * from employees where org_id=$1',[f.orgId])).rows;
  assert(rows.every(r=>r.status==='active' && r.training_progress_pct===100));
  assert.equal(rows.find(r=>r.employee_type==='gm').manager_id,rows.find(r=>r.employee_type==='ea').id);
});
test('B: repeated same-tenant requests preserve employees, runtime identities and completed preparation',async()=>{
  const f=await fixture();await f.run();const ids=[...f.resources.keys()];await f.run();await f.run();
  assert.deepEqual([...f.resources.keys()],ids);assert.deepEqual(f.counters,{team:1,dispatcher:1,agents:2,prepare:2});
});
test('C: partial failure after remote creation resumes the same GM and preserves EA',async()=>{
  const f=await fixture();f.health.failGM=true;await assert.rejects(f.run(),/response lost/);
  assert.equal(await f.state(),'retryable');const ids=[...f.resources.keys()];
  f.health.failGM=false;await f.run();assert.deepEqual([...f.resources.keys()],ids);assert.equal(await f.state(),'ready');
});
test('D: identical role keys in two tenants cannot collide',async()=>{
  const a=await fixture(),b=await fixture();await Promise.all([a.run(),b.run()]);
  assert.equal(a.resources.size,2);assert.equal(b.resources.size,2);
  assert([...a.resources.keys()].every(id=>!b.resources.has(id)));
});
test('E: simultaneous initial requests are serialized durably',async()=>{
  const f=await fixture();let entered,release;
  const gate=new Promise(r=>{release=r});const started=new Promise(r=>{entered=r});
  const ensure=f.deps.ensureTeam;f.deps.ensureTeam=async()=>{entered();await gate;return ensure()};
  const first=f.run();await started;
  try { await assert.rejects(f.run(),/in progress/);assert.equal(await f.state(),'provisioning'); }
  finally { release();await first; }
  assert.equal(f.counters.agents,2);
});
test('F: unhealthy gateway/stale daemon evidence keeps readiness false; recovery can become ready',async()=>{
  const f=await fixture();f.health.team=false;await assert.rejects(f.run(),/not operational/);assert.equal(f.counters.agents,0);
  f.health.team=true;f.health.agents=false;await assert.rejects(f.run(),/not operational/);assert.equal(await f.state(),'retryable');
  f.health.agents=true;await f.run();assert.equal(await f.state(),'ready');
});
test('G: health loss after EA/GM creation prevents completion and subsequent retry recovers',async()=>{
  const f=await fixture();f.deps.inspect=async id=>({...await fixtureInspect(f,id),readiness:{operational:false,checked_at:new Date().toISOString()}});
  await assert.rejects(f.run(),/incomplete or unhealthy/);assert.equal(await f.state(),'retryable');
  f.deps.inspect=id=>fixtureInspect(f,id);await f.run();assert.equal(f.counters.agents,2);
});
function fixtureInspect(f,id){return {...f.resources.get(id),readiness:{operational:true,checked_at:new Date().toISOString()}};}
test('H: foreign team response fails closed before employee creation',async()=>{
  const f=await fixture();const original=f.deps.ensureTeam;f.deps.ensureTeam=async()=>({...await original(),external_id:randomUUID()});
  await assert.rejects(f.run(),/not operational/);assert.equal(f.resources.size,0);
});
test('I: expired worker ownership is fenced; a restarted worker resumes its durable reservation',async()=>{
  const f=await fixture(),owner=randomUUID(),key='hire:initial:ea:v1';
  const args={p_org:f.orgId,p_key:key,p_owner:owner};
  assert.equal((await db.rpc('claim_provisioning_operation',args)).error,null);
  const reserved=await db.rpc('reserve_provisioning_employee',{...args,p_employee:{ceo_id:f.ceo.id,name:'Existing Sophia',title:'Executive Assistant',role:'Executive Assistant',employee_type:'ea'}});
  assert.equal(reserved.error,null);
  await pool.query("update provisioning_operations set lease_until=now()-interval '1 second' where org_id=$1",[f.orgId]);
  const late=await db.rpc('save_provisioning_operation',{...args,p_data:{},p_state:'completed'});assert.match(late.error.message,/lease lost/);
  await f.run();assert(f.resources.has(reserved.data.id));assert.equal(f.counters.agents,2);
});
test('J: legacy initial employee is adopted without replacement',async()=>{
  const f=await fixture(),id=randomUUID();await pool.query("insert into employees(id,org_id,ceo_id,name,memory,role,employee_type,status) values($1,$2,$3,'Sophia','{}','Executive Assistant','ea','active')",[id,f.orgId,f.ceo.id]);
  await f.run();assert(f.resources.has(id));assert.equal(f.resources.size,2);
});
test('K: cross-tenant employee adoption is rejected by the database',async()=>{
  const a=await fixture(),b=await fixture();await a.run();const args={p_org:b.orgId,p_key:'hire:test',p_owner:randomUUID()};
  await db.rpc('claim_provisioning_operation',args);
  const result=await db.rpc('reserve_provisioning_employee',{...args,p_employee:{},p_existing:[...a.resources.keys()][0]});assert(result.error);
});
test('L: anonymous and authenticated callers cannot execute privileged provisioning RPCs',async()=>{
  for(const role of ['anon','authenticated']){
    const result=await pool.query("select has_function_privilege($1,'public.claim_provisioning_operation(uuid,text,uuid)','EXECUTE') as allowed",[role]);
    assert.equal(result.rows[0].allowed,false);
  }
});

test('M: failed live checks invalidate readiness without clobbering newer retries',async()=>{
  const f=await fixture();await f.run();
  const snapshot=(await pool.query("select data from provisioning_operations where org_id=$1 and operation_key='initial-workforce:v1'",[f.orgId])).rows[0].data.verifiedAt;
  assert.equal((await db.rpc('invalidate_workforce_readiness',{p_org:f.orgId,p_verified_at:snapshot})).data,true);
  assert.equal(await f.state(),'retryable');
  assert((await pool.query('select status from employees where org_id=$1',[f.orgId])).rows.every(r=>r.status==='training'));
  await f.run();
  assert.equal((await db.rpc('invalidate_workforce_readiness',{p_org:f.orgId,p_verified_at:snapshot})).data,false);
  assert.equal(await f.state(),'ready');
});

test('N: expired operational evidence cannot complete the transaction',async()=>{
  const f=await fixture(),ensure=f.deps.ensureTeam;
  f.deps.ensureTeam=async()=>({...await ensure(),readiness:{operational:true,checked_at:new Date(Date.now()-120000).toISOString()}});
  await assert.rejects(f.run(),/not operational/);
  assert.equal(await f.state(),'retryable');assert.equal(f.resources.size,0);
});

test('O: factory success events are durable once-only and never precede readiness',async()=>{
  const f=await fixture();f.health.agents=false;await assert.rejects(f.run());
  assert.equal((await pool.query('select count(*)::int n from staffai_events where org_id=$1',[f.orgId])).rows[0].n,0);
  f.health.agents=true;await f.run();await f.run();
  assert.equal((await pool.query('select count(*)::int n from staffai_events where org_id=$1',[f.orgId])).rows[0].n,4);
});

test('P: automatic retries cannot override Staff AI suspension',async()=>{
  const f=await fixture();await f.run();
  const ea=[...f.resources.keys()][0];
  await pool.query("update employees set status='suspended' where id=$1",[ea]);
  await assert.rejects(f.run(),/explicit authorization/);
  assert.equal((await pool.query('select status from employees where id=$1',[ea])).rows[0].status,'suspended');
  assert.equal(await f.state(),'retryable');assert.equal(f.counters.agents,2);
});
