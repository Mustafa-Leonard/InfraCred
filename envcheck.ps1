$out = 'c:\Users\hp\Desktop\Eric project\envcheck.txt'
$py = 'C:\Program Files\Python313\python.exe'
'=== python version ===' | Out-File -Encoding utf8 $out
(& $py -c 'import sys; print(sys.version); print(sys.executable)' 2>&1 | Out-String) | Out-File -Append -Encoding utf8 $out

'=== global deps ===' | Out-File -Append -Encoding utf8 $out
(& $py -c 'import importlib
for m in ["django","rest_framework","rest_framework_simplejwt","PIL","corsheaders","django_filters","dj_database_url","drf_spectacular","celery","redis","dotenv"]:
    try:
        mod = importlib.import_module(m)
        print("OK  ", m, getattr(mod, "__version__", ""))
    except Exception as e:
        print("MISS", m, type(e).__name__)' 2>&1 | Out-String) | Out-File -Append -Encoding utf8 $out

'=== venv site-packages on PYTHONPATH ===' | Out-File -Append -Encoding utf8 $out
$env:PYTHONPATH = 'c:\Users\hp\Desktop\Eric project\InfraCred\backend\venv\Lib\site-packages'
(& $py -c 'import importlib
for m in ["django","rest_framework","rest_framework_simplejwt","PIL","corsheaders","django_filters","dj_database_url","drf_spectacular","celery"]:
    try:
        mod = importlib.import_module(m)
        print("OK  ", m, getattr(mod, "__version__", ""))
    except Exception as e:
        print("MISS", m, type(e).__name__, e)' 2>&1 | Out-String) | Out-File -Append -Encoding utf8 $out
Remove-Item Env:\PYTHONPATH

'=== pip present ===' | Out-File -Append -Encoding utf8 $out
(& $py -m pip --version 2>&1 | Out-String) | Out-File -Append -Encoding utf8 $out

'=== pypi reachable (5s timeout) ===' | Out-File -Append -Encoding utf8 $out
$ok = $false
try {
    $r = Invoke-WebRequest -Uri 'https://pypi.org/simple/django/' -Method Head -TimeoutSec 5 -UseBasicParsing
    $ok = $r.StatusCode
} catch { $ok = 'FAIL: ' + $_.Exception.Message }
("pypi: " + $ok) | Out-File -Append -Encoding utf8 $out
'=== END ===' | Out-File -Append -Encoding utf8 $out
