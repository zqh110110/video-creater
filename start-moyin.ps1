# 魔因漫创启动器 (PowerShell版)
param(
    [switch]$Clean,
    [switch]$Build,
    [switch]$Help
)

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectDir = Join-Path $ScriptDir "moyin-creator"

function Show-Help {
    Write-Host "魔因漫创启动器" -ForegroundColor Cyan
    Write-Host "==================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "用法:" -ForegroundColor Yellow
    Write-Host "  .\start-moyin.ps1          # 启动开发服务器"
    Write-Host "  .\start-moyin.ps1 -Clean   # 清理并重启"
    Write-Host "  .\start-moyin.ps1 -Build   # 构建生产版本"
    Write-Host "  .\start-moyin.ps1 -Help    # 显示帮助"
    Write-Host ""
}

function Test-NodeInstallation {
    try {
        $nodeVersion = node --version
        $npmVersion = npm --version
        Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
        Write-Host "✅ NPM: $npmVersion" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "❌ 未检测到Node.js" -ForegroundColor Red
        Write-Host "请从 https://nodejs.org/ 安装Node.js" -ForegroundColor Yellow
        return $false
    }
}

function Initialize-Project {
    Write-Host "📦 检查项目依赖..." -ForegroundColor Yellow
    
    if (-not (Test-Path $ProjectDir)) {
        Write-Host "❌ 项目目录不存在: $ProjectDir" -ForegroundColor Red
        return $false
    }
    
    Set-Location $ProjectDir
    
    if (-not (Test-Path "node_modules")) {
        Write-Host "📥 安装依赖..." -ForegroundColor Yellow
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ 依赖安装失败" -ForegroundColor Red
            return $false
        }
    }
    
    return $true
}

function Stop-OldProcesses {
    Write-Host "🧹 清理旧进程..." -ForegroundColor Yellow
    Get-Process "node" -ErrorAction SilentlyContinue | Where-Object {$_.CommandLine -like "*moyin-creator*"} | Stop-Process -Force
    Get-Process "moyin-creator" -ErrorAction SilentlyContinue | Stop-Process -Force
    Get-Process "electron" -ErrorAction SilentlyContinue | Stop-Process -Force
}

function Start-Development {
    Write-Host "🚀 启动魔因漫创开发服务器..." -ForegroundColor Green
    Write-Host "📱 Web界面: http://localhost:5174/" -ForegroundColor Cyan
    Write-Host "🖥️  Electron应用将自动打开" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "按 Ctrl+C 停止服务器" -ForegroundColor Yellow
    Write-Host "==================" -ForegroundColor Cyan
    
    npm run dev
}

function Start-Build {
    Write-Host "🔨 构建生产版本..." -ForegroundColor Yellow
    npm run build
}

# 主逻辑
if ($Help) {
    Show-Help
    exit 0
}

if (-not (Test-NodeInstallation)) {
    exit 1
}

if (-not (Initialize-Project)) {
    exit 1
}

if ($Clean) {
    Stop-OldProcesses
    Write-Host "🧹 清理完成" -ForegroundColor Green
}

if ($Build) {
    Start-Build
} else {
    Stop-OldProcesses
    Start-Development
}