# Script de arranque del backend (Windows PowerShell)
# Crea entorno virtual, instala dependencias, carga datos de ejemplo y levanta la API.

Write-Host "=== GotaAGota Bank - Backend ===" -ForegroundColor Green

Set-Location "$PSScriptRoot\backend"

# Detectar el ejecutable de Python
$python = $null
$candidates = @(
    "python",
    "py",
    "$env:LOCALAPPDATA\Programs\Python\Python313\python.exe",
    "$env:LOCALAPPDATA\Programs\Python\Python312\python.exe",
    "$env:LOCALAPPDATA\Programs\Python\Python311\python.exe"
)
foreach ($c in $candidates) {
    try {
        $v = & $c --version 2>&1
        if ($v -match "Python 3\.") { $python = $c; Write-Host "Python detectado: $c ($v)" -ForegroundColor Cyan; break }
    } catch {}
}
if (-not $python) {
    Write-Host "ERROR: No se encontro Python. Instalalo desde python.org y reabre la terminal." -ForegroundColor Red
    exit 1
}

# Crear entorno virtual si no existe
if (-not (Test-Path ".\venv")) {
    Write-Host "Creando entorno virtual..." -ForegroundColor Cyan
    & $python -m venv venv
}

# Usar el python del entorno virtual directamente (no depende de Activate)
$venvPython = ".\venv\Scripts\python.exe"

# Instalar dependencias
Write-Host "Instalando dependencias..." -ForegroundColor Cyan
& $venvPython -m pip install --upgrade pip
& $venvPython -m pip install -r requirements.txt

# Cargar datos de ejemplo
Write-Host "Cargando datos de ejemplo..." -ForegroundColor Cyan
& $venvPython seed.py

# Levantar servidor
Write-Host "Levantando API en http://localhost:8000 (docs en /docs)" -ForegroundColor Green
& $venvPython -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
