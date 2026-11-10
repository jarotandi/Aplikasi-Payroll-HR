/**
 * QP1-R5 synthetic dual-consumer integration against a DEDICATED disposable
 * local Supabase stack only. Browser credential/session test is a separate gate.
 * Never use with any production/staging-shared Supabase project.
 */
import assert from 'node:assert/strict';
import { randomUUID, randomBytes } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { createCanonicalPayrollReader } from '@niaga/payroll-core';
import { readLocalCanonicalPayroll } from '../../src/canonical/isolatedCanonicalRead.js';

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;
const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (process.env.QP1_ISOLATED_PROJECT_ID !== 'niaga-qp1-isolated-r5-20261110' ||
  url !== 'http://127.0.0.1:56821' || !anonKey || !adminKey) {
  throw new Error('HOLD: refused non-dedicated QP1-R5 local Supabase');
}
const admin = createClient(url,adminKey,{auth:{persistSession:false,autoRefreshToken:false}});
const publicClient = () => createClient(url,anonKey,{auth:{persistSession:false,autoRefreshToken:false}});
function must(value, error, label) {
  if (error || !value) throw new Error(label+' failed: '+(error?.message??'missing result'));
  return value;
}
async function actor(label) {
  const email='qp1-r5-'+label+'-'+randomUUID()+'@example.test';
  const password='ephemeral-'+randomBytes(20).toString('hex');
  const created=await admin.auth.admin.createUser({email,password,email_confirm:true});
  const user=must(created.data.user,created.error,'synthetic auth user');
  const prof=await admin.from('profiles').upsert({id:user.id,full_name:'QP1-R5 fixture'});
  if(prof.error) throw new Error('profile fixture failed');
  const client=publicClient();
  const login=await client.auth.signInWithPassword({email,password});
  must(login.data.user,login.error,'login');
  return {client,userId:user.id,email,password};
}
const runId=randomUUID();
const ownerA=await actor('owner-a');
const ownerB=await actor('owner-b');
const viewer=await actor('viewer');
const rolesResult=await admin.from('roles').select('id,code');
const roles=must(rolesResult.data,rolesResult.error,'roles');
const owner=roles.find(r=>r.code==='owner')?.id;
const viewerRole=roles.find(r=>r.code==='viewer')?.id;
assert.ok(owner&&viewerRole,'owner and viewer roles required');
const o1=await admin.from('organizations').insert({name:'QP1 R5 synthetic A '+runId,created_by:ownerA.userId}).select('id').single();
const o2=await admin.from('organizations').insert({name:'QP1 R5 synthetic B '+runId,created_by:ownerB.userId}).select('id').single();
const orgA=must(o1.data,o1.error,'org A').id;
const orgB=must(o2.data,o2.error,'org B').id;
const memberships=await admin.from('organization_members').insert([
 {organization_id:orgA,user_id:ownerA.userId},
 {organization_id:orgB,user_id:ownerB.userId},
 {organization_id:orgA,user_id:viewer.userId},
]);
if(memberships.error)throw new Error('memberships fixture failed');
const grants=await admin.from('organization_user_roles').upsert([
 {organization_id:orgA,user_id:ownerA.userId,role_id:owner,assigned_by:ownerA.userId},
 {organization_id:orgB,user_id:ownerB.userId,role_id:owner,assigned_by:ownerB.userId},
 {organization_id:orgA,user_id:viewer.userId,role_id:viewerRole,assigned_by:ownerA.userId},
],{onConflict:'organization_id,user_id'});
if(grants.error)throw new Error('role fixture failed');
const eA=await admin.from('employees').insert({organization_id:orgA,employee_code:'R5-A-'+runId.slice(0,8),full_name:'Synthetic A',employment_status:'active'}).select('id').single();
const eB=await admin.from('employees').insert({organization_id:orgB,employee_code:'R5-B-'+runId.slice(0,8),full_name:'Synthetic B',employment_status:'active'}).select('id').single();
const empA=must(eA.data,eA.error,'employee A').id;
const empB=must(eB.data,eB.error,'employee B').id;
const runA=await admin.from('payroll_runs').insert({organization_id:orgA,period_start:'2026-11-01',period_end:'2026-11-30',status:'draft'}).select('id').single();
const runB=await admin.from('payroll_runs').insert({organization_id:orgB,period_start:'2026-11-01',period_end:'2026-11-30',status:'draft'}).select('id').single();
const payrollA=must(runA.data,runA.error,'run A').id;
const payrollB=must(runB.data,runB.error,'run B').id;
const items=await admin.from('payroll_items').insert([
 {payroll_run_id:payrollA,employee_id:empA,gross_amount:100000,deduction_amount:0,net_amount:100000},
 {payroll_run_id:payrollB,employee_id:empB,gross_amount:200000,deduction_amount:0,net_amount:200000},
]);
if(items.error)throw new Error('synthetic item seed failed');

const readGrant=(org)=>({authenticated:true,workspaceReady:true,organizationId:org,peopleManage:true});
const erpA=createCanonicalPayrollReader(ownerA.client,readGrant(orgA));
const standaloneA=await readLocalCanonicalPayroll(ownerA.client,orgA);
const [employees,runs,itemsA]=await Promise.all([
 erpA.employees(orgA),erpA.payrollRuns(orgA),erpA.payrollItems(orgA),
]);
assert.deepEqual(standaloneA.employees.map(r=>r.id).sort(),employees.map(r=>r.id).sort());
assert.deepEqual(standaloneA.payroll_runs.map(r=>r.id).sort(),runs.map(r=>r.id).sort());
assert.deepEqual(standaloneA.payroll_items.map(r=>r.id).sort(),itemsA.map(r=>r.id).sort());
assert.ok(employees.some(r=>r.id===empA),'own employee visible');
assert.ok(!employees.some(r=>r.id===empB),'other employee hidden');
assert.ok(itemsA.every(r=>r.organization_id===orgA),'join-scoped tenant');
await assert.rejects(()=>readLocalCanonicalPayroll(ownerB.client,orgA),/Access denied/);
await assert.rejects(()=>readLocalCanonicalPayroll(viewer.client,orgA),/Access denied/);
const standaloneB=await readLocalCanonicalPayroll(ownerB.client,orgB);
assert.ok(standaloneB.employees.some(r=>r.id===empB),'org B own employee');
assert.ok(!standaloneB.employees.some(r=>r.id===empA),'org B cannot see org A');
console.log('QP1_R5_DUAL_CONSUMER_API_PARITY_PASS 8 conditions');
if(process.env.QP1_BROWSER_E2E !== 'true') console.log('QP1_R5_BROWSER_AUTH_PARITY_UNTESTED');

if(process.env.QP1_BROWSER_E2E==='true'){
  const {chromium}=await import('playwright-core');
  const chromeExe=process.env.QP1_CHROME_PATH;
  assert.ok(chromeExe,'QP1_CHROME_PATH required for isolated browser E2E');
  const browser=await chromium.launch({
    executablePath:chromeExe,headless:true,
    args:['--no-first-run','--disable-background-networking','--disable-extensions'],
  });
  try{
    const erp=await browser.newPage();
    const standalone=await browser.newPage();
    const pageErrors=[];
    for(const page of [erp,standalone]) page.on('pageerror',err=>pageErrors.push(err.message));
    await erp.goto('http://127.0.0.1:56831',{waitUntil:'domcontentloaded',timeout:45000});
    await erp.locator('#email').fill(ownerA.email);
    await erp.locator('#password').fill(ownerA.password);
    await erp.locator('button[type=submit]').click();
    await erp.waitForTimeout(5500);
    const erpStillAtLogin=await erp.locator('#email').isVisible().catch(()=>false);
    assert.equal(erpStillAtLogin,false,'ERP isolated Supabase login did not reach workspace');
    await erp.evaluate(()=>window.dispatchEvent(new CustomEvent('niaga-open-erp-tab',{detail:{tab:'payroll'}})));
    await erp.waitForTimeout(2200);
    const erpPanel=erp.getByLabel('Canonical Payroll isolated read');
    if(!(await erpPanel.isVisible())) {
      console.log('ERP_ROUTE_DIAG',JSON.stringify({
        headings:(await erp.locator('h1,h2,h3').allTextContents()).slice(0,16),
        alerts:(await erp.locator('[role=alert]').allTextContents()).slice(0,8),
        links:(await erp.locator('button').allTextContents()).map(x=>x.trim()).filter(Boolean).slice(0,22),
        activeTab:await erp.evaluate(()=>localStorage.getItem('niaga-active-tab')),
        errors:pageErrors.slice(0,4),
      }));
    }
    assert.ok(await erpPanel.isVisible(),'ERP canonical payroll panel not visible');
    const erpText=await erpPanel.innerText();
    assert.ok(!erpText.includes('Akses ditolak'),'ERP canonical access denied');
    assert.ok(erpText.includes('Payroll Runs'),'ERP payroll summary missing');
    await standalone.goto('http://127.0.0.1:56832',{waitUntil:'domcontentloaded',timeout:45000});
    await standalone.getByLabel('Email Supabase staging').fill(ownerA.email);
    await standalone.getByLabel('Password Supabase staging').fill(ownerA.password);
    await standalone.getByRole('button',{name:'Masuk staging'}).click();
    await standalone.getByLabel('Organization UUID kanonis').fill(orgA);
    await standalone.getByRole('button',{name:'Baca kanonis'}).click();
    await standalone.waitForTimeout(2500);
    const standaloneText=await standalone.getByText('Data kanonis berhasil dibaca lewat Supabase RLS. Mode baca saja.').allTextContents();
    assert.ok(standaloneText.length>0,'Standalone browser canonical read did not complete');
    const standalonePanelText=await standalone.locator('section').first().innerText();
    const countFrom=(text,label)=>{
      const found=text.match(new RegExp(label+'\\s*(\\d+)','i'));
      assert.ok(found,'missing browser count for '+label);
      return Number(found[1]);
    };
    const erpCounts=[countFrom(erpText,'Employees'),countFrom(erpText,'Payroll Runs'),countFrom(erpText,'Payroll Items')];
    const standaloneCounts=[countFrom(standalonePanelText,'employees'),countFrom(standalonePanelText,'payrollRuns'),countFrom(standalonePanelText,'payrollItems')];
    assert.deepEqual(erpCounts,standaloneCounts,'visible dual-frontend counts differ');
    assert.deepEqual(erpCounts,[1,1,1],'synthetic fixture counts must match exact tenant');
    console.log('QP1_R5_BROWSER_VISIBLE_COUNTS_MATCH 1/1/1');
    await standalone.getByRole('button',{name:'Keluar staging'}).click();
    await standalone.getByLabel('Email Supabase staging').fill(viewer.email);
    await standalone.getByLabel('Password Supabase staging').fill(viewer.password);
    await standalone.getByRole('button',{name:'Masuk staging'}).click();
    await standalone.getByLabel('Organization UUID kanonis').fill(orgA);
    await standalone.getByRole('button',{name:'Baca kanonis'}).click();
    await standalone.waitForTimeout(1000);
    const denied=await standalone.getByText('Akses kanonis ditolak, organisasi tidak cocok, atau layanan tidak tersedia.').isVisible();
    assert.equal(denied,true,'viewer must be denied in Standalone browser UI');
    console.log('QP1_R5_BROWSER_VIEWER_DENIAL_PASS');    assert.equal(pageErrors.length,0,'browser script errors');
    console.log('QP1_R5_AUTHENTICATED_BROWSER_DUAL_UI_PARITY_PASS');
  }finally{await browser.close();}
}
