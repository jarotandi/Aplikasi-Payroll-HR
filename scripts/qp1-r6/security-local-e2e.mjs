/** QP1-R6 local-only Supabase session & signed URL acceptance. Synthetic fixtures only. */
import assert from 'node:assert/strict';
import {randomUUID,randomBytes} from 'node:crypto';
import {createClient} from '@supabase/supabase-js';
const url=process.env.SUPABASE_URL,anon=process.env.SUPABASE_ANON_KEY,secret=process.env.SUPABASE_SERVICE_ROLE_KEY;
if(process.env.QP1_ISOLATED_PROJECT_ID!=='niaga-qp1-isolated-r6-20261110'
 || url!=='http://127.0.0.1:56821' || !anon || !secret)
 throw new Error('HOLD: only dedicated QP1-R6 local Supabase fixture allowed');
const admin=createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false}});
const user=createClient(url,anon,{auth:{persistSession:false,autoRefreshToken:false}});
const email='qp1-r6-'+randomUUID()+'@example.test',password='test-'+randomBytes(20).toString('hex');
const create=await admin.auth.admin.createUser({email,password,email_confirm:true});
assert.ok(create.data.user&&!create.error,'fixture user creation');
const login=await user.auth.signInWithPassword({email,password});
assert.ok(login.data.session?.access_token&&!login.error,'fixture auth login');
const oldAccess=login.data.session.access_token;
const before=await user.auth.getUser();
assert.ok(before.data.user&&!before.error,'authenticated fixture session');
const logout=await user.auth.signOut({scope:'global'});
assert.ok(!logout.error,'global sign out request succeeded');
const after=await user.auth.getUser();
assert.ok(after.error||!after.data.user,'current client session removed');
console.log('QP1_R6_SIGNOUT_CLIENT_SESSION_CLEARED_PASS');
// Important: JWTs can remain usable until their exp; report rather than conceal.
const replay=createClient(url,anon,{global:{headers:{Authorization:'Bearer '+oldAccess}},auth:{persistSession:false,autoRefreshToken:false}});
const stale=await replay.from('profiles').select('id').eq('id',create.data.user.id);
console.log('QP1_R6_STALE_ACCESS_TOKEN_REPLAY_STATUS='+((stale.error||!stale.data?.length)?'denied_or_no_rows':'may_still_authorize'));
console.log('QP1_R6_STRICT_IMMEDIATE_JWT_REVOCATION_HOLD');

const bucket='qp1-r6-'+randomUUID();
const created=await admin.storage.createBucket(bucket,{public:false});
assert.ok(!created.error,'fixture private bucket');
try{
 const filename='fixture-'+randomUUID()+'.txt';
 const uploaded=await admin.storage.from(bucket).upload(filename,Buffer.from('QP1-R6 non-sensitive synthetic fixture'),{contentType:'text/plain'});
 assert.ok(!uploaded.error,'private fixture upload');
 const signed=await admin.storage.from(bucket).createSignedUrl(filename,1);
 assert.ok(signed.data?.signedUrl&&!signed.error,'1-second signed URL');
 const signedUrl=signed.data.signedUrl;
 assert.ok(signedUrl.startsWith(url),'signed URL is local-only');
 const immediate=await fetch(signedUrl);
 assert.equal(immediate.status,200,'signed URL must work before expiry');
 await new Promise(resolve=>setTimeout(resolve,2500));
 const expired=await fetch(signedUrl);
 assert.ok(expired.status===400||expired.status===401||expired.status===403,'expired signed URL denied');
 console.log('QP1_R6_SIGNED_URL_EXPIRY_PASS: denied_after_expiry');
 const renewed=await admin.storage.from(bucket).createSignedUrl(filename,30);
 assert.ok(renewed.data?.signedUrl&&!renewed.error,'fresh signed URL');
 const deletion=await admin.storage.from(bucket).remove([filename]);
 assert.ok(!deletion.error,'fixture deletion');
 const deleted=await fetch(renewed.data.signedUrl);
 assert.ok(deleted.status===400||deleted.status===401||deleted.status===403||deleted.status===404,'deleted object cannot be fetched by previously signed URL');
 console.log('QP1_R6_SIGNED_URL_OBJECT_REMOVAL_PASS');
}finally{
 await admin.storage.emptyBucket(bucket);
 await admin.storage.deleteBucket(bucket);
 await admin.auth.admin.deleteUser(create.data.user.id);
}
console.log('QP1_R6_STORAGE_SESSION_ACCEPTANCE_COMPLETE');
