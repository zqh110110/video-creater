import { TianmuClient } from './tianmu-client/dist/client/tianmu-client.js';

// 创建客户端，尝试不同的基础URL
const client = new TianmuClient({
  app_key: '93dc75fe9be26c8a0530dad18b498087',
  app_secret: '545377213f382142231a74fc108c0495',
  api: {
    baseURL: 'https://wsai-api.wondershare.cn'
  }
});

// 文生图测试
async function testTextToImageWithDifferentURL() {
  try {
    console.log('尝试使用不同的API端点...');
    
    const result = await client.textToImage({
      prompt: '一只可爱的小猫咪',
      width: 512,
      height: 512
    });

    console.log('✅ 文生图任务创建成功:', result.task_id);

    // 等待任务完成
    const finalResult = await client.waitForTaskCompletion(result.task_id);
    console.log('图片生成完成:', finalResult);

  } catch (error) {
    console.error('❌ 使用新端点失败:', error.response?.data || error.message);
  }
}

// 执行测试
testTextToImageWithDifferentURL();