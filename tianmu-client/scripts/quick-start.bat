@echo off
chcp 65001 >nul
echo 🚀 天幕API客户端快速开始
echo ========================

REM 检查Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未找到Node.js，请先安装Node.js ^(版本 ^>= 16^)
    pause
    exit /b 1
)

echo ✅ Node.js版本检查通过
node --version

REM 安装依赖
echo 📦 安装依赖...
call npm install
if errorlevel 1 (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)

REM 构建项目
echo 🔨 构建项目...
call npm run build
if errorlevel 1 (
    echo ❌ 构建失败
    pause
    exit /b 1
)

REM 检查环境变量
echo ⚙️  检查配置...

if not exist ".env" (
    echo 📋 创建环境变量文件...
    copy .env.example .env >nul
    echo ✅ 已创建 .env 文件
    echo ⚠️  请编辑 .env 文件，设置你的 TIANMU_APP_KEY 和 TIANMU_APP_SECRET
    echo.
    echo 获取API凭证的步骤:
    echo 1. 访问 https://www.tomoviee.cn/developers.html
    echo 2. 注册并创建应用
    echo 3. 获取 app_key 和 app_secret
    echo 4. 将它们填入 .env 文件
    echo.
) else (
    echo ✅ 找到 .env 文件
)

REM 检查是否设置了API凭证
findstr /C:"your_app_key_here" .env >nul
if errorlevel 1 (
    echo ✅ API凭证已设置
    
    REM 运行测试
    echo 🧪 运行测试...
    call npm test
    if errorlevel 1 (
        echo.
        echo ❌ 测试失败，请检查配置
    ) else (
        echo.
        echo 🎉 快速开始完成！
        echo.
        echo 接下来你可以:
        echo   npm run dev                # 运行客户端示例
        echo   npm run mcp                 # 启动MCP服务器
        echo   npm run test:watch          # 监视模式运行测试
        echo.
        echo 📖 查看文档:
        echo   type README.md               # 完整文档
        echo.
    )
) else (
    echo ⚠️  请先在 .env 文件中设置正确的API凭证
    echo.
    echo 设置完成后，运行以下命令测试:
    echo   npm test                    # 运行测试
    echo   npm run dev                # 运行开发示例
    echo   npm run mcp                 # 启动MCP服务器
    echo.
)

echo 🔗 有用的链接:
echo   - 天幕API文档: https://www.tomoviee.cn/doc/
echo   - MCP协议: https://modelcontextprotocol.io/
echo   - 项目GitHub: [你的仓库地址]
echo.
pause