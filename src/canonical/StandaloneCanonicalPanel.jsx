import {useMemo,useState} from 'react';
import {
 createLocalCanonicalClient,isLocalCanonicalConfig,readCanonicalSessionPayroll,
 resolveCanonicalSession,createCanonicalEmployeeR20,updateCanonicalEmployeeR20,
} from './isolatedCanonicalRead';

/** R20 standalone bridge. Existing legacy UI unchanged; its demo localStorage
 * data is not payroll production data and is never imported implicitly.
 */
export default function StandaloneCanonicalPanel(){
 const enabled=useMemo(()=>isLocalCanonicalConfig({
  flag:import.meta.env.VITE_QP1_ISOLATED_PAYROLL_READ,
  appHost:window.location.hostname,supabaseUrl:import.meta.env.VITE_SUPABASE_URL,
 }),[]);
 const [client]=useState(()=>enabled?createLocalCanonicalClient():null);
 const [email,setEmail]=useState(''),[password,setPassword]=useState('');
 const [session,setSession]=useState(null);
 const [snapshot,setSnapshot]=useState(null);
 const [code,setCode]=useState(''),[name,setName]=useState('');
 const [selected,setSelected]=useState(''),[rename,setRename]=useState('');
 const [busy,setBusy]=useState(false);
 const [status,setStatus]=useState('HOLD — login aplikasi demo tidak memberikan akses ke Payroll kanonis.');
 const [error,setError]=useState('');
 const refreshed=async()=>{
  const data=await readCanonicalSessionPayroll(client);
  if(session && data.context.userId!==session.userId)throw Error('R20 session switched; sign in again');
  setSession(data.context);setSnapshot(data);
  setStatus('Terhubung ke sumber data Supabase yang sama dengan Niaga Business OS (bukan sinkronisasi salinan).');
  return data;
 };
 const action=async task=>{
  if(busy)return;
  setBusy(true);setError('');
  try{await task();}
  catch(e){setError(e instanceof Error?e.message:'Permintaan ditolak');setSnapshot(null);}
  finally{setBusy(false);}
 };
 const signIn=e=>{
  e.preventDefault();
  void action(async()=>{
   const {error:loginError}=await client.auth.signInWithPassword({email,password});
   setPassword('');
   if(loginError)throw Error('Autentikasi Supabase staging gagal');
   const ctx=await resolveCanonicalSession(client);
   setSession(ctx);
   await refreshed();
  });
 };
 const signOut=()=>action(async()=>{
  await client.auth.signOut({scope:'global'});
  setSession(null);setSnapshot(null);setSelected('');setCode('');setName('');setRename('');
  setStatus('Sesi Supabase kanonis ditutup. Demo lokal tetap terpisah.');
 });
 return <section className="mb-6 rounded-2xl border border-emerald-200 bg-white p-5 space-y-3" data-testid="r20-standalone-bridge">
  <div className="flex flex-wrap justify-between gap-2 items-start">
   <div><h2 className="font-bold text-slate-900">Niaga Payroll · Canonical Bridge R20</h2>
    <p className="text-sm text-slate-600">Auth Supabase · organisasi otomatis · role people.manage · data kanonis langsung</p></div>
   <span className="rounded bg-amber-50 px-3 py-2 text-xs text-amber-900">LOCAL STAGING · FINANCE HOLD</span>
  </div>
  <p className="text-xs text-amber-900 bg-amber-50 p-3 rounded">
   Data demo aplikasi lama tetap tersimpan secara lokal dan <b>tidak</b> otomatis disinkronkan.
   Jalur R20 di bawah membaca dan mengubah tabel yang sama dengan Niaga Business OS.
   Setiap aplikasi memiliki sesi Auth masing-masing; belum ada login lintas-origin otomatis atau cutover legacy.
  </p>
  {!enabled?<p role="alert">HOLD: canonical integration requires localhost and isolated Supabase flag.</p>:
   <>
    {!session?<form onSubmit={signIn} className="flex flex-wrap gap-2">
      <input aria-label="Email Supabase staging" required type="email" value={email} onChange={e=>setEmail(e.target.value)}
       placeholder="Email staging" className="rounded border p-2 text-sm flex-1 min-w-40"/>
      <input aria-label="Password Supabase staging" required type="password" value={password} onChange={e=>setPassword(e.target.value)}
       placeholder="Password staging" className="rounded border p-2 text-sm flex-1 min-w-40"/>
      <button disabled={busy} type="submit" className="bg-emerald-700 text-white rounded p-2 px-4 text-sm">Masuk kanonis</button>
     </form>:
     <>
      <div className="flex flex-wrap gap-2 items-center justify-between text-sm">
       <div>Organisasi aktif (dari server): <strong data-testid="r20-current-org">{session.organizationId}</strong></div>
       <div className="flex gap-2">
        <button type="button" disabled={busy} onClick={()=>void action(refreshed)} className="rounded border px-3 py-2">Refresh kanonis</button>
        <button type="button" disabled={busy} onClick={signOut} className="rounded border px-3 py-2">Keluar staging</button>
       </div>
      </div>
      {snapshot&&<div className="grid grid-cols-3 gap-3" data-testid="r20-canonical-counts">
       {[
        ['employees',snapshot.employees.length],['payrollRuns',snapshot.payroll_runs.length],
        ['payrollItems',snapshot.payroll_items.length],
       ].map(([label,n])=><div key={label} className="bg-slate-50 rounded p-3">
        <p className="text-xs text-slate-500">{label}</p><strong>{n}</strong></div>)}
      </div>}
      {snapshot&&<div className="grid grid-cols-1 lg:grid-cols-2 gap-3" data-testid="r20-canonical-records">
       <div className="rounded-lg border p-3">
        <h3 className="font-bold text-sm mb-2">Karyawan kanonis</h3>
        <div className="max-h-52 overflow-auto text-sm">
         {snapshot.employees.slice(0,50).map(row=><div key={row.id} className="border-b p-2">
          <b>{row.employee_code}</b> · {row.full_name}
         </div>)}
        </div>
       </div>
       <div className="rounded-lg border p-3">
        <h3 className="font-bold text-sm mb-2">Payroll Runs · baca-saja</h3>
        <div className="max-h-52 overflow-auto text-sm">
         {snapshot.payroll_runs.slice(0,50).map(row=><div key={row.id} className="border-b p-2">
          <b>{row.period_start}</b> – {row.period_end} · {row.status}
         </div>)}
        </div>
       </div>
       <div className="rounded-lg border p-3 lg:col-span-2">
        <h3 className="font-bold text-sm mb-2">Payroll Items · baca-saja (Finance HOLD)</h3>
        <div className="max-h-52 overflow-auto text-sm">
         {snapshot.payroll_items.slice(0,50).map(row=><div key={row.id} className="border-b p-2 flex flex-wrap gap-3">
          <span>{row.id.slice(0,8)}</span>
          <span>Bruto Rp {Number(row.gross_amount).toLocaleString('id-ID')}</span>
          <span>Potongan Rp {Number(row.deduction_amount).toLocaleString('id-ID')}</span>
          <b>Netto Rp {Number(row.net_amount).toLocaleString('id-ID')}</b>
         </div>)}
        </div>
       </div>
      </div>}
      <form className="flex flex-wrap items-end gap-2 border-t pt-3" onSubmit={e=>{
       e.preventDefault();void action(async()=>{
        const response=await createCanonicalEmployeeR20(client,{employee_code:code,full_name:name});
        await refreshed();setStatus(response.alreadyExists?'Kode karyawan telah ada; tidak dibuat duplikat.':'Karyawan kanonis dibuat tanpa menyalin data demo.');
       });
      }}>
       <label className="text-xs">Kode karyawan<input required aria-label="Kode karyawan kanonis" value={code}
        onChange={e=>setCode(e.target.value)} className="block border rounded p-2 text-sm"/></label>
       <label className="text-xs">Nama lengkap<input required aria-label="Nama karyawan kanonis" value={name}
        onChange={e=>setName(e.target.value)} className="block border rounded p-2 text-sm"/></label>
       <button disabled={busy} className="bg-emerald-700 text-white rounded px-3 py-2 text-sm">Tambah kanonis</button>
      </form>
      <form className="flex flex-wrap items-end gap-2" onSubmit={e=>{
       e.preventDefault();void action(async()=>{
        await updateCanonicalEmployeeR20(client,selected,rename);
        await refreshed();setStatus('Perubahan karyawan tersimpan di Supabase kanonis.');
       });
      }}>
       <label className="text-xs">Karyawan aktif<select aria-label="Pilih karyawan kanonis" required className="block border rounded p-2 text-sm"
        value={selected} onChange={e=>setSelected(e.target.value)}>
        <option value="">Pilih</option>
        {(snapshot?.employees??[]).map(row=><option key={row.id} value={row.id}>{row.employee_code} · {row.full_name}</option>)}
       </select></label>
       <label className="text-xs">Nama baru<input aria-label="Nama karyawan baru" required className="block border rounded p-2 text-sm"
        value={rename} onChange={e=>setRename(e.target.value)}/></label>
       <button disabled={busy} className="rounded border px-3 py-2 text-sm">Perbarui kanonis</button>
      </form>
     </>
    }
    {error&&<p role="alert" className="text-red-800 text-sm">{error}</p>}
    <p role="status" className="text-emerald-800 text-sm">{status}</p>
   </>
  }
 </section>;
}
