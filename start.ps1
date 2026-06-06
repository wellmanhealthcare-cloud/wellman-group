# Wellman Group — Start all 3 services
# Run from: C:\Users\admin\Desktop\wellman group\
# Usage: .\start.ps1

$root = $PSScriptRoot

# 1. FastAPI backend (port 8000)
Start-Process powershell -ArgumentList "-NoExit", "-Command", @"
  Set-Location '$root\wellman-group\backend'
  venv\Scripts\Activate.ps1
  uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
"@

# 2. Next.js frontend (port 3000)
Start-Process powershell -ArgumentList "-NoExit", "-Command", @"
  Set-Location '$root\wellman-group\frontend'
  npm run dev
"@

# 3. Chatbot RAG server (port 8001)
Start-Process powershell -ArgumentList "-NoExit", "-Command", @"
  Set-Location '$root\wellman-group\chatbot\app'
  & 'D:\wellman\wellman_rag\venv\Scripts\python.exe' app.py
"@

Write-Host ""
Write-Host "Starting all services..." -ForegroundColor Green
Write-Host "  Backend  -> http://localhost:8000/v1/docs" -ForegroundColor Cyan
Write-Host "  Frontend -> http://localhost:3000" -ForegroundColor Cyan
Write-Host "  Chatbot  -> http://localhost:8001/health" -ForegroundColor Cyan
Write-Host ""
