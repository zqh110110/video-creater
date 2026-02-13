@echo off
title Moyin Creator - Guaranteed Fix
echo ========================================
echo     Moyin Creator - Guaranteed Fix
echo ========================================
echo.

echo [1/6] Force killing all related processes...
taskkill /F /IM "node.exe" /T 2>nul
taskkill /F /IM "electron.exe" /T 2>nul
taskkill /F /IM "moyin-creator.exe" /T 2>nul
wmic process where "name='node.exe' or name='electron.exe'" delete 2>nul
timeout 3 >nul

echo [2/6] Deep cleaning build cache...
cd /d "%~dp0moyin-creator"
if exist "out" rmdir /s /q "out"
if exist "node_modules\.vite" rmdir /s /q "node_modules\.vite"
if exist "dist" rmdir /s /q "dist"
del /q /s *.log

echo [3/6] Setting environment variables...
set VITE_DEV_SERVER_URL=http://localhost:5173
set ELECTRON_IS_DEV=true
echo Environment set: VITE_DEV_SERVER_URL=http://localhost:5173

echo [4/6] Starting npm install to ensure dependencies...
call npm install >nul 2>&1

echo [5/6] Starting Vite development server...
echo.
echo The server will start and Electron will connect to it.
echo Please wait for full initialization...
echo.

start "Vite Dev Server" cmd /c "npm run dev"
timeout 8 >nul

echo [6/6] Starting Electron manually with correct URL...
echo Connecting to: http://localhost:5173
call npx electron . --remote-debugging-port=9223 --inspect=5858

pause