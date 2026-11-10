import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createCanonicalPayrollReader, assertProductionPayrollExecutable } from '@niaga/payroll-core';

const directory=path.dirname(fileURLToPath(import.meta.url));
const artifact=path.resolve(directory,'../../vendor/niaga-payroll-core-0.1.0-staging.6.tgz');
const expected='7fe96d9eac8bc03afd6796f4a570c333dbd99b98d1b74bac3eb7c3b628f95f2b';
const digest=createHash('sha256').update(readFileSync(artifact)).digest('hex');
if (digest!==expected) throw new Error('QP1-R5 payroll-core package integrity mismatch');
if (typeof createCanonicalPayrollReader!=='function') throw new Error('Shared Payroll Core export missing');
let denied=false;
try { assertProductionPayrollExecutable(); } catch { denied=true; }
if(!denied) throw new Error('Production payroll authority unexpectedly enabled');
console.log('QP1_R5_PINNED_SHARED_CORE_INTEGRITY_PASS');
