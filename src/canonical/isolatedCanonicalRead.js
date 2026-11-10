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
