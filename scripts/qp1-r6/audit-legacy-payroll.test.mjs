import test from 'node:test';
import assert from 'node:assert/strict';
import { auditLegacyPayrollSnapshot } from './audit-legacy-payroll.mjs';

test('legacy payroll migration never automatically executes even if sample clean',()=>{
 const a=auditLegacyPayrollSnapshot({'payroll-employees':[{id:'test-1'}]});
 assert.equal(a.go,false);assert.ok(a.errors.includes('canonical_org_identity_mapping_unverified'));
 assert.equal(a.counts.employees,1);
});
test('duplicate employee identifiers are blocked, no personal values emitted',()=>{
 const a=auditLegacyPayrollSnapshot({'payroll-employees':[{id:'personal-x',fullName:'Private'},{id:'PERSONAL-X'}]});
 assert.ok(a.errors.includes('duplicate_legacy_employee_identifiers'));
 assert.equal(JSON.stringify(a).includes('Private'),false);
 assert.equal(JSON.stringify(a).includes('personal-x'),false);
});
test('missing employee identifiers or malformed collections fail closed',()=>{
 assert.ok(auditLegacyPayrollSnapshot({'payroll-employees':[{}]}).errors.includes('employee_identifier_missing'));
 assert.ok(auditLegacyPayrollSnapshot({'payroll-employees':{a:1}}).errors.includes('invalid_employees_collection'));
 assert.equal(auditLegacyPayrollSnapshot(null).go,false);
});
test('historical payroll, demo users and attendance require separate reconciliation',()=>{
 const a=auditLegacyPayrollSnapshot({'payroll-rows':[{}],'payroll-users':[{}],'payroll-attendance':[{}]});
 assert.equal(a.go,false);
 assert.ok(a.warnings.includes('historical_payroll_requires_independent_reconciliation'));
 assert.ok(a.warnings.includes('legacy_demo_users_not_accepted_as_ssO_identity'));
 assert.ok(a.warnings.includes('attendance_requires_tenant_and_employee_fk_mapping'));
});
