# QP1-R6 — Standalone dependency, session and legacy payroll gates

Date: 2026-11-10. Staging only; source parent Draft PR #3.

## Dependency remediation
- Ran `npm audit fix --package-lock-only --no-force`, changed lockfile only (no breaking forced updates).
- Ran `npm ci`, `node --test src/canonical/isolatedCanonicalRead.test.mjs` and `npm run build`: all PASS.
- Re-audited with both `npm audit --omit=dev --json` and `npm audit --json`: **0 findings**, down from 16 runtime findings. This audit is a snapshot of the lockfile/registry at test time, not a guarantee of perpetual security.
- Never auto-merged to main or deployed.

## Local Supabase security acceptance
- `scripts/qp1-r6/security-local-e2e.mjs` tests on a dedicated disposable Supabase project `niaga-qp1-isolated-r6-20261110` at `http://127.0.0.1:56821`.
- Global signout clears a session in the current client: PASS.
- **Old access-token replay remains possible until JWT expiry** in tested setup. This is a confirmed blocker for immediate revocation of sensitive payroll access; strict server-side session validity and role downgrade check required. Do not mark production session security PASS.
- Private Storage signed URL works before expiry, is denied after expiry, and cannot download removed object even via previously issued fresh signed URL: PASS.
- Uses only synthetic users, test file bytes, fixture bucket, and local database. No real payroll/salary/bank data.
- `run-local-security.ps1` passes ephemeral CLI fixture keys via process env only and is intended for this authorized Windows PC with isolated project. Never run on production.

## Legacy localStorage migration — negative preflight
- `scripts/qp1-r6/audit-legacy-payroll.mjs` is a pure read-only readiness validator: accepts a **provided in-memory snapshot** of localStorage-style keys, checks collection shapes and duplicate/missing employee identifiers, and reports aggregate counts/error codes without names/salaries.
- Unit tests `scripts/qp1-r6/audit-legacy-payroll.test.mjs`: **4/4 PASS**.
- The function **always returns go=false** until independent organization mapping, user identity migration, legal requirements, and independent payroll reconciliation are authorized and verified. It does not read browser localStorage, modify any database, export user data or perform a migration.
- Existing legacy PayRollix demo records remain independent and unchanged. Treat current Standalone as a legacy demo UI + *separate* canonical staging read panel, **not** a production payroll frontend.

## Still HOLD
1. Server-side immediate JWT/session revocation/downgrade controls.
2. Niaga ERP high `xlsx` vulnerability removal and cross-module Excel regression.
3. Independent review of migration mapping/dedup, company/payroll records and full UI cutover.
4. Production approval/payment/Finance journal authority and payslip privacy.
5. Independent production security assessment and release authorization.

**Decision: STAGING PASS (selected gates), PRODUCTION NO_GO.**
