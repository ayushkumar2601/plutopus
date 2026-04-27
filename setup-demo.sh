#!/bin/bash

# 🚀 PLUTO Demo Setup Script
# Automated setup for PLUTO - Autonomous Cyber Defense Agent

set -e

echo "
██████╗ ██╗     ██╗   ██╗████████╗ ██████╗ 
██╔══██╗██║     ██║   ██║╚══██╔══╝██╔═══██╗
██████╔╝██║     ██║   ██║   ██║   ██║   ██║
██╔═══╝ ██║     ██║   ██║   ██║   ██║   ██║
██║     ███████╗╚██████╔╝   ██║   ╚██████╔╝
╚═╝     ╚══════╝ ╚═════╝    ╚═╝    ╚═════╝ 

🤖 PLUTO Demo Setup - Autonomous Cyber Defense Agent
"

# Check prerequisites
echo "🔍 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 16+ from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please upgrade to Node.js 16+"
    exit 1
fi

echo "✅ Node.js $(node --version) found"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install npm"
    exit 1
fi

echo "✅ npm $(npm --version) found"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install Playwright
echo "🎭 Installing Playwright browsers..."
npx playwright install chromium

# Check environment
echo "🔧 Checking environment configuration..."

if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please copy .env.example to .env"
    exit 1
fi

# Check if Groq API key is set
if grep -q "gsk_" .env; then
    echo "✅ Groq API key found in .env"
else
    echo "⚠️  Groq API key not found. Demo will use default key."
fi

# Create demo data
echo "🎲 Generating demo data..."
if [ -f "scripts/seed-database.js" ]; then
    node scripts/seed-database.js
fi

# Check ports
echo "🔌 Checking available ports..."

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 3000 is in use. You may need to stop other services."
else
    echo "✅ Port 3000 is available"
fi

if lsof -Pi :4000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 4000 is in use. Sandbox server may conflict."
else
    echo "✅ Port 4000 is available"
fi

echo "
🎉 PLUTO Demo Setup Complete!

🚀 Quick Start:
   npm run dev                    # Start dashboard (http://localhost:3000)
   npm run sandbox               # Start sandbox server (optional)
   npm run pluto                 # Access CLI

📖 Demo Guide:
   See DEMO_GUIDE.md for complete presentation script

🎬 Key Demo Features:
   • Autonomous agent decision-making
   • Cinematic UX with thinking stream
   • Real-time threat analysis
   • Chrome extension integration
   • Civic AI governance

🔗 URLs:
   Dashboard: http://localhost:3000
   Sandbox:   http://localhost:3000/sandbox
   Warning:   http://localhost:3000/warning

Happy demoing! 🤖✨
"