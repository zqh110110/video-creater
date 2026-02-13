const { TianmuClient } = require('./tianmu-client/dist/client/tianmu-client.js');

// 使用修复后的客户端
const client = new TianmuClient({
  app_key: '93dc75fe9be26c8a0530dad18b498087',
  app_secret: '545377213f382142231a74fc108c0495'
});

// 测试修复后的API端点
async function testFixedEndpoints() {
  try {
    console.log('🧪 测试修复后的API端点...');
    
    const result = await client.textToVideo({
      prompt: '一只可爱的小猫在花园里玩耍，阳光明媚，动态效果自然',
      duration: 5,
      resolution: '720p',
      aspect_ratio: '16:9',
    });

    console.log('✅ 修复后的API调用成功:', result);
    console.log('📋 任务ID:', result.task_id);
    
    // 保存任务ID
    const fs = require('fs');
    fs.writeFileSync('./fixed-endpoint-task-id.txt', result.task_id);
    
    // 测试状态查询
    if (result.task_id) {
      console.log('🔍 测试修复后的状态查询...');
      
      const status = await client.getTaskStatus(result.task_id);
      console.log('📊 任务状态:', status);
      
      fs.writeFileSync('./fixed-endpoint-status.json', JSON.stringify(status, null, 2));
      
      return result.task_id;
    }
    
  } catch (error) {
    console.error('❌ 修复后测试失败:', error.response?.data || error.message);
    return null;
  }
}

// 执行测试
testFixedEndpoints();