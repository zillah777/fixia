# Cloudflare Tunnel Startup Script for Fixia.app
# Este script inicia el túnel de Cloudflare con el token válido

$TUNNEL_TOKEN="eyJhIjoiNWNiN2U4NzM4MjY4ZWE1NDEzYTIwYzk0ZDc5OTAyMDIiLCJ0IjoiMThjMDY0YzgtOWVhNS00MDdiLWJlMGMtMzdjZWM5ZjRkNmMwIiwicyI6Ik16QXdORE01TlRJdE1UbG1ZUzAwTmpJM0xUZzROekV0WldVelpESTVZbVV5WWpVeSJ9"

Write-Host "========================================"
Write-Host "  FIXIA.APP - CLOUDFLARE TUNNEL STARTUP"
Write-Host "========================================"
Write-Host ""
Write-Host "Starting Cloudflare tunnel..."
Write-Host "Tunnel will connect to: http://fixia-app:3000"
Write-Host ""

$env:TUNNEL_TOKEN=$TUNNEL_TOKEN

# Start the tunnel
cloudflared tunnel --no-autoupdate run --token $env:TUNNEL_TOKEN

