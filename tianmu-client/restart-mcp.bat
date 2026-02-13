@echo off
chcp 65001 >nul
echo 🚀 重新启动天幕MCP服务器
echo ========================
echo.

echo 📋 设置环境变量:
set TIANMU_APP_KEY=93dc75fe9be26c8a0530dad18b498087
set TIANMU_APP_SECRET=545377213f382142231a74fc108c0495
set TIANMU_BASE_URL=https://open-api.wondershare.cc
set TIANMU_TIMEOUT=30000

echo TIANMU_APP_KEY=%TIANMU_APP_KEY%
echo TIANMU_APP_SECRET=%TIANMU_APP_SECRET%
echo.

echo 🔄 启动MCP服务器...
echo 📡 服务器正在启动...
echo 🛑 按 Ctrl+C 停止服务器
echo.

REM 启动MCP服务器
node dist/server.js