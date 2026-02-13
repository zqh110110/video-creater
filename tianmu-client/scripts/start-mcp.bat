@echo off
chcp 65001 >nul
echo 🚀 天幕MCP服务器启动脚本
echo ========================

REM 检查是否已构建
if not exist "dist" (
    echo 📦 构建项目...
    call npm run build
    if errorlevel 1 (
        echo ❌ 构建失败
        pause
        exit /b 1
    )
)

REM 检查环境配置
if not exist ".env" (
    echo 📋 创建环境配置文件...
    copy .env.example .env >nul
    echo ⚠️  请编辑 .env 文件设置真实的 TIANMU_APP_KEY 和 TIANMU_APP_SECRET
    echo.
)

REM 检查API凭证
findstr /C:"your_app_key_here" .env >nul
if errorlevel 1 (
    echo ✅ API凭证已配置
) else (
    echo ⚠️  检测到默认的API凭证
    echo 💡 请先获取真实的API凭证：
    echo    1. 访问 https://www.tomoviee.cn/developers.html
    echo    2. 注册并创建应用
    echo    3. 获取 app_key 和 app_secret
    echo    4. 更新 .env 文件
    echo.
    echo 🔄 使用测试凭证启动演示...
    set TIANMU_APP_KEY=demo_key
    set TIANMU_APP_SECRET=demo_secret
)

echo 🎯 启动MCP服务器...
echo 📡 服务器地址: http://localhost:3000 (如果可用)
echo 🛑 按 Ctrl+C 停止服务器
echo.

REM 启动MCP服务器
node dist/server.js