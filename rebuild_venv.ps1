# Rebuild the InfraCred backend virtualenv with the real Python 3.13 install.
$ErrorActionPreference = 'Continue'
$py  = 'C:\Program Files\Python313\python.exe'
$be  = 'c:\Users\hp\Desktop\Eric project\InfraCred\backend'
$log = 'c:\Users\hp\Desktop\Eric project\pipinstall.log'

Set-Location -LiteralPath $be
("START " + (Get-Date -Format s)) | Out-File -Encoding utf8 $log

'--- venv create ---' | Out-File -Append -Encoding utf8 $log
(& $py -m venv (Join-Path $be 'venv') --clear 2>&1 | Out-String) | Out-File -Append -Encoding utf8 $log

$venvPy = Join-Path $be 'venv\Scripts\python.exe'
('venv python exists: ' + (Test-Path -LiteralPath $venvPy)) | Out-File -Append -Encoding utf8 $log

'--- pip upgrade ---' | Out-File -Append -Encoding utf8 $log
(& $venvPy -m pip install --upgrade pip 2>&1 | Out-String) | Out-File -Append -Encoding utf8 $log

'--- install requirements ---' | Out-File -Append -Encoding utf8 $log
(& $venvPy -m pip install -r (Join-Path $be 'requirements.txt') 2>&1 | Out-String) | Out-File -Append -Encoding utf8 $log

'--- pip freeze (key pins) ---' | Out-File -Append -Encoding utf8 $log
(& $venvPy -m pip freeze 2>&1 | Out-String) | Out-File -Append -Encoding utf8 $log

'--- manage.py check ---' | Out-File -Append -Encoding utf8 $log
(& $venvPy manage.py check 2>&1 | Out-String) | Out-File -Append -Encoding utf8 $log
('check exit code: ' + $LASTEXITCODE) | Out-File -Append -Encoding utf8 $log

'--- makemigrations --check ---' | Out-File -Append -Encoding utf8 $log
(& $venvPy manage.py makemigrations --check --dry-run 2>&1 | Out-String) | Out-File -Append -Encoding utf8 $log

'--- showmigrations (summary) ---' | Out-File -Append -Encoding utf8 $log
(& $venvPy manage.py showmigrations 2>&1 | Out-String) | Out-File -Append -Encoding utf8 $log

('DONE ' + (Get-Date -Format s)) | Out-File -Append -Encoding utf8 $log
