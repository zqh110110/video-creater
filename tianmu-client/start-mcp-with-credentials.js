#!/usr/bin/env node

/**
 * 天幕MCP服务器启动脚本
 */

console.log('🚀 天幕MCP服务器启动脚本');
console.log('========================\n');

// 设置环境变量
process.env.TIANMU_APP_KEY = '93dc75fe9be26c8a0530dad18b498087';
process.env.TIANMU_APP_SECRET = '545377213f382142231a74fc108c0495';
process.env.TIANMU_BASE_URL = 'https://open-api.wondershare.cc';
process.env.TIANMU_TIMEOUT = '30000';

console.log('📋 环境配置:');
console.log(`TIANMU_APP_KEY: ${process.env.TIANMU_APP_KEY}`);
console.log(`TIANMU_APP_SECRET: ${process.env.TIANMU_APP_SECRET ? '***设置成功***' : '未设置'}`);
console.log(`TIANMU_BASE_URL: ${process.env.TIANMU_BASE_URL}`);
console.log('');

// 验证配置
if (!process.env.TIANMU_APP_KEY || !process.env.TIANMU_APP_SECRET) {
  console.error('❌ 环境变量配置失败');
  process.exit(1);
}

console.log('✅ 环境变量配置成功');
console.log('🔄 启动MCP服务器...');
console.log('📡 天幕MCP服务器正在启动');
console.log('🛑 按 Ctrl+C 停止服务器');
console.log('');

// 启动MCP服务器
try {
  require('./dist/server.js');
} catch (error) {
  console.error('❌ 启动失败:', error.message);
  process.exit(1);
}