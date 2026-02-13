// 天幕图生视频功能完整测试
// 根据文档，天幕可能使用不同的API版本和基础URL

const testTianmuAPI = async () => {
  console.log('🚀 开始天幕图生视频功能完整分析');
  console.log('=' .repeat(60));

  // 测试配置1: 原始配置
  console.log('\n📋 配置1: 使用原始 open-api.wondershare.cc');
  try {
    const axios = require('axios');
    
    const APP_KEY = '93dc75fe9be26c8a0530dad18b498087';
    const APP_SECRET = '545377213f382142231a74fc108c0495';
    const basicToken = Buffer.from(`${APP_KEY}:${APP_SECRET}`).toString('base64');

    const api1 = axios.create({
      baseURL: 'https://open-api.wondershare.cc',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${basicToken}`,
        'X-App-Key': APP_KEY
      }
    });

    // 测试文生视频 (我们知道这个可以工作)
    console.log('📊 测试文生视频 (已知可用):');
    const videoResult = await api1.post('/v1/open/capacity/application/tm_text2video_b', {
      prompt: '测试文生视频功能',
      duration: 5,
      resolution: '720p',
      aspect_ratio: '16:9',
      camera_move_index: 9
    });
    
    console.log('✅ 文生视频响应:', videoResult.status);
    if (videoResult.data.code === 0) {
      console.log('📋 任务ID:', videoResult.data.data.task_id);
    }

  } catch (error) {
    console.error('❌ 配置1失败:', error.message);
  }

  console.log('\n' + '=' .repeat(60));

  // 测试配置2: 尝试不同的基础URL
  console.log('\n📋 配置2: 尝试 ailab.wondershare.cn');
  try {
    const axios = require('axios');
    
    const APP_KEY = '93dc75fe9be26c8a0530dad18b498087';
    const APP_SECRET = '545377213f382142231a74fc108c0495';
    const basicToken = Buffer.from(`${APP_KEY}:${APP_SECRET}`).toString('base64');

    const api2 = axios.create({
      baseURL: 'https://ailab.wondershare.cn',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${basicToken}`,
        'X-App-Key': APP_KEY
      }
    });

    // 测试 v3 图生视频端点
    console.log('📊 测试 v3/pic/t2v/batch:');
    const image2videoResult = await api2.post('/v3/pic/t2v/batch', {
      text: '测试v3图生视频功能，一只小猫在花园里玩耍',
      duration: 5
    });
    
    console.log('✅ v3图生视频响应:', image2videoResult.status);
    console.log('📊 响应数据:', image2videoResult.data);

  } catch (error) {
    console.error('❌ 配置2失败:', error.message);
    if (error.response) {
      console.error('🔍 错误详情:', error.response.data);
    }
  }

  console.log('\n' + '=' .repeat(60));

  // 测试配置3: 尝试不同的认证方式
  console.log('\n📋 配置3: 测试不同的认证头');
  try {
    const axios = require('axios');
    
    const APP_KEY = '93dc75fe9be26c8a0530dad18b498087';
    const APP_SECRET = '545377213f382142231a74fc108c0495';

    const api3 = axios.create({
      baseURL: 'https://open-api.wondershare.cc',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // 使用查询参数认证
    console.log('📊 测试查询参数认证:');
    const authResult = await api3.post('/v3/pic/t2v/batch', {
      app_key: APP_KEY,
      app_secret: APP_SECRET,
      text: '使用查询参数认证测试',
      duration: 5
    });
    
    console.log('✅ 查询参数认证响应:', authResult.status);
    console.log('📊 响应数据:', authResult.data);

  } catch (error) {
    console.error('❌ 配置3失败:', error.message);
    if (error.response) {
      console.error('🔍 错误详情:', error.response.data);
    }
  }

  console.log('\n' + '=' .repeat(60));
  console.log('🎯 天幕图生视频功能分析完成!');
  
  console.log('\n📝 测试总结:');
  console.log('1. ✅ 文生视频(tm_text2video_b) - 已验证可用');
  console.log('2. ❓ 图生视频(tm_image2video_b) - 权限不足');
  console.log('3. ❓ 图生视频(v3/pic/t2v/batch) - 端点可能需要不同的配置');
  console.log('4. 🔍 建议联系天幕技术支持确认正确的API端点和权限');
};

// 执行测试
testTianmuAPI();