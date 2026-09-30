$out = 'c:\Users\hp\Desktop\Eric project\pyprobe.txt'
'=== where python ===' | Out-File -Encoding utf8 $out
(where.exe python 2>&1 | Out-String) | Out-File -Append -Encoding utf8 $out
'=== candidate dirs ===' | Out-File -Append -Encoding utf8 $out
$candidates = @(
    'C:\Python313\python.exe',
    'C:\Python312\python.exe',
    'C:\Python311\python.exe',
    'C:\Python310\python.exe',
    'C:\Python39\python.exe',
    'C:\Program Files\Python313\python.exe',
    'C:\Program Files\Python312\python.exe',
    'C:\Program Files\Python311\python.exe',
    'C:\Program Files\Python310\python.exe',
    'C:\Program Files (x86)\Python312-32\python.exe',
    'C:\Users\hp\AppData\Local\Programs\Python\Python313\python.exe',
    'C:\Users\hp\AppData\Local\Programs\Python\Python312\python.exe',
    'C:\Users\hp\AppData\Local\Programs\Python\Python311\python.exe',
    'C:\Users\hp\AppData\Local\Programs\Python\Python310\python.exe',
    'C:\Users\leon\AppData\Local\Programs\Python\Python310\python.exe',
    'C:\ProgramData\anaconda3\python.exe',
    'C:\Users\hp\AppData\Local\anaconda3\python.exe',
    'C:\Users\hp\AppData\Local\Microsoft\WindowsApps\python.exe',
    'C:\Users\hp\AppData\Local\Microsoft\WindowsApps\PythonSoftwareFoundation.Python.3.12_qbz5n2kfra8p0\python.exe'
)
foreach ($c in $candidates) {
    ('{0} :: {1}' -f $c, (Test-Path -LiteralPath $c)) | Out-File -Append -Encoding utf8 $out
}
'=== drive roots with python/conda ===' | Out-File -Append -Encoding utf8 $out
$hits = Get-ChildItem -Path 'C:\' -Directory -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -match 'python|conda' } |
    Select-Object -ExpandProperty FullName
($hits -join "`r`n") | Out-File -Append -Encoding utf8 $out
'=== user programs dir ===' | Out-File -Append -Encoding utf8 $out
$dir = Get-ChildItem -Path 'C:\Users\hp\AppData\Local\Programs' -Directory -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty FullName
($dir -join "`r`n") | Out-File -Append -Encoding utf8 $out
'=== venv cfg ===' | Out-File -Append -Encoding utf8 $out
(Get-Content -LiteralPath 'c:\Users\hp\Desktop\Eric project\InfraCred\backend\venv\pyvenv.cfg' -ErrorAction SilentlyContinue | Out-String) | Out-File -Append -Encoding utf8 $out
'=== venv site-packages sample ===' | Out-File -Append -Encoding utf8 $out
$spList = Get-ChildItem -Path 'c:\Users\hp\Desktop\Eric project\InfraCred\backend\venv\Lib\site-packages' -Directory -ErrorAction SilentlyContinue |
    Select-Object -First 30 -ExpandProperty Name
($spList -join "`r`n") | Out-File -Append -Encoding utf8 $out
'=== winget / choco available ===' | Out-File -Append -Encoding utf8 $out
(('winget: ' + [bool](Get-Command winget -ErrorAction SilentlyContinue))) | Out-File -Append -Encoding utf8 $out
'=== END ===' | Out-File -Append -Encoding utf8 $out
