import test from 'node:test';
import assert from 'node:assert/strict';
import { isLocalCanonicalConfig,isPublicSupabaseKey,createLocalCanonicalClient,readLocalCanonicalPayroll } from './isolatedCanonicalRead.js';

const org='11111111-1111-4111-8111-111111111111';
const other='22222222-2222-4222-8222-222222222222';
function fixture({auth=true,grant=true,poison=false}={}) {
  const reads=[];
  const client={
    auth:{getUser:async()=>({data:{user:auth?{id:'fixture-user'}:null},error:null})},
    rpc:async(name,args)=>{
      assert.equal(name,'has_organization_permission');
      assert.deepEqual(args,{p_organization_id:org,p_permission_code:'people.manage'});
      return {data:grant,error:null};
    },
    from:(table)=>({select:(columns)=>({eq:async(column,id)=>{
      reads.push({table,columns,column,id});
      return {data:[table==='payroll_items'
        ? {id:'fixture-id',payroll_run_id:'run-fixture',payroll_runs:{organization_id:poison?other:org}}
        : {id:'fixture-id',organization_id:poison?other:org}],error:null};
    }})}),
  };
  return {client,reads};
}
test('canonical read gate denies production Supabase and nonlocal frontend',()=>{
  const cfg={flag:'true',appHost:'localhost',supabaseUrl:'http://127.0.0.1:54321'};
  assert.equal(isLocalCanonicalConfig(cfg),true);
  assert.equal(isLocalCanonicalConfig({...cfg,appHost:'payroll.example.com'}),false);
  assert.equal(isLocalCanonicalConfig({...cfg,supabaseUrl:'https://production.supabase.co'}),false);
  assert.equal(isLocalCanonicalConfig({...cfg,supabaseUrl:'http://192.168.1.2:54321'}),false);
  assert.equal(isLocalCanonicalConfig({...cfg,flag:'false'}),false);
});
test('rejects Supabase service keys in browser canonical reader',()=>{
  assert.equal(isPublicSupabaseKey('sb_secret_example'),false);
  assert.equal(isPublicSupabaseKey('sb_publishable_test-only'),true);
  const jwt=(role)=>'eyJhbGciOiJIUzI1NiJ9.'+Buffer.from(JSON.stringify({role})).toString('base64url')+'.fixture';
  assert.equal(isPublicSupabaseKey(jwt('service_role')),false);
  assert.equal(isPublicSupabaseKey(jwt('anon')),true);
  assert.throws(()=>createLocalCanonicalClient({
    flag:'true',appHost:'localhost',supabaseUrl:'http://127.0.0.1:54321',anonKey:'sb_secret_test-only',
  }),/unavailable/);
});test('building a production or nonlocal client fails before network',()=>{
  assert.throws(()=>createLocalCanonicalClient({
    flag:'true',appHost:'localhost',
    supabaseUrl:'https://production.supabase.co',anonKey:'dummy-public-anon',
  }),/unavailable/);
});
test('requires real Supabase session before permission check',async()=>{
  const f=fixture({auth:false});
  await assert.rejects(readLocalCanonicalPayroll(f.client,org),/authentication required/);
  assert.equal(f.reads.length,0);
});
test('requires real server-side people.manage and never trusts demo login',async()=>{
  const f=fixture({grant:false});
  await assert.rejects(readLocalCanonicalPayroll(f.client,org),/Access denied/);
  assert.equal(f.reads.length,0);
});
test('reads canonical three-table metadata with organization filter',async()=>{
  const f=fixture();
  const data=await readLocalCanonicalPayroll(f.client,org);
  assert.deepEqual(Object.keys(data),['employees','payroll_runs','payroll_items']);
  assert.deepEqual(f.reads.map(r=>r.table),['employees','payroll_runs','payroll_items']);
  assert.ok(f.reads.filter(r=>r.table!=='payroll_items').every(r=>r.column==='organization_id'&&r.id===org&&r.columns==='id,organization_id'));
  assert.deepEqual(f.reads.find(r=>r.table==='payroll_items'),{
    table:'payroll_items', columns:'id,payroll_run_id,payroll_runs!inner(organization_id)',
    column:'payroll_runs.organization_id', id:org,
  });
});
test('rejects tenant mismatched result even if upstream is incorrect',async()=>{
  const f=fixture({poison:true});
  await assert.rejects(readLocalCanonicalPayroll(f.client,org),/tenant boundary violation/);
});
test('denies malformed or missing organization before requesting user data',async()=>{
  const f=fixture();
  await assert.rejects(readLocalCanonicalPayroll(f.client,'wrong-id'),/organization unavailable/);
  assert.equal(f.reads.length,0);
});
