#!/bin/bash

echo "🚀 天幕MCP服务器启动脚本"
echo "========================"

# 检查是否已构建
if [ ! -d "dist" ]; then
    echo "📦 构建项目..."
    npm run build
fi

# 检查环境配置
if [ ! -f ".env" ]; then
    echo "📋 创建环境配置文件..."
    cp .env.example .env
    echo "⚠️  请编辑 .env 文件设置真实的 TIANMU_APP_KEY 和 TIANMU_APP_SECRET"
    echo ""
fi

# 检查API凭证
if grep -q "your_app_key_here" .env; then
    echo "⚠️  检测到默认的API凭证"
    echo "💡 请先获取真实的API凭证："
    echo "   1. 访问 https://www.tomoviee.cn/developers.html"
    echo "   2. 注册并创建应用"
    echo "   3. 获取 app_key 和 app_secret"
    echo "   4. 更新 .env 文件"
    echo ""
    echo "🔄 使用测试凭证启动演示..."
    export TIANMU_APP_KEY="demo_key"
    export TIANMU_APP_SECRET="demo_secret"
fi

echo "🎯 启动MCP服务器..."
echo "📡 服务器地址: http://localhost:3000 (如果可用)"
echo "🛑 按 Ctrl+C 停止服务器"
echo ""

# 启动MCP服务器
node dist/server.js