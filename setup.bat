@echo off
REM Quick Start Script for Student Volunteer Platform

echo.
echo ====================================
echo Student Volunteer Platform - Quick Start
echo ====================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo [1/4] Installing backend dependencies...
cd server
call npm install
if errorlevel 1 (
    echo ERROR: Backend installation failed!
    pause
    exit /b 1
)

echo.
echo [2/4] Creating .env file...
if not exist ".env" (
    copy .env.example .env
    echo Created .env file - please configure MONGODB_URI if needed
)

echo.
echo [3/4] Installing frontend dependencies...
cd ..\client
call npm install
if errorlevel 1 (
    echo ERROR: Frontend installation failed!
    pause
    exit /b 1
)

echo.
echo ====================================
echo ✅ Installation Complete!
echo ====================================
echo.
echo 📝 Next steps:
echo.
echo 1. Open TWO terminal windows:
echo.
echo    Terminal 1 (Backend):
echo    cd server
echo    npm run dev
echo.
echo    Terminal 2 (Frontend):
echo    cd client
echo    npm run dev
echo.
echo 2. Open your browser:
echo    http://localhost:5173
echo.
echo 3. (Optional) To create sample data:
echo    cd server
echo    npm run seed
echo.
echo 📚 Documentation:
echo    - See SETUP.md for detailed setup guide
echo    - See PROGRESS.md for what's been completed
echo    - See README.md for project info
echo.
pause
