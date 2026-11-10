# QP1-R5 — Standalone consumes canonical Payroll Core (staging)

Date: 2026-11-10. Stacked on Standalone Draft PR #2; ERP source is separate Draft PR based on #91. No main merge or production deployment.

## Single package, no duplicated domain query
- `@niaga/payroll-core@0.1.0-staging.5` compiled from `jarotandi/Niaga-ERP/libs/payroll-core`.
- `src/canonical/isolatedCanonicalRead.js` now uses the imported `createCanonicalPayrollReader` instead of maintaining its own `employees / payroll_runs / payroll_items` query mapping. It still separately verifies Supabase user via `auth.getUser`, organization-scoped `people.manage` via server RPC, and denies missing/invalid identity; PostgreSQL RLS independently controls rows.
- `vendor/niaga-payroll-core-0.1.0-staging.5.tgz` is a pinned 8,008-byte local staging package, compiled `dist` only. SHA-256 `3b2643c6d905e39a3619caf25e0c495a7ae43ca4181d0633dfea109d3adb21b9`. The lockfile points to this local artifact, no ephemeral F: path.
- `node scripts/qp1-r5/verify-shared-core.mjs` verifies the digest, exports and always-denied production payroll execution.

## Acceptance
- `node --test src/canonical/isolatedCanonicalRead.test.mjs`: **9/9 PASS**.
- `npm ci`: PASS once local Vite processes were terminated (running Vite kept esbuild.exe file-locked during an earlier npm ci attempt).
- `npm run build`: PASS.
- `node scripts/qp1-r5/dual-consumer-local-e2e.mjs` was run with a **dedicated disposable local Supabase** (ID `niaga-qp1-isolated-r5-20261110`, 127.0.0.1:56821), fixture users/passwords generated in memory, and isolated service-role key provided only to the Node setup process.
- **API parity PASS**: the Business OS reader and Standalone reader show exactly the same canonical employee, payroll run and payroll item IDs on organization A; each row filtered by tenant, and org B / viewer denied cross-tenant reads.
- **Authenticated Chromium dual-UI PASS**: logged into both local frontends with the synthetic owner account, verified visible counts **Employees 1, Payroll Runs 1, Payroll Items 1** on both screens. Viewer login was allowed but the payroll canonical read displayed DENIED. No production payroll authority was activated.
- Final browser+API E2E process exited **0**. Earlier browser attempts failed on a real B2 workspace membership JSON parser mismatch. That was fixed in the separate ERP staging branch and covered by three new gateway unit tests.
- All QP1-R5 local Vite servers and dedicated Supabase containers were stopped after tests; temporary local `.env.local` files were deleted.

## Reproducing
Requires an explicitly dedicated local Supabase project and ports; **never execute this against a shared/staging/production Supabase endpoint**. Set ephemeral `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `QP1_ISOLATED_PROJECT_ID=niaga-qp1-isolated-r5-20261110` in a transient test process only. To enable browser tests, run only Vite for ERP (port 56831) and Standalone (56832), set public keys through ignored `.env.local` files, use `QP1_BROWSER_E2E=true` and `QP1_CHROME_PATH` pointing to installed Chrome. Test script rejects any non-loopback API or wrong dedicated ID.

## Release blockers
- **Production remains NO_GO**: legacy PayRollix localStorage has not been migrated/cut over to authoritative canonical records. Only staging canonical metadata read is integrated. Payroll calculation, approval, payment, Finance journal and payslip issuance remain HOLD.
- Production-tree audit: 16 advisories (0 critical, 7 high, 7 moderate, 2 low) still require remediation; ERP direct xlsx high also remains.
- Signed URL real expiration/revocation, session revocation/downgrade acceptance and final production-permission authorization remain HOLD.
- Local tarball is a versioned staging artifact, **not** a public npm package; update requires source audit, new build and both-app tests.
