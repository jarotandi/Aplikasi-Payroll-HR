import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
import {createClient} from '@supabase/supabase-js';
import {createCanonicalEmployeeR20} from '../../src/canonical/isolatedCanonicalRead.js';
import {listR21Operational,createR21Attendance,reviewR21Attendance,createR21Leave,
 reviewR21Leave,createR21PayrollReview,reviewR21PayrollDraft} from '../../src/canonical/operationalR21.js';

const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_ANON_KEY,secret=process.env.SUPABASE_SERVICE_ROLE_KEY;
if(process.env.QP1_ISOLATED_PROJECT_ID!=='niaga-qp1-r15-functional-20261111'||
 url!=='http://127.0.0.1:56821'||!key||!secret)
 throw Error('R21 refuses non-disposable Supabase');
const admin=createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false}});
const client=()=>createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
const f=readFileSync('F:/Niaga-QP1-R15-TestDeps/R15-LOCAL-DEMO-ACCOUNTS.txt','utf8');
async function login(role){
 const m=new RegExp('^'+role+'\\s*\\|\\s*Email:\\s*(\\S+)\\s*\\|\\s*Password:\\s*(\\S+)','m').exec(f);
 if(!m)throw Error('Missing isolated fixture '+role);
 const c=client(),r=await c.auth.signInWithPassword({email:m[1],password:m[2]});
 if(r.error)throw Error('Fixture login '+role+' '+r.error.message);
 return c;
}
const expected=x=>{if(x.error||!x.data)throw Error(x.error?.message||'fixture missing');return x.data;};
let employeeId,runId,attendanceId,leaveId,reviewId,org;
(async()=>{
 try{
  const [owner,checker,viewer]=await Promise.all([login('OWNER HR'),login('REVIEWER'),login('VIEWER')]);
  const o=await owner.rpc('current_organization_id');org=expected(o);
  const c=await checker.rpc('current_organization_id');assert.equal(expected(c),org);
  const unique='R21'+randomUUID().slice(0,8).toUpperCase();
  employeeId=(await createCanonicalEmployeeR20(owner,{employee_code:unique,full_name:'R21 Synthetic HR'})).row.id;
  const run=await owner.from('payroll_runs').insert({
   organization_id:org,period_start:'2039-01-01',period_end:'2039-01-31',status:'draft',created_by:(await owner.auth.getUser()).data.user.id,
  }).select('id').single();
  runId=expected(run).id;
  const createdA=await createR21Attendance(owner,{employeeId,attendanceDate:'2026-11-12'});
  attendanceId=createdA.id;
  await assert.rejects(()=>reviewR21Attendance(owner,createdA,'verified'),/maker\/checker/);
  const verified=await reviewR21Attendance(checker,createdA,'verified');
  assert.equal(verified.status,'verified');
  await assert.rejects(()=>reviewR21Attendance(checker,createdA,'verified'),/denied|conflict|maker\/checker|review unavailable/);
  console.log('R21_ATTENDANCE_OWNER_TO_INDEPENDENT_CHECKER_PASS');
  const leave=await createR21Leave(owner,{
   employeeId,startDate:'2026-11-13',endDate:'2026-11-14',leaveType:'annual',reason:'R21 synthetic attendance',
  });
  leaveId=leave.id;
  await assert.rejects(()=>reviewR21Leave(owner,leave,'approved'),/maker\/checker/);
  const approved=await reviewR21Leave(checker,leave,'approved');
  assert.equal(approved.status,'approved');
  console.log('R21_LEAVE_MAKER_CHECKER_PASS');
  const req=await createR21PayrollReview(owner,runId,'R21 synthetic HR review (not Finance approval)');
  reviewId=req.id;
  await assert.rejects(()=>reviewR21PayrollDraft(owner,req,'reviewed'),/maker\/checker/);
  await assert.rejects(()=>reviewR21PayrollDraft(checker,req,'approved'),/Invalid/);
  const inspected=await reviewR21PayrollDraft(checker,req,'reviewed');
  assert.equal(inspected.status,'reviewed');
  const stillDraft=await checker.from('payroll_runs').select('status').eq('id',runId).single();
  assert.equal(expected(stillDraft).status,'draft','HR review must never finalize payroll run');
  console.log('R21_PAYROLL_HR_REVIEW_FINANCE_REMAINS_DRAFT_PASS');
  await assert.rejects(()=>listR21Operational(viewer),/Auth|people.manage|denied/);
  const owners=await listR21Operational(owner);
  assert.ok(owners.attendance.some(r=>r.id===attendanceId));
  assert.ok(owners.leaves.some(r=>r.id===leaveId));
  assert.ok(owners.reviews.some(r=>r.id===reviewId));
  assert.ok(owners.runs.every(r=>r.organization_id===org));
  console.log('R21_VIEWER_DENIED_AUDITED_ORG_PARITY_PASS');
  console.log('QP1_R21_ISOLATED_OPERATIONAL_E2E_PASS');
 }finally{
  // Synthetic only; never deletes production/historical records.
  if(reviewId)await admin.from('hr_payroll_reviews').delete().eq('id',reviewId);
  if(leaveId)await admin.from('hr_leave_requests').delete().eq('id',leaveId);
  if(attendanceId)await admin.from('hr_attendance_records').delete().eq('id',attendanceId);
  if(runId)await admin.from('payroll_runs').delete().eq('id',runId);
  if(employeeId)await admin.from('employees').delete().eq('id',employeeId);
 }
})().catch(e=>{console.error('QP1_R21_E2E_HOLD',e.stack||e.message);process.exitCode=1});
