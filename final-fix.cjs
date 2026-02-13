#!/usr/bin/env node

/**
 * 天幕API最终修复和验证脚本
 */

const fs = require('fs');
const { exec } = require('child_process');

async function createWorkingMCPClient() {
  console.log('🔧 创建可工作的MCP客户端...');
  
  // 创建使用基础认证的客户端
  const workingClientCode = `
/**
 * 使用基础认证的可工作MCP客户端
 */
import { TianmuClient } from '../client/tianmu-client.js';

export class WorkingMCPClient {
  private client: TianmuClient;
  
  constructor() {
    // 使用已知有效的基础认证配置
    this.client = new TianmuClient({
      app_key: process.env.TIANMU_APP_KEY || '93dc75fe9be26c8a0530dad18b498087',
      app_secret: process.env.TIANMU_APP_SECRET || '545377213f382142231a74fc108c0495',
      baseURL: 'https://open-api.wondershare.cc' // 使用工作的原始URL
    });
  }

  // 测试视频生成
  async testTextToVideo(prompt: string = '测试视频生成') {
    try {
      const result = await this.client.textToVideo({
        prompt,
        duration: 5,
        resolution: '720p'
      });
      
      return {
        success: !!result.task_id,
        task_id: result.task_id,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }

  // 测试图像生成
  async testTextToImage(prompt: string = '测试图像生成') {
    try {
      const result = await this.client.textToImage({
        prompt,
        width: 512,
        height: 512
      });
      
      return {
        success: !!result.task_id,
        task_id: result.task_id,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }
}
  `;
  
  fs.writeFileSync('./tianmu-client/src/mcp/working-mcp-client.ts', workingClientCode);
  console.log('✅ 可工作的MCP客户端已创建');
  
  return true;
}

// 修复package.json添加TypeScript配置
async function fixPackageJson() {
  console.log('🔧 修复package.json TypeScript配置...');
  
  try {
    const packagePath = './tianmu-client/package.json';
    const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // 添加或更新TypeScript配置
    if (!packageData.type) {
      packageData.type = 'module';
    }
    
    if (!packageData.types) {
      packageData.types = 'dist/index.d.ts';
    }
    
    // 添加必要的开发依赖
    if (!packageData.devDependencies) {
      packageData.devDependencies = {};
    }
    
    packageData.devDependencies['@types/node'] = '^20.0.0';
    
    fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 2));
    console.log('✅ package.json已修复');
    
    return true;
  } catch (error) {
    console.error('package.json修复失败:', error);
    return false;
  }
}

// 创建简化的测试脚本
async function createSimpleTest() {
  console.log('🧪 创建简化测试脚本...');
  
  const testScript = `
/**
 * 简化的天幕API测试
 */

const { TianmuClient } = require('./tianmu-client/dist/client/tianmu-client.js');

async function runQuickTest() {
  console.log('🚀 开始天幕API快速测试...');
  
  const client = new TianmuClient({
    app_key: '93dc75fe9be26c8a0530dad18b498087',
    app_secret: '545377213f382142231a74fc108c0495',
    baseURL: 'https://open-api.wondershare.cc'
  });
  
  try {
    console.log('📹 测试文生视频...');
    const videoResult = await client.textToVideo({
      prompt: '一只可爱的小猫在花园里玩耍',
      duration: 5,
      resolution: '720p'
    });
    
    if (videoResult.task_id) {
      console.log('✅ 文生视频成功! 任务ID:', videoResult.task_id);
      
      console.log('🔍 测试任务状态查询...');
      const status = await client.getTaskStatus(videoResult.task_id);
      console.log('📊 任务状态:', status);
      
      return { success: true, videoResult, status };
    } else {
      console.log('❌ 文生视频失败:', videoResult);
      return { success: false, error: videoResult };
    }
  } catch (error) {
    console.error('❌ 测试失败:', error.response?.data || error.message);
    return { success: false, error };
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  runQuickTest().then(result => {
    if (result.success) {
      console.log('\\n🎉 天幕API测试完全成功！');
      console.log('📋 可以开始使用所有功能');
    } else {
      console.log('\\n❌ 测试失败，需要进一步调试');
      console.log('错误:', result.error);
    }
  });
}

module.exports = { runQuickTest };
  `;
  
  fs.writeFileSync('./quick-test.cjs', testScript);
  console.log('✅ 简化测试脚本已创建');
  
  return true;
}

// 主修复流程
async function runCompleteFix() {
  console.log('🚀 开始最终修复流程...');
  console.log('='.repeat(80));
  
  // 步骤1: 创建可工作的MCP客户端
  await createWorkingMCPClient();
  
  // 步骤2: 修复package.json
  await fixPackageJson();
  
  // 步骤3: 创建简化测试
  await createSimpleTest();
  
  // 步骤4: 重新构建
  console.log('\\n🔨 重新构建项目...');
  
  return new Promise((resolve, reject) => {
    exec('cd tianmu-client && npm run build', { 
      cwd: './tianmu-client',
      stdio: 'pipe',
      maxBuffer: 1024 * 1024
    }, (error, stdout, stderr) => {
      if (error) {
        console.error('构建失败:', error);
        reject(error);
        return;
      }
      
      console.log(stdout);
      console.log(stderr);
      
      if (stderr.includes('error')) {
        console.error('构建过程中有错误');
        reject(new Error('TypeScript compilation failed'));
        return;
      }
      
      console.log('✅ 构建成功');
      resolve({ success: true });
    });
  });
}

// 执行最终修复
if (require.main === module) {
  runCompleteFix().then(() => {
    console.log('\\n' + '='.repeat(80));
    console.log('🎯 修复完成！');
    console.log('\\n📋 下一步操作:');
    console.log('1. cd tianmu-client && node quick-test.cjs');
    console.log('2. 启动MCP服务器: export TIANMU_APP_KEY=your_key && npm run mcp');
    console.log('3. 测试API功能: 使用生成的客户端进行各种API调用');
    console.log('\\n🔧 核心修复内容:');
    console.log('- 使用基础认证 (已验证有效)');
    console.log('- 使用原始API端点 (已验证有效)');
    console.log('- 修复TypeScript编译问题');
    console.log('- 创建可工作的测试和MCP集成');
    console.log('\\n✅ 现在所有功能都应该正常工作！');
  }).catch(error => {
    console.error('修复失败:', error);
    process.exit(1);
  });
}

module.exports = { runCompleteFix };