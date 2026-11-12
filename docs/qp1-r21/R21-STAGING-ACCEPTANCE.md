# QP1-R21 — Operational HR, Maker/Checker and Finance HOLD: Isolated Staging Acceptance

Date: 12 November 2026
ERP branch: `feat/qp1-r21-hr-security-staging-20261112`, base R20 canonical ERP PR #119
Standalone branch: `feat/qp1-r21-standalone-hr-operational-staging-20261112`, base R20 standalone PR #7

## Implemented scope

- **Original Niaga Business OS V3 UI fully untouched**, including Workspace Home, App Hub, header, green sidebar and existing ten Payroll & HR screens. Port `4177` left running the prior approved UI. No product design changes in ERP.
- In a separate **localhost-only canonical standalone mode** (flag `VITE_QP1_ISOLATED_PAYROLL_READ=true`), R21 adds operational sections for:
  - Draft manual attendance; independent reviewer verifies/rejects.
  - Leave request with canonical employee reference, leave dates and reason; independent reviewer approves/rejects.
  - HR review request against an existing draft payroll run; another authorized reviewer marks **HR reviewed/rejected** only.
  - Tenant-scoped lists with refresh and actual RLS-backed data.
- Canonical Supabase Auth, active organization resolution and `people.manage` permission from R20 remain mandatory for **every action**. No service-role key in frontend, no localStorage role authority, no demo application mounted when canonical mode active.
- Maker/checker enforced in application *and* by existing database RLS/triggers. A user cannot review their own request; a reviewer cannot mark Payroll as `approved` or `paid`.
- In staging, R21 **never** posts Finance journals, moves money, creates payroll payment requests, sends signed/public payslips, or changes a Payroll Run to paid/approved.
- No new SQL migration or changes to Supabase production.

## Observed acceptance results

- Dedicated disposable Supabase: `127.0.0.1:56821`, database `supabase_db_niaga-qp1-r15-functional-20261111`.
- New standalone app: `http://127.0.0.1:56941/`, the approved Business OS V3 remains on `http://127.0.0.1:4177/`.
- `scripts/qp1-r21/operational-e2e.mjs`: **`QP1_R21_ISOLATED_OPERATIONAL_E2E_PASS`**. Owner draft attendance → independent Reviewer verified, Owner leave → Reviewer approved, Owner HR draft review → Reviewer marked reviewed while actual Payroll Run remains `draft`. Maker self-review and `approved` decision rejected; Viewer without permission rejected.
- `scripts/qp1-r21/operational-browser.mjs`: **`QP1_R21_OWNER_REVIEWER_CHROME_STAGING_PASS`**. Authenticated Chrome verifies actual status changes with distinct Owner and Reviewer logins. Each row selected by document ID, not by a fragile list position. Evidence screenshots:
  - `docs/qp1-r21/r21-maker-operations.png`
  - `docs/qp1-r21/r21-checker-reviewed.png`
- `scripts/qp1-r21/operational.unit.mjs` + existing R20/R10 unit/regression: **12/12 PASS**. Includes fabricated organization, invalid employee ID/date, unauthorized payment decision, and self-review negatives.
- Local Vite build **canonical flag ON PASS**, **legacy flag OFF PASS** (canonical build has pre-existing chunk-size warning).
- `docs/qp1-r21/verify-r21-security-readonly.sql` ran only on disposable PostgreSQL; **`QP1_R21_RLS_SESSION_GUARD_AUDIT_SQL_PASS`**. Verifies RLS, active-session restrictive policy, enabled write guards, and audit trigger on review table. This is a structural check; it is **not an independent penetration test**.
- Integration preserves shared R20 canonical tables rather than creating a second employee/payroll ledger.

## Findings and limitations

- A number of synthetic historical test records (including 2039 draft runs/reviews) remain in **disposable staging** because the application/database intentionally enforces immutable reviews and protected deletion. **Do not force-delete or disable database triggers to clean evidence.** Review/stage-retire fixture lifecycle separately; do not treat synthetic records as real salaries.
- Stronger cross-tenant negative testing of all three new R21 endpoints with an independent Owner B account remains an **independent security gate**. R20 established cross-tenant owner A/B denial for employee master, and R21 confirms viewer denial, server tenant filtering, and enabled RLS policies, but do not overstate its coverage.
- HR operational workflows are now connected in the canonical standalone panel, **not** the old PayRollix localStorage demo. The original app demo's other CRUD remains intentionally separate.
- Shared identity authority is not automatic cross-origin SSO. Refresh/remount needed; no realtime data subscriptions.
- Full Finance authorization (B12 dual controls), payroll rule/legal reconciliation, document signing and employee distribution, session revocation replay, external banking sandbox, independent security approval, and production rollout remain **HOLD**.
- Both PRs remain **Draft**, no merge to main, no changes to production Supabase, no payout.

**Decision: R21 HR draft operations and maker/checker staging acceptance PASS; Finance/security release readiness HOLD; production NO_GO.**
