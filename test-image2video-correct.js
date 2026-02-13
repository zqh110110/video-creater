import axios from 'axios';

// 天幕API配置
const APP_KEY = '93dc75fe9be26c8a0530dad18b498087';
const APP_SECRET = '545377213f382142231a74fc108c0495';

// 生成Basic认证token
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

// 使用正确的端点测试图生视频
async function testImageToVideoV3() {
  try {
    console.log('🎬 使用v3端点测试天幕图生视频功能...');
    
    // 根据文档使用 /v3/pic/t2v/batch 端点
    const payload = {
      text: '一只可爱的小猫在花园里玩耍，阳光明媚，花朵盛开，动态效果自然',
      duration: 5
    };

    console.log('📤 发送请求:', payload);
    
    const response = await api.post('/v3/pic/t2v/batch', payload);
    
    console.log('✅ 图生视频任务创建成功!');
    console.log('📋 响应:', response.data);
    
    if (response.data.code === 0 && response.data.data) {
      const taskId = response.data.data.task_id;
      console.log('📋 任务ID:', taskId);
      
      // 保存任务ID
      const fs = require('fs');
      fs.writeFileSync('./image2video-task-id.txt', taskId);
      console.log('💾 任务ID已保存到 image2video-task-id.txt');
      
      return taskId;
    } else {
      console.log('❌ 创建任务失败:', response.data);
      return null;
    }

  } catch (error) {
    console.error('❌ 图生视频测试失败:', error.message);
    if (error.response) {
      console.error('🔍 错误详情:', error.response.data);
    }
    return null;
  }

// 测试任务状态查询
async function testTaskStatus(taskId) {
  try {
    console.log('📊 测试任务状态查询...');
    
    // 使用正确的查询端点
    const response = await api.get(`/v3/pic/t2v/result/${taskId}`);
    
    console.log('✅ 任务状态查询成功!');
    console.log('📋 任务状态:', response.data);
    
    return response.data;

  } catch (error) {
    console.error('❌ 任务状态查询失败:', error.message);
    if (error.response) {
      console.error('🔍 错误详情:', error.response.data);
    }
    return null;
  }

// 主测试函数
async function runCorrectedImageToVideoTest() {
  console.log('🚀 开始天幕图生视频功能（正确端点）测试');
  console.log('=' .repeat(60));
  
  // 测试图生视频
  console.log('\n📋 测试: 图生视频任务创建');
  const taskId = await testImageToVideoV3();
  
  if (taskId) {
    console.log('\n' + '='.repeat(60));
    
    // 等待几秒后查询任务状态
    console.log('\n⏳ 等待5秒后查询任务状态...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('\n📋 测试: 任务状态查询');
    await testTaskStatus(taskId);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🎯 图生视频测试完成!');
  
  console.log('\n📝 使用说明:');
  console.log('1. 使用 /v3/pic/t2v/batch 端点创建任务');
  console.log('2. 使用 /v3/pic/t2v/result/{task_id} 查询结果');
  console.log('3. 支持duration参数: 5-60秒');
  console.log('4. text参数支持逗号分隔的多个人物/元素');
}

// 执行测试
runCorrectedImageToVideoTest();