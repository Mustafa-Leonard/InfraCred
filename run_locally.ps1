# InfraCred Local Run Script

Write-Host "Setting up InfraCred..." -ForegroundColor Green

# 1. Setup Backend
Write-Host "Configuring Backend..." -ForegroundColor Cyan
cd backend
if (-not (Test-Path venv)) {
    python -m venv venv
}
.\venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_infra
Start-Process ".\venv\Scripts\python.exe" -ArgumentList "manage.py runserver"
cd ..

# 2. Setup Frontend
Write-Host "Configuring Frontend..." -ForegroundColor Cyan
cd frontend
if (-not (Test-Path node_modules)) {
    npm install
}
Start-Process npm -ArgumentList "run dev"
cd ..

Write-Host "Servers are starting!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host "Backend API: http://localhost:8000/api/" -ForegroundColor Yellow
Write-Host "API Docs: http://localhost:8000/api/docs/" -ForegroundColor Yellow
