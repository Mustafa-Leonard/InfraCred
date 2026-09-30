$ErrorActionPreference = 'Continue'
$be  = 'c:\Users\hp\\Desktop\\Eric project\InfraCred\backend'
$py  = Join-Path $be 'venv\Scripts\python.exe'
$log = 'c:\Users\hp\Desktop\Eric project\backend_verify.txt'
Set-Location -LiteralPath $be

'===== 1. manage.py check =====' | Out-File -Encoding utf8 $log
(& $py manage.py check 2>&1 | Out-String) | Out-File -Append -Encoding utf8 $log
('exit=' + $LASTEXITCODE) | Out-File -Append -Encoding utf8 $log

'===== 2. makemigrations --check --dry-run =====' | Out-File -Append -Encoding utf8 $log
(& $py manage.py makemigrations --check --dry-run 2>&1 | Out-String) | Out-File -Append -Encoding utf8 $log
('exit=' + $LASTEXITCODE) | Out-File -Append -Encoding utf8 $log

'===== 3. migrate --noinput =====' | Out-File -Append -Encoding utf8 $log
(& $py manage.py migrate --noinput 2>&1 | Out-String) | Out-File -Append -Encoding utf8 $log
('exit=' + $LASTEXITCODE) | Out-File -Append -Encoding utf8 $log

'===== 4. seed_infra =====' | Out-File -Append -Encoding utf8 $log
(& $py manage.py seed_infra 2>&1 | Out-String) | Out-File -Append -Encoding utf8 $log
('exit=' + $LASTEXITCODE) | Out-File -Append -Encoding utf8 $log

'===== 5. unapplied migrations after migrate =====' | Out-File -Append -Encoding utf8 $log
$show = & $py manage.py showmigrations 2>&1 | Out-String
(($show -split "`r?`n") | Where-Object { $_ -match '^\[ \]' -or $_ -match '^\[X\]' -or $_ -match '^\w+$' } | Out-String) | Out-File -Append -Encoding utf8 $log

'===== 6. django test suite (accounts + reports) =====' | Out-File -Append -Encoding utf8 $log
(& $py manage.py test apps.accounts apps.reports 2>&1 | Out-String) | Out-File -Append -Encoding utf8 $log
('exit=' + $LASTEXITCODE) | Out-File -Append -Encoding utf8 $log

'===== END =====' | Out-File -Append -Encoding utf8 $log
