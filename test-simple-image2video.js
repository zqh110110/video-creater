const axios = require('axios');

// 天幕API配置
const APP_KEY = '93dc75fe9be26c8a0530dad18b498087';
const APP_SECRET = '545377213f382142231a74fc108c0495';
const basicToken = Buffer.from(`${APP_KEY}:${APP_SECRET}`).toString('base64');

// 创建axios实例
const api = axios.create({
  baseURL: 'https://open-api.wondershare.cc',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${basicToken}`,
    'X-App-Key': APP_KEY
  }
});

// 测试图生视频
async function testImageToVideo() {
  try {
    console.log('🎬 使用v3端点测试天幕图生视频功能...');
    
    const payload = {
      text: '一只可爱的小猫在花园里玩耍，阳光明媚，花朵盛开，动态效果自然',
      duration: 5
    };

    console.log('📤 发送请求:', payload);
    
    const response = await api.post('/v3/pic/t2v/batch', payload);
    
    console.log('✅ 响应状态:', response.status);
    console.log('📋 响应数据:', JSON.stringify(response.data, null, 2));
    
    if (response.data.code === 0 && response.data.data) {
      const taskId = response.data.data.task_id;
      console.log('📋 任务ID:', taskId);
      return taskId;
    } else {
      console.log('❌ 创建任务失败:', response.data);
      return null;
    }

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    if (error.response) {
      console.error('🔍 错误详情:', error.response.data);
    }
    return null;
  }
}

// 执行测试
testImageToVideo();