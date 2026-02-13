@echo off
title Fix Moyin Creator Blank Window
echo ========================================
echo     Fix Moyin Creator Blank Window
echo ========================================
echo.

echo [1/3] Stopping any running Moyin processes...
taskkill /F /IM "moyin-creator.exe" 2>nul
taskkill /F /IM "electron.exe" 2>nul
timeout /t 2 >nul

echo [2/3] Setting correct environment variables...
set VITE_DEV_SERVER_URL=http://localhost:5174
echo Environment set: VITE_DEV_SERVER_URL=http://localhost:5174

echo [3/3] Starting Moyin Creator with DevTools...
echo.
cd /d "%~dp0moyin-creator"

echo Starting with DevTools enabled for debugging...
npm run dev

pause