# Script de arranque del backend (Windows PowerShell)
# Crea entorno virtual, instala dependencias, carga datos de ejemplo y levanta la API.

Write-Host "=== GotaAGota Bank - Backend ===" -ForegroundColor Green

Set-Location "$PSScriptRoot\backend"

# Crear entorno virtual si no existe
if (-not (Test-Path ".\venv")) {
    Write-Host "Creando entorno virtual..." -ForegroundColor Cyan
    python -m venv venv
}

# Activar entorno virtual
Write-Host "Activando entorno virtual..." -ForegroundColor Cyan
& ".\venv\Scripts\Activate.ps1"

# Instalar dependencias
Write-Host "Instalando dependencias..." -ForegroundColor Cyan
pip install -r requirements.txt

# Cargar datos de ejemplo
Write-Host "Cargando datos de ejemplo..." -ForegroundColor Cyan
python seed.py

# Levantar servidor
Write-Host "Levantando API en http://localhost:8000(docs en /docs)" -ForegroundColor Green
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
