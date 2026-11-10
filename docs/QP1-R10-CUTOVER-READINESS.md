# QP1-R10 — Controlled Legacy Payroll Cutover Readiness

Date: 2026-11-10. Standalone branch `feat/qp1-r10-legacy-cutover-readiness-20261110` based on Draft PR #5. **DRY RUN / NO DATA MIGRATION**.

## Why this gate is necessary
The original PayRollix Standalone persists demo payroll and employee records in browser `localStorage`. These records are not automatically authoritative in the canonical multi-tenant `employees`, `payroll_runs` and `payroll_items` database of Niaga Business OS.

## Implementation
- New pure, read-only `scripts/qp1-r10/evaluate-cutover-manifest.mjs` accepts an externally prepared manifest (not raw payroll records).
- Validates manifest schema version, source SHA-256, source and destination counts, zero duplicate employee identifiers, zero unresolved identity mappings, verified company/organization mapping, legal data-processing review, historical gross/net payroll period reconciliation, independent reviewer approval and rollback rehearsal.
- Only `destination='isolated-test-only'` can pass eligibility; even with every prerequisite, response is `eligibleForIndependentReview=true`, `executable=false`, `productionGo=false`. The evaluator **never** writes a database or reads localStorage.
- Returns aggregate counts and machine-readable blocker codes; does not return employee names, salary amounts, bank information, source records or user identifiers.
- `node --test scripts/qp1-r10/evaluate-cutover-manifest.test.mjs`: **5/5 PASS**. Combined with earlier canonical and legacy preflight tests: **18/18 PASS**.

## Required independent operator steps
1. Establish lawful custody of the historic payroll export. Keep unredacted source outside GitHub, logs, chat attachments and frontend bundles.
2. Hash the immutable source and create a sanitized, count-only manifest. Maintain authorized owner of source and designated reviewers.
3. Map legacy organization/team/store IDs and employees to existing canonical tenants. Resolve duplicates across businesses before any write.
4. Reconcile payroll dates, attendance, wages, deductions, statutory rules, journals and payment evidence; separate historical rows from future authorizations.
5. Build an isolated dry-run import with deterministic idempotency keys, negative cross-tenant tests, row counts, amounts and rollback.
6. Obtain independent data/privacy/security and business-owner approvals after dry-run acceptance.
7. Plan production cutover only in a separately authorized release gate with auditable downtime, rollback and legal retention; never treat this preflight as permission to mutate production.

## Decisions
- **PASS**: read-only manifest validator and five negative/positive tests.
- **HOLD**: access to actual historic payroll records (not provided or accessed), true identity mapping, historical reconciliation, isolated import dry-run, legal approvals, operational rollback and production migration.
- **NO_GO**: automatic transfer from demo `localStorage` into canonical payroll, payroll execution and real Finance/payment writes.

No production Supabase account, table, RLS, payroll data or deployment was modified.
