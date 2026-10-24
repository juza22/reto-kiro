# Script de arranque del frontend (Windows PowerShell)
# Instala dependencias y levanta el servidor de desarrollo de React.

Write-Host "=== GotaAGota Bank - Frontend ===" -ForegroundColor Green

Set-Location "$PSScriptRoot\frontend"

# Instalar dependencias si no existen
if (-not (Test-Path ".\node_modules")) {
    Write-Host "Instalando dependencias (puede tardar unos minutos)..." -ForegroundColor Cyan
    npm install
}

# Levantar servidor de desarrollo
Write-Host "Levantando frontend en http://localhost:3000" -ForegroundColor Green
npm start
