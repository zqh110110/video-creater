import { TianmuClient } from './tianmu-client/dist/client/tianmu-client.js';

// 使用Token认证的完整测试
async function testCompleteTokenAuth() {
  console.log('🔐 完整Token-Based Authentication测试...');
  
  try {
    // 使用新的配置启用Token认证
    const client = new TianmuClient({
      app_key: '93dc75fe9be26c8a0530dad18b498087',
      app_secret: '545377213f382142231a74fc108c0495',
      baseURL: 'https://ai-api-eus.300624.com', // 使用正确的AI API端点
      useTokenAuth: true, // 启用Token认证
      tokenEndpoint: 'https://open-api.wondershare.cc/v1/open/capacity/application/tob_text2video_b' // Token生成端点
    });
    
    console.log('📝 已启用Token-Based认证');
    
    // 测试文生视频功能
    const result = await client.textToVideo({
      prompt: '使用Token认证测试视频生成',
      duration: 5,
      resolution: '720p',
      aspect_ratio: '16:9'
    });
    
    console.log('🎯 Token认证API调用结果:', result);
    
    if (result.task_id) {
      console.log('✅ Token认证成功！任务ID:', result.task_id);
      
      // 测试状态查询
      console.log('🔍 测试Token认证状态查询...');
      const status = await client.getTaskStatus(result.task_id);
      console.log('📊 Token认证状态查询结果:', status);
      
      return { success: true, task: result.task_id, status };
    } else {
      console.log('❌ Token认证失败:', result);
      return { success: false, error: result };
    }
    
  } catch (error) {
    console.error('❌ Token认证测试失败:', error.response?.data || error.message);
    return { success: false, error };
  }
}

// 测试Token认证和Basic认证对比
async function testAuthComparison() {
  console.log('⚖️ Token vs Basic认证对比测试...');
  
  // Basic认证客户端（当前可能失效）
  const basicClient = new TianmuClient({
    app_key: '93dc75fe9be26c8a0530dad18b498087',
    app_secret: '545377213f382142231a74fc108c0495',
    baseURL: 'https://ai-api-eus.300624.com'
  });
  
  // Token认证客户端
  const tokenClient = new TianmuClient({
    app_key: '93dc75fe9be26c8a0530dad18b498087',
    app_secret: '545377213f382142231a74fc108c0495',
    baseURL: 'https://ai-api-eus.300624.com',
    useTokenAuth: true,
    tokenEndpoint: 'https://open-api.wondershare.cc/v1/open/capacity/application/tob_text2video_b'
  });
  
  const testPrompt = '认证方式对比测试';
  const testOptions = {
    prompt: testPrompt,
    duration: 5,
    resolution: '720p'
  };
  
  const results = {
    basic: null,
    token: null
  };
  
  try {
    console.log('🔷 测试Basic认证...');
    results.basic = await basicClient.textToVideo(testOptions);
    console.log('Basic认证结果:', results.basic);
  } catch (error) {
    console.error('Basic认证失败:', error.response?.data || error.message);
  }
  
  try {
    console.log('🔷 测试Token认证...');
    results.token = await tokenClient.textToVideo(testOptions);
    console.log('Token认证结果:', results.token);
  } catch (error) {
    console.error('Token认证失败:', error.response?.data || error.message);
  }
  
  console.log('\n📊 认证对比结果:');
  console.log(`Basic认证: ${results.basic ? '✅ 成功' : '❌ 失败'}`);
  console.log(`Token认证: ${results.token ? '✅ 成功' : '❌ 失败'}`);
  
  const success = results.basic && results.token;
  if (success) {
    console.log('🎉 Token认证系统正常工作！');
  } else {
    console.log('⚠️ 需要进一步调试认证系统');
  }
  
  return success;
}

// 执行完整测试
async function runCompleteTests() {
  console.log('='.repeat(60));
  
  const authTest = await testAuthComparison();
  
  if (authTest) {
    console.log('✅ Token-Based Authentication实现完成！');
    console.log('🚀 现在可以使用Bearer Token进行API调用');
  } else {
    console.log('❌ Token-Based Authentication仍需调试');
  }
  
  console.log('='.repeat(60));
}

runCompleteTests();