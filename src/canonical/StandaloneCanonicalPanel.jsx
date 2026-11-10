import { useMemo, useState } from 'react';
import {
  createLocalCanonicalClient, isLocalCanonicalConfig, readLocalCanonicalPayroll,
} from './isolatedCanonicalRead';

export default function StandaloneCanonicalPanel() {
  const enabled=useMemo(()=>isLocalCanonicalConfig({
    flag:import.meta.env.VITE_QP1_ISOLATED_PAYROLL_READ,
    appHost:window.location.hostname,
    supabaseUrl:import.meta.env.VITE_SUPABASE_URL,
  }),[]);
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [organizationId,setOrganizationId]=useState('');
  const [client]=useState(()=>enabled ? createLocalCanonicalClient() : null);
  const [authenticated,setAuthenticated]=useState(false);
  const [counts,setCounts]=useState(null);
  const [status,setStatus]=useState('HOLD: login demo tidak memiliki otoritas Supabase.');
  const [busy,setBusy]=useState(false);

  async function signIn(event) {
    event.preventDefault();setCounts(null);setBusy(true);
    try {
      const {error}=await client.auth.signInWithPassword({email,password});
      setPassword('');
      if(error) throw new Error('Authentication denied');
      setAuthenticated(true);
      setStatus('Autentikasi Supabase staging berhasil. Pilih organization UUID kanonis.');
    } catch {
      setAuthenticated(false);
      setStatus('Autentikasi Supabase lokal ditolak atau tidak tersedia.');
    } finally {setBusy(false);}
  }
  async function loadCanonical() {
    setCounts(null);setBusy(true);
    try {
      const rows=await readLocalCanonicalPayroll(client,organizationId);
      setCounts({
        employees:rows.employees.length,
        payrollRuns:rows.payroll_runs.length,
        payrollItems:rows.payroll_items.length,
      });
      setStatus('Data kanonis berhasil dibaca lewat Supabase RLS. Mode baca saja.');
    } catch {
      setStatus('Akses kanonis ditolak, organisasi tidak cocok, atau layanan tidak tersedia.');
    } finally {setBusy(false);}
  }
  async function signOut() {
    setCounts(null);setAuthenticated(false);setOrganizationId('');
    await client.auth.signOut().catch(()=>{});
    setStatus('Sesi Supabase staging ditutup.');
  }
  return <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
    <h2 className="font-bold text-slate-900">Canonical Payroll — Isolated Staging</h2>
    <p className="text-sm text-slate-600">
      Hanya baca metadata employees, payroll_runs dan payroll_items pada Supabase lokal.
      Login demo PayRollix serta data localStorage tidak memberi izin ke API kanonis.
      Persetujuan gaji, jurnal Finance, dan pembayaran tetap dinonaktifkan.
    </p>
    {!enabled ? <p role="alert" className="text-sm text-amber-800">
      HOLD: aktifkan hanya di localhost dengan Supabase lokal dan flag VITE_QP1_ISOLATED_PAYROLL_READ=true.
    </p> : <>
      {!authenticated && <form onSubmit={signIn} className="flex flex-wrap gap-2">
        <input aria-label="Email Supabase staging" className="rounded border p-2 text-sm" type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email akun fixture Supabase lokal"/>
        <input aria-label="Password Supabase staging" className="rounded border p-2 text-sm" type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password fixture lokal"/>
        <button disabled={busy} className="rounded bg-slate-900 px-4 py-2 text-sm text-white">Masuk staging</button>
      </form>}
      {authenticated && <div className="flex flex-wrap gap-2">
        <input aria-label="Organization UUID kanonis" className="min-w-72 rounded border p-2 text-sm" value={organizationId} onChange={e=>{setOrganizationId(e.target.value);setCounts(null);}} placeholder="Organization UUID"/>
        <button type="button" disabled={busy} onClick={loadCanonical} className="rounded bg-emerald-700 px-4 py-2 text-sm text-white">Baca kanonis</button>
        <button type="button" onClick={signOut} className="rounded border px-4 py-2 text-sm">Keluar staging</button>
      </div>}
      <p role="status" className="text-sm text-slate-600">{status}</p>
      {counts && <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {Object.entries(counts).map(([name,count])=><div key={name} className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500">{name}</p><strong className="text-xl">{count}</strong></div>)}
      </div>}
    </>}
  </section>;
}
