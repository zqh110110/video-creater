@echo off
title Moyin Creator - Final Fix
echo ========================================
echo     Moyin Creator - Final Fix
echo ========================================
echo.

echo [1/4] Stopping all Moyin processes...
taskkill /F /IM "moyin-creator.exe" 2>nul
taskkill /F /IM "electron.exe" 2>nul
timeout 2 >nul

echo [2/4] Cleaning build cache...
cd /d "%~dp0moyin-creator"
if exist "out" rmdir /s /q "out"
if exist "node_modules\.vite" rmdir /s /q "node_modules\.vite"

echo [3/4] Starting development server...
echo.
echo Starting with automatic URL detection...
echo VITE_DEV_SERVER_URL will be set to the actual server port.
echo.

set VITE_DEV_SERVER_URL=http://localhost:5173
call npm run dev

pause