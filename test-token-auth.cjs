const { TianmuClient } = require('./tianmu-client/dist/client/tianmu-client.js');

// 测试token-based认证流程
async function testTokenBasedAuth() {
  console.log('🔐 测试token-based认证流程...');
  
  // 根据文档，需要先生成token
  const client = new TianmuClient({
    app_key: '93dc75fe9be26c8a0530dad18b498087',
    app_secret: '545377213f382142231a74fc108c0495',
    baseURL: 'https://open-api.wondershare.cc' // 使用原始URL进行token生成
  });
  
  try {
    // 步骤1: 调用token生成接口
    console.log('📝 步骤1: 生成认证token...');
    
    const axios = require('axios');
    const tokenResponse = await axios.post(
      'https://open-api.wondershare.cc/v1/open/capacity/application/tob_text2video_b',
      {}, // 空body，只使用认证头
      {
        headers: {
          'X-App-Key': '93dc75fe9be26c8a0530dad18b498087',
          'Content-Type': 'application/json'
          // 注意：这里不包含Authorization，让客户端自动生成Basic token
        }
      }
    );
    
    console.log('📋 Token生成响应:', tokenResponse.data);
    
    if (tokenResponse.data.code === 0) {
      const generatedToken = tokenResponse.data.data.access_token;
      console.log('✅ 成功生成token:', generatedToken.substring(0, 20) + '...');
      
      // 步骤2: 使用生成的token调用API
      console.log('📝 步骤2: 使用生成的token调用API...');
      
      const apiResponse = await axios.post(
        'https://ai-api-eus.300624.com/v1/ai/capacity/application/tm_text2video',
        {
          prompt: '使用token认证测试小猫视频',
          duration: 5,
          resolution: '720p'
        },
        {
          headers: {
            'X-App-Key': '93dc75fe9be26c8a0530dad18b498087',
            'Authorization': `Bearer ${generatedToken}`, // 使用Bearer token
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('🎯 API调用响应:', apiResponse.data);
      
      if (apiResponse.data.code === 0) {
        const taskId = apiResponse.data.data.task_id;
        console.log('✅ Token认证成功创建任务:', taskId);
        
        const fs = require('fs');
        fs.writeFileSync('./token-auth-task-id.txt', taskId);
        
        return { success: true, taskId, token: generatedToken };
      } else {
        console.log('❌ API调用失败:', apiResponse.data);
        return { success: false, error: apiResponse.data };
      }
      
    } else {
      console.log('❌ Token生成失败:', tokenResponse.data);
      return { success: false, error: tokenResponse.data };
    }
    
  } catch (error) {
    console.error('❌ Token认证测试失败:', error.response?.data || error.message);
    return { success: false, error };
  }
}

// 执行测试
testTokenBasedAuth();