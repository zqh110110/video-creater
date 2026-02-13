import { TianmuClient } from './tianmu-client/dist/client/tianmu-client.js';

// 创建客户端
const client = new TianmuClient({
  app_key: '93dc75fe9be26c8a0530dad18b498087',
  app_secret: '545377213f382142231a74fc108c0495'
});

// 测试获取任务状态 - 简单的API调用
async function testTaskStatus() {
  try {
    console.log('测试API凭证有效性...');
    
    // 尝试获取一个虚构任务的状态，这应该告诉我们API凭证是否有效
    const result = await client.getTaskStatus('test-task-id');
    console.log('API响应:', result);

  } catch (error) {
    console.error('API测试失败:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('❌ API凭证无效');
    } else if (error.response?.status === 403) {
      console.log('❌ API凭证无权限访问此功能');
    } else if (error.response?.status === 404) {
      console.log('✅ API凭证有效，但任务不存在（这是正常的）');
    } else {
      console.log('❓ 其他错误:', error.response?.status);
    }
  }
}

// 执行测试
testTaskStatus();