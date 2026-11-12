import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
import {chromium} from 'playwright-core';
import {createClient} from '@supabase/supabase-js';
const url=process.env.SUPABASE_URL;
if(url!=='http://127.0.0.1:56821'||
 process.env.QP1_ISOLATED_PROJECT_ID!=='niaga-qp1-r15-functional-20261111'||!process.env.SUPABASE_SERVICE_ROLE_KEY)
 throw Error('R21 browser refuses non-isolated Supabase');
const adm=createClient(url,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});
const f=readFileSync('F:/Niaga-QP1-R15-TestDeps/R15-LOCAL-DEMO-ACCOUNTS.txt','utf8');
function cred(role){const m=new RegExp('^'+role+'\\s*\\|\\s*Email:\\s*(\\S+)\\s*\\|\\s*Password:\\s*(\\S+)','m').exec(f);if(!m)throw Error('Missing fixture '+role);return m;}
const code='R21'+randomUUID().slice(0,8).toUpperCase();
let employeeId,attendanceId,leaveId,reviewId,runId,org;
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-first-run','--disable-extensions']});
const errors=[];
try{
 const page=await browser.newPage({viewport:{width:1440,height:960}});
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:56941/',{waitUntil:'domcontentloaded',timeout:20000});
 assert.equal((await page.locator('body').innerText()).includes('admin@payroll.local'),false,'legacy demo credentials must be absent');
 const bridge=page.locator('[data-testid="r20-standalone-bridge"]');
 const owner=cred('OWNER HR');
 await bridge.getByLabel('Email Supabase staging').fill(owner[1]);
 await bridge.getByLabel('Password Supabase staging').fill(owner[2]);
 await bridge.getByRole('button',{name:'Masuk kanonis'}).click();
 const ops=page.locator('[data-testid="r21-hr-operational"]');
 await ops.waitFor({state:'visible',timeout:16000});
 org=await bridge.locator('[data-testid="r20-current-org"]').innerText();
 await bridge.getByLabel('Kode karyawan kanonis').fill(code);
 await bridge.getByLabel('Nama karyawan kanonis').fill('R21 Browser Synthetic');
 await bridge.getByRole('button',{name:'Tambah kanonis'}).click();
 await bridge.getByText('Karyawan kanonis dibuat tanpa menyalin data demo.').waitFor({timeout:12000});
 const emp=await adm.from('employees').select('id').eq('organization_id',org).eq('employee_code',code).single();
 if(emp.error||!emp.data)throw Error('Synthetic employee not created');
 employeeId=emp.data.id;
 await ops.getByLabel('Pilih karyawan R21').selectOption(employeeId);
 await ops.getByRole('button',{name:'Buat draft absensi'}).click();
 await page.waitForTimeout(800);
 let rs=await adm.from('hr_attendance_records').select('id').eq('organization_id',org).eq('employee_id',employeeId);
 assert.equal(rs.data?.length,1);attendanceId=rs.data[0].id;
 await ops.getByRole('button',{name:'Ajukan cuti'}).click();
 await page.waitForTimeout(750);
 rs=await adm.from('hr_leave_requests').select('id').eq('organization_id',org).eq('employee_id',employeeId);
 assert.equal(rs.data?.length,1);leaveId=rs.data[0].id;
 const pending=await adm.from('hr_payroll_reviews')
  .select('id,payroll_run_id').eq('organization_id',org).eq('status','pending')
  .eq('note','Review draft R21 staging').limit(1);
 assert.equal(pending.data?.length,1,'Existing synthetic pending review fixture required');
 runId=pending.data[0].payroll_run_id;
 reviewId=pending.data[0].id;
 await ops.getByRole('button',{name:'Refresh operasional'}).click();
 await ops.getByLabel('Draft payroll R21').selectOption(runId);
 await ops.screenshot({path:'F:/Niaga-QP1-R21-STANDALONE-20261112/docs/qp1-r21/r21-maker-operations.png'});
 await bridge.getByRole('button',{name:'Keluar staging'}).click();
 const checker=cred('REVIEWER');
 await bridge.getByLabel('Email Supabase staging').fill(checker[1]);
 await bridge.getByLabel('Password Supabase staging').fill(checker[2]);
 await bridge.getByRole('button',{name:'Masuk kanonis'}).click();
 await ops.waitFor({state:'visible',timeout:15000});
 const list=await ops.innerText();
 assert.ok(list.includes('Review Draft Payroll')&&list.includes('2039'));
 await ops.locator('[data-testid="r21-list-attendance"] [data-record-id="'+attendanceId+'"]').getByRole('button',{name:'Review / terima'}).click();
 await page.waitForTimeout(600);
 // Reviewed attendance removed from actionable buttons; locate intended records with DB.
 const v=await adm.from('hr_attendance_records').select('status').eq('id',attendanceId).single();
 assert.equal(v.data?.status,'verified');
 await ops.locator('[data-testid="r21-list-leave"] [data-record-id="'+leaveId+'"]').getByRole('button',{name:'Review / terima'}).click();
 await page.waitForTimeout(650);
 const lv=await adm.from('hr_leave_requests').select('status').eq('id',leaveId).single();
 assert.equal(lv.data?.status,'approved');
 await ops.locator('[data-testid="r21-list-payroll"] [data-record-id="'+reviewId+'"]').getByRole('button',{name:'Review / terima'}).click();
 await page.waitForTimeout(650);
 const pr=await adm.from('hr_payroll_reviews').select('status').eq('id',reviewId).single();
 assert.equal(pr.data?.status,'reviewed');
 const finalRun=await adm.from('payroll_runs').select('status').eq('id',runId).single();
 assert.equal(finalRun.data?.status,'draft');
 await ops.screenshot({path:'F:/Niaga-QP1-R21-STANDALONE-20261112/docs/qp1-r21/r21-checker-reviewed.png'});
 assert.deepEqual(errors,[]);
 console.log('QP1_R21_OWNER_REVIEWER_CHROME_STAGING_PASS');
}finally{
 await browser.close();
 // Existing synthetic HR review is retained for controlled staging traceability.
 if(leaveId)await adm.from('hr_leave_requests').delete().eq('id',leaveId);
 if(attendanceId)await adm.from('hr_attendance_records').delete().eq('id',attendanceId);
 // Existing draft run is retained for controlled staging traceability.
 if(employeeId)await adm.from('employees').delete().eq('id',employeeId);
}