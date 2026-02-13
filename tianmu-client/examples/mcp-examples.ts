#!/usr/bin/env node

/**
 * MCP服务器测试示例
 * 这个脚本演示如何与天幕MCP服务器交互
 */

import { spawn } from 'child_process';
import { createInterface } from 'readline';

// MCP工具调用示例
const toolCalls = [
  {
    name: 'text_to_video',
    description: '文生视频',
    arguments: {
      prompt: '一只小猫在花园里玩耍，阳光明媚',
      resolution: '720p',
      aspect_ratio: '16:9',
      camera_move_index: 9,
    },
  },
  {
    name: 'text_to_music',
    description: '文生音乐',
    arguments: {
      prompt: '轻快的钢琴曲，适合早晨聆听',
      duration: 15,
      style: 'classical',
      mood: 'happy',
    },
  },
  {
    name: 'text_to_speech',
    description: '文字转语音',
    arguments: {
      text: '你好，欢迎使用天幕创作引擎！',
      voice_id: 'female_01',
      speed: 1.0,
      pitch: 1.0,
    },
  },
  {
    name: 'image_to_image',
    description: '参考生图',
    arguments: {
      reference_image_url: 'https://example.com/reference.jpg',
      prompt: '将照片转换为油画风格',
      strength: 0.8,
      style: 'oil_painting',
    },
  },
  {
    name: 'get_task_status',
    description: '获取任务状态',
    arguments: {
      task_id: 'example_task_id_123',
    },
  },
];

/**
 * 启动MCP服务器并发送工具调用
 */
async function testMCPServer() {
  console.log('🚀 启动天幕MCP服务器测试...\n');

  // 检查环境变量
  if (!process.env.TIANMU_APP_KEY || !process.env.TIANMU_APP_SECRET) {
    console.error('❌ 请设置环境变量:');
    console.error('   export TIANMU_APP_KEY=your_app_key');
    console.error('   export TIANMU_APP_SECRET=your_app_secret');
    process.exit(1);
  }

  // 启动MCP服务器进程
  const serverProcess = spawn('node', ['dist/server.js'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: process.env,
  });

  let serverOutput = '';
  let isReady = false;

  // 监听服务器输出
  serverProcess.stdout.on('data', (data) => {
    const output = data.toString();
    serverOutput += output;
    
    if (output.includes('天幕MCP服务器已启动')) {
      isReady = true;
      console.log('✅ MCP服务器已启动\n');
    }
  });

  serverProcess.stderr.on('data', (data) => {
    console.error('服务器错误:', data.toString());
  });

  serverProcess.on('error', (error) => {
    console.error('启动服务器失败:', error);
    process.exit(1);
  });

  // 等待服务器启动
  await new Promise((resolve) => {
    const checkReady = setInterval(() => {
      if (isReady) {
        clearInterval(checkReady);
        resolve(null);
      }
    }, 100);
  });

  // 演示MCP工具调用
  console.log('📋 可用工具列表:');
  toolCalls.forEach((tool, index) => {
    console.log(`${index + 1}. ${tool.name} - ${tool.description}`);
  });
  console.log('');

  // 创建交互式界面
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const askQuestion = (question: string): Promise<string> => {
    return new Promise((resolve) => {
      rl.question(question, resolve);
    });
  };

  while (true) {
    console.log('\n🎯 选择操作:');
    console.log('1. 列出所有工具');
    console.log('2. 调用工具');
    console.log('3. 运行预设示例');
    console.log('4. 退出');

    const choice = await askQuestion('请输入选择 (1-4): ');

    switch (choice) {
      case '1':
        console.log('\n📋 所有可用工具:');
        toolCalls.forEach((tool, index) => {
          console.log(`${index + 1}. ${tool.name}`);
          console.log(`   描述: ${tool.description}`);
          console.log(`   参数: ${JSON.stringify(tool.arguments, null, 2)}`);
          console.log('');
        });
        break;

      case '2':
        const toolIndex = parseInt(await askQuestion('选择工具编号 (1-5): ')) - 1;
        if (toolIndex >= 0 && toolIndex < toolCalls.length) {
          const tool = toolCalls[toolIndex];
          console.log(`\n🔧 调用工具: ${tool.name}`);
          console.log(`参数: ${JSON.stringify(tool.arguments, null, 2)}`);
          
          // 模拟MCP工具调用
          console.log('⏳ 正在调用工具...');
          
          // 在实际实现中，这里会通过MCP协议发送请求
          // 现在我们只是模拟响应
          setTimeout(() => {
            console.log('✅ 工具调用成功');
            console.log('响应: {"task_id": "mock_task_id", "status": "submitted"}');
          }, 1000);
        } else {
          console.log('❌ 无效的工具编号');
        }
        break;

      case '3':
        console.log('\n🎬 运行预设示例...');
        
        for (let i = 0; i < 2; i++) {
          const tool = toolCalls[i];
          console.log(`\n${i + 1}. 执行: ${tool.description}`);
          console.log(`   工具: ${tool.name}`);
          console.log(`   参数: ${JSON.stringify(tool.arguments)}`);
          
          // 模拟执行
          console.log('   ⏳ 执行中...');
          await new Promise(resolve => setTimeout(resolve, 2000));
          console.log('   ✅ 执行完成');
        }
        
        console.log('\n💡 在实际使用中，这些工具会通过MCP协议与AI助手集成');
        console.log('   你可以在Claude Desktop等支持MCP的工具中直接使用这些功能');
        break;

      case '4':
        console.log('\n👋 退出测试');
        rl.close();
        serverProcess.kill();
        process.exit(0);

      default:
        console.log('❌ 无效选择，请重试');
    }
  }
}

/**
 * MCP配置示例
 */
function showMCPConfig() {
  console.log('\n📝 MCP服务器配置示例:');
  console.log('');
  console.log('在Claude Desktop的配置文件中添加:');
  console.log('');
  console.log(JSON.stringify({
    mcpServers: {
      tianmu: {
        command: 'node',
        args: ['dist/server.js'],
        env: {
          TIANMU_APP_KEY: 'your_app_key',
          TIANMU_APP_SECRET: 'your_app_secret'
        }
      }
    }
  }, null, 2));
  console.log('');
  console.log('💡 配置文件位置:');
  console.log('   macOS: ~/Library/Application Support/Claude/claude_desktop_config.json');
  console.log('   Windows: %APPDATA%\\Claude\\claude_desktop_config.json');
  console.log('   Linux: ~/.config/Claude/claude_desktop_config.json');
}

// 如果直接运行此文件
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--config')) {
    showMCPConfig();
  } else {
    testMCPServer();
  }
}

export { testMCPServer, showMCPConfig, toolCalls };