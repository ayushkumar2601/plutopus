@echo off
REM 🚀 PLUTO Demo Setup Script for Windows
REM Automated setup for PLUTO - Autonomous Cyber Defense Agent

echo.
echo ██████╗ ██╗     ██╗   ██╗████████╗ ██████╗ 
echo ██╔══██╗██║     ██║   ██║╚══██╔══╝██╔═══██╗
echo ██████╔╝██║     ██║   ██║   ██║   ██║   ██║
echo ██╔═══╝ ██║     ██║   ██║   ██║   ██║   ██║
echo ██║     ███████╗╚██████╔╝   ██║   ╚██████╔╝
echo ╚═╝     ╚══════╝ ╚═════╝    ╚═╝    ╚═════╝ 
echo.
echo 🤖 PLUTO Demo Setup - Autonomous Cyber Defense Agent
echo.

REM Check prerequisites
echo 🔍 Checking prerequisites...

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js 16+ from https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js found
node --version

REM Check npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm not found. Please install npm
    pause
    exit /b 1
)

echo ✅ npm found
npm --version

REM Install dependencies
echo.
echo 📦 Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

REM Install Playwright
echo.
echo 🎭 Installing Playwright browsers...
call npx playwright install chromium
if %errorlevel% neq 0 (
    echo ❌ Failed to install Playwright
    pause
    exit /b 1
)

REM Check environment
echo.
echo 🔧 Checking environment configuration...

if not exist ".env" (
    echo ❌ .env file not found. Please copy .env.example to .env
    pause
    exit /b 1
)

REM Check if Groq API key is set
findstr /C:"gsk_" .env >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Groq API key found in .env
) else (
    echo ⚠️  Groq API key not found. Demo will use default key.
)

REM Generate demo data (if script exists)
echo.
echo 🎲 Generating demo data...
if exist "scripts\seed-database.js" (
    node scripts\seed-database.js
)

echo.
echo 🎉 PLUTO Demo Setup Complete!
echo.
echo 🚀 Quick Start:
echo    npm run dev                    # Start dashboard (http://localhost:3000)
echo    npm run sandbox               # Start sandbox server (optional)
echo    npm run pluto                 # Access CLI
echo.
echo 📖 Demo Guide:
echo    See DEMO_GUIDE.md for complete presentation script
echo.
echo 🎬 Key Demo Features:
echo    • Autonomous agent decision-making
echo    • Cinematic UX with thinking stream
echo    • Real-time threat analysis
echo    • Chrome extension integration
echo    • Civic AI governance
echo.
echo 🔗 URLs:
echo    Dashboard: http://localhost:3000
echo    Sandbox:   http://localhost:3000/sandbox
echo    Warning:   http://localhost:3000/warning
echo.
echo Happy demoing! 🤖✨
echo.
pause