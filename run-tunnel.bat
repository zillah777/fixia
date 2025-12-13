@echo off
REM Cloudflared Tunnel Runner para Fixia App
REM Este script ejecuta cloudflared con el token del túnel

setlocal enabledelayedexpansion

REM Token del túnel (generado en Cloudflare)
set TUNNEL_TOKEN=eyJhIjoiNWNiN2U4NzM4MjY4ZWE1NDEzYTIwYzk0ZDc5OTAyMDIiLCJ0IjoiMDhiMGRhNDAtMmNjMy00MDc0LWE3ZDMtYzlkN2U0YTdlMzVhIiwicyI6Ik1UZzJNR1UyWkdNdE1qWmpZaTAwWlRBMkxXRXdPRE10WWpoak9URTBNR1E1Wm1NdyJ9

REM Directorio del script
cd /d "%~dp0"

echo ============================================
echo Iniciando Cloudflared Tunnel para fixia.app
echo ============================================
echo.
echo Token: %TUNNEL_TOKEN%
echo Configuración: .cloudflared\config.yml
echo.

REM Ejecutar cloudflared
cloudflared.exe tunnel --no-autoupdate --config .cloudflared\config.yml run --token %TUNNEL_TOKEN%

pause
