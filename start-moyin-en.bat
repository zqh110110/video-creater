@echo off
title Moyin Creator Launcher

echo ========================================
echo        Moyin Creator Launcher
echo        AI Film Production Tool
echo ========================================
echo.

:: Check Node.js installation
node --version >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found
    echo Please install Node.js (version >= 18)
    echo Download: https://nodejs.org/
    pause
    exit /b 1
)

:: Show versions
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [OK] Node.js: %NODE_VERSION%
echo [OK] NPM: %NPM_VERSION%
echo.

:: Change to project directory
cd /d "%~dp0moyin-creator"

:: Check if project exists
if not exist "package.json" (
    echo ERROR: moyin-creator project not found
    echo Please ensure moyin-creator folder is in the same directory
    pause
    exit /b 1
)

:: Check if dependencies are installed
if not exist "node_modules" (
    echo Installing dependencies for first run...
    echo This may take several minutes, please wait...
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Dependency installation failed
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed
    echo.
)

:: Clean old processes
echo Cleaning old processes...
taskkill /F /IM "moyin-creator.exe" 2>nul
taskkill /F /IM "electron.exe" 2>nul

:: Start application
echo Starting Moyin Creator...
echo.
echo ========================================
echo Application starting, please wait...
echo ========================================
echo.
echo Web interface: http://localhost:5174/
echo Electron app will open automatically
echo.
echo Press Ctrl+C to stop the application
echo.

:: Start development server
call npm run dev

echo.
echo Application stopped
pause