/**
 * QP1-R10 dry-run migration acceptance gate, NO DB/network/file access.
 * Approvals, identity mapping and reconciliation are external evidence.
 * A true result means "eligible for independent review", NEVER executable.
 */
export function evaluateCutoverManifest(manifest) {
  const blockers = [];
  const checks = {
    schema: manifest?.schemaVersion === 1,
    sourceHash: typeof manifest?.sourceSha256 === 'string' && /^[0-9a-f]{64}$/i.test(manifest.sourceSha256),
    sourceRecords: Number.isSafeInteger(manifest?.sourceEmployeeCount) && manifest.sourceEmployeeCount >= 0,
    destinationRecords: Number.isSafeInteger(manifest?.canonicalEmployeeCount) && manifest.canonicalEmployeeCount >= 0,
    duplicateCount: manifest?.duplicateEmployeeCount === 0,
    unresolvedCount: manifest?.unresolvedIdentityCount === 0,
    organizationMapping: manifest?.organizationMappingReviewed === true,
    legalBasis: manifest?.lawfulDataProcessingReviewed === true,
    historicalGrossNet: manifest?.grossNetPeriodsReconciled === true,
    approvals: manifest?.independentApproverReviewed === true,
    rollback: manifest?.rollbackDryRunPassed === true,
    dbIsolation: manifest?.destination === 'isolated-test-only',
  };
  if (checks.sourceRecords && checks.destinationRecords && manifest.sourceEmployeeCount !== manifest.canonicalEmployeeCount) {
    blockers.push('record_count_mismatch');
  }
  for (const [check,passed] of Object.entries(checks)) if(!passed) blockers.push('missing_'+check);
  return Object.freeze({
    mode: 'DRY_RUN_REVIEW_ONLY',
    eligibleForIndependentReview: blockers.length === 0,
    executable: false,
    productionGo: false,
    blockers,
    // Do not return employee names, payroll numbers, emails or account data.
    counts: {
      source: checks.sourceRecords ? manifest.sourceEmployeeCount : null,
      destination: checks.destinationRecords ? manifest.canonicalEmployeeCount : null,
    },
  });
}
