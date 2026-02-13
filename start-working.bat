@echo off
title Moyin Creator - Working Solution
echo ========================================
echo     Moyin Creator - Working Solution
echo ========================================
echo.

echo [1/3] Stopping all processes...
taskkill /F /IM "node.exe" 2>nul
taskkill /F /IM "electron.exe" 2>nul
taskkill /F /IM "moyin-creator.exe" 2>nul
timeout 2 >nul

echo [2/3] Cleaning cache...
cd /d "%~dp0moyin-creator"
if exist "out" rmdir /s /q "out"

echo [3/3] Starting Moyin Creator...
echo.
set VITE_DEV_SERVER_URL=http://localhost:5173
echo Environment set: VITE_DEV_SERVER_URL=http://localhost:5173
echo.
echo Starting with DevTools enabled for debugging...
call npm run dev

pause