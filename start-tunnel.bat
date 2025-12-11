@echo off
REM Cloudflare Tunnel Startup Batch Script for Fixia.app
REM This script starts the PowerShell tunnel script

setlocal enabledelayedexpansion

title FIXIA.APP - Cloudflare Tunnel

echo.
echo ========================================
echo   FIXIA.APP - CLOUDFLARE TUNNEL
echo ========================================
echo.
echo Starting Cloudflare tunnel in PowerShell...
echo.
echo Make sure:
echo  - Docker containers (app + db) are running
echo  - Port 3000 is accessible
echo.

cd /d "%~dp0"

REM Execute PowerShell script
powershell -NoProfile -ExecutionPolicy Bypass -File "start-tunnel.ps1"

pause
