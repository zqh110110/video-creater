@echo off
title Start Moyin Creator (Fixed)
echo ========================================
echo     Starting Moyin Creator (Fixed)
echo ========================================
echo.

echo [1/3] Stopping any running Moyin processes...
taskkill /F /IM "moyin-creator.exe" 2>nul
taskkill /F /IM "electron.exe" 2>nul
timeout /t 2 >nul

echo [2/3] Cleaning build cache...
cd /d "%~dp0moyin-creator"
if exist "out" rmdir /s /q "out"
if exist "node_modules\.vite" rmdir /s /q "node_modules\.vite"

echo [3/3] Starting Moyin Creator...
echo.
echo Starting with development server and DevTools enabled...
echo The app will automatically detect the correct port.
echo.

call npm run dev

pause