#!/usr/bin/env node

/**
 * 天幕API全面测试脚本
 * 测试所有功能，分析问题，提供修复方案
 */

const { TianmuClient } = require('./tianmu-client/dist/client/tianmu-client.js');

// 测试配置
const TEST_CONFIG = {
  app_key: '93dc75fe9be26c8a0530dad18b498087',
  app_secret: '545377213f382142231a74fc108c0495',
  baseURL: 'https://open-api.wondershare.cc', // 基础URL
  timeout: 30000
};

// 测试结果收集器
const results = {
  authentication: {
    basic: null,
    token: null,
    comparison: null
  },
  apiEndpoints: {
    textToVideo: null,
    imageToVideo: null,
    textToImage: null,
    textToMusic: null,
    taskStatus: null
  },
  mcpServer: {
    running: false,
    toolsAvailable: null,
    functionality: null
  },
  overall: {
    successCount: 0,
    failureCount: 0,
    issues: [],
    recommendations: []
  }
};

/**
 * 测试基础认证
 */
async function testBasicAuthentication() {
  console.log('🔐 测试基础认证 (Basic Auth)...');
  try {
    const client = new TianmuClient(TEST_CONFIG);
    const response = await client.textToVideo({
      prompt: '基础认证测试视频',
      duration: 5,
      resolution: '720p'
    });
    
    results.authentication.basic = {
      success: !!response.task_id,
      task_id: response.task_id,
      error: response.error || null
    };
    
    console.log('基础认证结果:', results.authentication.basic);
    return results.authentication.basic.success;
  } catch (error) {
    results.authentication.basic = {
      success: false,
      error: error.response?.data || error.message
    };
    console.error('基础认证失败:', results.authentication.basic.error);
    return false;
  }
}

/**
 * 测试Token认证 (当前实现可能有问题)
 */
async function testTokenAuthentication() {
  console.log('🎫 测试Token认证...');
  try {
    // 尝试使用Token认证配置
    const tokenClient = new TianmuClient({
      ...TEST_CONFIG,
      useTokenAuth: true,
      tokenEndpoint: 'https://open-api.wondershare.cc/v1/open/capacity/application/auth'
    });
    
    const response = await tokenClient.textToVideo({
      prompt: 'Token认证测试视频',
      duration: 5,
      resolution: '720p'
    });
    
    results.authentication.token = {
      success: !!response.task_id,
      task_id: response.task_id,
      error: response.error || null
    };
    
    console.log('Token认证结果:', results.authentication.token);
    return results.authentication.token.success;
  } catch (error) {
    results.authentication.token = {
      success: false,
      error: error.response?.data || error.message
    };
    console.error('Token认证失败:', results.authentication.token.error);
    return false;
  }
}

/**
 * 测试不同API端点
 */
async function testAPIEndpoints() {
  console.log('🌐 测试API端点...');
  const client = new TianmuClient({
    ...TEST_CONFIG,
    baseURL: 'https://ai-api-eus.300624.com' // 尝试AI API端点
  });
  
  const tests = [
    {
      name: 'textToVideo',
      func: () => client.textToVideo({
        prompt: '端点测试视频',
        duration: 5
      })
    },
    {
      name: 'textToImage', 
      func: () => client.textToImage({
        prompt: '端点测试图片',
        width: 512,
        height: 512
      })
    },
    {
      name: 'textToMusic',
      func: () => client.textToMusic({
        prompt: '端点测试音乐',
        duration: 10
      })
    }
  ];
  
  for (const test of tests) {
    try {
      console.log(`测试 ${test.name}...`);
      const result = await test.func();
      results.apiEndpoints[test.name] = {
        success: !!result.task_id,
        task_id: result.task_id,
        error: result.error || null
      };
      
      if (results.apiEndpoints[test.name].success) {
        results.overall.successCount++;
      } else {
        results.overall.failureCount++;
      }
      
      console.log(`${test.name} 结果:`, results.apiEndpoints[test.name]);
    } catch (error) {
      results.apiEndpoints[test.name] = {
        success: false,
        error: error.response?.data || error.message
      };
      results.overall.failureCount++;
      console.error(`${test.name} 失败:`, results.apiEndpoints[test.name].error);
    }
  }
}

/**
 * 测试任务状态查询
 */
async function testTaskStatus() {
  console.log('🔍 测试任务状态查询...');
  const client = new TianmuClient(TEST_CONFIG);
  
  try {
    // 使用测试任务ID
    const testTaskId = 'test-status-query-' + Date.now();
    const status = await client.getTaskStatus(testTaskId);
    
    results.apiEndpoints.taskStatus = {
      success: !!status,
      status: status,
      error: status === null ? 'Task not found (expected)' : null
    };
    
    console.log('任务状态查询结果:', results.apiEndpoints.taskStatus);
    return true;
  } catch (error) {
    results.apiEndpoints.taskStatus = {
      success: false,
      error: error.response?.data || error.message
    };
    console.error('任务状态查询失败:', results.apiEndpoints.taskStatus.error);
    return false;
  }
}

/**
 * 测试MCP服务器
 */
async function testMCPServer() {
  console.log('🤖 测试MCP服务器...');
  
  try {
    // 检查MCP服务器是否正在运行
    const http = require('http');
    
    return new Promise((resolve) => {
      const req = http.request({
        hostname: 'localhost',
        port: 3000,
        path: '/',
        method: 'GET',
        timeout: 5000
      }, (res) => {
        results.mcpServer.running = res.statusCode === 200;
        console.log(`MCP服务器状态: ${results.mcpServer.running ? '运行中' : '未运行'}`);
        resolve(results.mcpServer.running);
      });
      
      req.on('error', () => {
        results.mcpServer.running = false;
        console.log('MCP服务器状态: 未运行');
        resolve(false);
      });
      
      req.end();
    });
    
  } catch (error) {
    results.mcpServer.running = false;
    results.mcpServer.error = error.message;
    console.error('MCP服务器检查失败:', error);
    return false;
  }
}

/**
 * 生成问题分析报告
 */
function generateReport() {
  console.log('\n' + '='.repeat(80));
  console.log('📊 全面测试报告');
  console.log('='.repeat(80));
  
  // 认证测试结果
  console.log('\n🔐 认证测试结果:');
  console.log(`基础认证: ${results.authentication.basic?.success ? '✅ 成功' : '❌ 失败'}`);
  console.log(`Token认证: ${results.authentication.token?.success ? '✅ 成功' : '❌ 失败'}`);
  
  // API端点测试结果
  console.log('\n🌐 API端点测试结果:');
  Object.entries(results.apiEndpoints).forEach(([name, result]) => {
    const status = result?.success ? '✅ 成功' : '❌ 失败';
    console.log(`${name}: ${status}`);
    if (result?.error) {
      console.log(`  错误: ${result.error}`);
    }
  });
  
  // MCP服务器测试结果
  console.log('\n🤖 MCP服务器测试结果:');
  console.log(`运行状态: ${results.mcpServer.running ? '✅ 运行中' : '❌ 未运行'}`);
  
  // 总体统计
  console.log('\n📈 总体统计:');
  console.log(`成功测试: ${results.overall.successCount}`);
  console.log(`失败测试: ${results.overall.failureCount}`);
  console.log(`成功率: ${((results.overall.successCount / (results.overall.successCount + results.overall.failureCount)) * 100).toFixed(1)}%`);
  
  // 问题分析和建议
  console.log('\n🔍 问题分析:');
  if (!results.authentication.basic?.success && !results.authentication.token?.success) {
    console.log('❌ 认证系统完全失效 - 需要检查API凭证和端点');
    results.overall.issues.push('Authentication system failure');
    results.overall.recommendations.push('Verify API credentials and endpoints');
  }
  
  if (Object.values(results.apiEndpoints).some(r => !r.success)) {
    console.log('❌ API端点存在问题 - 需要修复URL或认证方式');
    results.overall.issues.push('API endpoint failures');
    results.overall.recommendations.push('Fix API endpoints and authentication method');
  }
  
  if (!results.mcpServer.running) {
    console.log('⚠️ MCP服务器未运行 - 需要启动服务器进行完整测试');
    results.overall.issues.push('MCP server not running');
    results.overall.recommendations.push('Start MCP server for full testing');
  }
  
  console.log('\n💡 修复建议:');
  results.overall.recommendations.forEach((rec, index) => {
    console.log(`${index + 1}. ${rec}`);
  });
  
  // 保存详细报告
  const reportData = {
    timestamp: new Date().toISOString(),
    results: results,
    summary: {
      totalTests: results.overall.successCount + results.overall.failureCount,
      successRate: ((results.overall.successCount / (results.overall.successCount + results.overall.failureCount)) * 100).toFixed(1) + '%',
      issues: results.overall.issues,
      recommendations: results.overall.recommendations
    }
  };
  
  const fs = require('fs');
  fs.writeFileSync('./tianmu-comprehensive-test-report.json', JSON.stringify(reportData, null, 2));
  console.log('\n📄 详细报告已保存到: tianmu-comprehensive-test-report.json');
  
  return reportData;
}

/**
 * 主测试函数
 */
async function runComprehensiveTests() {
  console.log('🚀 开始天幕API全面功能测试...');
  console.log('测试时间:', new Date().toISOString());
  console.log('='.repeat(80));
  
  // 并行执行主要测试
  const authPromise = testBasicAuthentication();
  const endpointPromise = testAPIEndpoints();
  const statusPromise = testTaskStatus();
  const mcpPromise = testMCPServer();
  
  // 等待所有测试完成
  await Promise.allSettled([authPromise, endpointPromise, statusPromise, mcpPromise]);
  
  // 生成报告
  const report = generateReport();
  
  console.log('\n🎯 测试完成！');
  return report;
}

// 执行测试
if (require.main === module) {
  runComprehensiveTests().catch(error => {
    console.error('测试执行失败:', error);
    process.exit(1);
  });
}

module.exports = { runComprehensiveTests, results, generateReport };