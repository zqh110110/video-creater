@echo off
chcp 65001 >nul
title 魔因漫创启动器

echo ========================================
echo           魔因漫创 Moyin Creator
echo           AI影视生产级工具
echo ========================================
echo.

:: 检查Node.js是否存在
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 错误：未检测到Node.js
    echo 请先安装Node.js (版本 >= 18)
    echo 下载地址：https://nodejs.org/
    pause
    exit /b 1
)

:: 显示Node.js版本
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ Node.js版本: %NODE_VERSION%
echo ✅ NPM版本: %NPM_VERSION%
echo.

:: 切换到项目目录
cd /d "%~dp0moyin-creator"

:: 检查项目是否存在
if not exist "package.json" (
    echo ❌ 错误：未找到moyin-creator项目
    echo 请确保脚本和moyin-creator文件夹在同一目录
    pause
    exit /b 1
)

:: 检查依赖是否安装
if not exist "node_modules" (
    echo 📦 首次运行，正在安装依赖...
    echo 这可能需要几分钟时间，请耐心等待...
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
    echo ✅ 依赖安装完成
    echo.
)

:: 清理可能存在的旧进程
echo 🧹 清理旧进程...
taskkill /F /IM "moyin-creator.exe" 2>nul
taskkill /F /IM "electron.exe" 2>nul

:: 启动应用
echo 🚀 启动魔因漫创...
echo.
echo ========================================
echo 应用启动中，请稍候...
echo ========================================
echo.
echo 📱 Web界面将运行在: http://localhost:5174/
echo 🖥️  Electron应用窗口将自动打开
echo.
echo 按 Ctrl+C 停止应用
echo.

:: 启动开发服务器
call npm run dev

echo.
echo 应用已停止
pause