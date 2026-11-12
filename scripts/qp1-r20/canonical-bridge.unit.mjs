import {test} from 'node:test';
import assert from 'node:assert/strict';
import {isLocalCanonicalConfig,resolveCanonicalSession,createCanonicalEmployeeR20} from '../../src/canonical/isolatedCanonicalRead.js';
const id='57c1cdb8-ebd4-4f73-9a35-3a9bfef447e4';
const user='77c1cdb8-ebd4-4f73-9a35-3a9bfef447e4';
function fake({activeId=id,perm=true,authId=user}={}){
 return {auth:{getUser:async()=>({data:{user:{id:authId}},error:null})},
  rpc:async name=>name==='current_organization_id'?{data:activeId,error:null}:{data:perm,error:null}};
}
test('R20 fails closed outside localhost with staging flag',()=>{
 assert.equal(isLocalCanonicalConfig({flag:'true',appHost:'localhost',supabaseUrl:'http://127.0.0.1:56821'}),true);
 assert.equal(isLocalCanonicalConfig({flag:'true',appHost:'example.com',supabaseUrl:'http://127.0.0.1:56821'}),false);
 assert.equal(isLocalCanonicalConfig({flag:'true',appHost:'localhost',supabaseUrl:'https://prod.supabase.co'}),false);
 assert.equal(isLocalCanonicalConfig({flag:'false',appHost:'localhost',supabaseUrl:'http://127.0.0.1:56821'}),false);
});
test('R20 accepts server-decided organization + permission',async()=>{
 assert.deepEqual(await resolveCanonicalSession(fake()),{userId:user,organizationId:id,peopleManage:true});
});
test('R20 rejects a missing active tenant or denied role',async()=>{
 await assert.rejects(()=>resolveCanonicalSession(fake({activeId:null})),/organization/);
 await assert.rejects(()=>resolveCanonicalSession(fake({perm:false})),/people.manage/);
});
test('R20 refuses untrusted employee codes before any DB query',async()=>{
 await assert.rejects(()=>createCanonicalEmployeeR20(fake(),{
  employee_code:'<script>',full_name:'Someone'}),/employee code/);
});
