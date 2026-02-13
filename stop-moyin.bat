@echo off
title 停止魔因漫创

echo 🛑 停止魔因漫创相关进程...

:: 停止可能的Node.js进程
for /f "tokens=2" %%i in ('tasklist /FI "IMAGENAME eq node.exe" /FO csv ^| find "node.exe"') do (
    echo 停止Node进程 %%i
    taskkill /F /PID %%i 2>nul
)

:: 停止Electron应用
taskkill /F /IM "moyin-creator.exe" 2>nul
taskkill /F /IM "electron.exe" 2>nul

echo ✅ 所有相关进程已停止
timeout /t 2 >nul