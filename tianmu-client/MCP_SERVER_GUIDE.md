# 天幕MCP服务器启动和使用指南

## 🚀 快速启动

### 1. 环境配置

首先需要配置天幕API凭证：

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，设置真实的API凭证
TIANMU_APP_KEY=your_real_app_key
TIANMU_APP_SECRET=your_real_app_secret
```

### 2. 获取API凭证

1. 访问 [天幕创作引擎](https://www.tomoviee.cn/developers.html)
2. 注册账号并创建应用
3. 获取 `app_key` 和 `app_secret`
4. 将凭证填入 `.env` 文件

### 3. 启动服务器

#### 方式1：使用脚本启动
```bash
# Linux/Mac
./scripts/start-mcp.sh

# Windows
scripts\start-mcp.bat
```

#### 方式2：使用npm命令
```bash
# 构建项目
npm run build

# 启动服务器
npm run mcp
```

#### 方式3：直接启动
```bash
node dist/server.js
```

## 🔧 MCP工具列表

天幕MCP服务器提供了16个工具，涵盖所有天幕AI功能：

### 🎥 视频生成工具
1. `text_to_video` - 文生视频
2. `image_to_video` - 图生视频
3. `continue_video` - 视频续写
4. `frames_to_video` - 首尾帧生视频

### 🎵 音频生成工具
5. `text_to_music` - 文生音乐
6. `text_to_sound_effect` - 文生音效
7. `generate_video_soundtrack` - 视频配乐
8. `text_to_speech` - 文字转语音

### 🎨 图像生成工具
9. `text_to_image` - 文生图
10. `image_to_image` - 参考生图
11. `redrawing_image` - 图片重绘
12. `recognize_image` - 图像识别

### 📊 任务管理工具
13. `get_task_status` - 获取任务状态
14. `wait_for_task` - 等待任务完成

## 🤖 Claude Desktop集成

### 1. 配置文件

在Claude Desktop的配置文件中添加：

```json
{
  "mcpServers": {
    "tianmu": {
      "command": "node",
      "args": ["D:\\mydoc\\moyin-creator\\tianmu-client\\dist\\server.js"],
      "env": {
        "TIANMU_APP_KEY": "your_app_key",
        "TIANMU_APP_SECRET": "your_app_secret"
      }
    }
  }
}
```

### 2. 配置文件位置

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

### 3. 重启Claude Desktop

配置完成后，重启Claude Desktop以加载MCP服务器。

## 💬 使用示例

### 视频生成
```
请生成一个关于夕阳海滩的5秒视频，要求高清画质，16:9比例
```

### 音频生成
```
请为我的视频生成一段轻快的背景音乐，时长15秒，钢琴风格
```

### 图像生成
```
请生成一张可爱小猫在花园玩耍的图片，要求写实风格，高清细节
```

### 任务管理
```
请检查任务 abc123 的状态
```

## 🔍 调试和故障排除

### 1. 常见问题

**问题**: 服务器启动失败，提示缺少凭证
```
错误: 请设置环境变量 TIANMU_APP_KEY 和 TIANMU_APP_SECRET
```
**解决**: 检查 `.env` 文件是否正确配置了API凭证

**问题**: Claude Desktop中看不到天幕工具
**解决**: 
1. 检查配置文件格式是否正确
2. 确认路径指向正确的 `server.js` 文件
3. 重启Claude Desktop

**问题**: API调用失败
**解决**: 
1. 检查API凭证是否有效
2. 确认网络连接正常
3. 查看服务器日志了解详细错误信息

### 2. 日志查看

MCP服务器会输出详细的日志信息：
- `📤 [Request]` - API请求日志
- `📥 [Response]` - API响应日志
- `❌ [Error]` - 错误信息

### 3. 测试连接

使用测试脚本验证服务器是否正常：
```bash
node scripts/start-mcp-demo.js
```

## 📚 更多资源

- [完整文档](README.md)
- [API参考文档](docs/api-reference.md)
- [架构设计文档](docs/architecture.md)
- [示例代码](examples/)

## 🎯 最佳实践

1. **凭证安全**: 不要在代码中硬编码API凭证，使用环境变量
2. **错误处理**: 在应用中处理API可能返回的错误
3. **任务管理**: 使用任务状态查询来跟踪异步任务进度
4. **参数优化**: 根据需求调整生成参数以获得最佳效果
5. **批量处理**: 对于多个任务，使用批量处理提高效率

## 🎉 开始使用

现在你已经了解了如何启动和使用天幕MCP服务器！

1. 获取天幕API凭证
2. 配置环境变量
3. 启动MCP服务器
4. 在Claude Desktop中享受AI创作的乐趣！

如有问题，请查看文档或提交Issue。祝您使用愉快！