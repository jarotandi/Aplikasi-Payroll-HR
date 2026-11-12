import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createR21Attendance,createR21Leave,createR21PayrollReview,reviewR21PayrollDraft,
 reviewR21Leave,reviewR21Attendance} from '../../src/canonical/operationalR21.js';
const org='57c1cdb8-ebd4-4f73-9a35-3a9bfef447e4',user='cac483d8-1ade-4edd-9527-a710fbe3d40b';
function actor(){
 let touched=0;
 return {client:{auth:{getUser:async()=>({data:{user:{id:user}},error:null})},
   rpc:async name=>({data:name==='current_organization_id'?org:true,error:null}),
   from:()=>{touched++;throw Error('Should not query DB');}},touched:()=>touched};
}
test('R21 forbids payment/Finance decisions before mutation',async()=>{
 const a=actor(),row={id:org,organization_id:org,status:'pending',requested_by:'different'};
 await assert.rejects(()=>reviewR21PayrollDraft(a.client,row,'approved'),/Invalid/);
 await assert.rejects(()=>reviewR21PayrollDraft(a.client,row,'paid'),/Invalid/);
 assert.equal(a.touched(),0);
});
test('R21 self-review and foreign org requests fail before DML',async()=>{
 const a=actor(),row={id:org,organization_id:org,status:'pending',requested_by:user};
 await assert.rejects(()=>reviewR21Leave(a.client,row,'approved'),/maker\/checker/);
 await assert.rejects(()=>reviewR21PayrollDraft(a.client,row,'reviewed'),/maker\/checker/);
 await assert.rejects(()=>reviewR21Attendance(a.client,{...row,status:'draft',created_by:user},'verified'),/maker\/checker/);
 await assert.rejects(()=>reviewR21PayrollDraft(a.client,{...row,organization_id:'another'},'reviewed'),/maker\/checker/);
 assert.equal(a.touched(),0);
});
test('R21 rejects forged organization/identifiers and invalid dates',async()=>{
 const a=actor();
 await assert.rejects(()=>createR21Attendance(a.client,{employeeId:'other',attendanceDate:'2026-11-12'}),/ID/);
 await assert.rejects(()=>createR21Attendance(a.client,{employeeId:org,attendanceDate:'2026-02-30'}),/date/);
 await assert.rejects(()=>createR21Leave(a.client,{employeeId:org,startDate:'2026-11-13',endDate:'2026-11-12',reason:'test',leaveType:'annual'}),/leave/);
 await assert.rejects(()=>createR21PayrollReview(a.client,'forged','ignored'),/ID/);
 assert.equal(a.touched(),0);
});
