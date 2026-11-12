-- QP1-R21 read-only isolated compliance gate.
-- Execute ONLY against disposable supabase_db_niaga-qp1-r15-functional-20261111.
-- DO block has no writes; validates server controls, no SQL migrations.
DO $qp1_r21$
DECLARE
 t text;
BEGIN
 FOREACH t IN ARRAY ARRAY['employees','hr_attendance_records','hr_leave_requests',
 'hr_payroll_reviews','payroll_runs','payroll_items','hr_payslip_drafts'] LOOP
  IF NOT EXISTS(SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE n.nspname='public' AND c.relname=t AND c.relrowsecurity) THEN
    RAISE EXCEPTION 'R21_SECURITY_HOLD: RLS disabled: %',t;
  END IF;
 END LOOP;
 IF NOT EXISTS(SELECT 1 FROM pg_policies
  WHERE schemaname='public' AND tablename='hr_attendance_records'
  AND policyname='qp1_r7_active_session_required' AND permissive='RESTRICTIVE') THEN
  RAISE EXCEPTION 'R21_SECURITY_HOLD: active attendance session gate absent';
 END IF;
 FOREACH t IN ARRAY ARRAY['hr_attendance_records','hr_leave_requests','hr_payroll_reviews'] LOOP
  IF NOT EXISTS(SELECT 1 FROM pg_trigger tr JOIN pg_class c ON c.oid=tr.tgrelid
   JOIN pg_namespace n ON n.oid=c.relnamespace
   WHERE n.nspname='public' AND c.relname=t AND tr.tgname LIKE '%guard%'
   AND tr.tgenabled='O' AND NOT tr.tgisinternal) THEN
   RAISE EXCEPTION 'R21_SECURITY_HOLD: write guard missing for %',t;
  END IF;
 END LOOP;
 IF NOT EXISTS(SELECT 1 FROM pg_trigger tr JOIN pg_class c ON c.oid=tr.tgrelid
   WHERE c.relname='hr_payroll_reviews' AND tr.tgname='qp1_r17_audit_review'
   AND tr.tgenabled='O') THEN
  RAISE EXCEPTION 'R21_SECURITY_HOLD: Payroll audit trigger missing';
 END IF;
 RAISE NOTICE 'QP1_R21_RLS_SESSION_GUARD_AUDIT_SQL_PASS';
END
$qp1_r21$;
