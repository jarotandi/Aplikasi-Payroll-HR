import React,{useEffect,useState} from 'react';
import {listR21Operational,createR21Attendance,reviewR21Attendance,createR21Leave,
 reviewR21Leave,createR21PayrollReview,reviewR21PayrollDraft} from './operationalR21';

/** Separate from the PayRollix demo. No global stylesheet or V3 Business OS changes. */
export default function CanonicalOperationalR21({client,organizationId,employees=[]}){
 const [snapshot,setSnapshot]=useState(null);
 const [error,setError]=useState(''),[busy,setBusy]=useState(false);
 const [person,setPerson]=useState(''),[when,setWhen]=useState('2026-11-12');
 const [start,setStart]=useState('2026-11-12'),[end,setEnd]=useState('2026-11-12');
 const [reason,setReason]=useState('Cuti sintetis staging'),[type,setType]=useState('annual');
 const [run,setRun]=useState(''),[note,setNote]=useState('Review draft R21 staging');
 const refresh=async()=>{const data=await listR21Operational(client);if(data.context.organizationId!==organizationId)throw Error('Tenant switched');setSnapshot(data);return data;};
 useEffect(()=>{let alive=true;setSnapshot(null);setError('');void listR21Operational(client).then(x=>{if(alive&&x.context.organizationId===organizationId)setSnapshot(x)}).catch(e=>{if(alive)setError(e.message)});return()=>{alive=false};},[client,organizationId]);
 const act=task=>{if(busy)return;setBusy(true);setError('');void task().then(refresh).catch(e=>setError(e instanceof Error?e.message:'HR action denied')).finally(()=>setBusy(false));};
 const action=(row,approve,reject)=><div className="flex gap-2">
  <button disabled={busy} type="button" className="text-emerald-700 underline" onClick={()=>act(()=>approve(row))}>Review / terima</button>
  <button disabled={busy} type="button" className="text-rose-700 underline" onClick={()=>act(()=>reject(row))}>Tolak</button>
 </div>;
 return <section className="rounded-2xl border border-emerald-200 bg-white p-5 space-y-4" data-testid="r21-hr-operational">
  <div><h2 className="text-lg font-bold">HR Operasional · R21</h2>
   <p className="text-xs text-slate-600">Absensi, cuti, review draft — RLS organisasi aktif, reviewer independen. Tanpa Finance atau pembayaran.</p></div>
  {error&&<p role="alert" className="bg-red-50 text-red-700 p-2 rounded">{error}</p>}
  <div className="grid lg:grid-cols-3 gap-3">
   <form className="border rounded p-3 space-y-2" onSubmit={e=>{e.preventDefault();act(()=>createR21Attendance(client,{employeeId:person,attendanceDate:when}));}}>
    <b>Draft Absensi</b>
    <select aria-label="Pilih karyawan R21" required className="border rounded p-2 w-full" value={person} onChange={e=>setPerson(e.target.value)}>
     <option value="">Pilih karyawan</option>{employees.map(e=><option key={e.id} value={e.id}>{e.employee_code} · {e.full_name}</option>)}
    </select>
    <input type="date" aria-label="Tanggal absensi R21" required className="border rounded p-2 w-full" value={when} onChange={e=>setWhen(e.target.value)}/>
    <button disabled={busy} className="bg-emerald-700 text-white rounded p-2 w-full">Buat draft absensi</button>
   </form>
   <form className="border rounded p-3 space-y-2" onSubmit={e=>{e.preventDefault();act(()=>createR21Leave(client,{employeeId:person,startDate:start,endDate:end,reason,leaveType:type}));}}>
    <b>Pengajuan Cuti</b>
    <input aria-label="Tanggal mulai cuti R21" type="date" value={start} className="border p-2 rounded w-full" onChange={e=>setStart(e.target.value)} required/>
    <input aria-label="Tanggal akhir cuti R21" type="date" value={end} className="border p-2 rounded w-full" onChange={e=>setEnd(e.target.value)} required/>
    <select aria-label="Jenis cuti R21" className="border p-2 rounded w-full" value={type} onChange={e=>setType(e.target.value)}>
     <option value="annual">Tahunan</option><option value="sick">Sakit</option><option value="personal">Pribadi</option><option value="other">Lainnya</option>
    </select>
    <input aria-label="Alasan cuti R21" className="border p-2 rounded w-full" value={reason} onChange={e=>setReason(e.target.value)} required/>
    <button disabled={busy||!person} className="bg-emerald-700 text-white rounded p-2 w-full">Ajukan cuti</button>
   </form>
   <form className="border rounded p-3 space-y-2" onSubmit={e=>{e.preventDefault();act(()=>createR21PayrollReview(client,run,note));}}>
    <b>Pengajuan Review Payroll</b>
    <select aria-label="Draft payroll R21" required className="border rounded p-2 w-full" value={run} onChange={e=>setRun(e.target.value)}>
     <option value="">Pilih draft</option>{(snapshot?.runs??[]).filter(r=>r.status==='draft').map(r=><option key={r.id} value={r.id}>{r.period_start} – {r.period_end}</option>)}
    </select>
    <input aria-label="Catatan review R21" value={note} onChange={e=>setNote(e.target.value)} className="border rounded p-2 w-full"/>
    <button disabled={busy} className="bg-emerald-700 text-white rounded p-2 w-full">Ajukan review HR</button>
   </form>
  </div>
  <div className="grid lg:grid-cols-3 gap-3">
   <div data-testid="r21-list-attendance"><h3 className="font-bold mb-2">Absensi</h3>{(snapshot?.attendance??[]).map(x=><div key={x.id} data-record-id={x.id} className="border-b p-2 text-xs">
    <span>{x.attendance_date} · {x.status}</span>
    {x.status==='draft'&&action(x,r=>reviewR21Attendance(client,r,'verified'),r=>reviewR21Attendance(client,r,'rejected'))}
   </div>)}</div>
   <div data-testid="r21-list-leave"><h3 className="font-bold mb-2">Cuti</h3>{(snapshot?.leaves??[]).map(x=><div key={x.id} data-record-id={x.id} className="border-b p-2 text-xs">
    <span>{x.start_date} – {x.end_date} · {x.status}</span>
    {x.status==='pending'&&action(x,r=>reviewR21Leave(client,r,'approved'),r=>reviewR21Leave(client,r,'rejected'))}
   </div>)}</div>
   <div data-testid="r21-list-payroll"><h3 className="font-bold mb-2">Review Draft Payroll</h3>{(snapshot?.reviews??[]).map(x=><div key={x.id} data-record-id={x.id} className="border-b p-2 text-xs">
    <span>{x.status} · {x.note}</span>
    {x.status==='pending'&&action(x,r=>reviewR21PayrollDraft(client,r,'reviewed'),r=>reviewR21PayrollDraft(client,r,'rejected'))}
   </div>)}</div>
  </div>
  <button disabled={busy} type="button" onClick={()=>act(()=>Promise.resolve())} className="border rounded px-3 py-2">Refresh operasional</button>
  <p className="text-xs text-amber-800">Review HR tidak menghasilkan persetujuan Finance, slip resmi, jurnal, ataupun pembayaran. Cross-tenant dan self-review ditolak.</p>
 </section>;
}
