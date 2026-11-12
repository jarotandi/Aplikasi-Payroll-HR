import { createClient } from '@supabase/supabase-js';
import { createCanonicalPayrollReader } from '@niaga/payroll-core';

/**
 * Staging-only. The legacy Standalone app uses localStorage demo state;
 * that state is NEVER trusted to authorize canonical payroll reads.
 */
export function isLocalCanonicalConfig({flag,appHost,supabaseUrl}) {
  if (flag !== 'true' || !['localhost','127.0.0.1'].includes(appHost)) return false;
  try {
    const url = new URL(supabaseUrl || '');
    return url.protocol === 'http:' && url.port !== '' &&
      ['localhost','127.0.0.1'].includes(url.hostname);
  } catch { return false; }
}
export function isPublicSupabaseKey(value) {
  if (typeof value !== 'string') return false;
  if (value.startsWith('sb_publishable_')) return true;
  if (!value.startsWith('eyJ') || value.split('.').length !== 3) return false;
  try {
    const payload = JSON.parse(atob(value.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));
    return payload.role === 'anon';
  } catch { return false; }
}export function createLocalCanonicalClient({
  flag = import.meta.env.VITE_QP1_ISOLATED_PAYROLL_READ,
  appHost = window.location.hostname,
  supabaseUrl = import.meta.env.VITE_SUPABASE_URL,
  anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY,
} = {}) {
  if (!isLocalCanonicalConfig({flag,appHost,supabaseUrl}) || !isPublicSupabaseKey(anonKey))
    throw new Error('Canonical Payroll is unavailable outside isolated staging');
  // Session memory only; demo login and localStorage are not a source of authority.
  return createClient(supabaseUrl,anonKey,{
    auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false},
  });
}
export async function readLocalCanonicalPayroll(client, organizationId) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(organizationId)) {
    throw new Error('Canonical organization unavailable');
  }
  const {data:{user},error:authError} = await client.auth.getUser();
  if (authError || !user) throw new Error('Isolated Supabase authentication required');
  // The default p_user_id is auth.uid() and cannot be impersonated by input.
  const permission=await client.rpc('has_organization_permission',{
    p_organization_id:organizationId,
    p_permission_code:'people.manage',
  });
  if (permission.error || permission.data !== true) throw new Error('Access denied');
  // Consume the exact compiled shared Payroll Core contract from Niaga ERP.
  // User-scoped Supabase session and database RLS remain authoritative;
  // the grant is based only on server RPC and a verified Auth session.
  const reader = createCanonicalPayrollReader(client, {
    authenticated: true,
    workspaceReady: true,
    organizationId,
    peopleManage: true,
  });
  const [employees, payrollRuns, payrollItems] = await Promise.all([
    reader.employees(organizationId),
    reader.payrollRuns(organizationId),
    reader.payrollItems(organizationId),
  ]);
  return { employees, payroll_runs: payrollRuns, payroll_items: payrollItems };
}


/**
 * R20 — canonical identity/tenant resolve. No manually typed org UUID, no
 * localStorage demo role, no service role, no JWT/user_metadata authorization.
 * Auth is a separate origin-local session; SSO redirect is NOT implied.
 */
export async function resolveCanonicalSession(client) {
  const {data:{user},error}=await client.auth.getUser();
  if(error || !user?.id) throw new Error('R20 requires real Supabase Auth');
  const {data:organizationId,error:orgError}=await client.rpc('current_organization_id');
  if(orgError || !/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(String(organizationId||''))) {
    throw new Error('R20 active organization unavailable');
  }
  const {data:granted,error:grantError}=await client.rpc('has_organization_permission',{
    p_organization_id:organizationId,p_permission_code:'people.manage',
  });
  if(grantError || granted!==true) throw new Error('R20 people.manage required');
  return Object.freeze({userId:user.id,organizationId,peopleManage:true});
}

/** Both apps call the same existing Niaga Payroll Core API, no copy/sync table. */
export async function readCanonicalSessionPayroll(client) {
  const ctx=await resolveCanonicalSession(client);
  const rows=await readLocalCanonicalPayroll(client,ctx.organizationId);
  // Shared Payroll Core verifies ID/tenant; details come from the SAME table.
  const {data:detail,error}=await client.from('employees')
    .select('id,organization_id,employee_code,full_name,employment_status')
    .eq('organization_id',ctx.organizationId);
  if(error||!Array.isArray(detail))throw Error('Canonical employee detail unavailable');
  if(detail.some(r=>r.organization_id!==ctx.organizationId)||
    detail.map(r=>r.id).sort().join(',')!==rows.employees.map(r=>r.id).sort().join(','))
    throw Error('Canonical employee detail parity HOLD');
  return {...rows,employees:detail,context:ctx};
}
const stringField=(value,label,max)=>{
  if(typeof value!=='string'||value.trim().length<2||value.trim().length>max||
    /[<>]/.test(value))throw new Error('Invalid '+label);
  return value.trim();
};
export async function createCanonicalEmployeeR20(client,raw){
  const ctx=await resolveCanonicalSession(client);
  const employee_code=stringField(raw.employee_code,'employee code',48);
  const full_name=stringField(raw.full_name,'employee name',120);
  if(!/^[A-Z0-9][A-Z0-9_-]{1,47}$/i.test(employee_code))
    throw new Error('Employee code format invalid');
  // UNIQUE(organization_id,employee_code) guarantees idempotence under concurrent writes.
  const existing=await client.from('employees').select('id,employee_code,full_name,organization_id')
    .eq('organization_id',ctx.organizationId).eq('employee_code',employee_code).maybeSingle();
  if(existing.error) throw new Error('Employee lookup denied: '+existing.error.message);
  if(existing.data){
    if(existing.data.full_name!==full_name)throw new Error('Employee code already exists with different name');
    return {row:existing.data,alreadyExists:true};
  }
  const inserted=await client.from('employees').insert({
    organization_id:ctx.organizationId,employee_code,full_name,employment_status:'active',
  }).select('id,employee_code,full_name,organization_id').single();
  if(inserted.error?.code==='23505'){
    // A concurrent request may have inserted the exact same employee.
    const raced=await client.from('employees').select('id,employee_code,full_name,organization_id')
      .eq('organization_id',ctx.organizationId).eq('employee_code',employee_code).maybeSingle();
    if(!raced.error && raced.data?.full_name===full_name)
      return {row:raced.data,alreadyExists:true};
  }
  if(inserted.error||!inserted.data)throw new Error('Canonical employee creation denied: '+inserted.error?.message);
  return {row:inserted.data,alreadyExists:false};
}
export async function updateCanonicalEmployeeR20(client,employeeId,newName){
  const ctx=await resolveCanonicalSession(client);
  const full_name=stringField(newName,'employee name',120);
  if(!/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(String(employeeId||'')))
    throw new Error('Invalid canonical employee ID');
  const {data,error}=await client.from('employees').update({full_name})
    .eq('id',employeeId).eq('organization_id',ctx.organizationId)
    .select('id,employee_code,full_name,organization_id').single();
  if(error||!data)throw new Error('Canonical employee update denied');
  return data;
}
