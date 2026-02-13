#!/usr/bin/env node

import { TianmuMCPServer } from './mcp/server.js';

// 从环境变量获取配置
const config = {
  app_key: process.env.TIANMU_APP_KEY || '',
  app_secret: process.env.TIANMU_APP_SECRET || '',
  baseURL: process.env.TIANMU_BASE_URL || 'https://open-api.wondershare.cc',
  timeout: parseInt(process.env.TIANMU_TIMEOUT || '30000'),
};

// 验证必需的配置
if (!config.app_key || !config.app_secret) {
  console.error('错误: 请设置环境变量 TIANMU_APP_KEY 和 TIANMU_APP_SECRET');
  process.exit(1);
}

// 创建并启动MCP服务器
const server = new TianmuMCPServer(config);

// 优雅关闭处理
process.on('SIGINT', async () => {
  console.error('\n正在关闭天幕MCP服务器...');
  await server.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.error('\n正在关闭天幕MCP服务器...');
  await server.stop();
  process.exit(0);
});