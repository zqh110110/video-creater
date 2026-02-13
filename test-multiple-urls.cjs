const { TianmuClient } = require('./tianmu-client/dist/client/tianmu-client.js');

// 测试不同的基础URL配置
async function testDifferentBaseURLs() {
  const configs = [
    {
      name: 'Original URL',
      baseURL: 'https://open-api.wondershare.cc'
    },
    {
      name: 'AI API URL', 
      baseURL: 'https://ai-api-eus.300624.com'
    },
    {
      name: 'Documentation URL v1',
      baseURL: 'https://wsai-api.wondershare.cn'
    },
    {
      name: 'Documentation URL v2',
      baseURL: 'https://open-api.wondershare.cc'
    }
  ];

  for (const config of configs) {
    try {
      console.log(`\n🔧 测试 ${config.name}...`);
      
      const client = new TianmuClient({
        app_key: '93dc75fe9be26c8a0530dad18b498087',
        app_secret: '545377213f382142231a74fc108c0495',
        ...config
      });
      
      const result = await client.textToVideo({
        prompt: '测试小猫视频',
        duration: 5,
        resolution: '720p'
      });
      
      if (result.task_id) {
        console.log(`✅ ${config.name} 成功创建任务:`, result.task_id);
      } else {
        console.log(`❌ ${config.name} 失败:`, result);
      }
      
    } catch (error) {
      console.error(`❌ ${config.name} 测试失败:`, error.response?.data || error.message);
    }
  }
}

// 执行测试
testDifferentBaseURLs();