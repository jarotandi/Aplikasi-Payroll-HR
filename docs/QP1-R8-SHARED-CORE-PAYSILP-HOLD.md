# QP1-R8 — Shared Payroll Core 0.1.0-staging.6

Date: 2026-11-10. Staging only, stacked on Standalone PR #4.

## Artifact and compatibility
- Source authority: `jarotandi/Niaga-ERP/libs/payroll-core` QP1-R8 branch, based on PR #94.
- Compiled, private staging tarball `vendor/niaga-payroll-core-0.1.0-staging.6.tgz` (not a published package).
- SHA-256: `7fe96d9eac8bc03afd6796f4a570c333dbd99b98d1b74bac3eb7c3b628f95f2b`.
- `package.json` and lockfile pin the exact `file:vendor` artifact. `scripts/qp1-r5/verify-shared-core.mjs` verifies its digest and that authoritative payroll execution throws.
- Standalone `npm ci` PASS, 13/13 unit tests (9 canonical + 4 legacy migration preflight) PASS, `npm run build` PASS, production dependency audit 0 findings.

## Security behavior and remaining gaps
- Payroll Core now refuses to create/delete canonical payslip metadata through its generic domain adapter, consistent with DEFERRED_B12 and no approved secure payslip distribution.
- Real isolated E2E at Niaga ERP QP1-R8 confirmed: stale JWT cannot read protected `hr_payslip_documents` metadata after logout, **but previously issued private signed URLs can remain usable after logout** until expiration.
- Signed URLs are bearer download credentials, not live per-request session authorization. No approved payslip distribution feature, no production deployment or actual salary data.
- Production requires a secured server download endpoint validating user and active session + organization + role + employee entitlement on **every** request, streaming file contents without returning a persistent signed URL, audit and cache no-store. All paths are subject to independent security review.
- Legacy PayRollix localStorage remains unchanged; no real data migration or payroll approval, Finance posting or payment.
- The shipped 0.1.0-staging.6 source is a pre-release artifact, not approved for production.

**Decision:** isolated read parity/staging regression PASS, payslip issuance and production NO_GO.
