import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluateCutoverManifest} from './evaluate-cutover-manifest.mjs';
const complete={
  schemaVersion:1,sourceSha256:'a'.repeat(64),sourceEmployeeCount:2,
  canonicalEmployeeCount:2,duplicateEmployeeCount:0,unresolvedIdentityCount:0,
  organizationMappingReviewed:true,lawfulDataProcessingReviewed:true,
  grossNetPeriodsReconciled:true,independentApproverReviewed:true,
  rollbackDryRunPassed:true,destination:'isolated-test-only',
};
test('complete manifest is review eligible but cannot execute migration',()=>{
 const v=evaluateCutoverManifest(complete);
 assert.equal(v.eligibleForIndependentReview,true);
 assert.equal(v.executable,false);
 assert.equal(v.productionGo,false);
 assert.equal(v.mode,'DRY_RUN_REVIEW_ONLY');
});
test('missing approvals, source hash and legal basis fail closed',()=>{
 const v=evaluateCutoverManifest({...complete,independentApproverReviewed:false,sourceSha256:'invalid',lawfulDataProcessingReviewed:false});
 assert.equal(v.eligibleForIndependentReview,false);
 assert.ok(v.blockers.includes('missing_sourceHash'));
 assert.ok(v.blockers.includes('missing_approvals'));
 assert.ok(v.blockers.includes('missing_legalBasis'));
});
test('record count mismatch, duplicates and unresolved identities block review',()=>{
 const v=evaluateCutoverManifest({...complete,sourceEmployeeCount:3,duplicateEmployeeCount:1,unresolvedIdentityCount:2});
 assert.ok(v.blockers.includes('record_count_mismatch'));
 assert.equal(v.eligibleForIndependentReview,false);
});
test('production database destination cannot be used even with all approvals',()=>{
 const v=evaluateCutoverManifest({...complete,destination:'production'});
 assert.ok(v.blockers.includes('missing_dbIsolation'));
 assert.equal(v.productionGo,false);
});
test('returned evidence never includes raw salary, names or employee identifiers',()=>{
 const v=evaluateCutoverManifest({...complete,employeeName:'Private Name',bankAccount:'123',salary:20000000});
 assert.equal(JSON.stringify(v).includes('Private Name'),false);
 assert.equal(JSON.stringify(v).includes('20000000'),false);
});
