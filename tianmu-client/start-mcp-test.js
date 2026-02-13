#!/usr/bin/env node

// 设置环境变量并启动MCP服务器
process.env.TIANMU_APP_KEY = '93dc75fe9be26c8a0530dad18b498087';
process.env.TIANMU_APP_SECRET = '545377213f382142231a74fc108c0495';

// 启动MCP服务器
console.log('🚀 启动天幕MCP服务器...');
console.log('📋 API Key:', process.env.TIANMU_APP_KEY.substring(0, 8) + '...');

// 动态导入并启动服务器
import('./dist/server.js');