@echo off
title Moyin Creator - Direct Fix
echo ========================================
echo     Moyin Creator - Direct Fix  
echo ========================================
echo.

echo [1/4] Stopping all processes...
taskkill /F /IM "node.exe" 2>nul
taskkill /F /IM "electron.exe" 2>nul
timeout 2 >nul

echo [2/4] Cleaning caches...
cd /d "%~dp0moyin-creator"
if exist "out" rmdir /s /q "out"
if exist "node_modules\.vite" rmdir /s /q "node_modules\.vite"

echo [3/4] Start Vite server first...
echo.
echo Starting development server...
start "Vite Server" cmd /c "npm run dev"

echo [4/4] Waiting for server to start...
echo Please wait 10 seconds for server initialization...
timeout 10 >nul

echo [4/4] Detecting actual port...
echo Checking which port is being used...
for /f "tokens=2" %%i in ('netstat -ano ^| findstr ":517" ^| findstr "LISTENING"') do (
    set ACTUAL_PORT=%%i
    goto :found
)

:not_found
echo Using fallback port 5174
set ACTUAL_PORT=5174
goto :continue

:found
echo Server found on port: %ACTUAL_PORT%
goto :continue

:continue
echo [4/4] Starting Electron with correct port...
echo.
set VITE_DEV_SERVER_URL=http://localhost:%ACTUAL_PORT%
call npx electron . --inspect=5858

pause