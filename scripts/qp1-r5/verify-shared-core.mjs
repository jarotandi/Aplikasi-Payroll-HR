import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createCanonicalPayrollReader, assertProductionPayrollExecutable } from '@niaga/payroll-core';

const directory=path.dirname(fileURLToPath(import.meta.url));
const artifact=path.resolve(directory,'../../vendor/niaga-payroll-core-0.1.0-staging.5.tgz');
const expected='3b2643c6d905e39a3619caf25e0c495a7ae43ca4181d0633dfea109d3adb21b9';
const digest=createHash('sha256').update(readFileSync(artifact)).digest('hex');
if (digest!==expected) throw new Error('QP1-R5 payroll-core package integrity mismatch');
if (typeof createCanonicalPayrollReader!=='function') throw new Error('Shared Payroll Core export missing');
let denied=false;
try { assertProductionPayrollExecutable(); } catch { denied=true; }
if(!denied) throw new Error('Production payroll authority unexpectedly enabled');
console.log('QP1_R5_PINNED_SHARED_CORE_INTEGRITY_PASS');
