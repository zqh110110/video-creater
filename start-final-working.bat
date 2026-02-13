@echo off
title Moyin Creator - FINAL WORKING VERSION
echo ========================================
echo     Moyin Creator - Final Working Version
echo ========================================
echo.

echo [1/3] Kill all processes...
taskkill /F /IM "node.exe" 2>nul
taskkill /F /IM "electron.exe" 2>nul
taskkill /F /IM "moyin-creator.exe" 2>nul
timeout 2 >nul

echo [2/3] Clean cache...
cd /d "%~dp0moyin-creator"
if exist "out" rmdir /s /q "out"

echo [3/3] Start development server and Electron...
echo.
echo Step 1: Starting Vite dev server...
start "Vite Server" cmd /c "npm run dev"

echo Step 2: Waiting 10 seconds for server...
timeout 10 >nul

echo Step 3: Starting Electron with correct port...
echo Using port 5174 based on server output...
call npx electron . --inspect=5858

pause