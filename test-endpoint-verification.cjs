// 简单测试来验证修复的端点
const axios = require('axios');

async function testEndpoints() {
  console.log('🧪 直接测试修复后的端点...');
  
  try {
    // 使用修复后的客户端，但需要绕过客户端直接调用API来验证端点
    const response = await axios.post(
      'https://ai-api-eus.300624.com/v1/ai/capacity/application/tm_text2video',
      {
        prompt: '测试修复后的端点',
        duration: 5,
        resolution: '720p'
      },
      {
        headers: {
          'X-App-Key': '93dc75fe9be26c8a0530dad18b498087',
          'Authorization': 'Basic OTNkYzc1ZmU5YmUyNmM4YTA1MzBkYWQxOGI0OTgwODc6NTQ1Mzc3MjEzZjM4MjE0MjIzMWE3NGZjMTA4YzA0OTU=',
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('🎯 直接API测试响应:', response.data);
    
    if (response.data.code === 0) {
      console.log('✅ 端点修复成功！任务ID:', response.data.data.task_id);
      return true;
    } else {
      console.log('❌ 端点仍有问题:', response.data);
      return false;
    }
    
  } catch (error) {
    console.error('❌ 端点测试失败:', error.response?.data || error.message);
    return false;
  }
}

// 测试状态查询端点
async function testStatusEndpoint() {
  console.log('🔍 测试修复后的状态查询端点...');
  
  try {
    const taskId = 'test-task-id'; // 使用测试任务ID
    
    const response = await axios.get(
      `https://open-api.wondershare.cc/v1/open/video/taf/result/${taskId}`,
      {
        headers: {
          'X-App-Key': '93dc75fe9be26c8a0530dad18b498087',
          'Authorization': 'Basic OTNkYzc1ZmU5YmUyNmM4YTA1MzBkYWQxOGI0OTgwODc6NTQ1Mzc3MjEzZjM4MjE0MjIzMWE3NGZjMTA4YzA0OTU=',
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('📊 状态查询响应:', response.data);
    
    if (response.data.code === 0) {
      console.log('✅ 状态查询端点修复成功！');
      return true;
    } else {
      console.log('❌ 状态查询端点仍有问题:', response.data);
      return false;
    }
    
  } catch (error) {
    console.error('❌ 状态查询失败:', error.response?.data || error.message);
    return false;
  }
}

// 执行测试
async function runTests() {
  console.log('='.repeat(50));
  console.log('🧪 测试API端点修复');
  const endpointTest = await testEndpoints();
  
  console.log('🔍 测试状态查询端点');
  const statusTest = await testStatusEndpoint();
  
  console.log('='.repeat(50));
  console.log('\n📊 测试结果总结:');
  console.log(`端点修复: ${endpointTest ? '✅ 成功' : '❌ 失败'}`);
  console.log(`状态查询修复: ${statusTest ? '✅ 成功' : '❌ 失败'}`);
  
  if (endpointTest && statusTest) {
    console.log('🎉 所有关键修复已验证成功！');
  } else {
    console.log('⚠️ 仍需要进一步调试认证问题');
  }
}

runTests();