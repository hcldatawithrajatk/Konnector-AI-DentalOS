#!/usr/bin/env bash
# ==============================================================================
# Konnector AI DentalOS — One-Click Automated Deployment Script
# ==============================================================================
set -e

echo "🚀 Starting One-Click Deployment for Konnector AI DentalOS..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ or 20+."
    exit 1
fi

echo "📦 Node Version: $(node -v)"
echo "📦 NPM Version: $(npm -v)"

# Install dependencies
echo "📥 Installing production dependencies..."
npm install

# Build Next.js application
echo "🔨 Building optimized Next.js production bundles..."
npm run build

echo "✅ Build completed successfully!"
echo "🌟 Launching Konnector AI DentalOS on port 3000..."

# Start production server
exec npm run start -- -p 3000
