$ErrorActionPreference = 'Stop'
$root = 'F:\Niaga-QP1-R4-Isolated-20261110'
$cfg = Get-Content "$root\supabase\config.toml" -Raw
if ($cfg -notmatch 'niaga-qp1-isolated-r6-20261110') { throw 'HOLD: wrong project' }
$status = supabase --workdir $root status -o json | ConvertFrom-Json
if ($status.API_URL -ne 'http://127.0.0.1:56821') { throw 'HOLD: wrong API' }
$env:QP1_ISOLATED_PROJECT_ID='niaga-qp1-isolated-r6-20261110'
$env:SUPABASE_URL=$status.API_URL
$env:SUPABASE_ANON_KEY=$status.ANON_KEY
$env:SUPABASE_SERVICE_ROLE_KEY=$status.SERVICE_ROLE_KEY
try {
  Set-Location 'F:\Niaga-Payroll-Standalone-QP1-R3-20261110'
  node scripts/qp1-r6/security-local-e2e.mjs
  $code=$LASTEXITCODE
  Write-Output "SECURITY_E2E_EXIT=$code"
} finally {
  Remove-Item Env:\QP1_ISOLATED_PROJECT_ID,Env:\SUPABASE_URL,Env:\SUPABASE_ANON_KEY,Env:\SUPABASE_SERVICE_ROLE_KEY -ErrorAction SilentlyContinue
}
