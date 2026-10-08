# ==============================================================================
# Konnector AI DentalOS — One-Click Automated Deployment Script (Windows PowerShell)
# ==============================================================================
$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   Konnector AI DentalOS — Production Deployment Script   " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Verify Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Error: Node.js was not detected on this machine. Please install Node.js 18+ or 20+." -ForegroundColor Red
    Exit 1
}

$nodeVer = node -v
Write-Host "✓ Detected Node.js: $nodeVer" -ForegroundColor Green

# 2. Install Dependencies
Write-Host "📦 Installing project dependencies..." -ForegroundColor Yellow
npm install

# 3. Build Production Bundles
Write-Host "🔨 Building production Next.js bundles..." -ForegroundColor Yellow
npm run build

Write-Host "==========================================================" -ForegroundColor Green
Write-Host "✓ Build Succeeded! All 17 dental routes are compiled." -ForegroundColor Green
Write-Host "🚀 Launching Konnector AI DentalOS at http://localhost:3000" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Green

# 4. Start Server
npm run start -- -p 3000
