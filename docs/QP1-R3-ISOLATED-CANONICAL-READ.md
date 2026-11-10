# QP1-R3 — Isolated canonical read (Standalone)

STAGING ONLY. Branch feat/qp1-r3-isolated-canonical-read-20261110. No production changes.

The new canonical panel is enabled ONLY if VITE_QP1_ISOLATED_PAYROLL_READ=true and both the browser and VITE_SUPABASE_URL are localhost/127.0.0.1 with HTTP and a local port.

The original PayRollix demo admin and localStorage do NOT authorize canonical reads. The canonical panel requires a separate Supabase local login. Sessions use memory only; no service-role key is loaded in the browser. The service calls has_organization_permission with p_organization_id, p_permission_code='people.manage' and *no* p_user_id override, then reads metadata from employees, payroll_runs, and payroll_items under RLS and exact organization filters.

Only ID/organization metadata are requested; the UI displays counts. No salary, tax, bank information, real payroll approval, journal, or payment operations.

This is a standalone read-only adapter to the same canonical Supabase API shape. The shared compiled @niaga/payroll-core library is NOT yet imported into Standalone. True dual-frontend real browser parity and authority cutover remain HOLD; do not treat demo localStorage as production data.

To test use an isolated local Supabase project with disposable test users, a local .env.local (never committed), and npm run dev. No production Supabase endpoint is permitted.

Verification: 7/7 Node unit tests PASS, npm run build PASS; not a full real Supabase E2E or browser acceptance. Legacy PayRollix features are preserved unchanged.

Rollback: close Draft PR or revert branch. No main merge or deploy.

## Schema and supply-chain audit
- payroll_items does not contain organization_id physically; the isolated reader uses payroll_runs!inner(organization_id) and checks its parent tenant before displaying counts.
- Standalone npm audit --omit=dev (2026-11-10): 16 advisories: 0 critical, 7 high, 7 moderate, 2 low. Production release is HOLD until reviewed remediation.
- @supabase/supabase-js is pinned exactly in package.json and package-lock.json; frontend rejects service-role/secret keys even when pointed at localhost.
