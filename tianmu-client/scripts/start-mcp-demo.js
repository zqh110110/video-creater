#!/usr/bin/env node

/**
 * MCP服务器启动演示脚本
 * 展示如何配置和启动天幕MCP服务器
 */

import { spawn } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import * as path from 'path';

console.log('🚀 天幕MCP服务器启动演示');
console.log('========================\n');

// 步骤1：检查环境配置
console.log('📋 步骤1：检查环境配置');
console.log('--------------------');

try {
  const envContent = readFileSync('.env', 'utf8');
  console.log('✅ 找到 .env 配置文件');
  
  if (envContent.includes('your_app_key_here')) {
    console.log('⚠️  需要设置真实的API凭证');
    console.log('💡 请按照以下步骤获取凭证：');
    console.log('   1. 访问 https://www.tomoviee.cn/developers.html');
    console.log('   2. 注册账号并创建应用');
    console.log('   3. 获取 app_key 和 app_secret');
    console.log('   4. 更新 .env 文件中的凭证');
    console.log('');
  } else {
    console.log('✅ API凭证已配置');
  }
} catch (error) {
  console.log('❌ 未找到 .env 配置文件');
  console.log('💡 请先运行: cp .env.example .env');
  console.log('');
}

// 步骤2：展示MCP工具列表
console.log('📋 步骤2：MCP工具列表');
console.log('--------------------');

const mcpTools = [
  { name: 'text_to_video', description: '文生视频：根据文字描述生成视频' },
  { name: 'image_to_video', description: '图生视频：将图片转换为视频' },
  { name: 'continue_video', description: '视频续写：延长现有视频' },
  { name: 'frames_to_video', description: '首尾帧生视频：根据首尾帧生成视频' },
  { name: 'text_to_music', description: '文生音乐：根据描述生成音乐' },
  { name: 'text_to_sound_effect', description: '文生音效：根据描述生成音效' },
  { name: 'generate_video_soundtrack', description: '视频配乐：为视频生成背景音乐' },
  { name: 'text_to_speech', description: '文字转语音：将文字转换为语音' },
  { name: 'text_to_image', description: '文生图：根据文字描述生成图片' },
  { name: 'image_to_image', description: '参考生图：根据参考图片生成新图片' },
  { name: 'redrawing_image', description: '图片重绘：对图片进行重绘' },
  { name: 'recognize_image', description: '图像识别：识别图片内容' },
  { name: 'get_task_status', description: '获取任务状态：查询任务执行状态' },
  { name: 'wait_for_task', description: '等待任务：等待任务完成并返回结果' }
];

mcpTools.forEach((tool, index) => {
  console.log(`${(index + 1).toString().padStart(2)}: ${tool.name.padEnd(20)} - ${tool.description}`);
});

console.log('');

// 步骤3：展示启动方式
console.log('📋 步骤3：启动方式');
console.log('--------------------');

console.log('🔧 方式1：直接启动服务器');
console.log('   npm run mcp');
console.log('');

console.log('🔧 方式2：开发模式启动');
console.log('   npm run dev:mcp');
console.log('');

console.log('🔧 方式3：构建后启动');
console.log('   npm run build');
console.log('   node dist/server.js');
console.log('');

// 步骤4：展示Claude Desktop配置
console.log('📋 步骤4：Claude Desktop配置');
console.log('-----------------------------');

const claudeConfig = {
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
};

console.log('在Claude Desktop配置文件中添加：');
console.log(JSON.stringify(claudeConfig, null, 2));
console.log('');

console.log('📍 配置文件位置：');
console.log('   macOS: ~/Library/Application Support/Claude/claude_desktop_config.json');
console.log('   Windows: %APPDATA%\\Claude\\claude_desktop_config.json');
console.log('   Linux: ~/.config/Claude/claude_desktop_config.json');
console.log('');

// 步骤5：演示MCP交互
console.log('📋 步骤5：MCP交互示例');
console.log('---------------------');

console.log('在Claude中使用示例：');
console.log('');
console.log('🎬 视频生成示例：');
console.log('   "请生成一个关于夕阳海滩的5秒视频"');
console.log('');
console.log('🎵 音频生成示例：');
console.log('   "请为这段视频生成轻快的背景音乐"');
console.log('');
console.log('🎨 图像生成示例：');
console.log('   "请生成一张可爱小猫在花园玩耍的图片，写实风格"');
console.log('');
console.log('📊 任务管理示例：');
console.log('   "请检查任务 abc123 的状态"');
console.log('   "请等待任务 def456 完成并返回结果"');
console.log('');

// 步骤6：实际启动尝试
console.log('📋 步骤6：启动服务器');
console.log('---------------------');

console.log('🔄 尝试启动MCP服务器...');

// 使用环境变量设置测试凭证
process.env.TIANMU_APP_KEY = 'test_demo_key';
process.env.TIANMU_APP_SECRET = 'test_demo_secret';

const serverProcess = spawn('node', ['dist/server.js'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: process.env,
  cwd: process.cwd()
});

let output = '';
let errorOutput = '';

serverProcess.stdout.on('data', (data) => {
  const text = data.toString();
  output += text;
  console.log('📤 服务器输出:', text.trim());
});

serverProcess.stderr.on('data', (data) => {
  const text = data.toString();
  errorOutput += text;
  console.log('⚠️  服务器警告:', text.trim());
});

serverProcess.on('error', (error) => {
  console.error('❌ 服务器启动错误:', error.message);
});

serverProcess.on('exit', (code, signal) => {
  if (code === 0) {
    console.log('✅ 服务器正常退出');
  } else {
    console.log(`❌ 服务器异常退出，代码: ${code}`);
  }
});

// 5秒后终止演示进程
setTimeout(() => {
  console.log('\n⏰ 演示时间结束，正在停止服务器...');
  serverProcess.kill('SIGTERM');
  
  console.log('\n🎊 MCP服务器演示完成！');
  console.log('');
  console.log('📚 更多信息：');
  console.log('   - README.md: 完整使用文档');
  console.log('   - docs/api-reference.md: API参考文档');
  console.log('   - examples/: 详细示例代码');
  console.log('');
}, 5000);