const axios = require('axios');

// 测试文生视频 - 使用文档中的正确端点
async function testCorrectEndpoint() {
  try {
    console.log('🔧 测试正确的API端点...');
    
    // 直接使用正确的URL格式
    const response = await axios.post(
      'https://ai-api-eus.300624.com/v1/ai/capacity/application/tm_text2video',
      {
        prompt: '一只可爱的小猫在花园里玩耍，阳光明媚，动态效果自然',
        duration: 5,
        resolution: '720p'
      },
      {
        headers: {
          'X-App-Key': '93dc75fe9be26c8a0530dad18b498087',
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ 直接API调用成功:', response.data);
    
    if (response.data.code === 0) {
      const taskId = response.data.data.task_id;
      console.log('📋 任务ID:', taskId);
      
      // 保存任务ID
      const fs = require('fs');
      fs.writeFileSync('./correct-endpoint-task-id.txt', taskId);
      
      return taskId;
    } else {
      console.error('❌ API调用失败:', response.data);
      return null;
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error.response?.data || error.message);
    return null;
  }
}

// 执行测试
testCorrectEndpoint();