const axios = require('axios');

// 测试不同的token生成方式
async function testTokenGenerationMethods() {
  const methods = [
    {
      name: 'tob_text2video_b endpoint',
      url: 'https://open-api.wondershare.cc/v1/open/capacity/application/tob_text2video_b'
    },
    {
      name: 'tob_text2video endpoint with data',
      url: 'https://open-api.wondershare.cc/v1/open/capacity/application/tob_text2video_b',
      data: { test: 'value' }
    },
    {
      name: 'Alternative token endpoint',
      url: 'https://wsai-api.wondershare.cn/v1/open/capacity/application/tm_text2video'
    }
  ];

  for (const method of methods) {
    try {
      console.log(`\n🔧 测试 ${method.name}...`);
      
      const response = await axios.post(
        method.url,
        method.data || {},
        {
          headers: {
            'X-App-Key': '93dc75fe9be26c8a0530dad18b498087',
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log(`${method.name} 响应:`, response.data);
      
    } catch (error) {
      console.error(`${method.name} 失败:`, error.response?.data || error.message);
    }
  }
}

// 执行测试
testTokenGenerationMethods();