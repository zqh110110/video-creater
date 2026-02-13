@echo off
title Moyin Creator - Ultimate Fix
echo ========================================
echo     Moyin Creator - Ultimate Fix
echo ========================================
echo.

echo [1/5] Killing all related processes...
taskkill /F /IM "node.exe" 2>nul
taskkill /F /IM "electron.exe" 2>nul
taskkill /F /IM "moyin-creator.exe" 2>nul
timeout 2 >nul

echo [2/5] Cleaning all caches...
cd /d "%~dp0moyin-creator"
if exist "out" rmdir /s /q "out"
if exist "node_modules\.vite" rmdir /s /q "node_modules\.vite"
if exist "dist" rmdir /s /q "dist"

echo [3/5] Setting environment for automatic port detection...
set ELECTRON_IS_DEV=1
set VITE_DEV_SERVER_URL=

echo [4/5] Starting Vite dev server...
echo This will start the server and Electron will connect to it automatically.
echo.

call npm run dev

pause