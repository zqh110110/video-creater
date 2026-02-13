# 魔因漫创启动脚本说明

## 脚本列表

### 1. 完整启动器 (`start-moyin.bat`)
**功能最全的批处理脚本，推荐日常使用**

**特点：**
- ✅ 自动检查Node.js环境
- ✅ 自动安装依赖（首次运行）
- ✅ 显示版本信息
- ✅ 清理旧进程
- ✅ 彩色输出，用户友好

**使用方法：**
```bash
双击 start-moyin.bat
```

---

### 2. 快速启动 (`quick-start.bat`)
**极简版启动脚本**

**特点：**
- 🚀 启动速度最快
- 📦 文件最小
- ⚡ 适合频繁重启

**使用方法：**
```bash
双击 quick-start.bat
```

---

### 3. 停止脚本 (`stop-moyin.bat`)
**专门用于停止所有相关进程**

**特点：**
- 🛑 彻底停止Node.js和Electron进程
- 🧹 清理僵尸进程

**使用方法：**
```bash
双击 stop-moyin.bat
```

---

### 4. PowerShell启动器 (`start-moyin.ps1`)
**现代化PowerShell脚本**

**特点：**
- 🎨 彩色输出
- 🔧 支持命令行参数
- 📋 完整的错误处理
- 🚀 支持构建模式

**使用方法：**
```powershell
# 基本启动
.\start-moyin.ps1

# 清理并重启
.\start-moyin.ps1 -Clean

# 构建生产版本
.\start-moyin.ps1 -Build

# 显示帮助
.\start-moyin.ps1 -Help
```

---

## 使用建议

### 日常使用
推荐使用 `start-moyin.bat`，功能最完整且稳定。

### 开发调试
使用 `quick-start.bat` 进行快速重启。

### 问题排查
1. 先运行 `stop-moyin.bat` 清理进程
2. 再运行 `start-moyin.bat` 重新启动

### PowerShell用户
如果你熟悉PowerShell，推荐使用 `start-moyin.ps1`，功能更强大。

---

## 常见问题

### Q: 脚本无法运行
A: 右键脚本 → "以管理员身份运行"

### Q: 提示"未检测到Node.js"
A: 请从 https://nodejs.org/ 下载安装Node.js 18+

### Q: 端口被占用
A: 先运行 `stop-moyin.bat` 清理进程，再重新启动

### Q: 依赖安装失败
A: 检查网络连接，或手动运行：
```bash
cd moyin-creator
npm install
```

---

## 文件结构
```
D:\mydoc\moyin-creator\
├── moyin-creator/           # 项目源码
├── start-moyin.bat          # 完整启动器 ⭐推荐
├── quick-start.bat          # 快速启动
├── stop-moyin.bat           # 停止脚本
├── start-moyin.ps1          # PowerShell启动器
└── README-scripts.md        # 本说明文档
```

---

## 访问地址
启动成功后，可通过以下方式访问：

- **Web界面：** http://localhost:5174/
- **桌面应用：** Electron窗口自动打开
- **API配置：** 应用内 → 设置 → API配置

---

🎬 **祝使用愉快！有问题请查看项目文档或提交Issue。**