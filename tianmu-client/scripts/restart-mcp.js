#!/usr/bin/env node

/**
 * 重新启动MCP服务器脚本
 */

console.log('🚀 重新启动天幕MCP服务器');
console.log('========================\n');

// 设置环境变量
process.env.TIANMU_APP_KEY = 'demo_restart_key';
process.env.TIANMU_APP_SECRET = 'demo_restart_secret';

console.log('📋 环境配置:');
console.log(`TIANMU_APP_KEY=${process.env.TIANMU_APP_KEY}`);
console.log(`TIANMU_APP_SECRET=${process.env.TIANMU_APP_SECRET}`);
console.log('');

console.log('🔄 启动服务器...');
console.log('📡 MCP服务器已启动');
console.log('🛑 按 Ctrl+C 停止服务器');
console.log('');

// 导入并启动MCP服务器
try {
  require('./dist/server.js');
} catch (error) {
  console.error('❌ 启动失败:', error.message);
  process.exit(1);
}