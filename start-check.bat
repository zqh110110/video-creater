@echo off
cd /d "%~dp0moyin-creator"
echo Checking Node.js...
node --version
echo Checking npm...
npm --version
echo.
echo Starting Moyin Creator...
echo Web interface: http://localhost:5174/
echo.
npm run dev
pause