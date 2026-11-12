/**
 * QP1-R21 staging only: canonical operational HR subset.
 * No Finance, bank/payment, posting, official payslips or salary mutation.
 * Every request resolves server-owned Auth identity, active organization, role.
 */
import {resolveCanonicalSession} from './isolatedCanonicalRead.js';

const uuid=/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
const date=/^\d{4}-\d{2}-\d{2}$/;
const assertDate=x=>{
 if(typeof x!=='string'||!date.test(x)||new Date(x+'T00:00:00Z').toISOString().slice(0,10)!==x)
  throw Error('Invalid HR date');
 return x;
};
const assertId=x=>{if(!uuid.test(String(x||'')))throw Error('Invalid canonical ID');return x;};
const stringText=(x,min,max)=>{
 if(typeof x!=='string'||x.trim().length<min||x.trim().length>max||/[<>]/.test(x))throw Error('Invalid HR text');
 return x.trim();
};
const unwrap=(r,label)=>{
 if(r.error||!r.data)throw Error(label+' unavailable/denied');
 return r.data;
};
/** Never accept an organization ID, created_by, requested_by, or verified_by from UI. */
export async function listR21Operational(client){
 const ctx=await resolveCanonicalSession(client);
 const [attendance,leaves,reviews,runs]=await Promise.all([
  client.from('hr_attendance_records')
   .select('id,organization_id,employee_id,attendance_date,status,created_by,verified_by,check_in,check_out')
   .eq('organization_id',ctx.organizationId).order('attendance_date',{ascending:false}).limit(100),
  client.from('hr_leave_requests')
   .select('id,organization_id,employee_id,start_date,end_date,reason,leave_type,status,requested_by,reviewed_by')
   .eq('organization_id',ctx.organizationId).order('created_at',{ascending:false}).limit(100),
  client.from('hr_payroll_reviews')
   .select('id,organization_id,payroll_run_id,status,requested_by,reviewed_by,note')
   .eq('organization_id',ctx.organizationId).order('created_at',{ascending:false}).limit(100),
  client.from('payroll_runs')
   .select('id,organization_id,period_start,period_end,status')
   .eq('organization_id',ctx.organizationId).limit(100),
 ]);
 const data={
  attendance:unwrap(attendance,'attendance'),leaves:unwrap(leaves,'leave'),
  reviews:unwrap(reviews,'review'),runs:unwrap(runs,'runs'),
 };
 if(Object.values(data).some(rows=>rows.some(row=>row.organization_id!==ctx.organizationId)))
  throw Error('R21 cross tenant response denied');
 return {...data,context:ctx};
}
export async function createR21Attendance(client,{employeeId,attendanceDate}){
 const ctx=await resolveCanonicalSession(client);
 const id=assertId(employeeId),when=assertDate(attendanceDate);
 const record=unwrap(await client.from('hr_attendance_records').insert({
  organization_id:ctx.organizationId,employee_id:id,attendance_date:when,
  created_by:ctx.userId,source:'manual',status:'draft',
 }).select('id,organization_id,employee_id,status,created_by').single(),'attendance create');
 if(record.organization_id!==ctx.organizationId||record.created_by!==ctx.userId||record.status!=='draft')
  throw Error('R21 attendance invariant');
 return record;
}
export async function reviewR21Attendance(client,row,decision){
 const ctx=await resolveCanonicalSession(client);
 if(!['verified','rejected'].includes(decision))throw Error('Invalid attendance decision');
 if(row?.organization_id!==ctx.organizationId||!uuid.test(row?.id)||row.status!=='draft'||
   row.created_by===ctx.userId)throw Error('Attendance maker/checker denied');
 const result=await client.from('hr_attendance_records')
  .update({status:decision,verified_by:ctx.userId})
  .eq('id',row.id).eq('organization_id',ctx.organizationId).eq('status','draft')
  .select('id,organization_id,status,verified_by');
 const changed=unwrap(result,'attendance review');
 if(changed.length!==1||changed[0].status!==decision)throw Error('Attendance review conflict');
 return changed[0];
}
export async function createR21Leave(client,{employeeId,startDate,endDate,reason,leaveType}){
 const ctx=await resolveCanonicalSession(client);
 const employee=assertId(employeeId);
 const start=assertDate(startDate),end=assertDate(endDate);
 if(start>end||!['annual','sick','personal','other'].includes(leaveType))throw Error('Invalid leave request');
 const record=unwrap(await client.from('hr_leave_requests').insert({
  organization_id:ctx.organizationId,employee_id:employee,
  start_date:start,end_date:end,reason:stringText(reason,3,500),leave_type:leaveType,
  status:'pending',requested_by:ctx.userId,
 }).select('id,organization_id,status,requested_by').single(),'leave create');
 if(record.organization_id!==ctx.organizationId||record.requested_by!==ctx.userId||record.status!=='pending')
  throw Error('R21 leave invariant');
 return record;
}
export async function reviewR21Leave(client,row,decision){
 const ctx=await resolveCanonicalSession(client);
 if(!['approved','rejected'].includes(decision))throw Error('Invalid leave decision');
 if(row?.organization_id!==ctx.organizationId||!uuid.test(row?.id)||
   row.status!=='pending'||row.requested_by===ctx.userId)throw Error('Leave maker/checker denied');
 const changed=unwrap(await client.from('hr_leave_requests').update({
  status:decision,reviewed_by:ctx.userId,reviewed_at:new Date().toISOString(),
 }).eq('id',row.id).eq('organization_id',ctx.organizationId).eq('status','pending')
  .select('id,organization_id,status,reviewed_by'),'leave review');
 if(changed.length!==1||changed[0].status!==decision)throw Error('Leave review conflict');
 return changed[0];
}
export async function createR21PayrollReview(client,payrollRunId,note){
 const ctx=await resolveCanonicalSession(client);
 const run=assertId(payrollRunId);
 const memo=stringText(note,0,500);
 const record=unwrap(await client.from('hr_payroll_reviews').insert({
  organization_id:ctx.organizationId,payroll_run_id:run,
  status:'pending',requested_by:ctx.userId,note:memo,
 }).select('id,organization_id,status,requested_by').single(),'HR review request');
 if(record.organization_id!==ctx.organizationId||record.requested_by!==ctx.userId)
  throw Error('HR review invariant');
 return record;
}
export async function reviewR21PayrollDraft(client,row,decision){
 const ctx=await resolveCanonicalSession(client);
 if(!['reviewed','rejected'].includes(decision))throw Error('Invalid HR review decision');
 if(row?.organization_id!==ctx.organizationId||!uuid.test(row?.id)||
  row.status!=='pending'||row.requested_by===ctx.userId)throw Error('Payroll maker/checker denied');
 const changed=unwrap(await client.from('hr_payroll_reviews').update({
  status:decision,reviewed_by:ctx.userId,reviewed_at:new Date().toISOString(),
 }).eq('id',row.id).eq('organization_id',ctx.organizationId).eq('status','pending')
  .select('id,organization_id,status,reviewed_by'),'HR review decision');
 if(changed.length!==1||changed[0].status!==decision)throw Error('HR review conflict');
 return changed[0];
}
// Deliberately no function for payroll approved/paid, Finance posting, external
// transfer, sending payslips, creating public shares, or organization switching.
