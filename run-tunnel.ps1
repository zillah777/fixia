# Script PowerShell para ejecutar Cloudflared Tunnel
# Este script ejecuta cloudflared en background

$token = "eyJhIjoiNWNiN2U4NzM4MjY4ZWE1NDEzYTIwYzk0ZDc5OTAyMDIiLCJ0IjoiMDhiMGRhNDAtMmNjMy00MDc0LWE3ZDMtYzlkN2U0YTdlMzVhIiwicyI6Ik1UZzJNR1UyWkdNdE1qWmpZaTAwWlRBMkxXRXdPRE10WWpoak9URTBNR1E1Wm1NdyJ9"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$cloudflaredExe = Join-Path $scriptDir "cloudflared.exe"

Write-Host "============================================"
Write-Host "Iniciando Cloudflared Tunnel para fixia.app"
Write-Host "============================================"
Write-Host ""

if (-not (Test-Path $cloudflaredExe)) {
    Write-Host "ERROR: cloudflared.exe no encontrado en: $cloudflaredExe"
    exit 1
}

Write-Host "Ejecutando: $cloudflaredExe"
Write-Host "Token: $(($token).Substring(0,20))..."
Write-Host ""

# Ejecutar cloudflared con token
& $cloudflaredExe tunnel run --token $token

# Si se cierra, mostrar mensaje
Write-Host "El túnel se ha desconectado. Presiona cualquier tecla para salir..."
Read-Host
