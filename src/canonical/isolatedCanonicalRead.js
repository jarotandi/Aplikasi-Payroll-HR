import { createClient } from '@supabase/supabase-js';

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
  const tables=['employees','payroll_runs','payroll_items'];
  const values=await Promise.all(tables.map((table)=> {
    if (table === 'payroll_items') {
      // Physical items have no organization_id. Filter through parent run.
      return client.from(table).select('id,payroll_run_id,payroll_runs!inner(organization_id)')
        .eq('payroll_runs.organization_id',organizationId);
    }
    return client.from(table).select('id,organization_id').eq('organization_id',organizationId);
  }));
  if(values.some((result)=>result.error || !Array.isArray(result.data)))
    throw new Error('Canonical payroll read unavailable');
  const normalized=values.map((result,i)=>result.data.map((row)=>{
    if(tables[i]!=='payroll_items') return row;
    const parent=row.payroll_runs;
    if(!parent || Array.isArray(parent) || typeof parent.organization_id!=='string')
      throw new Error('Canonical tenant boundary violation');
    return {...row,organization_id:parent.organization_id};
  }));
  if(normalized.some((rows)=>rows.some((row)=>row.organization_id!==organizationId)))
    throw new Error('Canonical tenant boundary violation');
  return Object.fromEntries(tables.map((table,i)=>[table,normalized[i]]));
}
