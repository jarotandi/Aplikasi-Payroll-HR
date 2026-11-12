import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
import {chromium} from 'playwright-core';
import {createClient} from '@supabase/supabase-js';
const isolated='http://127.0.0.1:56821';
if(process.env.SUPABASE_URL!==isolated||
 process.env.QP1_ISOLATED_PROJECT_ID!=='niaga-qp1-r15-functional-20261111'||
 !process.env.SUPABASE_SERVICE_ROLE_KEY)throw Error('Browser test: isolated local only');
const fixture=readFileSync('F:/Niaga-QP1-R15-TestDeps/R15-LOCAL-DEMO-ACCOUNTS.txt','utf8');
const m=/^OWNER HR\s*\|\s*Email:\s*(\S+)\s*\|\s*Password:\s*(\S+)/m.exec(fixture);
if(!m)throw Error('R20 synthetic Owner missing');
const admin=createClient(isolated,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});
const employeeCode='R20'+randomUUID().slice(0,8).toUpperCase();
let employeeId=null;
async function main(){
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless:true,args:['--no-first-run','--disable-extensions']});
 const errors=[];
 try{
  const standalone=await browser.newPage({viewport:{width:1470,height:920}});
  standalone.on('pageerror',e=>errors.push('standalone: '+e.message));
  await standalone.goto('http://127.0.0.1:56921/',{waitUntil:'domcontentloaded',timeout:25000});
  const panel=standalone.locator('[data-testid="r20-standalone-bridge"]');
  await panel.waitFor({state:'visible',timeout:15000});
  assert.ok((await standalone.locator('body').innerText()).includes('PayRollix')||
            (await standalone.locator('body').innerText()).includes('Payroll'));
  await panel.getByLabel('Email Supabase staging').fill(m[1]);
  await panel.getByLabel('Password Supabase staging').fill(m[2]);
  await panel.getByRole('button',{name:'Masuk kanonis'}).click();
  const org=await panel.locator('[data-testid="r20-current-org"]').innerText({timeout:15000});
  assert.match(org,/^[0-9a-f-]{36}$/);
  await panel.locator('[data-testid="r20-canonical-counts"]').waitFor({state:'visible'});
  await panel.screenshot({path:'F:/Niaga-QP1-R20-STANDALONE-20261112/docs/qp1-r20/r20-standalone-auth.png'});
  await panel.getByLabel('Kode karyawan kanonis').fill(employeeCode);
  await panel.getByLabel('Nama karyawan kanonis').fill('R20 Browser Synthetic');
  await panel.getByRole('button',{name:'Tambah kanonis'}).click();
  await panel.getByRole('status').getByText(/Karyawan kanonis dibuat/).waitFor({state:'visible',timeout:15000});
  const [found]=await Promise.all([admin.from('employees').select('id,organization_id').eq('employee_code',employeeCode).eq('organization_id',org).single()]);
  if(found.error||!found.data)throw Error('Synthetic employee not stored in canonical DB');
  employeeId=found.data.id;

  const erp=await browser.newPage({viewport:{width:1700,height:960}});
  erp.on('pageerror',e=>errors.push('erp: '+e.message));
  await erp.goto('http://127.0.0.1:56931/',{waitUntil:'domcontentloaded',timeout:25000});
  await erp.locator('#email').fill(m[1]);await erp.locator('#password').fill(m[2]);
  await erp.locator('button[type=submit]').click();
  await erp.locator('#email').waitFor({state:'hidden',timeout:16000});
  await erp.waitForTimeout(1000);
  assert.ok((await erp.locator('body').innerText()).includes('Niaga Business OS'),'V3 workspace changed');
  await erp.evaluate(()=>window.dispatchEvent(new CustomEvent('niaga-open-erp-tab',{detail:{tab:'payroll'}})));
  await erp.locator('[data-testid="payroll-v3-shell"]').waitFor({state:'visible',timeout:13000});
  await erp.locator('.payroll-v3-nav-item').filter({hasText:'Karyawan'}).first().click();
  await erp.getByText('R20 Browser Synthetic').first().waitFor({state:'visible',timeout:12000});
  await erp.screenshot({path:'F:/Niaga-QP1-R20-STANDALONE-20261112/docs/qp1-r20/r20-business-os-same-employee.png',fullPage:true});

  await panel.getByLabel('Pilih karyawan kanonis').selectOption(employeeId);
  await panel.getByLabel('Nama karyawan baru').fill('R20 Browser Updated');
  await panel.getByRole('button',{name:'Perbarui kanonis'}).click();
  await panel.getByText('Perubahan karyawan tersimpan di Supabase kanonis.').waitFor({state:'visible',timeout:15000});
  await erp.reload({waitUntil:'domcontentloaded',timeout:20000});
  await erp.waitForTimeout(1000);
  await erp.evaluate(()=>window.dispatchEvent(new CustomEvent('niaga-open-erp-tab',{detail:{tab:'payroll'}})));
  await erp.locator('[data-testid="payroll-v3-shell"]').waitFor({state:'visible',timeout:16000});
  await erp.locator('.payroll-v3-nav-item').filter({hasText:'Karyawan'}).first().click();
  await erp.getByText('R20 Browser Updated').first().waitFor({state:'visible',timeout:15000});
  const all=await admin.from('employees').select('id').eq('organization_id',org).eq('employee_code',employeeCode);
  assert.equal(all.data?.length,1,'no duplicate employee from two app surfaces');
  await panel.getByRole('button',{name:'Keluar staging'}).click();
  await panel.getByLabel('Email Supabase staging').waitFor({state:'visible'});
  assert.deepEqual(errors,[]);
  console.log('QP1_R20_DUAL_BROWSER_CANONICAL_SYNC_V3_PASS');
 }finally{
  await browser.close();
  if(employeeId)await admin.from('employees').delete().eq('id',employeeId);
 }
}
main().catch(e=>{console.error('QP1_R20_DUAL_BROWSER_HOLD',e.stack||e.message);process.exitCode=1});
