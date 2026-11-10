/**
 * QP1-R6 legacy browser backup -> canonical data migration READINESS audit.
 * No network, no writes, no PII output. Never maps currentUser demo as SSO.
 */
export function auditLegacyPayrollSnapshot(snapshot) {
  const errors=[],warnings=[],counts={};
  if(!snapshot || typeof snapshot!=='object'||Array.isArray(snapshot)) return {go:false,errors:['invalid_snapshot_shape'],warnings,counts};
  const collections={
    employees:snapshot['payroll-employees'],
    attendance:snapshot['payroll-attendance'],
    workers:snapshot['payroll-external-workers'],
    minimumWages:snapshot['payroll-minimum-wages'],
    payrollRows:snapshot['payroll-rows'],
    users:snapshot['payroll-users'],
    auditLogs:snapshot['payroll-audit-logs'],
  };
  for(const [name,records] of Object.entries(collections)){
    if(records!==undefined && !Array.isArray(records))errors.push('invalid_'+name+'_collection');
    counts[name]=Array.isArray(records)?records.length:0;
  }
  if(errors.length)return {go:false,errors,warnings,counts};
  const employees=collections.employees??[];
  if(!employees.length)warnings.push('no_legacy_employee_records');
  const identifiers=new Set();
  let noIdentifiers=0,duplicateIdentifiers=0;
  for(const employee of employees){
    if(!employee || typeof employee!=='object' || Array.isArray(employee)){errors.push('invalid_employee_record');continue}
    // Legacy data does not establish canonical IDs or organization grants.
    const raw=employee.employee_code ?? employee.employeeCode ?? employee.nik ?? employee.id;
    const key=typeof raw==='string'||typeof raw==='number'?String(raw).trim().toLowerCase():'';
    if(!key){noIdentifiers++;continue;}
    if(identifiers.has(key)){duplicateIdentifiers++;continue;}
    identifiers.add(key);
  }
  if(noIdentifiers)errors.push('employee_identifier_missing');
  if(duplicateIdentifiers)errors.push('duplicate_legacy_employee_identifiers');
  if(counts.payrollRows)warnings.push('historical_payroll_requires_independent_reconciliation');
  if(counts.users)warnings.push('legacy_demo_users_not_accepted_as_ssO_identity');
  if(counts.attendance)warnings.push('attendance_requires_tenant_and_employee_fk_mapping');
  if(counts.workers)warnings.push('external_workers_require_org_mapping');
  // Never approve unattended mutation or payroll cutover: verified external
  // organization identity, dedup and legal rules are prerequisites.
  errors.push('canonical_org_identity_mapping_unverified');
  return {go:false,errors:[...new Set(errors)],warnings:[...new Set(warnings)],counts};
}
