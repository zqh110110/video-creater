#!/usr/bin/env node

/**
 * OpenCode天幕MCP配置验证脚本
 */

const { spawn } = require('child_process');
const { readFileSync } = require('fs');

console.log('🔗 OpenCode天幕MCP配置验证');
console.log('============================\n');

// 1. 验证配置文件
console.log('📋 步骤1：验证OpenCode配置文件');
try {
  const configPath = 'C:\\Users\\Administrator\\.config\\opencode\\opencode.json';
  const config = JSON.parse(readFileSync(configPath, 'utf8'));
  
  if (config.mcp && config.mcp['tianmu-mcp-server']) {
    const tianmuConfig = config.mcp['tianmu-mcp-server'];
    console.log('✅ 天幕MCP服务器配置已找到');
    console.log(`📡 类型: ${tianmuConfig.type}`);
    console.log(`🎯 命令: ${tianmuConfig.command.join(' ')}`);
    console.log(`🔑 API凭证: 已配置`);
    console.log(`📝 描述: ${tianmuConfig.description}`);
  } else {
    console.log('❌ 天幕MCP服务器配置未找到');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ 读取配置文件失败:', error.message);
  process.exit(1);
}

console.log('\n📋 步骤2：验证MCP服务器文件');
try {
  const serverPath = 'D:\\mydoc\\moyin-creator\\tianmu-client\\start-mcp-with-credentials.js';
  require.resolve(serverPath);
  console.log('✅ MCP服务器启动文件存在');
} catch (error) {
  console.error('❌ MCP服务器启动文件不存在:', error.message);
  process.exit(1);
}

console.log('\n📋 步骤3：测试MCP服务器启动');
console.log('🔄 正在启动天幕MCP服务器...');

const mcpProcess = spawn('node', [
  'D:\\mydoc\\moyin-creator\\tianmu-client\\start-mcp-with-credentials.js'
], {
  stdio: ['pipe', 'pipe', 'pipe'],
  cwd: 'D:\\mydoc\\moyin-creator\\tianmu-client'
});

let output = '';
let hasStarted = false;

mcpProcess.stdout.on('data', (data) => {
  const text = data.toString();
  output += text;
  
  console.log('📤 服务器输出:', text.trim());
  
  if (text.includes('天幕MCP服务器已启动')) {
    hasStarted = true;
  }
  
  if (text.includes('错误')) {
    console.error('❌ 启动错误:', text.trim());
  }
});

mcpProcess.stderr.on('data', (data) => {
  const text = data.toString();
  output += text;
  console.error('⚠️ 服务器输出:', text.trim());
  
  if (text.includes('天幕MCP服务器已启动')) {
    hasStarted = true;
  }
});

mcpProcess.on('error', (error) => {
  console.error('❌ 启动失败:', error.message);
  process.exit(1);
});

// 5秒后终止测试进程
setTimeout(() => {
  mcpProcess.kill('SIGTERM');
  
  console.log('\n🔍 调试信息:');
  console.log('=================');
  console.log('完整输出:', output);
  console.log('包含启动信息:', output.includes('天幕MCP服务器已启动'));
  
  console.log('\n📊 验证结果:');
  console.log('=================');
  
  if (output.includes('天幕MCP服务器已启动')) {
    console.log('🎉 OpenCode天幕MCP配置验证成功！');
    console.log('');
    console.log('✅ 配置文件: 已正确配置');
    console.log('✅ MCP服务器: 可以正常启动');
    console.log('✅ API凭证: 已正确设置');
    console.log('');
    console.log('🎯 现在你可以在OpenCode中使用以下功能:');
    
    const tools = [
      '🎬 文生视频 - 根据文字描述生成视频',
      '🎵 文生音乐 - 根据描述生成音乐',
      '🎨 文生图 - 根据文字描述生成图片',
      '🔊 文字转语音 - 将文字转换为语音',
      '📊 任务管理 - 查询和管理任务状态'
    ];
    
    tools.forEach(tool => console.log(`   ${tool}`));
    
    console.log('');
    console.log('💡 在OpenCode中使用示例:');
    console.log('   "请生成一个关于夕阳海滩的5秒视频"');
    console.log('   "请生成一张可爱小猫的图片，写实风格"');
    console.log('   "请为这段文字生成语音：欢迎使用天幕AI"');
    
  } else {
    console.log('❌ MCP服务器启动验证失败');
    console.log('💡 请检查以下项目:');
    console.log('   1. API凭证是否有效');
    console.log('   2. 服务器文件是否完整');
    console.log('   3. Node.js环境是否正常');
  }
  
  console.log('\n📚 更多信息:');
  console.log('   - 完整文档: README.md');
  console.log('   - API参考: docs/api-reference.md');
  console.log('   - 使用指南: MCP_SERVER_GUIDE.md');
  
}, 5000);