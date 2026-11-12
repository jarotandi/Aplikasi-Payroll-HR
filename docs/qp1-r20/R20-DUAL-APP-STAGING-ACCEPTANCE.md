# QP1-R20 — Payroll Standalone ↔ Niaga Business OS V3 Canonical Integration

**Date:** 12 November 2026  
**Codebase A:** `jarotandi/Niaga-ERP`, branch `feat/qp1-r20-canonical-bridge-erp-20261112` (parent PR #118).  
**Codebase B:** `jarotandi/Aplikasi-Payroll-HR`, branch `feat/qp1-r20-canonical-bridge-standalone-20261112`.

## What is genuinely integrated

1. Both frontends independently authenticate to **the same disposable Supabase Auth project** with an eligible staging user. **Login credentials/identity are shared; cross-origin browser SSO is NOT implemented** and sessions are independent. No arbitrary auth token or localStorage/demo role is trusted.
2. Both call the same server canonical `current_organization_id()` and `has_organization_permission(...,people.manage)` functions. Business OS adds a hard guard on its existing V3 data bridge, checking Auth user ID, active server organization, and server permission before rendering canonical HR data.
3. Standalone no longer requires a manually typed organization UUID in the canonical panel. It automatically resolves the active organization from the database and uses the already-vendored Niaga Payroll Core reader for canonical employee/run/item IDs.
4. Additional RLS-constrained `employees`, `payroll_runs`, and `payroll_items` projections supply details from the **same** tables; strict ID and organization parity against shared Payroll Core result is checked. Runs/items remain read-only. No copy, ETL, second payroll ledger, or browser-local persistence of canonical records.
5. The standalone bridge supports **create employee** (unique org+code idempotent), **update employee name**, and reading employee/run/item details and counts; all writes use a user-scoped client with `people.manage` authorization and a current-organization filter. Changes show up in Niaga Business OS on refresh. The Payroll Run/Item reader remains read-only, and finance/payment remains locked.
6. The standalone canonical mode is bootstrapped separately from `src/main.jsx` and does **not mount the PayRollix demo** or initialize demo localStorage. Standalone legacy mode is still available with the integration flag disabled. The standalone legacy PayRollix demo still uses local browser data. **This is NOT silently imported, migrated, replicated, or presented as canonical data**. It remains clearly labeled demo and must be separately reconciled before any eventual cutover.
7. Niaga Business OS V3 navigation, sidebar, colors, design assets, all ten Payroll screens and the familiar port 4177 are **unchanged**. The new ERP code adds only an authentication/organization permission guard to `PayrollV3DataBridge`.

## Explicit isolated acceptance tests

- Dedicated local Supabase URL: `http://127.0.0.1:56821`, project `niaga-qp1-r15-functional-20261111`; no production secret or endpoint used.
- `scripts/qp1-r20/dual-app-canonical-e2e.mjs` (standalone):
  * Two independent client sessions for Owner A authenticate as the same Supabase user, resolve the same organization, and return exactly the same shared-core employee IDs.
  * Create an employee via standalone → read same canonical ID through ERP client. Repeating same organization+code returns same record; changing name via standalone → ERP reads changed name.
  * Viewer without `people.manage` cannot use API.
  * An isolated synthetic Owner B + Organization B may reuse the same employee code **only in their own tenant**, cannot read or update A, and cannot impersonate the A organization through direct PostgREST or shared-core API. Local fixtures cleaned after test.
  * Logged-out standalone session is rejected.
  * Marker `QP1_R20_ISOLATED_DUAL_APP_E2E_PASS`.
- `scripts/qp1-r20/dual-app-browser.mjs` (standalone):
  * Chrome Owner logs into standalone and Business OS on distinct origins.
  * Creates synthetic employee in the standalone panel; employee appears on original Niaga Business OS V3 Karyawan screen. Updates name in standalone; appears after Business OS refresh. Unique ID remains unique.
  * No TypeScript/JS page errors; screenshot evidence saved. Synthetic browser-created employee cleaned.
  * Marker `QP1_R20_DUAL_BROWSER_CANONICAL_SYNC_V3_PASS`.
- ERP 60 focused tests and TypeScript PASS; R20 canonical session gate unit tests PASS.
- Standalone Vite build, R20 local unit suite, and legacy cutover manifest regression tracked in terminal evidence.

## Evidence files

- Standalone: `docs/qp1-r20/r20-standalone-auth.png` — cropped to canonical bridge only, with no demo-login credentials.
- Standalone: `docs/qp1-r20/r20-business-os-same-employee.png` — original V3 Karyawan page displaying synthetic cross-app record.
- This acceptance document in both repositories; independent PRs remain Draft.

## Mandatory remaining controls (NO_GO)

- **SSO/OAuth redirect flow** across origins, secure session revocation and workspace organization switching semantics are not complete. The current integration shares the *identity authority* and records, but each application logs in separately.
- **Full replacement of the legacy standalone localStorage CRUD** with canonical authorization for attendance, leaves, payslips, payroll runs, etc. is not complete. Staging R20 covers the explicitly tested employee master CRUD and canonical read of payroll runs/items, while the existing Business OS operational CRUD remains separately available. No automated legacy data migration is authorized.
- Real-time streaming is not implemented. Read consistency is established after explicit refresh or remount.
- Independent statutory review, historical payroll reconciliation, RLS/session revocation audit, signed PDF distribution, Finance posting/payments, and production release remain HOLD (R21/R22).
- Do not merge either Draft PR to `main`, modify production schema, or switch production keys without the independent release gates. Local tests were disposable and used synthetic data only.

**Acceptance status:** QP1-R20 canonical employee-master synchronization + auth/tenant/RLS E2E **STAGING PASS**, comprehensive full standalone operational cutover **HOLD**, production **NO_GO**.
