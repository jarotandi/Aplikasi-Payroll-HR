import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {randomUUID,randomBytes} from 'node:crypto';
import {createClient} from '@supabase/supabase-js';
import {createCanonicalPayrollReader} from '@niaga/payroll-core';
import {resolveCanonicalSession,readCanonicalSessionPayroll,createCanonicalEmployeeR20,
 updateCanonicalEmployeeR20,readLocalCanonicalPayroll} from '../../src/canonical/isolatedCanonicalRead.js';
const url=process.env.SUPABASE_URL,anon=process.env.SUPABASE_ANON_KEY,secret=process.env.SUPABASE_SERVICE_ROLE_KEY;
if(url!=='http://127.0.0.1:56821'||process.env.QP1_ISOLATED_PROJECT_ID!=='niaga-qp1-r15-functional-20261111'||
 !anon||!secret)throw Error('DENY: isolated local Supabase only');
const admin=createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false}});
const client=()=>createClient(url,anon,{auth:{persistSession:false,autoRefreshToken:false}});
const file=readFileSync('F:/Niaga-QP1-R15-TestDeps/R15-LOCAL-DEMO-ACCOUNTS.txt','utf8');
const creds=role=>{const m=new RegExp('^'+role+'\\s*\\|\\s*Email:\\s*(\\S+)\\s*\\|\\s*Password:\\s*(\\S+)','m').exec(file);if(!m)throw Error('Missing synthetic fixture');return m;};
async function login(role){const c=client(),m=creds(role);const r=await c.auth.signInWithPassword({email:m[1],password:m[2]});if(r.error)throw Error(r.error.message);return c;}
const data=(r,who)=>{if(r.error||!r.data)throw Error(who+': '+r.error?.message);return r.data};
const code='R20'+randomUUID().slice(0,8).toUpperCase();
let aId,bId,bOrg,bUser;
(async()=>{
 try{
  const [erp,standalone,viewer]=await Promise.all([login('OWNER HR'),login('OWNER HR'),login('VIEWER')]);
  const [e,s]=await Promise.all([resolveCanonicalSession(erp),resolveCanonicalSession(standalone)]);
  assert.deepEqual(e,s);
  const reader=createCanonicalPayrollReader(erp,{authenticated:true,workspaceReady:true,organizationId:e.organizationId,peopleManage:true});
  const first=await readCanonicalSessionPayroll(standalone);
  const original=await reader.employees(e.organizationId);
  assert.deepEqual(first.employees.map(x=>x.id).sort(),original.map(x=>x.id).sort());
  console.log('R20_AUTH_ROLE_ORGANIZATION_CANONICAL_PARITY_PASS');
  const made=await createCanonicalEmployeeR20(standalone,{employee_code:code,full_name:'R20 Synthetic Original'});aId=made.row.id;
  assert.equal(made.alreadyExists,false);
  const again=await createCanonicalEmployeeR20(standalone,{employee_code:code,full_name:'R20 Synthetic Original'});
  assert.equal(again.alreadyExists,true);assert.equal(again.row.id,aId);
  const visibleCreated=data(await erp.from('employees').select('id,employee_code,full_name,organization_id').eq('organization_id',e.organizationId).eq('employee_code',code),'ERP create read');
  assert.equal(visibleCreated.length,1);
  await updateCanonicalEmployeeR20(standalone,aId,'R20 Synthetic Updated');
  const erpRows=data(await erp.from('employees').select('id,organization_id,full_name').eq('organization_id',e.organizationId),'ERP detail read');
  assert.equal(erpRows.find(x=>x.id===aId).full_name,'R20 Synthetic Updated');
  assert.deepEqual((await readLocalCanonicalPayroll(standalone,s.organizationId)).employees.map(x=>x.id).sort(),erpRows.map(x=>x.id).sort());
  console.log('R20_CREATE_IDEMPOTENCY_UPDATE_VISIBLE_IN_BOTH_APPS_PASS');
  await assert.rejects(()=>resolveCanonicalSession(viewer),/people.manage/);
  await assert.rejects(()=>createCanonicalEmployeeR20(viewer,{employee_code:code+'V',full_name:'Denied Viewer'}),/people.manage/);
  const u=data(await admin.auth.admin.createUser({email:'r20b-'+randomUUID()+'@example.test',
   password:'Temp-'+randomBytes(18).toString('hex'),email_confirm:true}),'B user').user;
  bUser=u.id;
  data(await admin.from('profiles').upsert({id:u.id,full_name:'R20 Synthetic B'}).select('id').single(),'B profile');
  bOrg=data(await admin.from('organizations').insert({name:'R20 Synthetic Org '+code,created_by:u.id}).select('id').single(),'B org').id;
  data(await admin.from('organization_members').insert({organization_id:bOrg,user_id:u.id,status:'active'}).select('user_id').single(),'B membership');
  const roles=data(await admin.from('roles').select('id,code,scope,organization_id,archived'),'roles');
  const ownerRole=roles.find(x=>x.code==='owner'&&x.scope==='organization'&&x.organization_id===null&&!x.archived);
  assert.ok(ownerRole);
  data(await admin.from('organization_user_roles').insert({organization_id:bOrg,user_id:u.id,role_id:ownerRole.id,assigned_by:u.id}).select('user_id').single(),'B role');
  const b=client();
  // Credentials held only in the return of createUser? createUser does not return raw password.
  // Reassign isolated synthetic user password without affecting a real account.
  const newPwd='Only-'+randomBytes(20).toString('hex');
  data(await admin.auth.admin.updateUserById(bUser,{password:newPwd}),'B password');
  const authB=await b.auth.signInWithPassword({email:u.email,password:newPwd});
  if(authB.error)throw Error(authB.error.message);
  assert.equal((await resolveCanonicalSession(b)).organizationId,bOrg);
  bId=(await createCanonicalEmployeeR20(b,{employee_code:code,full_name:'R20 Synthetic B'})).row.id;
  assert.notEqual(aId,bId);
  await assert.rejects(()=>readLocalCanonicalPayroll(b,e.organizationId),/Access denied/);
  await assert.rejects(()=>updateCanonicalEmployeeR20(b,aId,'Denied B'),/denied/);
  const r=await b.from('employees').select('id').eq('id',aId);
  assert.equal(r.data?.length,0);
  assert.ok(!(await readCanonicalSessionPayroll(b)).employees.some(x=>x.id===aId));
  assert.ok(!(await readCanonicalSessionPayroll(standalone)).employees.some(x=>x.id===bId));
  console.log('R20_CROSS_TENANT_RLS_AND_VIEWER_DENIAL_PASS');
  await standalone.auth.signOut({scope:'global'});
  await assert.rejects(()=>resolveCanonicalSession(standalone),/Auth/);
  console.log('QP1_R20_ISOLATED_DUAL_APP_E2E_PASS');
 }finally{
  if(aId)await admin.from('employees').delete().eq('id',aId);
  if(bId)await admin.from('employees').delete().eq('id',bId);
  if(bOrg){
   await admin.from('organization_user_roles').delete().eq('organization_id',bOrg);
   await admin.from('organization_members').delete().eq('organization_id',bOrg);
   await admin.from('organizations').delete().eq('id',bOrg);
  }
  if(bUser)await admin.auth.admin.deleteUser(bUser);
 }
})().catch(err=>{console.error('QP1_R20_E2E_HOLD',err.stack||err.message);process.exitCode=1});
